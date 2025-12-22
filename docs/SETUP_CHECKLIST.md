# Passwordless Auth Implementation - Setup Checklist

## Pre-Deployment Setup

### AWS Account Configuration
- [ ] AWS Account created and configured
- [ ] IAM user/role with Cognito, Lambda, DynamoDB, SES, API Gateway permissions
- [ ] AWS CLI installed and configured
- [ ] Region set to ap-south-1

### SES (Simple Email Service) Setup
- [ ] Email domain or address verified in SES console
- [ ] SES account moved out of sandbox (request production access)
- [ ] DKIM records added if using domain
- [ ] Set `SES_SOURCE_EMAIL` in GitHub secrets (e.g., noreply@growksh.com)

### GitHub Configuration
- [ ] GitHub Actions enabled in repository
- [ ] Set GitHub Secrets:
  - `AWS_ROLE_TO_ASSUME` (for OIDC) OR
  - `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_SESSION_TOKEN`
  - `VERIFY_SECRET` (generate: `openssl rand -hex 32`)
  - `SES_SOURCE_EMAIL` (e.g., noreply@growksh.com)
  - `VERIFY_BASE_URL` (e.g., https://growksh.com/auth/verify-email)

## Deployment

### Option 1: GitHub Actions (Recommended)
```bash
# 1. Commit all changes
git add .
git commit -m "feat: implement passwordless auth with Cognito and Lambda"

# 2. Push to main/master - this triggers automatic deployment
git push origin main

# 3. Watch GitHub Actions workflow
# Go to Actions tab → Deploy SAM Infra

# 4. After successful deployment, copy stack outputs
```

### Option 2: Manual SAM Deployment
```bash
# 1. Install dependencies
cd aws-lambda/auth && npm install && cd ../../

# 2. Build SAM
sam build --template-file infra/sam-template.yaml

# 3. Deploy
sam deploy \
  --template-file .aws-sam/build/template.yaml \
  --stack-name growksh-infra \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VerifySecret="$(openssl rand -hex 32)" \
    SESSourceEmail="noreply@growksh.com" \
    VerifyBaseUrl="https://growksh.com/auth/verify-email"

# 4. Get outputs
aws cloudformation describe-stacks \
  --stack-name growksh-infra \
  --query 'Stacks[0].Outputs' \
  --output table
```

## Post-Deployment Configuration

### 1. Get Stack Outputs
Copy these values from CloudFormation outputs:
- [ ] `CognitoUserPoolId`
- [ ] `CognitoUserPoolClientId`
- [ ] `AuthApiEndpoint`

### 2. Update Frontend Environment Variables
Create `.env.local` in project root:
```
VITE_COGNITO_USER_POOL_ID=<from stack outputs>
VITE_COGNITO_CLIENT_ID=<from stack outputs>
VITE_API_URL=<from stack outputs>
VITE_USE_FAKE_AUTH=0
```

### 3. Verify SES Configuration
```bash
# List verified identities
aws ses list-verified-email-addresses --region ap-south-1

# Check SES status
aws ses describe-configuration-set \
  --configuration-set-name default \
  --region ap-south-1
```

### 4. Update Domain Settings (if using custom domain)
- [ ] Update DNS records if needed
- [ ] Update CORS settings in API Gateway if needed
- [ ] Update CloudFront distribution (if used) to include `/auth/*` paths

## Testing

### Local Testing
```bash
# 1. Start development server
npm run dev

# 2. Enable fake auth for testing (in browser console)
enableFakeAuth()

# 3. Test signup at http://localhost:5173/signup
# 4. Test login at http://localhost:5173/login
```

### Real AWS Testing
```bash
# 1. Go to /signup on your deployed site
# 2. Use verified SES email for testing
# 3. Check email for verification link
# 4. Click link to verify
# 5. Go to /login with same email
# 6. Check email for OTP
# 7. Enter OTP to complete login
```

### API Testing with curl
```bash
# Test signup endpoint
curl -X POST https://your-api-endpoint/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone_number": "+1234567890"
  }'

# Test verify email
curl "https://your-api-endpoint/auth/verify-email?email=test@example.com&token=<token>&t=<timestamp>"
```

## Troubleshooting Checklist

### Deployment Issues
- [ ] Check GitHub Actions logs for build/deploy errors
- [ ] Verify IAM permissions include Cognito, Lambda, DynamoDB, SES
- [ ] Check SAM template syntax: `sam validate --template-file infra/sam-template.yaml`
- [ ] Verify AWS region is ap-south-1
- [ ] Check for naming conflicts in CloudFormation

### Environment Variable Issues
- [ ] Run `echo $VITE_COGNITO_USER_POOL_ID` to verify vars are set
- [ ] Rebuild frontend after changing .env.local: `npm run build`
- [ ] Check that variables are NOT wrapped in quotes in .env.local
- [ ] For CI/CD: vars injected via build, not .env.local

### Email/SES Issues
- [ ] Verify SES email in SES console
- [ ] Check SES is not in sandbox (request production access)
- [ ] Verify `SES_SOURCE_EMAIL` is a verified identity
- [ ] Check CloudWatch logs for Lambda errors
- [ ] Check SES bounce rate (may prevent delivery)

### Cognito Issues
- [ ] Verify User Pool was created: `aws cognito-idp describe-user-pool --user-pool-id <ID>`
- [ ] Check User Pool client auth flows: Custom Auth must be enabled
- [ ] Verify Lambda triggers are configured
- [ ] Check Lambda execution roles have DynamoDB and SES permissions

### Frontend Issues
- [ ] Clear browser cache/localStorage when changing .env.local
- [ ] Verify API endpoint is accessible: `curl <AUTH_API_ENDPOINT>`
- [ ] Check CORS headers in API Gateway
- [ ] Verify email in URL is URL-encoded

## Files Modified/Created

### New Files
- [ ] `aws-lambda/auth/` - Lambda function implementations
  - [ ] `pre-sign-up.js`
  - [ ] `custom-message.js`
  - [ ] `create-auth-challenge.js`
  - [ ] `verify-auth-challenge.js`
  - [ ] `signup.js`
  - [ ] `verify-email.js`
  - [ ] `package.json`
- [ ] `src/context/AuthContext.jsx` - Global auth state
- [ ] `src/components/Auth/VerifyEmail.jsx` - Email verification page
- [ ] `AUTH_IMPLEMENTATION.md` - Implementation guide

### Modified Files
- [ ] `infra/sam-template.yaml` - Complete Cognito + Lambda resources
- [ ] `src/App.jsx` - Added auth routes and AuthProvider
- [ ] `src/components/Auth/Login.jsx` - Passwordless OTP login
- [ ] `src/components/Auth/Signup.jsx` - User registration
- [ ] `src/lib/cognito.js` - All auth functions (signup, login, token management)
- [ ] `.github/workflows/deploy-sam.yml` - Enhanced deployment workflow

## Security Review

- [ ] Verify HTTPS is enforced in production
- [ ] Check that tokens are not logged in CloudWatch
- [ ] Verify HMAC secret is long and random (32+ characters)
- [ ] Confirm OTP expiry is set to 10 minutes
- [ ] Verify DynamoDB TTL is configured
- [ ] Check that sensitive data is not exposed in error messages
- [ ] Verify CORS is restricted appropriately
- [ ] Check that Lambda execution roles follow least privilege

## Performance Considerations

- [ ] Monitor Lambda cold starts (use provisioned concurrency if needed)
- [ ] Monitor DynamoDB capacity (on-demand pricing recommended)
- [ ] Monitor API Gateway throttling
- [ ] Consider CloudFront caching for static assets
- [ ] Monitor email delivery rates from SES

## Monitoring & Alerts

### CloudWatch Setup
- [ ] Create CloudWatch log groups for each Lambda
- [ ] Set up alarms for Lambda errors
- [ ] Set up alarms for API Gateway 5xx errors
- [ ] Set up alarms for SES bounce/complaint rates

### Recommended Alarms
```bash
# Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-auth-lambda-errors \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:your-topic \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold

# API errors
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-auth-api-errors \
  --alarm-actions arn:aws:sns:ap-south-1:ACCOUNT_ID:your-topic \
  --metric-name 5XXError \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## Maintenance

### Regular Tasks
- [ ] Review CloudWatch logs weekly for errors
- [ ] Monitor SES bounce/complaint rates
- [ ] Update Lambda dependencies: `npm audit --update`
- [ ] Review Cognito user pool settings monthly
- [ ] Clean up old OTPs from DynamoDB (TTL handles this automatically)

### Version Updates
- [ ] Update AWS SDK when new features available
- [ ] Update node.js version in Lambda runtime
- [ ] Update Cognito Identity SDK for browser

## Rollback Plan

If something goes wrong:
```bash
# Delete the stack (WARNING: This deletes all resources)
aws cloudformation delete-stack --stack-name growksh-infra

# Or update to previous template version
sam deploy --template-file .aws-sam/build/template.yaml \
  --stack-name growksh-infra \
  --no-fail-on-empty-changeset
```

## Success Criteria

✅ All checklist items completed when:
- [ ] Users can sign up with email verification
- [ ] Verification link works and redirects to login
- [ ] Users can login with OTP
- [ ] Tokens are stored and managed correctly
- [ ] Users can logout
- [ ] No auth errors in CloudWatch logs
- [ ] SES emails are being delivered
- [ ] All tests passing (local and production)

---

**Date Completed**: _________________
**Deployed By**: _________________
**Notes**: _________________________________________________
