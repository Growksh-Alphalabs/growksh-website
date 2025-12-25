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

# Get all stacks matching the environment prefix (including failed ones)
STACKS=$(aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE CREATE_FAILED UPDATE_FAILED \
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

# Simple delete function - let CloudFormation handle DeletionPolicy
delete_stack() {
  local stack_name=$1
  
  echo "🗑️  Deleting stack: $stack_name"
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

echo "Stage 7️⃣: Delete IAM"
for stack in $STACKS; do
  if [[ $stack == *"-iam-"* ]]; then
    delete_stack "$stack"
  fi
done

echo "✅ Cleanup complete!"
