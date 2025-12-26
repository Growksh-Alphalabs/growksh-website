#!/bin/bash
set -e

# Deploy CloudFormation stacks in dependency order
# Usage: ./deploy-stacks.sh <environment>
# Example: ./deploy-stacks.sh dev

ENVIRONMENT=$1
DEPLOYMENT_FAILED=false

if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Error: Environment name is required"
  echo "Usage: $0 <environment>"
  echo "Example: $0 dev"
  exit 1
fi

REGION=${AWS_REGION:-ap-south-1}
TEMPLATE_DIR="infra/cloudformation"
PARAM_DIR="infra/cloudformation/parameters"

# Determine if this is an ephemeral environment and set flag
IS_EPHEMERAL="false"
if [[ $ENVIRONMENT == feature-* ]]; then
  IS_EPHEMERAL="true"
  # Use random 6-character alphanumeric suffix for guaranteed uniqueness
  RANDOM_SUFFIX=$(openssl rand -hex 3)
  BUCKET_NAME="$ENVIRONMENT-$RANDOM_SUFFIX"
else
  BUCKET_NAME="$ENVIRONMENT-assets"
fi

echo "🚀 Starting CloudFormation deployment for environment: $ENVIRONMENT"
echo "📍 Region: $REGION"
echo "🔄 Ephemeral environment: $IS_EPHEMERAL"
echo "⏱️  Timestamp: $(date)"
echo "🔐 IAM Role: GrowkshDeveloperRole (with wildcard permissions)"
echo ""

# For ephemeral environments, create Lambda code bucket and build Lambda functions
if [[ $IS_EPHEMERAL == "true" ]]; then
  LAMBDA_BUCKET="growksh-website-lambda-code-$RANDOM_SUFFIX"
  
  echo "🔨 Building and uploading Lambda functions..."
  echo "📦 Lambda bucket: $LAMBDA_BUCKET"
  echo ""
  
  # Create Lambda code bucket if it doesn't exist
  echo "📦 Creating Lambda code bucket: $LAMBDA_BUCKET"
  if ! aws s3 ls "s3://$LAMBDA_BUCKET" --region "$REGION" 2>/dev/null; then
    echo "   → Bucket doesn't exist, creating..."
    if ! aws s3 mb "s3://$LAMBDA_BUCKET" --region "$REGION" 2>&1; then
      echo "❌ Failed to create Lambda code bucket" >&2
      DEPLOYMENT_FAILED=true
      exit 1
    fi
    
    # Wait for bucket to be available (S3 eventual consistency)
    echo "   → Waiting for bucket to be available..."
    sleep 2
    
    # Verify bucket exists
    if ! aws s3 ls "s3://$LAMBDA_BUCKET" --region "$REGION" 2>/dev/null; then
      echo "❌ Bucket created but not accessible yet" >&2
      DEPLOYMENT_FAILED=true
      exit 1
    fi
  fi
  echo "✅ Lambda code bucket ready: s3://$LAMBDA_BUCKET"
  echo ""
  
  # Build and upload Lambda functions
  if [ -f "infra/scripts/build-and-upload-lambdas.sh" ]; then
    chmod +x infra/scripts/build-and-upload-lambdas.sh
    ./infra/scripts/build-and-upload-lambdas.sh "$ENVIRONMENT" "$LAMBDA_BUCKET" || {
      echo "❌ Failed to build/upload Lambda functions" >&2
      DEPLOYMENT_FAILED=true
      exit 1
    }
  else
    echo "⚠️  Lambda build script not found, skipping Lambda deployment" >&2
  fi
  
  echo ""
else
  # For non-ephemeral environments, use default Lambda bucket
  LAMBDA_BUCKET="growksh-website-lambda-code-$ENVIRONMENT"
fi

echo ""

# Function to deploy a stack
deploy_stack() {
  local stack_name=$1
  local template_file=$2
  local param_file=$3
  
  echo "📦 Deploying stack: $stack_name"
  
  # If parameter file exists and is valid, use it
  if [ -n "$param_file" ] && [ -f "$param_file" ]; then
    # When using parameter file, still override IsEphemeral for database/storage stacks if it's ephemeral
    local param_overrides="file://$param_file"
    if [[ $ENVIRONMENT == feature-* ]] && ([[ "$stack_name" == *"database"* ]] || [[ "$stack_name" == *"storage-cdn"* ]]); then
      param_overrides="$param_overrides IsEphemeral=$IS_EPHEMERAL"
    fi
    # Add LambdaCodeBucketName for lambda stacks in ephemeral environments
    if [[ $ENVIRONMENT == feature-* ]] && ([[ "$stack_name" == *"cognito-lambdas"* ]] || [[ "$stack_name" == *"api-lambdas"* ]]); then
      param_overrides="$param_overrides LambdaCodeBucketName=$LAMBDA_BUCKET"
    fi
    
    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides $param_overrides \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$REGION" \
      --no-fail-on-empty-changeset 2>&1 | tee -a "/tmp/deploy-${stack_name}.log" || {
      echo "❌ Failed to deploy stack: $stack_name" >&2
      cat "/tmp/deploy-${stack_name}.log" >&2
      DEPLOYMENT_FAILED=true
      return 0
    }
  else
    # Build dynamic parameters for ephemeral/non-standard environments
    local params="Environment=$ENVIRONMENT"
    
    # Add IsEphemeral only to stacks that use it (database and storage stacks)
    if [[ "$stack_name" == *"database"* ]] || [[ "$stack_name" == *"storage-cdn"* ]]; then
      params="$params IsEphemeral=$IS_EPHEMERAL"
    fi
    
    # Add specific parameters for Storage CDN stack
    # Don't pass empty strings for optional parameters - let CloudFormation use defaults
    if [[ "$stack_name" == *"storage-cdn"* ]]; then
      params="$params BucketName=$BUCKET_NAME LambdaCodeBucketName=growksh-website-lambda-code-$RANDOM_SUFFIX"
    fi
    
    # Add specific parameters for Cognito Lambdas
    if [[ "$stack_name" == *"cognito-lambdas"* ]]; then
      params="$params LambdaCodeBucketName=growksh-website-lambda-code-$RANDOM_SUFFIX SESSourceEmail=noreply@growksh.com VerifyBaseUrl=https://$BUCKET_NAME.s3.amazonaws.com/auth/verify-email DebugLogOTP=1"
    fi
    
    # Add specific parameters for API Lambdas
    if [[ "$stack_name" == *"api-lambdas"* ]]; then
      params="$params LambdaCodeBucketName=growksh-website-lambda-code-$RANDOM_SUFFIX SESSourceEmail=noreply@growksh.com VerifyBaseUrl=https://$BUCKET_NAME.s3.amazonaws.com/auth/verify-email"
    fi
    
    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides $params \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$REGION" \
      --no-fail-on-empty-changeset 2>&1 | tee -a "/tmp/deploy-${stack_name}.log" || {
      echo "❌ Failed to deploy stack: $stack_name" >&2
      cat "/tmp/deploy-${stack_name}.log" >&2
      DEPLOYMENT_FAILED=true
      return 0
    }
  fi
  
  # Only print success if deployment actually succeeded
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
# For ephemeral environments, pass parameters directly instead of using param file
if [[ $ENVIRONMENT == feature-* ]]; then
  deploy_stack \
    "growksh-website-storage-cdn-$ENVIRONMENT" \
    "$TEMPLATE_DIR/03-storage-cdn-stack.yaml"
else
  # For dev/prod, use parameter files
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-03-storage-cdn.json"
  deploy_stack \
    "growksh-website-storage-cdn-$ENVIRONMENT" \
    "$TEMPLATE_DIR/03-storage-cdn-stack.yaml" \
    "$PARAM_FILE"
fi

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
if [ "$DEPLOYMENT_FAILED" = true ]; then
  echo "❌ Deployment FAILED - some stacks did not deploy"
  echo "═══════════════════════════════════════════════════"
  exit 1
else
  echo "✅ All stacks deployed successfully!"
  echo "═══════════════════════════════════════════════════"
fi
echo ""
echo "📊 Stack Status:"
aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$ENVIRONMENT')].{Name:StackName,Status:StackStatus}" \
  --region "$REGION" \
  --output table || echo "⚠️  Could not retrieve stack status"

echo ""
echo "🎉 Deployment complete for environment: $ENVIRONMENT"

# Output the actual bucket name for workflow use
echo "BUCKET_NAME=$BUCKET_NAME" >> "$GITHUB_OUTPUT" 2>/dev/null || true
