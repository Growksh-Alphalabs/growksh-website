#!/bin/bash

# Discover API endpoint from CloudFormation and update .env.local
# This script finds the API Gateway endpoint from deployed CloudFormation stacks
# and updates .env.local with the correct value

ENVIRONMENT=${1:-dev}
REGION=${AWS_REGION:-ap-south-1}
ENV_FILE=".env.local"

echo "🔍 Discovering API endpoint for environment: $ENVIRONMENT"

# Try to find the API endpoint from CloudFormation exports
API_ENDPOINT=$(aws cloudformation list-exports \
  --region "$REGION" \
  --query "Exports[?Name=='growksh-website-${ENVIRONMENT}-api-endpoint'].Value" \
  --output text 2>/dev/null || echo "")

if [ -n "$API_ENDPOINT" ]; then
  echo "✅ Found API endpoint: $API_ENDPOINT"
  
  # Update .env.local with the API endpoint
  if grep -q "^VITE_API_URL=" "$ENV_FILE"; then
    # Update existing value
    sed -i.bak "s|^VITE_API_URL=.*|VITE_API_URL=$API_ENDPOINT|" "$ENV_FILE"
    echo "✅ Updated .env.local with new API endpoint"
  else
    # Append if not exists
    echo "VITE_API_URL=$API_ENDPOINT" >> "$ENV_FILE"
    echo "✅ Added API endpoint to .env.local"
  fi
  
  echo ""
  echo "📊 Updated .env.local:"
  grep "VITE_API_URL" "$ENV_FILE"
else
  echo "⚠️  Could not find API endpoint in CloudFormation exports"
  echo "   Expected export name: growksh-website-${ENVIRONMENT}-api-endpoint"
  echo ""
  echo "   This is normal if stacks haven't been deployed yet."
  echo "   To deploy stacks, run: ./infra/scripts/deploy-stacks.sh $ENVIRONMENT"
  echo ""
  echo "   For now, manually set VITE_API_URL in .env.local to your API endpoint"
  exit 1
fi
