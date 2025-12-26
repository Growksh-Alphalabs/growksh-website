#!/bin/bash

# Cleanup ephemeral CloudFormation stacks
# Usage: ./cleanup-stacks.sh <environment-prefix>
# Example: ./cleanup-stacks.sh feature-6e9da714

ENVIRONMENT_PREFIX=$1

if [ -z "$ENVIRONMENT_PREFIX" ]; then
  echo "❌ Error: Environment prefix is required"
  echo "Usage: $0 <environment-prefix>"
  echo "Example: $0 feature-6e9da714"
  exit 1
fi

REGION=${AWS_REGION:-ap-south-1}

echo "🧹 Starting cleanup for environment prefix: $ENVIRONMENT_PREFIX"
echo "📍 Region: $REGION"
echo ""

# Get all stacks matching the environment prefix (only failed/rolled-back ones)
# This ensures we only clean up stacks that actually failed, not successful ones
STACKS=$(aws cloudformation list-stacks \
  --stack-status-filter CREATE_FAILED UPDATE_FAILED ROLLBACK_COMPLETE DELETE_FAILED \
  --query "StackSummaries[?contains(StackName, '$ENVIRONMENT_PREFIX')].StackName" \
  --output text \
  --region "$REGION")

if [ -z "$STACKS" ]; then
  echo "ℹ️  No failed stacks found for environment: $ENVIRONMENT_PREFIX"
  echo "✅ Successful stacks will be preserved for retry"
  exit 0
fi

echo "📋 Found stacks to delete:"
for stack in $STACKS; do
  echo "  - $stack"
done
echo ""

# Check if storage-cdn or lambda-code-bucket stacks are being deleted - if so, empty buckets first
HAS_STORAGE_CDN=false
HAS_LAMBDA_BUCKET=false
for stack in $STACKS; do
  if [[ $stack == *"storage-cdn"* ]]; then
    HAS_STORAGE_CDN=true
  fi
  if [[ $stack == *"lambda-code-bucket"* ]]; then
    HAS_LAMBDA_BUCKET=true
  fi
done

if [ "$HAS_STORAGE_CDN" = true ] || [ "$HAS_LAMBDA_BUCKET" = true ]; then
  echo "🧹 Pre-cleanup: Emptying S3 buckets..."
  
  if [ "$HAS_STORAGE_CDN" = true ]; then
    echo "  Emptying storage-cdn buckets..."
    BUCKETS=$(aws s3 ls --region "$REGION" | grep "$ENVIRONMENT_PREFIX" | grep -v "lambda-code" | awk '{print $3}')
    if [ -n "$BUCKETS" ]; then
      for bucket in $BUCKETS; do
        echo "    - s3://$bucket"
        aws s3 rm "s3://$bucket" --recursive --region "$REGION" 2>/dev/null || echo "      (bucket may already be empty or inaccessible)"
      done
    fi
  fi
  
  if [ "$HAS_LAMBDA_BUCKET" = true ]; then
    echo "  Emptying lambda-code-bucket..."
    LAMBDA_BUCKETS=$(aws s3 ls --region "$REGION" | grep "$ENVIRONMENT_PREFIX" | grep "lambda-code" | awk '{print $3}')
    if [ -n "$LAMBDA_BUCKETS" ]; then
      for bucket in $LAMBDA_BUCKETS; do
        echo "    - s3://$bucket"
        # Delete all versions as well (in case versioning is enabled)
        aws s3api list-object-versions \
          --bucket "$bucket" \
          --query 'Versions[].{Key:Key,VersionId:VersionId}' \
          --output text \
          --region "$REGION" | \
        while read -r key version; do
          if [ -n "$key" ]; then
            aws s3api delete-object \
              --bucket "$bucket" \
              --key "$key" \
              --version-id "$version" \
              --region "$REGION" 2>/dev/null || true
          fi
        done
        # Also delete delete markers
        aws s3api list-object-versions \
          --bucket "$bucket" \
          --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' \
          --output text \
          --region "$REGION" | \
        while read -r key version; do
          if [ -n "$key" ]; then
            aws s3api delete-object \
              --bucket "$bucket" \
              --key "$key" \
              --version-id "$version" \
              --region "$REGION" 2>/dev/null || true
          fi
        done
      done
    fi
  fi
  echo ""
fi

# Simple delete function - let CloudFormation handle DeletionPolicy
delete_stack() {
  local stack_name=$1
  
  echo "🗑️  Deleting stack: $stack_name"
  
  # Capture stack events before deletion for debugging
  echo "📋 Stack events:"
  aws cloudformation describe-stack-events \
    --stack-name "$stack_name" \
    --region "$REGION" \
    --query 'StackEvents[?contains(ResourceStatusReason, `Error`) || contains(ResourceStatusReason, `Failed`) || ResourceStatus == `CREATE_FAILED` || ResourceStatus == `UPDATE_FAILED`]' \
    --output table 2>/dev/null || true
  echo ""
  
  aws cloudformation delete-stack \
    --stack-name "$stack_name" \
    --region "$REGION" 2>/dev/null || true
  
  echo "⏳ Waiting for stack deletion..."
  aws cloudformation wait stack-delete-complete \
    --stack-name "$stack_name" \
    --region "$REGION" 2>/dev/null || true
  
  echo "✅ Stack deleted: $stack_name"
  echo ""
}

# Delete stacks in reverse dependency order
echo "Stage 1️⃣: Delete API Lambdas"
for stack in $STACKS; do
  if [[ $stack == *"api-lambdas"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 2️⃣: Delete Cognito Lambdas"
for stack in $STACKS; do
  if [[ $stack == *"cognito-lambdas"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 3️⃣: Delete API Gateway"
for stack in $STACKS; do
  if [[ $stack == *"-api-"* ]] && [[ $stack != *"api-lambdas"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 4️⃣: Delete Storage & CDN"
for stack in $STACKS; do
  if [[ $stack == *"storage-cdn"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 5️⃣: Delete Lambda Code Bucket"
for stack in $STACKS; do
  if [[ $stack == *"lambda-code-bucket"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 6️⃣: Delete Cognito"
for stack in $STACKS; do
  if [[ $stack == *"-cognito-"* ]] && [[ $stack != *"cognito-lambdas"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 6️⃣: Delete Database"
for stack in $STACKS; do
  if [[ $stack == *"-database-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 8️⃣: Delete WAF"
for stack in $STACKS; do
  if [[ $stack == *"-waf-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 9️⃣: Delete IAM"
for stack in $STACKS; do
  if [[ $stack == *"-iam-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "✅ Cleanup complete!"
