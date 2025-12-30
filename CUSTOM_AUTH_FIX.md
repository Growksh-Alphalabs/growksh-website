# Custom Auth Lambda Trigger Configuration Fix

## Problem
**Error**: "Custom auth lambda trigger is not configured for the user pool."

This error occurs when Cognito tries to use the `CUSTOM_AUTH` authentication flow but cannot find the required Lambda triggers.

## Root Cause Analysis

### What I Found
1. ✅ All Lambda functions are properly implemented:
   - `create-auth-challenge.js` - Generates and sends OTP
   - `define-auth-challenge.js` - Orchestrates CUSTOM_AUTH flow
   - `verify-auth-challenge.js` - Validates OTP response
   - `pre-sign-up.js` - Auto-confirms users
   - `custom-message.js` - Sends verification emails
   - `post-confirmation.js` - Post-confirmation hook

2. ✅ All Lambda permissions are correctly defined in SAM template
   - DefineAuthChallengeLambdaPermission
   - CreateAuthChallengeLambdaPermission
   - VerifyAuthChallengeLambdaPermission
   - etc.

3. ❌ **MISSING**: `PostConfirmation` trigger in Cognito LambdaConfig
   - The trigger was defined but **NOT connected** to the User Pool

### The Fix Applied
Updated `infra/sam-template.yaml` to add the missing trigger:

```yaml
LambdaConfig:
  PreSignUp: !GetAtt PreSignUpFunction.Arn
  CustomMessage: !GetAtt CustomMessageFunction.Arn
  DefineAuthChallenge: !GetAtt DefineAuthChallengeFunction.Arn
  CreateAuthChallenge: !GetAtt CreateAuthChallengeFunction.Arn
  VerifyAuthChallengeResponse: !GetAtt VerifyAuthChallengeFunction.Arn
  PostConfirmation: !GetAtt PostConfirmationFunction.Arn        # ← ADDED THIS
```

## Deployment Steps

### 1. Rebuild and Redeploy SAM Stack
```bash
cd infra

# Clear previous build
rm -rf .aws-sam

# Build SAM template
sam build

# Deploy with parameter overrides
sam deploy \
  --parameter-overrides \
    DebugLogOTP=1 \
    DebugLogVerify=0 \
    VerifySecret=your-secret-here \
    VerifyBaseUrl=https://your-domain/auth/verify \
    SESSourceEmail=noreply@your-domain.com \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-south-1
```

### 2. Invalidate CloudFront Cache
After successful deployment, invalidate CloudFront to ensure index.html and runtime-config are fresh:

```bash
# Get your CloudFront Distribution ID from SAM outputs
aws cloudfront create-invalidation \
  --distribution-id E1234ABC5XYZ \
  --paths "/*" \
  --region ap-south-1
```

### 3. Verify Cognito Configuration
```bash
# Check that triggers are properly configured
aws cognito-idp describe-user-pool \
  --user-pool-id ap-south-1_XXXXX \
  --region ap-south-1 | jq '.UserPool.LambdaConfig'
```

**Expected Output:**
```json
{
  "PreSignUp": "arn:aws:lambda:...:function:growksh-website-pre-sign-up",
  "CustomMessage": "arn:aws:lambda:...:function:growksh-website-custom-message",
  "DefineAuthChallenge": "arn:aws:lambda:...:function:growksh-website-define-auth-challenge",
  "CreateAuthChallenge": "arn:aws:lambda:...:function:growksh-website-create-auth-challenge",
  "VerifyAuthChallengeResponse": "arn:aws:lambda:...:function:growksh-website-verify-auth-challenge",
  "PostConfirmation": "arn:aws:lambda:...:function:growksh-website-post-confirmation"
}
```

## Frontend Runtime Configuration

Ensure `public/runtime-config.js` is properly configured on your deployed server:

```javascript
window.__GROWKSH_RUNTIME_CONFIG__ = {
  VITE_COGNITO_USER_POOL_ID: 'ap-south-1_XXXXX',           // From CloudFormation outputs
  VITE_COGNITO_CLIENT_ID: '1234abc5xyz',                    // From CloudFormation outputs
  VITE_API_URL: 'https://api.your-domain.com',              // API Gateway URL
  VITE_AWS_REGION: 'ap-south-1',
  VITE_USE_FAKE_AUTH: '0',
};
```

## Testing the Auth Flow

### 1. Local Testing (with fake-auth)
```bash
npm run dev
# Login form should work with fake OTP: 123456
```

### 2. Testing Against Deployed Cognito
1. Deploy `public/runtime-config.js` with correct Cognito credentials
2. Invalidate CloudFront cache
3. Go to login page
4. Enter email → should receive OTP via SES
5. Enter OTP → should receive tokens

### 3. Debugging
Enable debug logging in SAM deployment:
```bash
sam deploy --parameter-overrides DebugLogOTP=1 DebugLogVerify=1
```

Then check Lambda logs:
```bash
# Create Auth Challenge logs
aws logs tail /aws/lambda/growksh-website-create-auth-challenge --follow

# Define Auth Challenge logs
aws logs tail /aws/lambda/growksh-website-define-auth-challenge --follow

# Verify Auth Challenge logs
aws logs tail /aws/lambda/growksh-website-verify-auth-challenge --follow
```

## Files Modified

1. **infra/sam-template.yaml**
   - Added `PostConfirmation: !GetAtt PostConfirmationFunction.Arn` to LambdaConfig

## Key Takeaways

- ✅ All Cognito CUSTOM_AUTH lambda triggers must be explicitly listed in `LambdaConfig`
- ✅ Each trigger requires explicit `AWS::Lambda::Permission` for `cognito-idp.amazonaws.com`
- ✅ Lambda functions must be deployed before Cognito can reference them (order matters in CloudFormation)
- ✅ Runtime config must match deployed Cognito credentials exactly
- ✅ Always invalidate CloudFront cache after deployment changes

## Additional Resources

- [Cognito Lambda Trigger Documentation](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/userguide/user-pool-lambda-custom-message.html)
- [SAM Lambda Permission Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html)
- [Cognito CUSTOM_AUTH Flow](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/userguide/amazon-cognito-user-pools-authentication-flow.html#custom-authentication-flow)
