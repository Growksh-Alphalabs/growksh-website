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
BUILD_DIR="$PROJECT_ROOT/.build/lambda"

echo "🔨 Building Lambda functions for environment: $ENVIRONMENT"
echo "📦 Target bucket: $LAMBDA_BUCKET"
echo "📂  Build directory: $BUILD_DIR"
echo ""

# Clean and create build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Function to build and upload a Lambda function
build_lambda() {
  local func_type=$1
  local func_name=$2
  local source_dir=$3
  local handler_file=$4

  echo "📦 Building: $func_name"

  local artifact_dir="$BUILD_DIR/$func_type/$func_name"
  mkdir -p "$artifact_dir"

  # Copy handler file
  if [ ! -f "$source_dir/$handler_file" ]; then
    echo "⚠️  Warning: Handler file not found: $source_dir/$handler_file (skipping)"
    return 0
  fi

  cp "$source_dir/$handler_file" "$artifact_dir/"

  # Copy package.json and install dependencies
  if [ -f "$source_dir/package.json" ]; then
    cp "$source_dir/package.json" "$artifact_dir/"
    if [ -f "$source_dir/package-lock.json" ]; then
      cp "$source_dir/package-lock.json" "$artifact_dir/"
    fi

    # Install dependencies
    cd "$artifact_dir"
    npm install --production --silent 2>&1 | grep -v "npm warn" || true
    cd "$PROJECT_ROOT"
  fi

  # Create zip file in build directory (not nested in subdirectory)
  local zip_name="${func_type}-${func_name}-${ENVIRONMENT}.zip"
  local zip_path="$BUILD_DIR/$zip_name"

  # Remove old zip if it exists
  rm -f "$zip_path"

  # Create zip from artifact directory contents
  cd "$artifact_dir"
  zip -r -q "$zip_path" . || {
    echo "❌ Failed to create zip: $zip_name"
    cd "$PROJECT_ROOT"
    return 1
  }

  # Verify zip was created
  if [ ! -f "$zip_path" ]; then
    echo "❌ Zip file not created: $zip_path"
    cd "$PROJECT_ROOT"
    return 1
  fi

  cd "$PROJECT_ROOT"

  # Upload to S3 with retry logic
  local s3_key="${func_type}/${func_name}-${ENVIRONMENT}.zip"
  echo "📤 Uploading: s3://$LAMBDA_BUCKET/$s3_key"

  local max_retries=5
  local retry=0
  local upload_output

  while [ $retry -lt $max_retries ]; do
    # Capture both stdout and stderr
    upload_output=$(aws s3 cp "$zip_path" "s3://$LAMBDA_BUCKET/$s3_key" \
      --region "$REGION" \
      --sse AES256 2>&1)

    if [ $? -eq 0 ]; then
      echo "✅ Uploaded: $s3_key"
      return 0
    fi

    retry=$((retry + 1))
    if [ $retry -lt $max_retries ]; then
      local wait_time=$((3 ** retry))  # 3, 9, 27, 81, 243 seconds
      echo "⚠️  Upload failed: $upload_output" >&2
      echo "⚠️  Retrying in ${wait_time}s (attempt $((retry + 1))/$max_retries)..."
      sleep $wait_time
    fi
  done

  echo "❌ Failed to upload after $max_retries attempts: $s3_key" >&2
  echo "📋 Last error: $upload_output" >&2
  return 1
}

# Build Cognito Lambda functions from auth directory
echo "📋 Building Cognito Lambda functions..."
build_lambda "auth" "pre-sign-up" "$LAMBDA_DIR/auth" "pre-sign-up.js"
build_lambda "auth" "custom-message" "$LAMBDA_DIR/auth" "custom-message.js"
build_lambda "auth" "create-auth-challenge" "$LAMBDA_DIR/auth" "create-auth-challenge.js"
build_lambda "auth" "define-auth-challenge" "$LAMBDA_DIR/auth" "define-auth-challenge.js"
build_lambda "auth" "verify-auth-challenge" "$LAMBDA_DIR/auth" "verify-auth-challenge.js"
build_lambda "auth" "post-confirmation" "$LAMBDA_DIR/auth" "post-confirmation.js"
build_lambda "auth" "signup" "$LAMBDA_DIR/auth" "signup.js"
build_lambda "auth" "verify-email" "$LAMBDA_DIR/auth" "verify-email.js"
build_lambda "auth" "check-admin" "$LAMBDA_DIR/auth" "define-auth-challenge.js"

# Build Contact Lambda function
echo "📋 Building Contact Lambda function..."
build_lambda "contact" "contact" "$LAMBDA_DIR/contact" "index.js"

# List uploaded files
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Lambda functions built and uploaded successfully!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📦 Bucket: s3://$LAMBDA_BUCKET"
echo "📄 Uploaded files:"
aws s3 ls "s3://$LAMBDA_BUCKET/" --recursive --region "$REGION" 2>/dev/null | awk '{print "   - " $4}' || echo "   (no files listed)"
echo ""
