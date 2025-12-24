#!/bin/bash
set -e

# Deploy CloudFormation stacks in dependency order
# Usage: ./deploy-stacks.sh <environment>
# Example: ./deploy-stacks.sh dev

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Error: Environment name is required"
  echo "Usage: $0 <environment>"
  echo "Example: $0 dev"
  exit 1
fi

REGION=${AWS_REGION:-ap-south-1}
TEMPLATE_DIR="infra/cloudformation"
PARAM_DIR="infra/cloudformation/parameters"

echo "🚀 Starting CloudFormation deployment for environment: $ENVIRONMENT"
echo "📍 Region: $REGION"
echo ""

# Function to deploy a stack
deploy_stack() {
  local stack_name=$1
  local template_file=$2
  local param_file=$3
  
  echo "📦 Deploying stack: $stack_name"
  
  if [ -n "$param_file" ] && [ -f "$param_file" ]; then
    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides file://"$param_file" \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$REGION" \
      --no-fail-on-empty-changeset
  else
    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides Environment="$ENVIRONMENT" \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$REGION" \
      --no-fail-on-empty-changeset
  fi
  
  echo "✅ Stack deployed: $stack_name"
  echo ""
}

# Stack deployment order with dependencies
echo "📋 Deployment Plan:"
echo "  1. growksh-website-iam-$ENVIRONMENT (IAM roles)"
echo "  2. growksh-website-database-$ENVIRONMENT (DynamoDB)"
echo "  3. growksh-website-cognito-$ENVIRONMENT (Cognito)"
echo "  4. growksh-website-storage-cdn-$ENVIRONMENT (S3 + CloudFront)"
echo "  5. growksh-website-api-$ENVIRONMENT (API Gateway)"
echo "  6. growksh-website-cognito-lambdas-$ENVIRONMENT (Cognito Lambdas)"
echo "  7. growksh-website-api-lambdas-$ENVIRONMENT (API Lambdas)"
echo ""

# Stage 1: IAM (no dependencies)
echo "Stage 1️⃣: IAM Roles"
deploy_stack \
  "growksh-website-iam-$ENVIRONMENT" \
  "$TEMPLATE_DIR/00-iam-stack.yaml"

# Stage 2: Database (depends on IAM)
echo "Stage 2️⃣: Database"
deploy_stack \
  "growksh-website-database-$ENVIRONMENT" \
  "$TEMPLATE_DIR/01-database-stack.yaml"

# Stage 3: Cognito (no dependencies)
echo "Stage 3️⃣: Cognito"
deploy_stack \
  "growksh-website-cognito-$ENVIRONMENT" \
  "$TEMPLATE_DIR/02-cognito-stack.yaml"

# Stage 4: Storage & CDN (no dependencies)
echo "Stage 4️⃣: Storage & CDN"
PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-03-storage-cdn.json"
deploy_stack \
  "growksh-website-storage-cdn-$ENVIRONMENT" \
  "$TEMPLATE_DIR/03-storage-cdn-stack.yaml" \
  "$PARAM_FILE"

# Stage 5: API Gateway (no dependencies)
echo "Stage 5️⃣: API Gateway"
deploy_stack \
  "growksh-website-api-$ENVIRONMENT" \
  "$TEMPLATE_DIR/04-api-gateway-stack.yaml"

# Stage 6: Cognito Lambda Triggers (depends on Cognito, IAM, Database)
echo "Stage 6️⃣: Cognito Lambda Triggers"
PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-05-cognito-lambdas.json"
deploy_stack \
  "growksh-website-cognito-lambdas-$ENVIRONMENT" \
  "$TEMPLATE_DIR/05-cognito-lambdas-stack.yaml" \
  "$PARAM_FILE"

# Stage 7: API Lambda Functions (depends on API Gateway, IAM, Cognito, Database)
echo "Stage 7️⃣: API Lambda Functions"
PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-06-api-lambdas.json"
deploy_stack \
  "growksh-website-api-lambdas-$ENVIRONMENT" \
  "$TEMPLATE_DIR/06-api-lambdas-stack.yaml" \
  "$PARAM_FILE"

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ All stacks deployed successfully!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📊 Stack Status:"
aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$ENVIRONMENT')].{Name:StackName,Status:StackStatus}" \
  --region "$REGION" \
  --output table

echo ""
echo "🎉 Deployment complete for environment: $ENVIRONMENT"
