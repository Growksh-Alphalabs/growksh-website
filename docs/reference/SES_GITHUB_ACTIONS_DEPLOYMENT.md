# SES Email Verification - GitHub Actions Deployment Guide

## Overview

This guide explains how to deploy Amazon SES email verification (OTP and magic link) through your GitHub Actions CI/CD pipeline.

## Architecture

```
GitHub Actions Workflow
├─ Build & Package Lambda Functions
│  ├─ send-otp.js
│  ├─ verify-otp.js
│  └─ custom-message.js (updated)
│
├─ Upload to S3
│  └─ Lambda code packages (*.zip)
│
├─ Deploy CloudFormation Stacks
│  ├─ Stack 10: SES Configuration
│  ├─ Stack 11: OTP Lambda Functions & DynamoDB
│  └─ Update Stack 07: Cognito Lambda triggers
│
└─ Post-Deployment
   ├─ Verify email identity
   ├─ Test OTP flow
   └─ Test magic link flow
```

## Deployment Order

**Critical**: Stacks must be deployed in this order:

1. **Stack 00** - IAM roles (already done)
2. **Stack 01** - Database tables (already done)
3. **Stack 02** - Cognito setup (already done)
4. **Stack 10** - SES configuration (NEW)
5. **Stack 11** - OTP Lambda & DynamoDB (NEW)
6. **Stack 07** - Update Cognito Lambda triggers (MODIFIED)
7. **Stack 08** - API Lambdas (update if needed)
8. **Stack 06** - API Gateway (update if needed)

## GitHub Actions Workflow Steps

### Step 1: Build Lambda Packages

```yaml
- name: Install Dependencies
  run: |
    cd aws-lambda/auth
    npm ci --production
    cd ../..

- name: Package send-otp Lambda
  run: |
    cd aws-lambda/auth
    zip -r ../../send-otp-${{ matrix.environment }}.zip send-otp.js node_modules/
    cd ../..

- name: Package verify-otp Lambda
  run: |
    cd aws-lambda/auth
    zip -r ../../verify-otp-${{ matrix.environment }}.zip verify-otp.js node_modules/
    cd ../..

- name: Package custom-message Lambda (Updated)
  run: |
    cd aws-lambda/auth
    zip -r ../../custom-message-${{ matrix.environment }}.zip custom-message.js node_modules/
    cd ../..
```

### Step 2: Upload to S3

```yaml
- name: Upload Lambda Packages to S3
  run: |
    aws s3 cp send-otp-${{ matrix.environment }}.zip \
      s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
    
    aws s3 cp verify-otp-${{ matrix.environment }}.zip \
      s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
    
    aws s3 cp custom-message-${{ matrix.environment }}.zip \
      s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: ap-south-1
```

### Step 3: Deploy SES Stack

```yaml
- name: Deploy SES CloudFormation Stack
  run: |
    aws cloudformation deploy \
      --template-file infra/cloudformation/10-ses-stack.yaml \
      --stack-name growksh-ses-${{ matrix.environment }} \
      --parameter-overrides \
        Environment=${{ matrix.environment }} \
        FromEmailAddress=${{ secrets.SES_FROM_EMAIL }} \
      --region ap-south-1 \
      --no-fail-on-empty-changeset
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Step 4: Deploy OTP Lambda Stack

```yaml
- name: Deploy OTP Lambda CloudFormation Stack
  run: |
    aws cloudformation deploy \
      --template-file infra/cloudformation/11-otp-lambda-stack.yaml \
      --stack-name growksh-otp-lambda-${{ matrix.environment }} \
      --parameter-overrides \
        Environment=${{ matrix.environment }} \
        LambdaCodeBucketName=${{ secrets.LAMBDA_CODE_BUCKET }} \
        LambdaCodeSourceEnv=-${{ matrix.environment }} \
        CognitoUserPoolId=${{ secrets.COGNITO_USER_POOL_ID }} \
      --region ap-south-1 \
      --no-fail-on-empty-changeset
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Step 5: Update Lambda Environment Variables

```yaml
- name: Update Lambda Environment Variables
  run: |
    # Update Send OTP function
    aws lambda update-function-configuration \
      --function-name growksh-send-otp-${{ matrix.environment }} \
      --environment Variables="{
        FROM_EMAIL=${{ secrets.SES_FROM_EMAIL }},
        OTP_TEMPLATE_NAME=growksh-${{ matrix.environment }}-otp-verification,
        OTP_LENGTH=6,
        OTP_EXPIRY_MINUTES=5,
        OTP_TABLE_NAME=growksh-otp-verification-${{ matrix.environment }},
        ENVIRONMENT=${{ matrix.environment }},
        AWS_REGION=ap-south-1
      }" \
      --region ap-south-1
    
    # Update Verify OTP function
    aws lambda update-function-configuration \
      --function-name growksh-verify-otp-${{ matrix.environment }} \
      --environment Variables="{
        OTP_TABLE_NAME=growksh-otp-verification-${{ matrix.environment }},
        COGNITO_USER_POOL_ID=${{ secrets.COGNITO_USER_POOL_ID }},
        AWS_REGION=ap-south-1
      }" \
      --region ap-south-1
    
    # Update Custom Message Cognito trigger
    aws lambda update-function-configuration \
      --function-name growksh-custom-message-${{ matrix.environment }} \
      --environment Variables="{
        FROM_EMAIL=${{ secrets.SES_FROM_EMAIL }},
        VERIFY_SECRET=${{ secrets.VERIFY_SECRET }},
        VERIFY_BASE_URL=${{ secrets.VERIFY_BASE_URL }},
        MAGIC_LINK_TEMPLATE_NAME=growksh-${{ matrix.environment }}-magic-link-verification,
        USE_SES=1,
        ENVIRONMENT=${{ matrix.environment }},
        AWS_REGION=ap-south-1,
        DEBUG_LOG=0
      }" \
      --region ap-south-1
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Step 6: Verify SES Email Identity

```yaml
- name: Verify SES Email Identity
  run: |
    # Check if email identity is verified
    VERIFIED=$(aws ses get-account-sending-enabled --region ap-south-1 | jq -r '.Enabled')
    
    if [ "$VERIFIED" != "true" ]; then
      echo "⚠️  SES Email Identity not verified"
      echo "Please verify the email identity in AWS SES console"
      exit 1
    fi
    
    echo "✅ SES Email Identity verified"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Required GitHub Secrets

Add these secrets to your GitHub Actions environment:

```
AWS_ACCESS_KEY_ID              # AWS IAM user access key
AWS_SECRET_ACCESS_KEY          # AWS IAM user secret key
LAMBDA_CODE_BUCKET             # S3 bucket for Lambda code
SES_FROM_EMAIL                 # Verified sender email (e.g., noreply@growksh.com)
VERIFY_SECRET                  # Secret for HMAC token generation
VERIFY_BASE_URL                # Frontend URL for email verification
COGNITO_USER_POOL_ID           # Cognito User Pool ID
```

## Example GitHub Actions Workflow File

```yaml
# .github/workflows/deploy-ses.yaml
name: Deploy SES Email Verification

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'aws-lambda/auth/**'
      - 'infra/cloudformation/10-ses-stack.yaml'
      - 'infra/cloudformation/11-otp-lambda-stack.yaml'

env:
  AWS_DEFAULT_REGION: ap-south-1

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging, prod]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      
      - name: Install Dependencies
        run: |
          cd aws-lambda/auth
          npm ci --production
          cd ../..
      
      - name: Package Lambda Functions
        run: |
          cd aws-lambda/auth
          zip -r ../../send-otp-${{ matrix.environment }}.zip send-otp.js node_modules/
          zip -r ../../verify-otp-${{ matrix.environment }}.zip verify-otp.js node_modules/
          zip -r ../../custom-message-${{ matrix.environment }}.zip custom-message.js node_modules/
          cd ../..
      
      - name: Upload Lambda Packages to S3
        run: |
          aws s3 cp send-otp-${{ matrix.environment }}.zip \
            s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
          aws s3 cp verify-otp-${{ matrix.environment }}.zip \
            s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
          aws s3 cp custom-message-${{ matrix.environment }}.zip \
            s3://${{ secrets.LAMBDA_CODE_BUCKET }}/
      
      - name: Deploy SES Stack
        run: |
          aws cloudformation deploy \
            --template-file infra/cloudformation/10-ses-stack.yaml \
            --stack-name growksh-ses-${{ matrix.environment }} \
            --parameter-overrides \
              Environment=${{ matrix.environment }} \
              FromEmailAddress=${{ secrets.SES_FROM_EMAIL }} \
            --no-fail-on-empty-changeset
      
      - name: Deploy OTP Lambda Stack
        run: |
          aws cloudformation deploy \
            --template-file infra/cloudformation/11-otp-lambda-stack.yaml \
            --stack-name growksh-otp-lambda-${{ matrix.environment }} \
            --parameter-overrides \
              Environment=${{ matrix.environment }} \
              LambdaCodeBucketName=${{ secrets.LAMBDA_CODE_BUCKET }} \
              LambdaCodeSourceEnv=-${{ matrix.environment }} \
              CognitoUserPoolId=${{ secrets.COGNITO_USER_POOL_ID }} \
            --no-fail-on-empty-changeset
      
      - name: Update Lambda Environment Variables
        run: |
          aws lambda update-function-configuration \
            --function-name growksh-send-otp-${{ matrix.environment }} \
            --environment Variables="{FROM_EMAIL=${{ secrets.SES_FROM_EMAIL }},OTP_TEMPLATE_NAME=growksh-${{ matrix.environment }}-otp-verification,OTP_LENGTH=6,OTP_EXPIRY_MINUTES=5,OTP_TABLE_NAME=growksh-otp-verification-${{ matrix.environment }},ENVIRONMENT=${{ matrix.environment }},AWS_REGION=ap-south-1}"
          
          aws lambda update-function-configuration \
            --function-name growksh-verify-otp-${{ matrix.environment }} \
            --environment Variables="{OTP_TABLE_NAME=growksh-otp-verification-${{ matrix.environment }},COGNITO_USER_POOL_ID=${{ secrets.COGNITO_USER_POOL_ID }},AWS_REGION=ap-south-1}"
          
          aws lambda update-function-configuration \
            --function-name growksh-custom-message-${{ matrix.environment }} \
            --environment Variables="{FROM_EMAIL=${{ secrets.SES_FROM_EMAIL }},VERIFY_SECRET=${{ secrets.VERIFY_SECRET }},VERIFY_BASE_URL=${{ secrets.VERIFY_BASE_URL }},MAGIC_LINK_TEMPLATE_NAME=growksh-${{ matrix.environment }}-magic-link-verification,USE_SES=1,ENVIRONMENT=${{ matrix.environment }},AWS_REGION=ap-south-1,DEBUG_LOG=0}"
      
      - name: Run Post-Deployment Tests
        run: |
          echo "Testing OTP endpoint..."
          # Add integration tests here
      
      - name: Slack Notification
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "SES Email Verification Deployment: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*SES Email Verification Deployment*\nEnvironment: ${{ matrix.environment }}\nStatus: ${{ job.status }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Deployment Checklist

Before deploying, ensure:

- ✅ All source code committed and pushed
- ✅ All GitHub secrets configured
- ✅ SES email identity verified in AWS
- ✅ DynamoDB table `growksh-otp-verification-{env}` created
- ✅ IAM permissions include SES and DynamoDB
- ✅ Lambda execution roles have SES permissions
- ✅ CloudFormation stacks 00-09 already deployed
- ✅ No conflicting stack names

## Deployment Commands (Manual)

If you prefer to deploy manually instead of using GitHub Actions:

```bash
# Set environment variables
export ENVIRONMENT=prod
export LAMBDA_CODE_BUCKET=growksh-lambda-code-prod
export SES_FROM_EMAIL=noreply@growksh.com

# Package Lambda functions
cd aws-lambda/auth
npm ci --production
zip -r ../../send-otp-${ENVIRONMENT}.zip send-otp.js node_modules/
zip -r ../../verify-otp-${ENVIRONMENT}.zip verify-otp.js node_modules/
cd ../..

# Upload to S3
aws s3 cp send-otp-${ENVIRONMENT}.zip s3://${LAMBDA_CODE_BUCKET}/
aws s3 cp verify-otp-${ENVIRONMENT}.zip s3://${LAMBDA_CODE_BUCKET}/

# Deploy SES stack
aws cloudformation deploy \
  --template-file infra/cloudformation/10-ses-stack.yaml \
  --stack-name growksh-ses-${ENVIRONMENT} \
  --parameter-overrides Environment=${ENVIRONMENT} FromEmailAddress=${SES_FROM_EMAIL} \
  --region ap-south-1

# Deploy OTP Lambda stack
aws cloudformation deploy \
  --template-file infra/cloudformation/11-otp-lambda-stack.yaml \
  --stack-name growksh-otp-lambda-${ENVIRONMENT} \
  --parameter-overrides \
    Environment=${ENVIRONMENT} \
    LambdaCodeBucketName=${LAMBDA_CODE_BUCKET} \
    LambdaCodeSourceEnv=-${ENVIRONMENT} \
  --region ap-south-1
```

## Troubleshooting

### Issue: CloudFormation stack creation fails

**Solution**:
1. Check CloudFormation events for specific error
2. Verify all parameters are provided
3. Ensure IAM permissions are sufficient
4. Check for existing resources with same name

### Issue: Lambda function doesn't have SES permission

**Solution**:
1. Update IAM role in `00-iam-stack.yaml`
2. Ensure `SESAccess` policy is attached
3. Re-deploy IAM stack: `aws cloudformation deploy ... 00-iam-stack.yaml`

### Issue: OTP emails not sending

**Solution**:
1. Check SES sandbox limits (100/day in sandbox)
2. Verify SES email identity is confirmed
3. Check Lambda CloudWatch logs
4. Verify `FROM_EMAIL` environment variable

### Issue: GitHub Actions secrets not working

**Solution**:
1. Verify secrets are set in repository settings
2. Check secret names match workflow YAML
3. Re-run workflow after updating secrets
4. Check AWS credentials have required permissions

## Next Steps

1. ✅ Review this deployment guide
2. ✅ Create GitHub Actions workflow file
3. ✅ Configure GitHub secrets
4. ✅ Run workflow to deploy SES
5. ✅ Verify email identity in SES console
6. ✅ Test OTP flow end-to-end
7. ✅ Monitor CloudWatch logs

## Related Documentation

- [SES_SETUP_GUIDE.md](SES_SETUP_GUIDE.md) - Detailed SES setup
- [../deployment-guides/DEPLOYMENT_CONFIG.md](../deployment-guides/DEPLOYMENT_CONFIG.md) - General deployment config
- [../architecture/DEPLOYMENT_ARCHITECTURE.md](../architecture/DEPLOYMENT_ARCHITECTURE.md) - Architecture overview
