# Development Environment Setup Guide

This guide covers setting up and working with the development environment.

## Overview

**Development Environment**:
- AWS Region: `ap-south-1` (Mumbai)
- Environment Identifier: `dev`
- Stack Naming: `growksh-website-*-dev`
- Deployment Branch: `develop`
- Approval Required: No
- Cost: ~$30-50/month

---

## Initial Setup

### 1. Clone and Prepare Repository

```bash
# Clone repository
git clone https://github.com/Growksh-Alphlabs/growksh-website.git
cd growksh-website

# Checkout or create develop branch
git checkout develop

# Install pre-commit hooks (validates CloudFormation, code style, etc.)
pip install pre-commit
pre-commit install

# Verify hooks work
python -m pre_commit run --all-files
```

### 2. Deploy Development Infrastructure

```bash
# Deploy infrastructure
chmod +x infra/scripts/deploy-stacks.sh
./infra/scripts/deploy-stacks.sh dev
```

**Expected Duration**: 10-15 minutes

**Expected Output**:
```
✅ All stacks deployed successfully!
growksh-website-iam-dev              CREATE_COMPLETE
growksh-website-database-dev         CREATE_COMPLETE
growksh-website-cognito-dev          CREATE_COMPLETE
growksh-website-storage-cdn-dev      CREATE_COMPLETE
growksh-website-api-dev              CREATE_COMPLETE
growksh-website-cognito-lambdas-dev  CREATE_COMPLETE
growksh-website-api-lambdas-dev      CREATE_COMPLETE
```

### 2. Get Development Endpoints

```bash
# Get CloudFront Domain
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text

# Example output: d1234567890abc.cloudfront.net

# Get API Endpoint
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text

# Example output: https://abc123def456.execute-api.ap-south-1.amazonaws.com/dev
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Frontend URL
VITE_API_URL=https://abc123def456.execute-api.ap-south-1.amazonaws.com/dev

# Cognito Configuration
VITE_COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxxxxx
VITE_COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i0jk

# Contact API
VITE_CONTACT_API_URL=https://abc123def456.execute-api.ap-south-1.amazonaws.com/dev/contact
```

To find these values:

```bash
# Get Cognito User Pool ID
aws cloudformation describe-stacks \
  --stack-name growksh-website-cognito-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" \
  --output text

# Get Cognito Client ID
aws cloudformation describe-stacks \
  --stack-name growksh-website-cognito-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" \
  --output text
```

### 4. Build and Deploy Frontend

```bash
# Install dependencies
npm ci

# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://growksh-website-assets-dev/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

Get Distribution ID:
```bash
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CdnDistributionId'].OutputValue" \
  --output text
```

---

## Daily Development Workflow

### 1. Start Work on Feature

```bash
# Ensure you're on develop with latest code
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes...
```

### 2. Test Locally

```bash
# Install dependencies if needed
npm ci

# Start dev server
npm run dev

# Navigate to http://localhost:5173
```

### 3. Commit and Push

```bash
# Commit changes
git add .
git commit -m "feat: describe your changes"

# Push to feature branch
git push origin feature/your-feature-name
```

### 4. Create Pull Request

```
1. Go to https://github.com/Growksh-Alphalabs/growksh-website/pulls
2. Click "New pull request"
3. Select: feature/your-feature-name → develop
4. Add description
5. Click "Create pull request"
```

### 5. GitHub Actions Deploys Ephemeral Environment

GitHub Actions automatically:
- ✅ Validates CloudFormation templates
- ✅ Deploys ephemeral stacks
- ✅ Builds and uploads frontend
- ✅ Comments PR with test URLs
- ✅ Provides testing environment

### 6. Test Ephemeral Environment

```
1. Check PR for GitHub Actions comment
2. Click provided frontend URL
3. Test your changes
4. Verify all features work
```

### 7. Merge to Develop

```
1. Request code review
2. Get approval
3. Click "Merge pull request" on GitHub
4. GitHub Actions automatically:
   - Deploys to dev environment
   - Builds and uploads frontend
   - Cleans up ephemeral stacks
   - Invalidates CloudFront cache
```

### 8. Test in Dev Environment

```bash
# Get CloudFront domain
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text

# Visit in browser: https://<domain>
```

---

## Common Development Tasks

### View Dev Logs

```bash
# CloudFront logs
aws logs tail /aws/cloudfront/growksh-website-dev --follow

# Lambda logs
aws logs tail /aws/lambda/growksh-website-pre-sign-up-dev --follow
aws logs tail /aws/lambda/growksh-website-contact-dev --follow

# API Gateway logs
aws logs tail /aws/apigateway/growksh-website-api-dev --follow
```

### Query Dev Database

```bash
# List auth OTP table items
aws dynamodb scan \
  --table-name growksh-website-otp-dev \
  --region ap-south-1

# List contacts
aws dynamodb scan \
  --table-name growksh-website-contact-dev \
  --region ap-south-1

# Query specific contact
aws dynamodb get-item \
  --table-name growksh-website-contact-dev \
  --key '{"id":{"S":"contact-id-123"}}' \
  --region ap-south-1
```

### Test Auth Flow

```bash
# Create test user in Cognito
aws cognito-idp admin-create-user \
  --user-pool-id ap-south-1_xxxxxxxxxxxx \
  --username testuser@example.com \
  --temporary-password TempPassword123! \
  --region ap-south-1

# Simulate auth challenge
# Use API endpoint to test signup/verify-email flows
curl -X POST https://api.example.com/dev/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Monitor Costs

```bash
# Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=growksh-website-contact-dev \
  --start-time 2025-12-24T00:00:00Z \
  --end-time 2025-12-25T00:00:00Z \
  --period 86400 \
  --statistics Sum \
  --region ap-south-1
```

---

## Troubleshooting Development Issues

### Issue: Frontend Not Updating

**Symptoms**: Code changes not visible after push to develop

**Solution**:
```bash
# Clear CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"

# Verify frontend was uploaded to S3
aws s3 ls s3://growksh-website-assets-dev/ --recursive | tail -20
```

### Issue: API Endpoints Returning 404

**Symptoms**: API calls fail with "not found"

**Solution**:
```bash
# Verify API stack is deployed
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-dev \
  --region ap-south-1

# Check API Gateway resource paths
aws apigateway get-resources \
  --rest-api-id <API_ID> \
  --region ap-south-1

# Verify Lambda permissions
aws lambda get-policy \
  --function-name growksh-website-contact-dev \
  --region ap-south-1
```

### Issue: Auth Not Working

**Symptoms**: Login fails or email verification fails

**Solution**:
```bash
# Check Cognito configuration
aws cognito-idp describe-user-pool \
  --user-pool-id ap-south-1_xxxxxxxxxxxx \
  --region ap-south-1

# Check Lambda trigger configuration
aws cognito-idp get-user-pool-mfa-config \
  --user-pool-id ap-south-1_xxxxxxxxxxxx \
  --region ap-south-1

# View Lambda logs
aws logs tail /aws/lambda/growksh-website-custom-message-dev --follow
```

### Issue: Database Query Slow

**Symptoms**: Contacts page loads slowly

**Solution**:
```bash
# Check DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedWriteCapacityUnits \
  --dimensions Name=TableName,Value=growksh-website-contact-dev \
  --start-time 2025-12-24T00:00:00Z \
  --end-time 2025-12-25T00:00:00Z \
  --period 3600 \
  --statistics Sum \
  --region ap-south-1
```

---

## Useful Development Commands

```bash
# List all dev stacks
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --query "StackSummaries[?contains(StackName, 'dev')].StackName" \
  --output table \
  --region ap-south-1

# Get CloudFront domain for quick access
echo "https://$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-dev \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)"

# Watch deployment progress
watch -n 5 'aws cloudformation describe-stacks \
  --stack-name growksh-website-api-dev \
  --region ap-south-1 \
  --query "Stacks[0].StackStatus" \
  --output text'

# Tail all Lambda logs
aws logs tail /aws/lambda --follow --region ap-south-1 | grep growksh-website-dev
```

---

## Best Practices

1. **Always test in develop first** before merging to main
2. **Use feature branches** for all changes (never commit directly to develop)
3. **Monitor costs** regularly - dev should be ~$30-50/month
4. **Clean up test data** from DynamoDB regularly
5. **Keep dependencies updated** - run `npm audit` weekly
6. **Review CloudWatch metrics** - watch for Lambda errors or high latency
7. **Test ephemeral environments** thoroughly before merging to develop

---

**Last Updated**: Dec 24, 2025
**Status**: Production Ready
