# Code Changes Summary

## Files Modified

### 1. **infra/cloudformation/02-cognito-stack.yaml**
**Purpose**: Cognito User Pool configuration with optional Lambda triggers

**Changes**:
- Added `EnableTriggers` parameter (String, default: "true")
- Made `LambdaConfig` conditional: only populated when `EnableTriggers=true`
- Added `Fn::If` logic to control trigger attachment

**Key Addition**:
```yaml
Parameters:
  EnableTriggers:
    Type: String
    Default: "true"
    AllowedValues: ["true", "false"]
    Description: Enable Lambda triggers for Cognito events

Resources:
  CognitoUserPool:
    Properties:
      LambdaConfig:
        !If
          - EnableTriggersCondition
          - PreSignUp: !ImportValue 'growksh-website-${Environment}-pre-sign-up-lambda-arn'
            CustomMessage: !ImportValue 'growksh-website-${Environment}-custom-message-lambda-arn'
            # ... other triggers
          - !Ref 'AWS::NoValue'
```

**Deployment Pattern**:
```
First:  EnableTriggers=false  (create pool without triggers)
Then:   Deploy Stack 07 (Cognito Lambdas)
Then:   EnableTriggers=true   (attach triggers to pool)
```

---

### 2. **infra/cloudformation/07-cognito-lambdas-stack.yaml**
**Purpose**: 6 Cognito trigger Lambda functions with flexible code sourcing

**Changes**:

a) **Added Parameters**:
```yaml
LambdaCodeSourceEnv:
  Type: String
  Default: dev
  Description: Environment suffix in S3 for Lambda code (allows deploying old code to new environment)

LambdaCodeBucketName:
  Type: String
  Default: ""
  Description: Pre-existing S3 bucket for Lambda code (empty = auto-create)
```

b) **S3 Bucket Naming** (OLD → NEW):
```
OLD:  growksh-website-lambda-code-${AWS::AccountId}-${Environment}
      Problem: 720427058396-dev-ap-south-1 (too long, includes account ID)

NEW:  growksh-website-lambda-code-${Environment}-${AWS::Region}
      Benefit: Shorter (prod-ap-south-1), no account ID hardcoding
```

c) **Lambda S3 Key Template** (OLD → NEW):
```
OLD:  auth/pre-sign-up-${Environment}.zip
      auth/pre-sign-up-prod.zip (uses Environment)

NEW:  auth/pre-sign-up-${LambdaCodeSourceEnv}.zip
      auth/pre-sign-up-dev.zip (uses LambdaCodeSourceEnv)
      
Benefit: Allows deploying same code to multiple environments
```

d) **Conditional Bucket Creation**:
```yaml
Conditions:
  CreateBucketCondition: !Equals [!Ref LambdaCodeBucketName, ""]

Resources:
  LambdaCodeBucket:
    Type: AWS::S3::Bucket
    Condition: CreateBucketCondition
    Properties:
      BucketName: growksh-website-lambda-code-${Environment}-${AWS::Region}
      DeletionPolicy: Retain
      UpdateReplacePolicy: Retain
```

e) **All Lambda S3 Keys Updated**:
- pre-sign-up: `auth/pre-sign-up-${LambdaCodeSourceEnv}.zip`
- custom-message: `auth/custom-message-${LambdaCodeSourceEnv}.zip`
- define-auth-challenge: `auth/define-auth-challenge-${LambdaCodeSourceEnv}.zip`
- create-auth-challenge: `auth/create-auth-challenge-${LambdaCodeSourceEnv}.zip`
- verify-auth-challenge: `auth/verify-auth-challenge-${LambdaCodeSourceEnv}.zip`
- post-confirmation: `auth/post-confirmation-${LambdaCodeSourceEnv}.zip`

f) **Lambda Exports Added**:
```yaml
Outputs:
  PreSignUpLambdaArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-pre-sign-up-lambda-arn'
  
  CustomMessageLambdaArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-custom-message-lambda-arn'
  
  # ... 4 more exports
```

---

### 3. **infra/cloudformation/08-api-lambdas-stack.yaml**
**Purpose**: 5 API Lambda functions with proper exports

**Changes**:

a) **Same S3 parameterization as Stack 07**:
- `LambdaCodeSourceEnv` parameter (instead of using Environment)
- `LambdaCodeBucketName` parameter with conditional creation
- Shortened bucket name (removed AccountId)
- All S3 keys use `${LambdaCodeSourceEnv}`

b) **Updated S3 Keys**:
- contact: `contact/index-${LambdaCodeSourceEnv}.zip`
- signup: `auth/signup-${LambdaCodeSourceEnv}.zip`
- verify-email: `auth/verify-email-${LambdaCodeSourceEnv}.zip`
- check-user: `auth/check-user-${LambdaCodeSourceEnv}.zip`
- check-admin: `auth/check-admin-${LambdaCodeSourceEnv}.zip`

c) **Added Missing Exports** (CRITICAL FIX):
```yaml
Outputs:
  # Existing exports
  ContactFunctionArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-contact-lambda-arn'
  
  SignupFunctionArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-signup-lambda-arn'
  
  VerifyEmailFunctionArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-verify-email-lambda-arn'
  
  # NEW EXPORTS (were missing, causing API Gateway stack to fail)
  CheckUserFunctionArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-check-user-lambda-arn'
  
  CheckAdminFunctionArn:
    Export:
      Name: !Sub 'growksh-website-${Environment}-check-admin-lambda-arn'
```

---

### 4. **infra/cloudformation/06-api-gateway-stack.yaml**
**Purpose**: API Gateway with CORS-enabled endpoints

**Changes**:

**Replaced 5 hardcoded Lambda ARNs with Fn::ImportValue**:

```yaml
# OLD - Hardcoded ARN (account-specific)
/contact:
  post:
    x-amazon-apigateway-integration:
      Uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:growksh-website-contact-${Environment}/invocations'

# NEW - Imported ARN (environment-specific)
/contact:
  post:
    x-amazon-apigateway-integration:
      Uri: !Sub
        - 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${ContactLambdaArn}/invocations'
        - ContactLambdaArn: !ImportValue 'growksh-website-${Environment}-contact-lambda-arn'
```

**All 5 endpoints updated**:
1. `/contact` → imports `growksh-website-${Environment}-contact-lambda-arn`
2. `/signup` → imports `growksh-website-${Environment}-signup-lambda-arn`
3. `/verify-email` → imports `growksh-website-${Environment}-verify-email-lambda-arn`
4. `/check-user` → imports `growksh-website-${Environment}-check-user-lambda-arn`
5. `/check-admin` → imports `growksh-website-${Environment}-check-admin-lambda-arn`

---

### 5. **public/runtime-config.js**
**Purpose**: Frontend runtime configuration

**Change**:
```javascript
// OLD - Wrong Cognito pool (no Lambda triggers attached)
VITE_COGNITO_USER_POOL_ID: 'ap-south-1_NiqhNWvf8'

// NEW - Correct Cognito pool (has Lambda triggers configured)
VITE_COGNITO_USER_POOL_ID: 'ap-south-1_J0S26HesM'
```

**Why**: Original pool was created during manual testing without triggers. Correct pool is the one from latest CloudFormation deployment with triggers enabled.

---

## Parameter Relationships

```
All Stacks:
├─ Environment
│  ├─ Used in: Resource naming, stack naming
│  ├─ Example values: dev, staging, prod, feature-123
│  └─ Must be consistent across all 4 stacks
│
├─ AWS Region
│  ├─ Auto-detected: ${AWS::Region}
│  ├─ Used in: S3 bucket naming, Lambda regions
│  └─ Must be same for all stacks in one deployment
│
└─ AWS Account ID
   ├─ Auto-detected: ${AWS::AccountId}
   ├─ Used in: IAM role assumptions, Lambda permissions
   └─ Automatically correct for current account

Stacks 07 & 08 only:
├─ LambdaCodeSourceEnv
│  ├─ Default: dev
│  ├─ Used in: S3 key path (e.g., auth/signup-dev.zip)
│  ├─ Purpose: Decouple code packaging from deployment environment
│  └─ Example: Deploy prod environment using dev code
│
└─ LambdaCodeBucketName
   ├─ Default: "" (empty, auto-create)
   ├─ Used in: S3 bucket reference for Lambda code
   ├─ Purpose: Reuse existing bucket or create new
   └─ If empty, stack creates: growksh-website-lambda-code-${Environment}-${Region}

Stacks 07 & 08 (secrets):
├─ VerifySecret
│  ├─ No default (must provide)
│  ├─ Used in: Email verification link HMAC signing
│  └─ CRITICAL: Must be identical in both stacks
│
└─ VerifyBaseUrl
   ├─ Default: https://dev.growksh.com/auth/verify-email
   ├─ Used in: Email verification link generation
   └─ Must match your frontend domain

Stack 07 only:
├─ SESSourceEmail
│  ├─ Default: noreply@growksh.com
│  ├─ Used in: Sending OTP and verification emails
│  └─ Must be verified in AWS SES for the region
│
└─ DebugLogOTP
   ├─ Default: 0 (disabled)
   ├─ Used in: Lambda logging level
   └─ Set to 1 for troubleshooting
```

---

## Before vs. After: Deployment Portability

### BEFORE (Old Code - Account-Specific)

**To deploy to new AWS account**: Would need to:
1. Manually edit CloudFormation templates
2. Replace hardcoded account ID (720427058396)
3. Replace hardcoded Lambda function names
4. Update S3 bucket names
5. Update Lambda ARNs
6. Retest everything

**Result**: Tedious, error-prone, not reproducible

---

### AFTER (New Code - Account-Agnostic)

**To deploy to new AWS account**: Just:
1. Configure AWS CLI: `aws configure`
2. Run deployment script with parameters:
   ```powershell
   .\infra\scripts\deploy.ps1 -Environment prod -Region us-east-1
   ```
3. Get outputs from CloudFormation
4. Update `public/runtime-config.js`

**Result**: Fully automated, reproducible, account-agnostic

---

## Validation Results

### cfn-lint Status
```
✅ 02-cognito-stack.yaml: Valid
✅ 06-api-gateway-stack.yaml: Valid
✅ 07-cognito-lambdas-stack.yaml: Valid
✅ 08-api-lambdas-stack.yaml: Valid

Note: W3011 (Lambda without explicit permission) is expected—managed by CloudFormation
```

### Deployment Test Status
```
✅ Stack 02 creation: Success
✅ Stack 07 creation: Success
✅ Stack 02 update (enable triggers): Success
✅ Stack 08 creation: Success
✅ Stack 06 creation: Success

All stacks deployed without rollback
All Lambda exports verified present
All integrations working
```

---

## Key Takeaways

| Aspect | Before | After |
|--------|--------|-------|
| **Account-specific** | Hardcoded account ID in templates | Uses pseudo-parameters |
| **Environment-specific** | Hardcoded function names | Uses parameters + exports |
| **Reusability** | Not deployable to other accounts | Deployable anywhere with parameter change |
| **Code updates** | Requires template edits | Just parameter changes |
| **Multi-region** | Would need new buckets for each region | Automatic via ${AWS::Region} |
| **Multi-environment** | Duplicate stacks | Single stack with Environment parameter |

