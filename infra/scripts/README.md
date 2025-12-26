# Deployment Scripts

This directory contains shell scripts for managing CloudFormation stack deployments.

## Scripts

### `deploy-stacks.sh`

Deploys all CloudFormation stacks in the correct dependency order.

**Usage:**
```bash
./infra/scripts/deploy-stacks.sh <environment>
```

**Parameters:**
- `<environment>`: Environment name (dev, prod, or ephemeral prefix like `growksh-website-feature-abc123`)

**Examples:**
```bash
# Deploy to development
./infra/scripts/deploy-stacks.sh dev

# Deploy to production
./infra/scripts/deploy-stacks.sh prod

# Deploy to ephemeral environment
./infra/scripts/deploy-stacks.sh growksh-website-feature-abc123
```

**Stack Deployment Order:**
1. `00-iam-stack.yaml` - IAM roles (no dependencies)
2. `01-database-stack.yaml` - DynamoDB tables (depends on IAM)
3. `02-cognito-stack.yaml` - Cognito User Pool (no dependencies)
4. `03-storage-cdn-stack.yaml` - S3 + CloudFront (no dependencies)
5. `04-api-gateway-stack.yaml` - API Gateway (no dependencies)
6. `05-cognito-lambdas-stack.yaml` - Cognito Lambda triggers (depends on Cognito, IAM, Database)
7. `06-api-lambdas-stack.yaml` - API Lambda functions (depends on API Gateway, IAM, Cognito, Database)

**Requirements:**
- AWS CLI configured with appropriate credentials (or OIDC via GitHub Actions)
- CloudFormation permissions
- `jq` (optional, for parsing JSON)

**Environment Variables:**
- `AWS_REGION` (default: `ap-south-1`)

### `cleanup-stacks.sh`

Deletes all CloudFormation stacks matching an environment prefix. Used for cleaning up ephemeral environments after PR closure.

**Usage:**
```bash
./infra/scripts/cleanup-stacks.sh <environment-prefix>
```

**Parameters:**
- `<environment-prefix>`: Environment prefix to match (e.g., `growksh-website-feature-abc123`)

**Examples:**
```bash
# Cleanup ephemeral environment
./infra/scripts/cleanup-stacks.sh growksh-website-feature-abc123
```

**Deletion Order (Reverse Dependencies):**
1. API Lambda functions (depends on everything)
2. Cognito Lambda triggers
3. API Gateway
4. Storage & CDN
5. Cognito User Pool
6. DynamoDB tables
7. IAM roles

**Cleanup Steps:**
1. Deletes CloudFormation stacks in dependency order
2. Empties and deletes associated S3 bucket
3. Confirms deletion of each resource

**Requirements:**
- AWS CLI configured with appropriate credentials
- CloudFormation and S3 permissions
- Credentials with DeleteStack and S3 permissions

**Environment Variables:**
- `AWS_REGION` (default: `ap-south-1`)

## Running Locally

To deploy locally:

```bash
# Set AWS credentials (via AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, or AWS profile)
export AWS_PROFILE=default

# Deploy to development
./infra/scripts/deploy-stacks.sh dev

# Check stack status
aws cloudformation describe-stacks --region ap-south-1 | jq '.Stacks[].StackName'
```

## GitHub Actions Integration

These scripts are automatically invoked by GitHub Actions workflows:

- **deploy-develop.yaml**: Calls `deploy-stacks.sh dev` on push to develop
- **deploy-prod.yaml**: Calls `deploy-stacks.sh prod` on push to main (after approval)
- **deploy-ephemeral.yaml**:
  - Calls `deploy-stacks.sh <environment-hash>` on push to feature branch
  - Calls `cleanup-stacks.sh <environment-hash>` on PR closure

## Troubleshooting

### Stack Deployment Fails

1. Check CloudFormation errors: `aws cloudformation describe-stack-resources --stack-name <stack-name>`
2. Verify parameter files exist: `ls infra/cloudformation/parameters/`
3. Check CloudFormation events: `aws cloudformation describe-stack-events --stack-name <stack-name>`

### Stack Cleanup Fails

1. Check stack status: `aws cloudformation describe-stacks --stack-name <stack-name>`
2. View CloudFormation events for deletion errors
3. Manually delete stacks if automated cleanup fails: `aws cloudformation delete-stack --stack-name <stack-name>`

### Permission Denied

- Ensure AWS credentials have CloudFormation, IAM, Lambda, DynamoDB, S3, and CloudFront permissions
- Check IAM role trust relationships if using OIDC

## Security Considerations

- Scripts use `aws cloudformation deploy` with `--capabilities CAPABILITY_NAMED_IAM` to create IAM roles
- Ensure only authorized personnel can trigger deployments
- Production deployments require manual approval in GitHub Actions
- Ephemeral environments are automatically cleaned up to avoid cost accumulation

## Cost Management

- Development stacks remain deployed for ongoing testing
- Ephemeral stacks are automatically deleted when PRs close
- Production stacks remain deployed continuously
- All resources tagged with `Partner=Growksh` for cost tracking
