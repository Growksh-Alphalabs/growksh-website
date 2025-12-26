# Passwordless Auth - Configuration Reference

## Environment Variables

### Frontend Configuration (.env.local)

```bash
# ==========================================
# Cognito Configuration (REQUIRED)
# ==========================================
VITE_COGNITO_USER_POOL_ID=<CloudFormation Output: CognitoUserPoolId>
VITE_COGNITO_CLIENT_ID=<CloudFormation Output: CognitoUserPoolClientId>

# ==========================================
# API Configuration (REQUIRED)
# ==========================================
VITE_API_URL=<CloudFormation Output: AuthApiEndpoint>
# Example: https://abc123.execute-api.ap-south-1.amazonaws.com/Prod/

# ==========================================
# Optional: Fake Auth for Local Testing
# ==========================================
VITE_USE_FAKE_AUTH=0
# Set to 1 to enable fake auth without AWS
# Useful for: Local development, CI/CD testing, demo

# ==========================================
# AWS Region (Optional - Defaults to ap-south-1)
# ==========================================
VITE_AWS_REGION=ap-south-1
```

### Getting CloudFormation Outputs

```bash
# Get all stack outputs
aws cloudformation describe-stacks \
  --stack-name growksh-infra \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

# Or get specific output
aws cloudformation describe-stacks \
  --stack-name growksh-infra \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CognitoUserPoolId`].OutputValue' \
  --output text
```

---

## GitHub Secrets Configuration

### OIDC Authentication (Recommended)

```bash
# Set this ONE secret for OIDC
AWS_ROLE_TO_ASSUME=arn:aws:iam::ACCOUNT_ID:role/github-actions-role

# The role should have policy:
# - cognito-idp:*
# - lambda:*
# - dynamodb:*
# - ses:*
# - apigateway:*
# - cloudformation:*
# - iam:PassRole
```

### Static Key Authentication (Alternative)

```bash
# Set these THREE secrets
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...  # Optional
```

### Auth Secrets

```bash
# Generate with: openssl rand -hex 32
VERIFY_SECRET=<long-random-string-32-chars-min>
# Used for: HMAC signing of email verification tokens

SES_SOURCE_EMAIL=noreply@growksh.com
# Used for: Email sender address in SES
# Must be: Verified in SES console

VERIFY_BASE_URL=https://growksh.com/auth/verify-email
# Used for: Email verification callback URL
# Must be: Accessible from internet
```

---

## CloudFormation Parameters

These are passed to SAM during deployment:

```yaml
Parameters:
  SESSourceEmail:
    Default: "noreply@growksh.com"
    # Email address verified in SES

  VerifyBaseUrl:
    Default: "https://d2eipj1xhqte5b.cloudfront.net/auth/verify-email"
    # Frontend URL for email verification callback

  DebugLogVerify:
    Default: '1'
    # Enable debug logging of verification URLs
    # Set to '0' in production

  DebugLogOTP:
    Default: '0'
    # Enable debug logging of OTPs
    # NEVER set to '1' in production (security risk)

  VerifySecret:
    Default: "change-me-replace-with-a-long-secret"
    # HMAC secret for verification tokens
    # Must be changed in production
```

### Deployment Example

```bash
sam deploy \
  --template-file infra/sam-template.yaml \
  --stack-name growksh-infra \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    SESSourceEmail="noreply@growksh.com" \
    VerifySecret="$(openssl rand -hex 32)" \
    VerifyBaseUrl="https://growksh.com/auth/verify-email" \
    DebugLogVerify="0" \
    DebugLogOTP="0"
```

---

## Lambda Environment Variables

Automatically set by SAM template:

### Pre Sign Up Function
```
No env vars needed
```

### Custom Message Function
```
DEBUG_LOG=1 or 0          # Enable/disable debug logging
VERIFY_SECRET=<secret>    # HMAC secret
VERIFY_BASE_URL=<url>     # Frontend verification callback
```

### Create Auth Challenge Function
```
OTP_TABLE=growksh-infra-auth-otp    # DynamoDB table name
SES_SOURCE_EMAIL=noreply@...        # Email sender
DEBUG_LOG=1 or 0                    # Enable/disable debug logging
```

### Verify Auth Challenge Function
```
OTP_TABLE=growksh-infra-auth-otp    # DynamoDB table name
```

### Signup Function
```
COGNITO_USER_POOL_ID=<pool-id>      # Cognito User Pool ID
```

### Verify Email Function
```
VERIFY_SECRET=<secret>              # HMAC secret
```

---

## Cognito User Pool Configuration

### Email Attributes
```
Attribute: email
- Required: Yes
- Mutable: Yes
- Alias: Yes (used as username)
- Email Verified: Auto-set by PreSignUp trigger
```

### User Attributes
```
Attribute: name
- Required: Yes
- Mutable: Yes

Attribute: phone_number
- Required: No
- Mutable: Yes
```

### Authentication Flow
```
Client ID: <CognitoUserPoolClientId>
Auth Flows Enabled:
  - CUSTOM_AUTH ✓ (for passwordless)
  - CUSTOM_AUTH_USER_PASSWORD_AUTH ✓
  - Prevent user existence errors: ENABLED

Lambda Triggers:
  - PreSignUp: auto-confirms user
  - CustomMessage: sends verification email
  - CreateAuthChallenge: generates OTP
  - VerifyAuthChallengeResponse: validates OTP
```

---

## DynamoDB Configuration

### OTP Table Schema
```
Table Name: growksh-infra-auth-otp
Billing Mode: PAY_PER_REQUEST (scales automatically)

Primary Key:
  - Partition Key: email (String)

Attributes:
  - email (String) [PK]
  - otp (String)
  - ttl (Number)
  - createdAt (String)

TTL Configuration:
  - Attribute Name: ttl
  - Enabled: Yes
  - Expiry: 10 minutes after creation
```

---

## SES Configuration

### Email Verification

```bash
# Verify email address
aws ses verify-email-identity \
  --email-address noreply@growksh.com \
  --region ap-south-1

# List verified identities
aws ses list-verified-email-addresses --region ap-south-1

# Check sandbox status
aws ses describe-account --region ap-south-1 | grep SendingQuota
```

### Sending Limits

**Sandbox Mode (Default)**
- Sending limit: 200 emails/day
- Maximum send rate: 1 email/second
- Can only send to verified addresses

**Production Mode (Request)**
- Unlimited sending
- Gradual increase recommended
- Monitor bounce rate

### Request Production Access

```bash
# Create case in AWS Support Console
# Service: Amazon SES
# Request: Production Access / Sending Limit Increase
# Include: Use case, sending volume, bounce rate estimates
```

---

## API Gateway Configuration

### CORS Settings
```
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
Allowed Origins: * (or specify: https://growksh.com)
```

### Rate Limiting (Recommended)
```bash
# 10,000 requests per second per account
# 5,000 requests per second per IP

# To set lower limits:
aws apigateway update-stage \
  --rest-api-id <api-id> \
  --stage-name Prod \
  --patch-operations \
    op=replace,path=/throttle/rateLimit,value=1000 \
    op=replace,path=/throttle/burstLimit,value=2000
```

---

## CloudWatch Monitoring

### Log Groups

```
Lambda Functions:
  /aws/lambda/growksh-infra-pre-sign-up
  /aws/lambda/growksh-infra-custom-message
  /aws/lambda/growksh-infra-create-auth-challenge
  /aws/lambda/growksh-infra-verify-auth-challenge
  /aws/lambda/growksh-infra-signup
  /aws/lambda/growksh-infra-verify-email

API Gateway:
  /aws/apigateway/AuthApiGateway
  /aws/apigateway/ContactApiGateway
```

### Recommended Alarms

```bash
# Lambda Errors
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-auth-lambda-errors \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --period 300 \
  --statistic Sum \
  --threshold 5

# API Gateway 5XX Errors
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-auth-api-5xx \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --metric-name 5XXError \
  --namespace AWS/ApiGateway \
  --period 300 \
  --statistic Sum \
  --threshold 10

# DynamoDB Write Throttling
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-dynamodb-writes-throttled \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --metric-name ConsumedWriteCapacityUnits \
  --namespace AWS/DynamoDB \
  --period 60 \
  --statistic Sum \
  --threshold 1000
```

---

## Development Configuration

### Local Testing with Fake Auth

```javascript
// Browser Console
import { enableFakeAuth } from './src/lib/cognito'
enableFakeAuth()

// Signup/login now work with fake data
// No AWS credentials needed
// OTP shown in browser console logs
```

### Vite Configuration

File: `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3001', // SAM local
        changeOrigin: true
      }
    }
  }
})
```

### SAM Local Testing

```bash
# Start SAM local server (requires Docker)
sam local start-api

# API available at: http://localhost:3000

# Update .env.local for local testing:
VITE_API_URL=http://localhost:3000/
```

---

## Email Template Customization

### Edit Custom Message Lambda

File: `aws-lambda/auth/custom-message.js`

```javascript
// Signup verification email
response.emailSubject = 'Your Custom Subject'
response.emailMessage = `
Your custom HTML/text email

${verificationLink}
`

// OTP email
response.emailSubject = 'Your Custom OTP Subject'
response.emailMessage = `
Your OTP: ${otp}
Expires in 10 minutes
`
```

### Deploy Updated Templates

```bash
# After modifying templates
sam build
sam deploy --no-confirm-changeset
```

---

## Scaling Configuration

### Lambda Concurrency

```bash
# Set reserved concurrency
aws lambda put-function-concurrency \
  --function-name growksh-infra-create-auth-challenge \
  --reserved-concurrent-executions 100
```

### DynamoDB Scaling

```bash
# Already set to on-demand (auto-scales)
# Scales automatically with usage
# Pay per request instead of provisioned capacity
```

### API Gateway Throttling

```bash
# Default: 10,000 RPS per account
# Can be increased via AWS Support
```

---

## Troubleshooting Configuration

### Enable Debug Logging

```bash
# For SAM deployment
sam deploy --debug

# For Lambda logs
aws logs tail /aws/lambda/<function-name> --follow

# Real-time logs
aws logs tail --follow /aws/lambda/growksh-infra-create-auth-challenge
```

### Check Service Status

```bash
# Cognito
aws cognito-idp describe-user-pool \
  --user-pool-id <pool-id> --region ap-south-1

# Lambda
aws lambda get-function --function-name <name> --region ap-south-1

# SES
aws ses verify-email-identity --region ap-south-1

# DynamoDB
aws dynamodb describe-table --table-name growksh-infra-auth-otp --region ap-south-1
```

---

## Security Configuration

### Recommended Production Settings

```yaml
# SAM Template overrides
DebugLogVerify: '0'              # Never log verification links
DebugLogOTP: '0'                 # Never log OTPs
VITE_USE_FAKE_AUTH: '0'          # Disable fake auth
EnableCORS: 'https://growksh.com' # Restrict origins

# Cognito
PasswordPolicy:
  MinimumLength: 12              # For recovery passwords
  RequireUppercase: true
  RequireLowercase: true
  RequireNumbers: true
  RequireSymbols: true

# API Gateway
WAF: Enabled                      # Enable WAF rules
RateLimiting: 1000/5min per IP   # Prevent abuse
LoggingLevel: ERROR               # Don't log everything

# DynamoDB
PointInTimeRecovery: Enabled      # Backup enabled
Encryption: Enabled               # KMS encryption
```

---

## Backup & Recovery

### Cognito User Pool Backup

```bash
# Export users (limited to 25,000)
aws cognito-idp admin-list-user-auth-events \
  --user-pool-id <pool-id> \
  --region ap-south-1

# No direct export - use Cognito Sync or custom Lambda
```

### DynamoDB Backup

```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name growksh-infra-auth-otp \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Create on-demand backup
aws dynamodb create-backup \
  --table-name growksh-infra-auth-otp \
  --backup-name growksh-auth-backup-$(date +%s)
```

---

## Performance Optimization

### Caching

```bash
# API Gateway caching (not recommended for auth)
# Keep disabled to ensure fresh tokens

# CloudFront caching
# Cache only static assets, not /auth/* paths
```

### Cold Start Optimization

```bash
# Lambda provisioned concurrency (if budget allows)
aws lambda put-provisioned-concurrency-config \
  --function-name growksh-infra-create-auth-challenge \
  --provisioned-concurrent-executions 5
```

---

## Cost Optimization

### Free Tier Usage

```
Cognito: 50,000 MAU free
Lambda: 1,000,000 requests/month free
DynamoDB: 25 GB storage free
SES: 62,000 emails/month from EC2 free
API Gateway: 1,000,000 requests/month free
```

### Cost Reduction

1. Use on-demand DynamoDB (over provisioned)
2. Clean up unused Cognito users
3. Monitor Lambda duration
4. Batch email sends
5. Use SES with SMTP instead of SDK if possible

---

## Configuration Checklist

Before deploying to production:

- [ ] VERIFY_SECRET is long and random (32+ chars)
- [ ] SES email is verified and domain configured
- [ ] DebugLogOTP is set to '0' (NEVER log OTPs)
- [ ] DebugLogVerify is set to '0' in production
- [ ] VITE_USE_FAKE_AUTH is set to '0'
- [ ] HTTPS is enabled on all endpoints
- [ ] CORS origins are restricted appropriately
- [ ] CloudWatch alarms are configured
- [ ] DynamoDB point-in-time recovery is enabled
- [ ] Lambda timeout is set appropriately (10 seconds)
- [ ] SES sending limits are reviewed
- [ ] Rate limiting is configured
- [ ] Error messages don't leak sensitive info

---

**Last Updated**: December 22, 2025
