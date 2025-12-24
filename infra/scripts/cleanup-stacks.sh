#!/bin/bash
set -e

# Cleanup ephemeral CloudFormation stacks
# Usage: ./cleanup-stacks.sh <environment-prefix>
# Example: ./cleanup-stacks.sh growksh-website-feature-abc123

ENVIRONMENT_PREFIX=$1

if [ -z "$ENVIRONMENT_PREFIX" ]; then
  echo "❌ Error: Environment prefix is required"
  echo "Usage: $0 <environment-prefix>"
  echo "Example: $0 growksh-website-feature-abc123"
  exit 1
fi

REGION=${AWS_REGION:-us-east-1}

echo "🧹 Starting cleanup for environment prefix: $ENVIRONMENT_PREFIX"
echo "📍 Region: $REGION"
echo ""

# Get all stacks matching the environment prefix
STACKS=$(aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --query "StackSummaries[?contains(StackName, '$ENVIRONMENT_PREFIX')].StackName" \
  --output text \
  --region "$REGION")

if [ -z "$STACKS" ]; then
  echo "ℹ️  No stacks found for environment: $ENVIRONMENT_PREFIX"
  exit 0
fi

echo "📋 Found stacks to delete:"
for stack in $STACKS; do
  echo "  - $stack"
done
echo ""

# Delete stacks in reverse dependency order
# Stack deletion order (reverse of deployment):
# 1. api-lambdas (depends on api-gateway, cognito, database, iam)
# 2. cognito-lambdas (depends on cognito, iam)
# 3. api (no other stacks depend on it)
# 4. storage-cdn (no other stacks depend on it)
# 5. cognito (no other stacks depend on it)
# 6. database (depends on iam)
# 7. iam (no dependencies)

delete_stack() {
  local stack_name=$1
  
  if echo "$STACKS" | grep -q "$stack_name"; then
    echo "🗑️  Deleting stack: $stack_name"
    aws cloudformation delete-stack \
      --stack-name "$stack_name" \
      --region "$REGION"
    
    echo "⏳ Waiting for stack deletion..."
    aws cloudformation wait stack-delete-complete \
      --stack-name "$stack_name" \
      --region "$REGION" || true
    
    echo "✅ Stack deleted: $stack_name"
    echo ""
  fi
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

echo "Stage 5️⃣: Delete Cognito"
for stack in $STACKS; do
  if [[ $stack == *"cognito"* ]] && [[ $stack != *"cognito-lambdas"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 6️⃣: Delete Database"
for stack in $STACKS; do
  if [[ $stack == *"database"* ]]; then
    delete_stack "$stack"
  fi
done

echo "Stage 7️⃣: Delete IAM"
for stack in $STACKS; do
  if [[ $stack == *"iam"* ]]; then
    delete_stack "$stack"
  fi
done

# Clean up S3 bucket if it exists
BUCKET_NAME="${ENVIRONMENT_PREFIX}-assets"
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
  echo "ℹ️  S3 bucket does not exist: $BUCKET_NAME"
else
  echo "🗑️  Emptying S3 bucket: $BUCKET_NAME"
  aws s3 rm "s3://$BUCKET_NAME" --recursive || true
  echo "🗑️  Deleting S3 bucket: $BUCKET_NAME"
  aws s3 rb "s3://$BUCKET_NAME" || true
  echo "✅ S3 bucket deleted: $BUCKET_NAME"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ Cleanup complete for environment: $ENVIRONMENT_PREFIX"
echo "═══════════════════════════════════════════════════"
