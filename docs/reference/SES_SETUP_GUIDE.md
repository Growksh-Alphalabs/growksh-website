# Amazon SES Setup for Growksh Email Verification

## Overview

This document describes the Amazon SES (Simple Email Service) setup for Growksh, including OTP generation, magic link email verification, and email delivery tracking.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Growksh Application                 │
├─────────────────────────────────────────────────────┤
│  Signup Flow → Email Verification → User Activation │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   ┌──────────┐         ┌──────────────────┐
   │ Cognito  │         │   API Gateway    │
   │ Triggers │         │   (OTP & Magic)  │
   └────┬─────┘         └─────┬────────────┘
        │                     │
        ├─────────────────────┤
        ▼
   ┌──────────────────────────────────────────┐
   │      Lambda Functions (Auth)             │
   ├──────────────────────────────────────────┤
   │ • custom-message.js  (Email verification)│
   │ • send-otp.js        (OTP generation)    │
   │ • verify-otp.js      (OTP validation)    │
   └────────┬─────────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────┐
   │   Amazon SES (Simple Email Service)      │
   ├──────────────────────────────────────────┤
   │ • Templates: OTP, Magic Link, Password   │
   │ • Configuration Set: Tracking & Bounces  │
   │ • Verified Email Identity                │
   └────────┬─────────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────┐
   │   Email Provider (AWS SES)               │
   │   → User's Email Inbox                   │
   └──────────────────────────────────────────┘
```

## Components

### 1. CloudFormation Stack (10-ses-stack.yaml)

Creates the following resources:

#### Email Identity
- **Type**: AWS::SES::EmailIdentity
- **Purpose**: Verify the sender email address
- **Parameters**: `FromEmailAddress` (must be domain or SES sandbox email)

#### Email Templates
Three pre-configured SES templates for different use cases:

**OTP Verification Template**
- Template ID: `growksh-{environment}-otp-verification`
- Used by: `send-otp.js` Lambda
- Variables:
  - `{{username}}` - User's display name
  - `{{otp_code}}` - 6-digit OTP code
  - `{{expiry_minutes}}` - OTP expiration time

**Magic Link Verification Template**
- Template ID: `growksh-{environment}-magic-link-verification`
- Used by: `custom-message.js` Lambda (Cognito trigger)
- Variables:
  - `{{username}}` - User's display name
  - `{{verification_link}}` - Email verification link with token
  - Auto-expires in 24 hours

**Password Reset Template**
- Template ID: `growksh-{environment}-password-reset`
- Used by: Future password reset flow
- Variables:
  - `{{username}}` - User's display name
  - `{{reset_link}}` - Password reset link with token
  - Auto-expires in 1 hour

#### Configuration Set
- **Purpose**: Email delivery tracking and bounce handling
- **Name**: `growksh-{environment}-config-set`
- **Features**:
  - CloudWatch logging for bounces
  - SNS notifications for email events
  - Email delivery metrics

#### CloudWatch Monitoring
- Log Group: `/aws/ses/growksh/{environment}/bounces`
- Retention: 30 days
- Monitors bounce and complaint events

### 2. Lambda Functions

#### custom-message.js (Updated)
**Cognito Trigger** - Runs during user signup/admin creation

```javascript
// Environment Variables Required:
FROM_EMAIL           // Email address to send from
VERIFY_SECRET        // Secret key for HMAC token generation
VERIFY_BASE_URL      // Frontend URL for email verification
MAGIC_LINK_TEMPLATE_NAME // SES template name
USE_SES             // "1" to enable SES, "0" for Cognito default
ENVIRONMENT         // dev/staging/prod
```

**Flow**:
1. User signs up in Cognito
2. CustomMessage trigger fires
3. Generates magic link with HMAC token
4. Sends email via SES template OR Cognito's default email
5. User clicks link to verify email

#### send-otp.js (New)
**API Lambda** - Generates and sends OTP codes

```javascript
// Environment Variables Required:
FROM_EMAIL           // Email address to send from
OTP_TEMPLATE_NAME    // SES template name
OTP_LENGTH           // Default: 6 (digits)
OTP_EXPIRY_MINUTES   // Default: 5 (minutes)
OTP_TABLE_NAME       // DynamoDB table name for OTP storage
ENVIRONMENT          // dev/staging/prod
```

**Endpoints**:
- **POST** `/send-otp`
  - Request: `{ "email": "user@example.com" }`
  - Response: `{ "message": "OTP sent successfully", "expiryMinutes": 5 }`

**Features**:
- Generates random 6-digit OTP
- Stores OTP in DynamoDB with TTL
- Sends via SES template
- Tracks attempt count

#### verify-otp.js (New)
**API Lambda** - Validates OTP and marks email as verified

```javascript
// Environment Variables Required:
OTP_TABLE_NAME      // DynamoDB table name
COGNITO_USER_POOL_ID // Optional, for Cognito update
```

**Endpoints**:
- **POST** `/verify-otp`
  - Request: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: `{ "message": "OTP verified successfully", "verified": true }`

**Features**:
- Validates OTP against stored value
- Checks expiration time
- Rate limits (3 attempts max)
- Updates Cognito email_verified attribute
- Returns remaining attempts on failure

### 3. DynamoDB Tables (Required)

#### OTP Verification Table
**Table Name**: `growksh-otp-verification`

```yaml
Attributes:
  email:         Primary Key (String)
  otp:           OTP code (String)
  createdAt:     Creation timestamp (String)
  expiryTime:    Unix timestamp for expiry (Number)
  attempts:      Failed attempt count (Number)
  maxAttempts:   Maximum allowed attempts (Number)

TTL:
  Attribute: expiryTime
  Purpose: Auto-delete expired OTPs after expiration
```

## Deployment Steps

### 1. Prerequisites

Before deploying, ensure:
- ✅ AWS Account with sufficient permissions
- ✅ Verified sender email in SES (see "SES Sandbox" below)
- ✅ DynamoDB table `growksh-otp-verification` created
- ✅ CloudFormation stacks 00-09 already deployed

### 2. Verify Email Identity in SES

If in **SES Sandbox** mode (development):
1. Go to AWS SES Console
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Choose "Email address"
5. Enter sender email (e.g., `noreply@growksh.com`)
6. Confirm email in inbox
7. Set as `FromEmailAddress` parameter

If in **Production** mode:
- Verify a domain instead: Add DKIM records to DNS
- Request production access from AWS

### 3. Create OTP DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name growksh-otp-verification \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

### 4. Deploy SES Stack

```bash
# PowerShell
.\infra\scripts\deploy.ps1 -Environment prod -StackNumbers "10"

# Or manually:
aws cloudformation deploy \
  --template-file infra/cloudformation/10-ses-stack.yaml \
  --stack-name growksh-ses-prod \
  --parameter-overrides \
    Environment=prod \
    FromEmailAddress=noreply@growksh.com \
  --region ap-south-1
```

### 5. Update Lambda Functions

```bash
# Package Lambda functions
cd aws-lambda/auth
npm install
zip -r send-otp-dev.zip send-otp.js node_modules/
zip -r verify-otp-dev.zip verify-otp.js node_modules/
cd ../..

# Upload to S3
aws s3 cp send-otp-dev.zip s3://growksh-lambda-code-dev/
aws s3 cp verify-otp-dev.zip s3://growksh-lambda-code-dev/

# Deploy Lambda functions (add to CloudFormation or deploy separately)
```

### 6. Environment Variables

Update Lambda function environment variables:

**custom-message.js** (Cognito trigger):
```env
FROM_EMAIL=noreply@growksh.com
VERIFY_SECRET=your-secure-random-secret
VERIFY_BASE_URL=https://app.growksh.com/verify-email
MAGIC_LINK_TEMPLATE_NAME=growksh-prod-magic-link-verification
USE_SES=1
ENVIRONMENT=prod
AWS_REGION=ap-south-1
```

**send-otp.js**:
```env
FROM_EMAIL=noreply@growksh.com
OTP_TEMPLATE_NAME=growksh-prod-otp-verification
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=5
OTP_TABLE_NAME=growksh-otp-verification
ENVIRONMENT=prod
AWS_REGION=ap-south-1
```

**verify-otp.js**:
```env
OTP_TABLE_NAME=growksh-otp-verification
COGNITO_USER_POOL_ID=ap-south-1_xxxxx
AWS_REGION=ap-south-1
```

## API Usage Examples

### Send OTP

```bash
curl -X POST https://api.growksh.com/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "John Doe"
  }'

# Response:
{
  "message": "OTP sent successfully",
  "email": "user@example.com",
  "messageId": "000001...",
  "expiryMinutes": 5
}
```

### Verify OTP

```bash
curl -X POST https://api.growksh.com/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'

# Success Response:
{
  "message": "OTP verified successfully",
  "email": "user@example.com",
  "verified": true
}

# Failed Response:
{
  "error": "Invalid OTP",
  "remainingAttempts": 2
}
```

## Features & Capabilities

### ✅ OTP Flow
- 6-digit random OTP generation
- 5-minute default expiration
- 3 attempt rate limiting
- DynamoDB storage with auto-cleanup
- SES email template delivery

### ✅ Magic Link Flow
- HMAC-SHA256 token generation
- 24-hour expiration
- Secure token validation
- Compatible with Cognito pre-token trigger

### ✅ Email Delivery Tracking
- CloudWatch logging for bounces/complaints
- SNS notifications for email events
- Configuration set for delivery metrics
- Email bounce handling

### ✅ Security Features
- HTTPS only for API endpoints
- CORS protection
- Rate limiting on verify attempts
- Token expiration enforcement
- Secure secret key for HMAC

## Monitoring & Debugging

### CloudWatch Logs

View email delivery logs:
```bash
aws logs tail /aws/ses/growksh/prod/bounces --follow
```

### SES Metrics

Monitor SES metrics in CloudWatch:
- Send rate
- Bounce rate
- Complaint rate
- Delivery time

### Lambda Logs

View Lambda function logs:
```bash
# custom-message trigger
aws logs tail /aws/lambda/growksh-custom-message-prod

# send-otp function
aws logs tail /aws/lambda/growksh-send-otp-prod

# verify-otp function
aws logs tail /aws/lambda/growksh-verify-otp-prod
```

## Troubleshooting

### Issue: Email not sent
**Solution**:
1. Verify email identity in SES console
2. Check SES sandbox limits (100 emails/day)
3. Verify `FROM_EMAIL` environment variable
4. Check Lambda CloudWatch logs

### Issue: OTP verification fails
**Solution**:
1. Verify DynamoDB table exists: `growksh-otp-verification`
2. Check OTP expiry time (default 5 minutes)
3. Check attempt limit (default 3 attempts)
4. Review Lambda logs for errors

### Issue: Magic link not working
**Solution**:
1. Verify `VERIFY_SECRET` matches in all functions
2. Check link expiration (24 hours)
3. Verify `VERIFY_BASE_URL` is correct
4. Test HMAC token generation

### Issue: High SES bounce rate
**Solution**:
1. Review CloudWatch logs for bounce reasons
2. Implement email validation before sending
3. Remove invalid emails from system
4. Check email template formatting

## SES Limits & Quotas

### Sandbox Mode (Development)
- **Daily sending quota**: 200 emails/day
- **Max send rate**: 1 email/second
- **Verified identities**: Only sandbox address and verified addresses

### Production Mode (After AWS Review)
- **Daily sending quota**: 50,000+ emails/day
- **Max send rate**: Can be higher
- **Verified identities**: Domain-based verification

## Cost Estimation

**OTP + Magic Link Emails**:
- SES: $0.10 per 1,000 emails
- DynamoDB: ~$0.25/million writes (OTP storage)
- CloudWatch: ~$0.50/month (logging)

**Example**:
- 10,000 users signing up per month
- Cost: ~$1 SES + <$0.01 DynamoDB = ~$1/month

## Best Practices

1. **Always verify senders**
   - Use domain verification in production
   - Implement DKIM and SPF records

2. **Monitor bounce rates**
   - Target <0.5% bounce rate
   - Remove bounced emails from system

3. **Template personalization**
   - Include user's name when available
   - Make links clickable and clear

4. **Rate limiting**
   - Limit OTP requests (max 3/hour per email)
   - Implement backoff on verification failures

5. **Security**
   - Use strong secrets for HMAC tokens
   - Rotate secrets regularly
   - Validate email format before sending

6. **Testing**
   - Test in SES sandbox first
   - Use test email addresses for development
   - Verify email templates render correctly

## Next Steps

1. ✅ Deploy SES CloudFormation stack
2. ✅ Create/update Lambda functions
3. ✅ Set environment variables
4. ✅ Test OTP flow end-to-end
5. ✅ Test magic link flow end-to-end
6. ✅ Monitor email delivery metrics
7. ✅ Request SES production access (if needed)
8. ✅ Update frontend to use new endpoints

## Related Documentation

- [docs/deployment-guides/DEPLOYMENT_CONFIG.md](../deployment-guides/DEPLOYMENT_CONFIG.md)
- [docs/reference/ACCOUNT_SPECIFIC_CONSTANTS.md](../reference/ACCOUNT_SPECIFIC_CONSTANTS.md)
- [docs/architecture/DEPLOYMENT_ARCHITECTURE.md](../architecture/DEPLOYMENT_ARCHITECTURE.md)

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review SES metrics in CloudWatch console
3. Test with curl/Postman manually
4. Check environment variables are set correctly
