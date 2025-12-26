# IAM Configuration Files

This directory contains IAM policies and trust relationships for GitHub Actions OIDC authentication.

## Files

### `trust-policy.json`
Trust relationship policy that allows GitHub Actions to assume the `GrowkshDeveloperRole`.

**Before using**: Replace placeholders:
- `ACCOUNT_ID`: Your AWS account ID
- `GITHUB_OWNER`: GitHub username/organization
- `GITHUB_REPO`: Repository name

**Usage**:
```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

sed -i "s/ACCOUNT_ID/$AWS_ACCOUNT_ID/g" trust-policy.json
sed -i "s/GITHUB_OWNER/mithilesh/g" trust-policy.json
sed -i "s/GITHUB_REPO/growksh-website/g" trust-policy.json

aws iam create-role \
  --role-name GrowkshDeveloperRole \
  --assume-role-policy-document file://trust-policy.json
```

### `growksh-developer-policy.json`
IAM policy granting permissions for CloudFormation, Lambda, S3, DynamoDB, Cognito, CloudFront, and other required services.

**Before using**: Replace `ACCOUNT_ID` placeholder:
```bash
sed -i "s/ACCOUNT_ID/$AWS_ACCOUNT_ID/g" growksh-developer-policy.json

aws iam put-role-policy \
  --role-name GrowkshDeveloperRole \
  --policy-name GrowkshDeveloperPolicy \
  --policy-document file://growksh-developer-policy.json
```

## Permissions Included

- ✅ CloudFormation (create/update/delete stacks)
- ✅ Lambda (create/update functions)
- ✅ API Gateway (create/update APIs)
- ✅ DynamoDB (create/update tables)
- ✅ S3 (create/manage buckets)
- ✅ Cognito (user pool operations)
- ✅ CloudFront (distributions, invalidations)
- ✅ SES (send emails)
- ✅ IAM PassRole (for Lambda execution roles)
- ✅ Logs (CloudWatch)

## Restrictions

❌ **NOT included** (for security):
- IAM role creation/deletion
- IAM policy attachment/detachment
- Account-level changes
- Cross-account access

## Reference

See [infra/PHASE0_SETUP.md](./PHASE0_SETUP.md) for complete setup instructions.
