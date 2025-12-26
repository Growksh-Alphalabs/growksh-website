# CloudFormation Resource Naming Convention

## Current Standard

### Logical Resource Names (CloudFormation keys - PascalCase)
- **Roles**: `{Service}Role` (e.g., `AuthLambdaRole`, `ContactLambdaRole`)
- **Tables**: `{Name}Table` (e.g., `AuthOtpTable`, `ContactsTable`)
- **Functions**: `{Name}Function` (e.g., `PreSignUpFunction`, `ContactFunction`)
- **Buckets**: `AssetsBucket`
- **API Gateway**: `ApiGateway`
- **CloudFront**: `CdnDistribution`
- **Policies**: `{Resource}Policy` (e.g., `BucketPolicy`)
- **Permissions**: `{Function}Permission` (e.g., `PreSignUpPermission`)

### AWS Resource Names (lowercase with hyphens)
Pattern: `growksh-{component}-{environment}`

Examples:
```
growksh-auth-lambda-dev          # Role
growksh-contact-lambda-prod      # Role
growksh-otp-dev                  # Table
growksh-contact-dev              # Table
growksh-pool-dev                 # Cognito User Pool
growksh-client-dev               # Cognito Client
growksh-api-dev                  # API Gateway
growksh-cdn-dev                  # CloudFront
growksh-assets-prod              # S3 Bucket (from parameter)
```

### CloudFormation Exports
Pattern: `growksh-{environment}-{resource}-{type}`

Examples:
```
growksh-dev-auth-lambda-arn      # Role ARN
growksh-dev-pool-id              # Cognito Pool ID
growksh-dev-otp-table            # DynamoDB Table
growksh-dev-api-endpoint         # API Gateway URL
growksh-dev-cdn-domain           # CloudFront Domain
```

---

## Recommended Future Updates

To make the templates even more consistent, consider these changes (when you have time):

### Stack File Naming
```
00-iam-stack.yaml              → Current ✓
01-database-stack.yaml         → Current ✓
02-cognito-stack.yaml          → Current ✓
03-storage-cdn-stack.yaml      → Current ✓
04-api-gateway-stack.yaml      → Current ✓
05-cognito-lambdas-stack.yaml  → Current ✓
06-api-lambdas-stack.yaml      → Current ✓
```

### Logical Resource Name Consistency
- Change `UnifiedApiGateway` → `ApiGateway` (shorter, clearer)
- Change `StaticSiteBucket` → `AssetsBucket` (clearer purpose)
- Change `CloudFrontDistribution` → `CdnDistribution` (consistent)

### Export Name Consistency
- Change `user-pool-id` → `pool-id` (shorter, clearer)
- Change `auth-otp-table` → `otp-table` (redundant "auth" prefix)
- Change `auth-lambda-role-arn` → `auth-lambda-arn` (shorter)

---

## Why This Matters

1. **Findability**: Consistent naming makes resources easy to find in AWS console
2. **Automation**: Scripts and tooling can parse resource names reliably
3. **Readability**: New team members understand resource purposes immediately
4. **Maintainability**: Clear patterns reduce confusion and errors

---

## Implementation Status

✅ Logical resource names follow PascalCase convention
✅ AWS resource names use `growksh-{component}-{environment}` pattern
✅ CloudFormation exports use consistent naming
⏳ Minor refinements (documented above) for future iterations

**Current status**: Naming is consistent enough for Phase 2. Refinements can be done incrementally.
