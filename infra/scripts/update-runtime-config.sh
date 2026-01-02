#!/bin/bash

# Update runtime-config.js with deployment-specific values
# This script runs AFTER CloudFormation deployment to populate:
# - VITE_API_URL from API Gateway endpoint
# - Other runtime configuration values
#
# Usage: ./update-runtime-config.sh <environment>
# Example: ./update-runtime-config.sh dev

set -e

ENVIRONMENT=$1
REGION=${AWS_REGION:-ap-south-1}
RUNTIME_CONFIG_FILE="public/runtime-config.js"
TEMP_CONFIG="/tmp/runtime-config-$$.js"

if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Error: Environment name is required"
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "🔄 Updating runtime configuration for environment: $ENVIRONMENT"

# Get CloudFormation exports
echo "📋 Fetching CloudFormation exports..."

API_ENDPOINT=$(aws cloudformation list-exports \
  --query "Exports[?Name=='growksh-website-${ENVIRONMENT}-api-endpoint'].Value" \
  --output text \
  --region "$REGION" 2>/dev/null || echo "")

COGNITO_USER_POOL_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='growksh-website-${ENVIRONMENT}-cognito-user-pool-id'].Value" \
  --output text \
  --region "$REGION" 2>/dev/null || echo "")

COGNITO_CLIENT_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='growksh-website-${ENVIRONMENT}-cognito-client-id'].Value" \
  --output text \
  --region "$REGION" 2>/dev/null || echo "")

# Log what we found
echo "✅ API Endpoint: ${API_ENDPOINT:-(not found)}"
echo "✅ Cognito Pool ID: ${COGNITO_USER_POOL_ID:-(not found)}"
echo "✅ Cognito Client ID: ${COGNITO_CLIENT_ID:-(not found)}"

# If API endpoint not found, warn user
if [ -z "$API_ENDPOINT" ]; then
  echo "⚠️  Warning: API endpoint export not found. Skipping API_URL update."
  echo "   This may be expected if API Gateway hasn't been deployed yet."
fi

# Update the runtime config file
echo ""
echo "📝 Updating $RUNTIME_CONFIG_FILE..."

# Create temporary config with updated values
cat > "$TEMP_CONFIG" << 'EOF'
// Runtime configuration loaded before the React app.
//
// This file is copied as-is to the deployed site (e.g., S3/CloudFront).
// Update it after each deployment to point the frontend at the new Cognito
// User Pool and App Client without rebuilding the app bundle.

window.__GROWKSH_RUNTIME_CONFIG__ = {
  // Cognito User Pool (example: ap-south-1_AbCdEfGhI)
  VITE_COGNITO_USER_POOL_ID: 'POOL_ID_PLACEHOLDER',

  // Cognito App Client ID (no secret)
  VITE_COGNITO_CLIENT_ID: 'CLIENT_ID_PLACEHOLDER',

  // Backend API base URL (API Gateway invoke URL)
  VITE_API_URL: 'API_URL_PLACEHOLDER',

  // Optional: AWS region override
  VITE_AWS_REGION: 'REGION_PLACEHOLDER',

  // Toggle fake auth ("1" or "true" to enable)
  VITE_USE_FAKE_AUTH: '0',
};

try {
  console.info('[Growksh] runtime-config loaded', Object.keys(window.__GROWKSH_RUNTIME_CONFIG__ || {}));
} catch {}
EOF

# Replace placeholders with actual values
if [ -n "$COGNITO_USER_POOL_ID" ]; then
  sed -i "s|POOL_ID_PLACEHOLDER|$COGNITO_USER_POOL_ID|g" "$TEMP_CONFIG"
else
  # Keep existing value from original file
  EXISTING_POOL_ID=$(grep "VITE_COGNITO_USER_POOL_ID:" "$RUNTIME_CONFIG_FILE" | sed "s/.*: '//" | sed "s/',.*//" || echo "")
  sed -i "s|POOL_ID_PLACEHOLDER|$EXISTING_POOL_ID|g" "$TEMP_CONFIG"
fi

if [ -n "$COGNITO_CLIENT_ID" ]; then
  sed -i "s|CLIENT_ID_PLACEHOLDER|$COGNITO_CLIENT_ID|g" "$TEMP_CONFIG"
else
  # Keep existing value from original file
  EXISTING_CLIENT_ID=$(grep "VITE_COGNITO_CLIENT_ID:" "$RUNTIME_CONFIG_FILE" | sed "s/.*: '//" | sed "s/',.*//" || echo "")
  sed -i "s|CLIENT_ID_PLACEHOLDER|$EXISTING_CLIENT_ID|g" "$TEMP_CONFIG"
fi

if [ -n "$API_ENDPOINT" ]; then
  sed -i "s|API_URL_PLACEHOLDER|$API_ENDPOINT|g" "$TEMP_CONFIG"
else
  # Keep existing value from original file
  EXISTING_API_URL=$(grep "VITE_API_URL:" "$RUNTIME_CONFIG_FILE" | sed "s/.*: '//" | sed "s/',.*//" || echo "")
  sed -i "s|API_URL_PLACEHOLDER|$EXISTING_API_URL|g" "$TEMP_CONFIG"
fi

sed -i "s|REGION_PLACEHOLDER|$REGION|g" "$TEMP_CONFIG"

# Copy the updated config to the public directory
cp "$TEMP_CONFIG" "$RUNTIME_CONFIG_FILE"
rm -f "$TEMP_CONFIG"

echo "✅ Updated $RUNTIME_CONFIG_FILE"

# Upload to S3 and invalidate CloudFront
echo ""
echo "📤 Uploading updated runtime-config.js to S3..."

# Determine bucket name
if [[ $ENVIRONMENT == feature-* ]]; then
  ASSETS_BUCKET_NAME="growksh-website-ephemeral-assets-$ENVIRONMENT"
else
  ASSETS_BUCKET_NAME="growksh-website-$ENVIRONMENT-assets"
fi

# Upload runtime-config.js with Cache-Control headers
aws s3 cp "$RUNTIME_CONFIG_FILE" \
  "s3://$ASSETS_BUCKET_NAME/runtime-config.js" \
  --region "$REGION" \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
  --content-type "application/javascript" \
  || {
  echo "⚠️  Warning: Failed to upload runtime-config.js to S3"
  echo "   This may be expected if the S3 bucket hasn't been created yet."
}

# Invalidate CloudFront cache for runtime-config.js and index.html
echo ""
echo "🔄 Invalidating CloudFront cache..."

CLOUDFRONT_ID=$(aws cloudformation list-exports \
  --query "Exports[?Name=='growksh-website-${ENVIRONMENT}-cloudfront-id'].Value" \
  --output text \
  --region "$REGION" 2>/dev/null || echo "")

if [ -n "$CLOUDFRONT_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" \
    --region "$REGION" \
    && echo "✅ CloudFront invalidation created (ID: $CLOUDFRONT_ID)"
else
  echo "⚠️  Warning: Could not find CloudFront distribution ID. Skipping invalidation."
fi

echo ""
echo "✅ Runtime configuration updated successfully!"
echo ""
echo "📊 Updated values:"
echo "   VITE_COGNITO_USER_POOL_ID: $(grep 'VITE_COGNITO_USER_POOL_ID:' "$RUNTIME_CONFIG_FILE" | head -1)"
echo "   VITE_COGNITO_CLIENT_ID: $(grep 'VITE_COGNITO_CLIENT_ID:' "$RUNTIME_CONFIG_FILE" | head -1)"
echo "   VITE_API_URL: $(grep 'VITE_API_URL:' "$RUNTIME_CONFIG_FILE" | head -1)"
