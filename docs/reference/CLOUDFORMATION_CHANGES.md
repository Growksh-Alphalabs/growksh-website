# CloudFormation Templates: Parameterization Changes

## Summary of Changes Made

All CloudFormation templates have been updated to be **account-agnostic** and **environment-agnostic**, allowing them to deploy the same infrastructure across multiple AWS accounts and environments with only parameter changes.

---

## Stack 02: Cognito User Pool (`02-cognito-stack.yaml`)

### Changes Made:
1. **Added `EnableTriggers` Parameter**: Controls whether Lambda triggers are attached to the user pool
2. **Conditional LambdaConfig**: Only configures triggers when `EnableTriggers=true`

### Key Parameters:
| Parameter | Type | Default | Required | Purpose |
|-----------|------|---------|----------|---------|
| `Environment` | String | `dev` | Yes | Environment name (dev/staging/prod/feature-123) |
| `EnableTriggers` | String | `true` | No | Enable/disable Lambda triggers |

### Deployment Strategy:
- Deploy **twice**: First with `EnableTriggers=false` to create the pool
- Then deploy Stack 07 (Lambda triggers)
- Then update Stack 02 with `EnableTriggers=true` to attach triggers

### Example:
```bash
# First deployment
aws cloudformation deploy --stack-name growksh-website-cognito-prod \
  --template-file 02-cognito-stack.yaml \
  --parameter-overrides Environment=prod EnableTriggers=false

# After Stack 07 deployment
aws cloudformation deploy --stack-name growksh-website-cognito-prod \
  --template-file 02-cognito-stack.yaml \
  --parameter-overrides Environment=prod EnableTriggers=true
```

---

## Stack 07: Cognito Lambdas (`07-cognito-lambdas-stack.yaml`)

### Changes Made:
1. **Added `LambdaCodeSourceEnv` Parameter**: Separates code environment from deployment environment
2. **Shortened S3 Bucket Names**: Removed AccountId to stay under 63-character limit
3. **Parameterized S3 Keys**: Use `${LambdaCodeSourceEnv}` instead of `${Environment}`
4. **Optional Bucket Creation**: If bucket doesn't exist, stack creates it
5. **Lambda Exports**: All 6 Lambda ARNs exported for use by Cognito user pool

### Key Parameters:
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `Environment` | String | `dev` | Deployment environment |
| `LambdaCodeSourceEnv` | String | `dev` | Environment where code was packaged (zip files location) |
| `LambdaCodeBucketName` | String | `` (empty) | Pre-existing S3 bucket (if empty, creates new bucket) |
| `SESSourceEmail` | String | `noreply@growksh.com` | Email for sending OTPs |
| `VerifyBaseUrl` | String | `https://dev.growksh.com/auth/verify-email` | Frontend verification endpoint |
| `VerifySecret` | String | (no default) | **Required**: HMAC key for signing verification links |
| `DebugLogOTP` | String | `0` | Enable detailed Lambda logs (0=off, 1=on) |

### S3 Bucket Naming Logic:
```
Bucket Name: growksh-website-lambda-code-${Environment}-${AWS::Region}
Example: growksh-website-lambda-code-prod-us-east-1 (54 chars) ✅
Old: growksh-website-lambda-code-${AWS::AccountId}-${Environment} (too long) ❌
```

### S3 Key Pattern:
```
Old:  auth/signup-${Environment}.zip
      auth/signup-prod.zip ✅

Old:  auth/signup-${LambdaCodeSourceEnv}.zip (before change)
      auth/signup-dev.zip (if deploying prod with dev code)

This allows dev to package code once and deploy to multiple environments
```

### Example:
```bash
# Deploy to production using code packaged in dev environment
aws cloudformation deploy --stack-name growksh-website-cognito-lambdas-prod \
  --template-file 07-cognito-lambdas-stack.yaml \
  --parameter-overrides \
    Environment=prod \
    LambdaCodeSourceEnv=dev \
    SESSourceEmail=noreply@growksh.com \
    VerifyBaseUrl=https://growksh.com/auth/verify-email \
    VerifySecret=CQxrZPyIjvXwMcNpzHaFDdASkWLYqthO \
  --capabilities CAPABILITY_NAMED_IAM
```

### Exported Values:
```
Exports:
  - growksh-website-prod-pre-sign-up-lambda-arn
  - growksh-website-prod-custom-message-lambda-arn
  - growksh-website-prod-define-auth-challenge-lambda-arn
  - growksh-website-prod-create-auth-challenge-lambda-arn
  - growksh-website-prod-verify-auth-challenge-lambda-arn
  - growksh-website-prod-post-confirmation-lambda-arn
```

---

## Stack 08: API Lambdas (`08-api-lambdas-stack.yaml`)

### Changes Made:
1. **Same parameterization as Stack 07**: Consistent Lambda code handling
2. **Added missing exports**: `CheckUserFunctionArn` and `CheckAdminFunctionArn`
3. **Optional bucket creation**: Same S3 bucket logic as Stack 07

### Key Parameters:
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `Environment` | String | `dev` | Deployment environment |
| `LambdaCodeSourceEnv` | String | `dev` | Environment where code was packaged |
| `LambdaCodeBucketName` | String | `` (empty) | Pre-existing S3 bucket or empty for auto-create |
| `VerifyBaseUrl` | String | `https://dev.growksh.com/auth/verify-email` | Frontend verification endpoint |
| `VerifySecret` | String | (no default) | **Required**: HMAC key (must match Stack 07) |

### Exported Values:
```
Exports:
  - growksh-website-prod-contact-lambda-arn
  - growksh-website-prod-signup-lambda-arn
  - growksh-website-prod-verify-email-lambda-arn
  - growksh-website-prod-check-user-lambda-arn          ← NEW
  - growksh-website-prod-check-admin-lambda-arn         ← NEW
```

### Example:
```bash
aws cloudformation deploy --stack-name growksh-website-api-lambdas-prod \
  --template-file 08-api-lambdas-stack.yaml \
  --parameter-overrides \
    Environment=prod \
    LambdaCodeSourceEnv=dev \
    VerifyBaseUrl=https://growksh.com/auth/verify-email \
    VerifySecret=CQxrZPyIjvXwMcNpzHaFDdASkWLYqthO \
  --capabilities CAPABILITY_NAMED_IAM
```

---

## Stack 06: API Gateway (`06-api-gateway-stack.yaml`)

### Changes Made:
1. **Replaced hardcoded Lambda ARNs with `Fn::ImportValue`**: Uses exported ARNs from Stacks 07 & 08
2. **Dynamic integration URIs**: Automatically resolves correct Lambda ARN based on environment

### Key Parameters:
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `Environment` | String | `dev` | Deployment environment (must match other stacks) |

### Integration Changes:
```yaml
# OLD (hardcoded, account-specific)
Uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:growksh-website-contact-prod/invocations'

# NEW (imported, environment-agnostic)
Uri: !Sub
  - 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${LambdaArn}/invocations'
  - LambdaArn: !ImportValue 'growksh-website-${Environment}-contact-lambda-arn'
```

### Integrations Using ImportValue:
- Contact endpoint → imports `growksh-website-prod-contact-lambda-arn`
- Signup endpoint → imports `growksh-website-prod-signup-lambda-arn`
- Verify Email endpoint → imports `growksh-website-prod-verify-email-lambda-arn`
- Check User endpoint → imports `growksh-website-prod-check-user-lambda-arn`
- Check Admin endpoint → imports `growksh-website-prod-check-admin-lambda-arn`

### Example:
```bash
aws cloudformation deploy --stack-name growksh-website-api-prod \
  --template-file 06-api-gateway-stack.yaml \
  --parameter-overrides Environment=prod
```

---

## Deployment Order (Critical!)

Stacks must be deployed in this order:

```
1. Stack 02 (Cognito User Pool)
   └─ EnableTriggers=false

2. Stack 07 (Cognito Lambdas)
   └─ Exports 6 Lambda ARNs

3. Stack 02 (Update Cognito User Pool)
   └─ EnableTriggers=true (attaches Lambda triggers)

4. Stack 08 (API Lambdas)
   └─ Exports 5 Lambda ARNs

5. Stack 06 (API Gateway)
   └─ Imports Lambda ARNs from Stacks 07 & 08
```

**Why this order?**
- Stack 02 must exist before Stack 07 can attach triggers
- Stack 07 must export ARNs before Stack 06 can import them
- Stack 08 must export ARNs before Stack 06 can import them
- Stack 06 depends on all Lambda exports

---

## Migration Path: Old → New Parameterization

### Old Approach (Account-Specific)
```
S3 Bucket: growksh-website-lambda-code-720427058396-dev
Lambda ARN: arn:aws:lambda:ap-south-1:720427058396:function:growksh-website-signup-dev
Template: Hardcoded account ID, region, function names
Result: Cannot deploy to different account without changing template
```

### New Approach (Account-Agnostic)
```
S3 Bucket: growksh-website-lambda-code-${Environment}-${Region}
Lambda ARN: Imported via CloudFormation Exports
Template: Uses parameters and pseudo-parameters
Result: Deploy to any account with just parameter changes
```

### What to Update If Migrating Old Stacks:

1. **Update Stack 02 (Cognito)**:
   - Add `EnableTriggers` parameter logic
   - Add conditional LambdaConfig

2. **Update Stack 07 (Cognito Lambdas)**:
   - Replace hardcoded S3 bucket with parameterized name
   - Add `LambdaCodeSourceEnv` parameter
   - Remove AccountId from bucket naming

3. **Update Stack 08 (API Lambdas)**:
   - Same changes as Stack 07
   - Add missing `CheckUserFunctionArn` and `CheckAdminFunctionArn` exports

4. **Update Stack 06 (API Gateway)**:
   - Replace hardcoded Lambda ARNs with `Fn::ImportValue`

---

## Common Mistakes to Avoid

❌ **Mistake 1**: Using same `Environment` for both `LambdaCodeSourceEnv`
```powershell
# Wrong: Code packaged as 'prod' but deploying to 'prod'
-LambdaCodeSourceEnv prod -Environment prod
# If you later want to deploy 'staging' with 'prod' code, you can't
```

✅ **Better**: Always package as 'dev' and deploy everywhere
```powershell
# Right: Code always packaged as 'dev', deployed to any environment
-LambdaCodeSourceEnv dev -Environment prod
```

---

❌ **Mistake 2**: Deploying Stack 06 before Stack 08
```
Error: Import not found 'growksh-website-prod-check-user-lambda-arn'
Reason: Stack 08 hasn't been deployed yet, ARNs don't exist
```

✅ **Correct order**: 02 → 07 → 02 update → 08 → 06

---

❌ **Mistake 3**: Different `VerifySecret` between Stack 07 and Stack 08
```
Email verification fails
Reason: Stack 07 signs with Secret A, Stack 08 verifies with Secret B
```

✅ **Solution**: Use same `VerifySecret` for both stacks

---

## Validation Checklist

After updating templates:

- [ ] cfn-lint passes: `cfn-lint infra/cloudformation/*.yaml`
- [ ] All hardcoded account IDs removed
- [ ] All hardcoded Lambda ARNs replaced with ImportValue
- [ ] Environment parameter added to all stacks
- [ ] LambdaCodeSourceEnv parameter added to Stacks 07 & 08
- [ ] S3 bucket naming includes Region pseudo-parameter
- [ ] Stack dependencies documented and tested
- [ ] All Lambda exports have unique, environment-aware names
- [ ] Dry-run deployment succeeds: `aws cloudformation deploy --template-file ... --no-execute-changeset`

