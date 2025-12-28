#!/bin/bash
set -e

# Deploy CloudFormation stacks in dependency order
# Bucket strategy: For ephemeral, CloudFormation creates both buckets
# Usage: ./deploy-stacks.sh <environment>
# Example: ./deploy-stacks.sh dev

# TODO: Refactor into modular deploy-single-stack.sh for better maintainability
# See: https://github.com/Growksh-Alphalabs/growksh-website/issues/XX
# This would allow orchestration of individual stack deployments with better
# separation of concerns and testability. Currently handled monolithically here.

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

# Determine if this is an ephemeral environment
IS_EPHEMERAL="false"
if [[ $ENVIRONMENT == feature-* ]]; then
  IS_EPHEMERAL="true"
  # Ephemeral environments use feature-specific buckets to avoid conflicts
  ASSETS_BUCKET_NAME="growksh-website-ephemeral-assets-$ENVIRONMENT"
  LAMBDA_BUCKET_NAME="growksh-website-lambda-code-$ENVIRONMENT"
else
  # Persistent environments (dev, prod) use environment-specific buckets
  ASSETS_BUCKET_NAME="growksh-website-$ENVIRONMENT-assets"
  LAMBDA_BUCKET_NAME="growksh-website-lambda-code-$ENVIRONMENT"
fi

echo "🚀 Starting CloudFormation deployment for environment: $ENVIRONMENT"
echo "📍 Region: $REGION"
echo "🔄 Ephemeral environment: $IS_EPHEMERAL"
echo "📦 Assets bucket: $ASSETS_BUCKET_NAME"
echo "📦 Lambda bucket: $LAMBDA_BUCKET_NAME"
echo "⏱️  Timestamp: $(date)"
echo ""

# Function to deploy a stack
deploy_stack() {
  local stack_name=$1
  local template_file=$2
  local param_file=$3
  local deploy_region=${4:-$REGION}  # Use provided region or default to REGION

  echo "📦 Deploying stack: $stack_name (region: $deploy_region)"

  # If parameter file exists and is valid, use it
  if [ -n "$param_file" ] && [ -f "$param_file" ]; then
    local param_overrides="file://$param_file"

    # Override parameters for ephemeral environments
    if [[ $ENVIRONMENT == feature-* ]]; then
      if [[ "$stack_name" == *"storage-cdn"* ]]; then
        param_overrides="$param_overrides IsEphemeral=$IS_EPHEMERAL BucketName=$ASSETS_BUCKET_NAME"
      elif [[ "$stack_name" == *"database"* ]]; then
        param_overrides="$param_overrides IsEphemeral=$IS_EPHEMERAL"
      elif [[ "$stack_name" == *"lambda-code-bucket"* ]]; then
        param_overrides="$param_overrides IsEphemeral=$IS_EPHEMERAL BucketName=$LAMBDA_BUCKET_NAME"
      fi
    fi

    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides $param_overrides \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$deploy_region" \
      --no-fail-on-empty-changeset 2>&1 | tee -a "/tmp/deploy-${stack_name}.log" || {
      echo "❌ Failed to deploy stack: $stack_name" >&2
      cat "/tmp/deploy-${stack_name}.log" >&2
      DEPLOYMENT_FAILED=true
      return 0
    }
  else
    # Build dynamic parameters for ephemeral/non-standard environments
    local params="Environment=$ENVIRONMENT"

    # Add IsEphemeral for stacks that use it
    if [[ "$stack_name" == *"database"* ]] || [[ "$stack_name" == *"storage-cdn"* ]] || [[ "$stack_name" == *"lambda-code-bucket"* ]]; then
      params="$params IsEphemeral=$IS_EPHEMERAL"
    fi

    # Add specific parameters for Lambda Code Bucket stack
    if [[ "$stack_name" == *"lambda-code-bucket"* ]]; then
      params="$params BucketName=$LAMBDA_BUCKET_NAME"
    fi

    # Add specific parameters for Storage CDN stack
    if [[ "$stack_name" == *"storage-cdn"* ]]; then
      params="$params BucketName=$ASSETS_BUCKET_NAME"
    fi

    # Add specific parameters for Cognito Lambdas
    if [[ "$stack_name" == *"cognito-lambdas"* ]]; then
      params="$params LambdaCodeBucketName=$LAMBDA_BUCKET_NAME SESSourceEmail=noreply@growksh.com VerifyBaseUrl=https://$ASSETS_BUCKET_NAME.s3.amazonaws.com/auth/verify-email DebugLogOTP=1"
    fi

    # Add specific parameters for API Lambdas
    if [[ "$stack_name" == *"api-lambdas"* ]]; then
      params="$params LambdaCodeBucketName=$LAMBDA_BUCKET_NAME SESSourceEmail=noreply@growksh.com VerifyBaseUrl=https://$ASSETS_BUCKET_NAME.s3.amazonaws.com/auth/verify-email"
    fi

    aws cloudformation deploy \
      --template-file "$template_file" \
      --stack-name "$stack_name" \
      --parameter-overrides $params \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$deploy_region" \
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
echo "  4. growksh-website-waf-$ENVIRONMENT (WAF, us-east-1)"
echo "  5. growksh-website-lambda-code-bucket-$ENVIRONMENT (Lambda code bucket)"
echo "  6. growksh-website-storage-cdn-$ENVIRONMENT (S3 + CloudFront)"
echo "  7. growksh-website-api-$ENVIRONMENT (API Gateway)"
echo "  8. growksh-website-cognito-lambdas-$ENVIRONMENT (Cognito Lambdas)"
echo "  9. growksh-website-api-lambdas-$ENVIRONMENT (API Lambdas)"
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

# Stage 4: WAF (us-east-1, no dependencies, before CDN)
echo "Stage 4️⃣: WAF (us-east-1)"
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_FILE="$PARAM_DIR/ephemeral-03-waf-stack.json"
else
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-03-waf-stack.json"
fi
deploy_stack \
  "growksh-website-waf-$ENVIRONMENT" \
  "$TEMPLATE_DIR/03-waf-stack.yaml" \
  "$PARAM_FILE" \
  "us-east-1"

# Stage 5: Lambda Code Bucket (no dependencies)
echo "Stage 5️⃣: Lambda Code Bucket"
deploy_stack \
  "growksh-website-lambda-code-bucket-$ENVIRONMENT" \
  "$TEMPLATE_DIR/04-lambda-code-bucket-stack.yaml"

# Verify Lambda bucket is ready before uploading code
echo "⏳ Verifying Lambda code bucket is accessible..."
max_attempts=10
attempt=1

# Create a temporary test file
TEST_FILE="/tmp/bucket-test-$(date +%s).txt"
echo "test" > "$TEST_FILE"

while [ $attempt -le $max_attempts ]; do
  # Try all three checks
  if aws s3 ls "s3://$LAMBDA_BUCKET_NAME" --region "$REGION" >/dev/null 2>&1 && \
     aws s3api head-bucket --bucket "$LAMBDA_BUCKET_NAME" --region "$REGION" >/dev/null 2>&1 && \
     aws s3 cp "$TEST_FILE" "s3://$LAMBDA_BUCKET_NAME/.test-write-$$" \
       --region "$REGION" >/dev/null 2>&1; then
    echo "✅ Lambda bucket ready: s3://$LAMBDA_BUCKET_NAME"
    # Clean up test object
    aws s3 rm "s3://$LAMBDA_BUCKET_NAME/.test-write-$$" --region "$REGION" 2>/dev/null || true
    rm -f "$TEST_FILE"
    break
  fi

  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Lambda bucket not ready after $max_attempts attempts" >&2
    # Show what failed
    echo "📋 Debug info:"
    aws s3 ls "s3://$LAMBDA_BUCKET_NAME" --region "$REGION" 2>&1 | head -5 || true
    rm -f "$TEST_FILE"
    DEPLOYMENT_FAILED=true
    exit 1
  fi

  sleep_time=$attempt
  echo "⏳ Attempt $attempt/$max_attempts: Waiting ${sleep_time}s before retry..."
  sleep $sleep_time
  attempt=$((attempt + 1))
done
echo ""

# Stage 5.5: Build and upload Lambda functions (AFTER bucket exists, BEFORE Lambda stacks)
if [[ $ENVIRONMENT == feature-* ]] || [[ ! -z "$BUILD_LAMBDAS" ]]; then
  echo "🔨 Building and uploading Lambda functions..."
  if [ -f "infra/scripts/build-and-upload-lambdas.sh" ]; then
    chmod +x infra/scripts/build-and-upload-lambdas.sh
    ./infra/scripts/build-and-upload-lambdas.sh "$ENVIRONMENT" "$LAMBDA_BUCKET_NAME" || {
      echo "❌ Failed to build/upload Lambda functions" >&2
      DEPLOYMENT_FAILED=true
      exit 1
    }
  else
    echo "⚠️  Lambda build script not found, skipping Lambda deployment" >&2
  fi
  echo ""
fi

# Stage 6: Storage & CDN (depends on nothing, but Lambda bucket should exist first)
echo "Stage 6️⃣: Storage & CDN"

# Use appropriate parameter file based on environment type
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_FILE="$PARAM_DIR/ephemeral-05-storage-cdn.json"
else
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-05-storage-cdn.json"
fi

# Get WAF ARN from WAF stack (deployed in us-east-1)
echo "⏳ Retrieving WAF ARN from CloudFormation..."
WAF_ARN=$(aws cloudformation describe-stacks \
  --stack-name "growksh-website-waf-$ENVIRONMENT" \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`WebACLArn`].OutputValue' \
  --output text 2>/dev/null || echo "")

# Build parameter overrides with bucket name and ephemeral flag
PARAM_OVERRIDES="file://$PARAM_FILE BucketName=$ASSETS_BUCKET_NAME"

# Add IsEphemeral flag for ephemeral environments
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_OVERRIDES="$PARAM_OVERRIDES IsEphemeral=true"
else
  PARAM_OVERRIDES="$PARAM_OVERRIDES IsEphemeral=false"
fi

# Add WAF ARN if available
if [ -n "$WAF_ARN" ] && [ "$WAF_ARN" != "None" ]; then
  echo "✅ Found WAF ARN: $WAF_ARN"
  PARAM_OVERRIDES="$PARAM_OVERRIDES WAFArn=$WAF_ARN"
else
  echo "⚠️  WAF stack not found or no WebACLArn output. Proceeding without WAF."
fi

# Deploy with parameters
aws cloudformation deploy \
  --template-file "$TEMPLATE_DIR/05-storage-cdn-stack.yaml" \
  --stack-name "growksh-website-storage-cdn-$ENVIRONMENT" \
  --parameter-overrides $PARAM_OVERRIDES \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$REGION" \
  --no-fail-on-empty-changeset 2>&1 | tee -a "/tmp/deploy-growksh-website-storage-cdn-$ENVIRONMENT.log" || {
  echo "❌ Failed to deploy stack: growksh-website-storage-cdn-$ENVIRONMENT" >&2
  cat "/tmp/deploy-growksh-website-storage-cdn-$ENVIRONMENT.log" >&2
  DEPLOYMENT_FAILED=true
}

echo "✅ Stack deployed: growksh-website-storage-cdn-$ENVIRONMENT"
echo ""

# Stage 7: API Gateway (no dependencies)
echo "Stage 7️⃣: API Gateway"
deploy_stack \
  "growksh-website-api-$ENVIRONMENT" \
  "$TEMPLATE_DIR/06-api-gateway-stack.yaml"

# Stage 8: Cognito Lambda Triggers (depends on Cognito, IAM, Database, Lambda code bucket)
echo "Stage 8️⃣: Cognito Lambda Triggers"
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_FILE="$PARAM_DIR/ephemeral-07-cognito-lambdas.json"
else
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-07-cognito-lambdas.json"
fi
deploy_stack \
  "growksh-website-cognito-lambdas-$ENVIRONMENT" \
  "$TEMPLATE_DIR/07-cognito-lambdas-stack.yaml" \
  "$PARAM_FILE"

# Stage 9: API Lambda Functions (depends on API Gateway, IAM, Cognito, Database, Lambda code bucket)
echo "Stage 9️⃣: API Lambda Functions"
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_FILE="$PARAM_DIR/ephemeral-08-api-lambdas.json"
else
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-08-api-lambdas.json"
fi
deploy_stack \
  "growksh-website-api-lambdas-$ENVIRONMENT" \
  "$TEMPLATE_DIR/08-api-lambdas-stack.yaml" \
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
echo "📦 Assets bucket: $ASSETS_BUCKET_NAME"
echo "📦 Lambda code bucket: $LAMBDA_BUCKET_NAME"
echo ""

# Output the bucket names for workflow use
echo "ASSETS_BUCKET_NAME=$ASSETS_BUCKET_NAME" >> "$GITHUB_OUTPUT" 2>/dev/null || true
echo "LAMBDA_BUCKET_NAME=$LAMBDA_BUCKET_NAME" >> "$GITHUB_OUTPUT" 2>/dev/null || true
