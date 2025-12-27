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

# Get all stacks matching the environment prefix
# When called from GitHub Actions (PR closed), delete ALL stacks including successful ones
# When called manually, only delete failed stacks (for safety)
CLEANUP_SUCCESSFUL_STACKS="${CLEANUP_SUCCESSFUL_STACKS:-false}"

if [ "$CLEANUP_SUCCESSFUL_STACKS" = "true" ]; then
  # Delete all stacks for this environment (used when PR is closed)
  STACKS=$(aws cloudformation list-stacks \
    --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE CREATE_FAILED UPDATE_FAILED ROLLBACK_COMPLETE DELETE_FAILED \
    --query "StackSummaries[?contains(StackName, '$ENVIRONMENT_PREFIX')].StackName" \
    --output text \
    --region "$REGION")
else
  # Only delete failed stacks (safer for manual cleanup)
  STACKS=$(aws cloudformation list-stacks \
    --stack-status-filter CREATE_FAILED UPDATE_FAILED ROLLBACK_COMPLETE DELETE_FAILED \
    --query "StackSummaries[?contains(StackName, '$ENVIRONMENT_PREFIX')].StackName" \
    --output text \
    --region "$REGION")
fi

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

# Simple delete function - empty buckets first, then delete stack
empty_bucket() {
  local bucket_name=$1

  if [ -z "$bucket_name" ]; then
    return 0
  fi

  # Check if bucket exists
  if ! aws s3 ls "s3://$bucket_name" --region "$REGION" &>/dev/null; then
    return 0
  fi

  echo "  🧹 Emptying bucket: $bucket_name"

  # Empty the bucket (delete all versions and objects)
  aws s3 rm "s3://$bucket_name" --recursive --region "$REGION" 2>/dev/null || true

  # If versioning is enabled, delete all object versions and delete markers
  # List all versions and delete them one by one
  local version_ids=$(aws s3api list-object-versions \
    --bucket "$bucket_name" \
    --region "$REGION" \
    --query 'Versions[*].[Key,VersionId]' \
    --output text)

  while read -r key version_id; do
    if [ -n "$key" ] && [ -n "$version_id" ]; then
      aws s3api delete-object \
        --bucket "$bucket_name" \
        --key "$key" \
        --version-id "$version_id" \
        --region "$REGION" 2>/dev/null || true
    fi
  done <<< "$version_ids"

  # Delete markers (versions without VersionId)
  local delete_markers=$(aws s3api list-object-versions \
    --bucket "$bucket_name" \
    --region "$REGION" \
    --query 'DeleteMarkers[*].[Key,VersionId]' \
    --output text)

  while read -r key version_id; do
    if [ -n "$key" ] && [ -n "$version_id" ]; then
      aws s3api delete-object \
        --bucket "$bucket_name" \
        --key "$key" \
        --version-id "$version_id" \
        --region "$REGION" 2>/dev/null || true
    fi
  done <<< "$delete_markers"
}

delete_stack() {
  local stack_name=$1

  echo "🗑️  Deleting stack: $stack_name"

  # Empty S3 buckets before deletion (so CloudFormation can delete them)
  if [[ $stack_name == *"storage-cdn"* ]]; then
    # Extract bucket name from stack (growksh-website-ephemeral-assets-feature-xxx)
    local bucket_name="${stack_name/growksh-website-storage-cdn-/growksh-website-ephemeral-assets-}"
    empty_bucket "$bucket_name"
  fi

  if [[ $stack_name == *"lambda-code-bucket"* ]]; then
    # Extract bucket name from stack (growksh-website-lambda-code-feature-xxx)
    local bucket_name="${stack_name/growksh-website-lambda-code-bucket-/growksh-website-lambda-code-}"
    empty_bucket "$bucket_name"
  fi

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

echo "Stage 4b️⃣: Delete Lambda Code Bucket Stack"
for stack in $STACKS; do
  if [[ $stack == *"lambda-code-bucket"* ]]; then
    delete_stack "$stack"
  fi
done

# NOTE: S3 buckets are retained even though their stacks are deleted:
# - growksh-website-ephemeral-assets: Retained, reused by next ephemeral environment
# - growksh-website-lambda-code: Retained, reused by all environments
# CloudFormation stacks are deleted, but buckets persist with DeletionPolicy: Retain

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
