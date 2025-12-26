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

# Check if storage-cdn stack is being deleted - if so, invalidate CloudFront
HAS_STORAGE_CDN=false
for stack in $STACKS; do
  if [[ $stack == *"storage-cdn"* ]]; then
    HAS_STORAGE_CDN=true
  fi
done

if [ "$HAS_STORAGE_CDN" = true ]; then
  echo "🧹 Pre-cleanup: Invalidating CloudFront caches..."
  
  # Get CloudFront distribution IDs for this environment and invalidate them
  DISTRIBUTIONS=$(aws cloudformation list-stack-resources \
    --stack-name "$(echo $STACKS | grep 'storage-cdn' | head -1)" \
    --region "$REGION" \
    --query 'StackResourceSummaries[?ResourceType==`AWS::CloudFront::Distribution`].PhysicalResourceId' \
    --output text 2>/dev/null || true)
  
  if [ -n "$DISTRIBUTIONS" ]; then
    for dist_id in $DISTRIBUTIONS; do
      echo "  Invalidating CloudFront: $dist_id"
      aws cloudfront create-invalidation \
        --distribution-id "$dist_id" \
        --paths "/*" 2>/dev/null || echo "    (invalidation may have already completed)"
    done
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

# NOTE: Shared buckets are not deleted during ephemeral cleanup:
# - growksh-website-ephemeral-assets: Shared across all ephemeral environments
# - growksh-website-lambda-code: Shared across all environments (ephemeral + dev + prod)
# This prevents orphaned stacks while keeping shared artifacts available for reuse

echo "Stage 5️⃣: Delete Cognito"
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

echo "Stage 7️⃣: Delete WAF"
for stack in $STACKS; do
  if [[ $stack == *"-waf-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 8️⃣: Delete IAM"
for stack in $STACKS; do
  if [[ $stack == *"-iam-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "✅ Cleanup complete!"
