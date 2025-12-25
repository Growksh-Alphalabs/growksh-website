#!/bin/bash
set -e

# Build and upload Lambda functions to S3
# Usage: ./build-and-upload-lambdas.sh <environment> <lambda-bucket-name>
# Example: ./build-and-upload-lambdas.sh dev growksh-website-lambda-code-dev

ENVIRONMENT=$1
LAMBDA_BUCKET=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$LAMBDA_BUCKET" ]; then
  echo "❌ Error: Environment and Lambda bucket name are required"
  echo "Usage: $0 <environment> <lambda-bucket-name>"
  echo "Example: $0 dev growksh-website-lambda-code-dev"
  exit 1
fi

REGION=${AWS_REGION:-ap-south-1}
PROJECT_ROOT=$(cd "$(dirname "$0")"/../.. && pwd)
LAMBDA_DIR="$PROJECT_ROOT/aws-lambda"
BUILD_DIR="$PROJECT_ROOT/.build"

echo "🔨 Building Lambda functions for environment: $ENVIRONMENT"
echo "📦 Target bucket: $LAMBDA_BUCKET"
echo "🏗️  Build directory: $BUILD_DIR"
echo ""

# Create build directory
mkdir -p "$BUILD_DIR"

# Function to build and upload a Lambda function
build_lambda() {
  local func_type=$1
  local func_name=$2
  local source_dir=$3
  
  echo "📦 Building: $func_name ($func_type)"
  
  ARTIFACTS_DIR="$BUILD_DIR/$func_type/$func_name-$ENVIRONMENT"
  rm -rf "$ARTIFACTS_DIR"
  mkdir -p "$ARTIFACTS_DIR"
  
  # Copy source files
  cp "$source_dir"/*.js "$ARTIFACTS_DIR/" 2>/dev/null || true
  cp "$source_dir"/package.json "$ARTIFACTS_DIR/" 2>/dev/null || true
  cp "$source_dir"/package-lock.json "$ARTIFACTS_DIR/" 2>/dev/null || true
  
  # Install dependencies
  if [ -f "$ARTIFACTS_DIR/package.json" ]; then
    cd "$ARTIFACTS_DIR"
    npm install --production --silent
    cd "$PROJECT_ROOT"
  fi
  
  # Create zip file
  ZIP_FILE="$BUILD_DIR/${func_type}-${func_name}-${ENVIRONMENT}.zip"
  rm -f "$ZIP_FILE"
  cd "$ARTIFACTS_DIR"
  zip -r -q "$ZIP_FILE" .
  cd "$PROJECT_ROOT"
  
  # Upload to S3
  S3_KEY="${func_type}/${func_name}-${ENVIRONMENT}.zip"
  aws s3 cp "$ZIP_FILE" "s3://$LAMBDA_BUCKET/$S3_KEY" \
    --region "$REGION" \
    --sse AES256 || {
    echo "❌ Failed to upload $func_name"
    return 1
  }
  
  echo "✅ Uploaded: s3://$LAMBDA_BUCKET/$S3_KEY"
}

# Build Cognito Lambda functions
echo "📋 Building Cognito Lambda functions..."
build_lambda "auth" "pre-sign-up" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "custom-message" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "create-auth-challenge" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "define-auth-challenge" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "verify-auth-challenge" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "post-confirmation" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "signup" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "verify-email" "$LAMBDA_DIR/auth" || true
build_lambda "auth" "check-admin" "$LAMBDA_DIR/auth" || true

# Build Contact Lambda function
echo "📋 Building Contact Lambda function..."
build_lambda "contact" "contact" "$LAMBDA_DIR/contact" || true

# Cleanup build directory
rm -rf "$BUILD_DIR"

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ Lambda functions built and uploaded successfully!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📦 Bucket: s3://$LAMBDA_BUCKET"
