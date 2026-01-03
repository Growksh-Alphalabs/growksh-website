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

# Function to deploy a stack with optional dynamic parameters
deploy_stack() {
  local stack_name=$1
  local template_file=$2
  local param_file=$3
  local deploy_region=${4:-$REGION}  # Use provided region or default to REGION
  local extra_params="$5"  # Additional parameters to append

  echo "📦 Deploying stack: $stack_name (region: $deploy_region)"

  # If parameter file exists and is valid, use it
  if [ -n "$param_file" ] && [ -f "$param_file" ]; then
    # Load parameters from file into an array
    local params_from_file=$(cat "$param_file" | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' | tr '\n' ' ')

    # Start with Environment parameter (always needed)
    local param_overrides="Environment=$ENVIRONMENT"

    # Add parameters from file if any
    if [ -n "$params_from_file" ]; then
      param_overrides="$param_overrides $params_from_file"
    fi

    # Add extra parameters if provided
    if [ -n "$extra_params" ]; then
      param_overrides="$param_overrides $extra_params"
    fi

    # Add dynamic overrides for dynamic values (BucketName, WAFArn, etc.)
    if [[ "$stack_name" == *"storage-cdn"* ]]; then
      param_overrides="$param_overrides BucketName=$ASSETS_BUCKET_NAME"
      # Get WAF ARN from CloudFormation if it's an ephemeral environment
      if [[ $ENVIRONMENT == feature-* ]]; then
        local waf_arn=$(aws cloudformation describe-stacks \
          --stack-name "growksh-website-waf" \
          --region us-east-1 \
          --query 'Stacks[0].Outputs[?OutputKey==`WebACLArn`].OutputValue' \
          --output text 2>/dev/null || echo "")
        if [ -n "$waf_arn" ]; then
          param_overrides="$param_overrides WAFArn=$waf_arn"
        fi
      fi
    elif [[ "$stack_name" == *"lambda-code-bucket"* ]]; then
      param_overrides="$param_overrides BucketName=$LAMBDA_BUCKET_NAME"
    fi

    # Add parameters for Lambda functions if not already in file
    if [[ "$stack_name" == *"cognito-lambdas"* ]]; then
      # For ephemeral environments, always override bucket name to use the dynamic one
      if [[ $ENVIRONMENT == feature-* ]]; then
        param_overrides="$param_overrides LambdaCodeBucketName=$LAMBDA_BUCKET_NAME"
      elif ! grep -q "LambdaCodeBucketName" "$param_file"; then
        param_overrides="$param_overrides LambdaCodeBucketName=$LAMBDA_BUCKET_NAME"
      fi
      if ! grep -q "SESSourceEmail" "$param_file"; then
        param_overrides="$param_overrides SESSourceEmail=noreply@growksh.com"
      fi
      if ! grep -q "VerifyBaseUrl" "$param_file"; then
        param_overrides="$param_overrides VerifyBaseUrl=https://$ASSETS_BUCKET_NAME.s3.amazonaws.com/auth/verify-email"
      fi
      if ! grep -q "DebugLogOTP" "$param_file"; then
        param_overrides="$param_overrides DebugLogOTP=1"
      fi
    elif [[ "$stack_name" == *"api-lambdas"* ]]; then
      # For ephemeral environments, always override bucket name to use the dynamic one
      if [[ $ENVIRONMENT == feature-* ]]; then
        param_overrides="$param_overrides LambdaCodeBucketName=$LAMBDA_BUCKET_NAME"
      elif ! grep -q "LambdaCodeBucketName" "$param_file"; then
        param_overrides="$param_overrides LambdaCodeBucketName=$LAMBDA_BUCKET_NAME"
      fi
      if ! grep -q "SESSourceEmail" "$param_file"; then
        param_overrides="$param_overrides SESSourceEmail=noreply@growksh.com"
      fi
      if ! grep -q "VerifyBaseUrl" "$param_file"; then
        param_overrides="$param_overrides VerifyBaseUrl=https://$ASSETS_BUCKET_NAME.s3.amazonaws.com/auth/verify-email"
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
      return 1
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
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != feature-* ]]; then
  echo "  4. growksh-website-waf-$ENVIRONMENT (WAF, us-east-1)"
  echo "  5. growksh-website-lambda-code-bucket-$ENVIRONMENT (Lambda code bucket)"
  echo "  6. growksh-website-storage-cdn-$ENVIRONMENT (S3 + CloudFront)"
  echo "  7. growksh-website-api-$ENVIRONMENT (API Gateway)"
  echo "  8. growksh-website-cognito-lambdas-$ENVIRONMENT (Cognito Lambdas)"
  echo "  9. growksh-website-api-lambdas-$ENVIRONMENT (API Lambdas)"
else
  echo "  4. ⏭️  (skipping WAF for dev/ephemeral to reduce costs)"
  echo "  5. growksh-website-lambda-code-bucket-$ENVIRONMENT (Lambda code bucket)"
  echo "  6. growksh-website-storage-cdn-$ENVIRONMENT (S3 + CloudFront)"
  echo "  7. growksh-website-api-$ENVIRONMENT (API Gateway)"
  echo "  8. growksh-website-cognito-lambdas-$ENVIRONMENT (Cognito Lambdas)"
  echo "  9. growksh-website-api-lambdas-$ENVIRONMENT (API Lambdas)"
fi
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

# Stage 4: WAF (us-east-1, no dependencies, before CDN) - Skip for dev/ephemeral to reduce costs
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != feature-* ]]; then
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
else
  echo "Stage 4️⃣: WAF - ⏭️  SKIPPED (dev/ephemeral environment - costs reduced by not using WAF)"
fi
echo ""

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
# Always build for ephemeral/feature branches, or for dev/prod if explicitly requested via BUILD_LAMBDAS
if [[ $ENVIRONMENT == feature-* ]] || [[ ! -z "$BUILD_LAMBDAS" ]] || [[ "$ENVIRONMENT" == "dev" ]] || [[ "$ENVIRONMENT" == "prod" ]]; then
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
if [[ $ENVIRONMENT == feature-* ]]; then
  PARAM_FILE="$PARAM_DIR/ephemeral-05-storage-cdn.json"
else
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-05-storage-cdn.json"
fi
deploy_stack \
  "growksh-website-storage-cdn-$ENVIRONMENT" \
  "$TEMPLATE_DIR/05-storage-cdn-stack.yaml" \
  "$PARAM_FILE"

# Stage 6.5: Route53 DNS Records (depends on storage-cdn for CloudFront domain)
echo "Stage 6️⃣.5️⃣: Route53 DNS Records"
if [[ "$ENVIRONMENT" != feature-* ]]; then
  # Determine parameter file
  PARAM_FILE="$PARAM_DIR/${ENVIRONMENT}-09-route53-stack.json"

  # Only deploy Route53 if DomainNames are configured in parameter file
  if [ -f "$PARAM_FILE" ] && grep -q "DomainNames" "$PARAM_FILE"; then
    # Get CloudFront domain name from storage-cdn stack
    CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
      --stack-name "growksh-website-storage-cdn-$ENVIRONMENT" \
      --region "$REGION" \
      --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
      --output text 2>/dev/null || echo "")

    if [ -n "$CLOUDFRONT_DOMAIN" ] && [ "$CLOUDFRONT_DOMAIN" != "None" ]; then
      # Get hosted zone and domain names from parameter file
      HOSTED_ZONE_ID=$(cat "$PARAM_FILE" | jq -r '.[] | select(.ParameterKey=="HostedZoneId") | .ParameterValue')
      DOMAIN_NAMES=$(cat "$PARAM_FILE" | jq -r '.[] | select(.ParameterKey=="DomainNames") | .ParameterValue' | tr ',' '\n' | xargs)

      if [ -n "$HOSTED_ZONE_ID" ] && [ -n "$DOMAIN_NAMES" ]; then
        # Update Route53 records using AWS CLI instead of CloudFormation
        # This avoids issues with CloudFormation trying to create records that already exist
        echo "  Updating Route53 records for CloudFront domain: $CLOUDFRONT_DOMAIN"

        # Read domain names as array
        read -ra DOMAINS <<< "$DOMAIN_NAMES"

        for DOMAIN in "${DOMAINS[@]}"; do
          echo "  - Updating A record for: $DOMAIN"

          # Create a JSON change batch for this domain
          CHANGE_BATCH=$(cat <<EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "$CLOUDFRONT_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF
)

          # Update the Route53 record
          if aws route53 change-resource-record-sets \
            --hosted-zone-id "$HOSTED_ZONE_ID" \
            --change-batch "$CHANGE_BATCH" \
            --region "$REGION" > /dev/null 2>&1; then
            echo "    ✅ Successfully updated Route53 record for $DOMAIN"
          else
            echo "    ❌ Failed to update Route53 record for $DOMAIN"
            DEPLOYMENT_FAILED=true
          fi
        done
      else
        echo "⚠️  Could not extract hosted zone or domain names from parameter file"
      fi
    else
      echo "⚠️  Could not get CloudFront domain name, skipping Route53 update"
    fi
  else
    echo "⏭️  Skipping Route53 update (DomainNames not configured for this environment)"
  fi
  echo ""
fi

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
fi
echo ""
echo "📊 Stack Status:"
STACK_OUTPUT=$(aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$ENVIRONMENT')].{Name:StackName,Status:StackStatus}" \
  --region "$REGION" \
  --output table 2>/dev/null)
echo "$STACK_OUTPUT"

echo ""

# Final check: Verify all stacks are in successful state (FAILED, ROLLBACK, DELETE_FAILED are bad states)
FAILED_STACKS=$(aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$ENVIRONMENT') && (StackStatus like 'FAILED|ROLLBACK%|DELETE_FAILED')].StackName" \
  --region "$REGION" \
  --output text 2>/dev/null)

if [ -n "$FAILED_STACKS" ]; then
  echo "❌ Deployment FAILED - some stacks have failed status:"
  for stack in $FAILED_STACKS; do
    echo "  - $stack"
  done
  echo ""
  DEPLOYMENT_FAILED=true
else
  echo "✅ All stacks deployed successfully!"
  echo "═══════════════════════════════════════════════════"
fi

# Check if deployment failed and exit with error code
if [ "$DEPLOYMENT_FAILED" = true ]; then
  echo "❌ Deployment failed for environment: $ENVIRONMENT"
  echo "📦 Assets bucket: $ASSETS_BUCKET_NAME"
  echo "📦 Lambda code bucket: $LAMBDA_BUCKET_NAME"
  echo ""

  # Capture detailed error information from all failed stacks
  echo "📋 Detailed Error Information:"
  echo "======================================"

  failed_stacks=$(aws cloudformation describe-stacks \
    --query "Stacks[?contains(StackName, '$ENVIRONMENT') && StackStatus like 'CREATE_FAILED|UPDATE_FAILED|ROLLBACK_COMPLETE|UPDATE_ROLLBACK_COMPLETE'].StackName" \
    --region "$REGION" \
    --output text)

  error_captured=false

  for stack in $failed_stacks; do
    if [ -n "$stack" ]; then
      echo ""
      echo "📌 Stack: $stack"
      echo "---"

      # Get stack status reason
      status_reason=$(aws cloudformation describe-stacks \
        --stack-name "$stack" \
        --region "$REGION" \
        --query 'Stacks[0].StackStatusReason' \
        --output text 2>/dev/null)

      if [ -n "$status_reason" ] && [ "$status_reason" != "None" ]; then
        echo "Status Reason: $status_reason"
        error_captured=true
      fi

      # Get resource-level errors
      echo ""
      echo "Failed Resources:"
      aws cloudformation describe-stack-resources \
        --stack-name "$stack" \
        --region "$REGION" \
        --query "StackResources[?ResourceStatus like 'CREATE_FAILED|UPDATE_FAILED'].{LogicalId:LogicalResourceId,Type:ResourceType,Status:ResourceStatus,Reason:ResourceStatusReason}" \
        --output text | while read line; do
        if [ -n "$line" ]; then
          echo "  - $line"
          error_captured=true
        fi
      done

      # Get stack events with errors
      echo ""
      echo "Recent Stack Events:"
      aws cloudformation describe-stack-events \
        --stack-name "$stack" \
        --region "$REGION" \
        --query "StackEvents[?contains(ResourceStatus, 'FAILED') || contains(ResourceStatus, 'IN_PROGRESS')].{Time:Timestamp,Resource:LogicalResourceId,Status:ResourceStatus,Reason:ResourceStatusReason}" \
        --output text | head -20 | while read line; do
        if [ -n "$line" ]; then
          echo "  $line"
        fi
      done

      # Get change set details if available
      echo ""
      echo "Change Set Details:"
      changesets=$(aws cloudformation list-change-sets \
        --stack-name "$stack" \
        --region "$REGION" \
        --query "Summaries[?Status=='FAILED'].ChangeSetId" \
        --output text)

      for changeset_id in $changesets; do
        if [ -n "$changeset_id" ]; then
          echo "  Changeset: $changeset_id"
          aws cloudformation describe-change-set \
            --stack-name "$stack" \
            --change-set-name "$changeset_id" \
            --region "$REGION" \
            --query 'StatusReason' \
            --output text 2>/dev/null | while read reason; do
            if [ -n "$reason" ] && [ "$reason" != "None" ]; then
              echo "  Reason: $reason"
              error_captured=true
            fi
          done
        fi
      done
    fi
  done

  echo ""
  echo "======================================"
  echo ""

  # Only clean up stacks if we successfully captured error information
  if [ "$error_captured" = true ]; then
    echo "🧹 Cleaning up failed stacks (error information captured)..."
    for stack in $failed_stacks; do
      if [ -n "$stack" ]; then
        echo "  - Deleting failed stack: $stack"
        aws cloudformation delete-stack --stack-name "$stack" --region "$REGION" 2>/dev/null || true
      fi
    done
    echo "✅ Cleanup initiated"
  else
    echo "⚠️  Could not capture detailed error information"
    echo "❌ Stacks NOT deleted for manual inspection:"
    for stack in $failed_stacks; do
      if [ -n "$stack" ]; then
        echo "  - $stack"
      fi
    done
  fi
  echo ""

  exit 1
fi

echo "🎉 Deployment complete for environment: $ENVIRONMENT"
echo "📦 Assets bucket: $ASSETS_BUCKET_NAME"
echo "📦 Lambda code bucket: $LAMBDA_BUCKET_NAME"
echo ""

# Output the bucket names for workflow use
echo "ASSETS_BUCKET_NAME=$ASSETS_BUCKET_NAME" >> "$GITHUB_OUTPUT" 2>/dev/null || true
echo "LAMBDA_BUCKET_NAME=$LAMBDA_BUCKET_NAME" >> "$GITHUB_OUTPUT" 2>/dev/null || true
