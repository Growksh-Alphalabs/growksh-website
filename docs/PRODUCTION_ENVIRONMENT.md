# Production Environment Setup Guide

This guide covers the production environment, deployment procedures, and operational tasks.

## Overview

**Production Environment**:
- AWS Region: `ap-south-1` (Mumbai)
- Environment Identifier: `prod`
- Stack Naming: `growksh-website-*-prod`
- Deployment Branch: `main`
- Approval Required: **YES - Manual approval in GitHub Actions**
- Cost: ~$50-100/month
- SLA: 99.9% uptime target
- Monitoring: CloudWatch + CloudTrail enabled

---

## Initial Production Setup

### Prerequisites

Before deploying to production for the first time:

1. ✅ Development environment must be fully tested
2. ✅ All code must be reviewed and tested
3. ✅ Security scanning must pass
4. ✅ Database backups configured
5. ✅ Monitoring and alerting configured
6. ✅ Team trained on production procedures

### 1. Manual Initial Deployment

On first production deployment, run manually:

```bash
# Ensure you have production credentials configured
aws sts get-caller-identity

# Output should confirm correct AWS account: 720427058396

# Deploy production infrastructure
chmod +x infra/scripts/deploy-stacks.sh
./infra/scripts/deploy-stacks.sh prod
```

**Expected Duration**: 15-20 minutes

**Expected Output**:
```
✅ All stacks deployed successfully!
growksh-website-iam-prod              CREATE_COMPLETE
growksh-website-database-prod         CREATE_COMPLETE
growksh-website-cognito-prod          CREATE_COMPLETE
growksh-website-storage-cdn-prod      CREATE_COMPLETE
growksh-website-api-prod              CREATE_COMPLETE
growksh-website-cognito-lambdas-prod  CREATE_COMPLETE
growksh-website-api-lambdas-prod      CREATE_COMPLETE
```

### 2. Get Production Endpoints

```bash
# Get CloudFront Domain
aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-prod \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text

# Example: d9876543210xyz.cloudfront.net

# Get API Endpoint
aws cloudformation describe-stacks \
  --stack-name growksh-website-api-prod \
  --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text

# Example: https://xyz9876543210.execute-api.ap-south-1.amazonaws.com/prod
```

### 3. Configure Environment Variables

Update `.env.production` in the project root:

```env
# Frontend URL (use CloudFront domain)
VITE_API_URL=https://xyz9876543210.execute-api.ap-south-1.amazonaws.com/prod

# Cognito Configuration
VITE_COGNITO_USER_POOL_ID=ap-south-1_yyyyyyyyyyyy
VITE_COGNITO_CLIENT_ID=2b3c4d5e6f7g8h9i0jk1l

# Contact API
VITE_CONTACT_API_URL=https://xyz9876543210.execute-api.ap-south-1.amazonaws.com/prod/contact

# Feature Flags
VITE_ENVIRONMENT=production
```

### 4. Configure DNS/CloudFront Custom Domain

To use a custom domain (e.g., `www.growksh.com`):

```bash
# Add custom domain to CloudFront distribution
aws cloudfront update-distribution-config \
  --id <DISTRIBUTION_ID> \
  --cli-input-json file://cf-config-update.json

# Update Route53 (if using AWS DNS)
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://route53-update.json
```

---

## Production Deployment Workflow

### Standard Production Deployment

Production uses **automated deployment with manual approval**:

```
1. Developer commits and pushes to main branch
2. GitHub Actions workflow automatically runs:
   ✅ Validates CloudFormation templates
   ✅ Validates code (linting, testing)
   ✅ Builds frontend
   ✅ PAUSES and waits for approval
3. Authorized person reviews and approves in GitHub Actions
4. Workflow continues:
   ✅ Deploys CloudFormation stacks
   ✅ Updates Lambda functions
   ✅ Uploads frontend to S3
   ✅ Invalidates CloudFront cache
   ✅ Creates release notes
5. Deployment complete - verify in browser
```

### Merging to Production (main)

**Note**: Use this only when code is **fully tested and approved**

```bash
# Merge develop to main
git checkout main
git pull origin main
git merge develop

# Push to main (triggers GitHub Actions)
git push origin main

# Watch deployment progress
# Open https://github.com/Growksh-Alphalabs/growksh-website/actions
# Find the deploy-prod workflow
# Click "Review deployments" when approval is needed
# Click "Approve and deploy"
```

### Emergency Hotfix to Production

For critical bugs that must be fixed immediately:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make minimal necessary changes
# ... fix code ...

# Commit and push hotfix
git add .
git commit -m "hotfix: critical issue description"
git push origin hotfix/critical-fix

# Create pull request
# hotfix/critical-fix → main
# Title: "HOTFIX: critical issue description"

# Deploy via manual workflow
# ./infra/scripts/deploy-stacks.sh prod

# After hotfix works:
# Merge hotfix back to develop:
git checkout develop
git merge hotfix/critical-fix
git push origin develop
```

---

## Production Operations

### Pre-Deployment Checklist

Before **every** production deployment:

- [ ] Code reviewed by at least 2 people
- [ ] All automated tests passing
- [ ] CHANGELOG.md updated
- [ ] Security scan passed
- [ ] Performance benchmarks acceptable
- [ ] Database migrations tested in develop
- [ ] Rollback plan documented
- [ ] Team notified of upcoming deployment

### Deployment Checklist

During deployment:

- [ ] Watch GitHub Actions workflow progress
- [ ] No other deployments running
- [ ] Verify approval is from authorized person
- [ ] Monitor AWS CloudFormation events
- [ ] Check CloudWatch dashboards during deployment
- [ ] Verify no errors in Lambda logs

### Post-Deployment Verification

After deployment completes:

```bash
# 1. Verify stacks are healthy
aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, 'prod')].{Name:StackName,Status:StackStatus}" \
  --output table \
  --region ap-south-1

# Expected: All should be CREATE_COMPLETE or UPDATE_COMPLETE

# 2. Test website accessibility
PROD_URL="https://$(aws cloudformation describe-stacks \
  --stack-name growksh-website-storage-cdn-prod \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)"

echo "Testing: $PROD_URL"
curl -I $PROD_URL | grep "HTTP"

# Expected: HTTP/1.1 200 OK

# 3. Test API endpoint
API_URL="https://$(aws cloudformation describe-stacks \
  --stack-name growksh-website-api-prod \
  --region ap-south-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text | cut -d'/' -f3)"

curl -I $API_URL | grep "HTTP"

# Expected: HTTP/1.1 403 Forbidden (API Gateway returns 403 for missing auth)

# 4. Check Lambda functions are updated
aws lambda get-function \
  --function-name growksh-website-contact-prod \
  --region ap-south-1 \
  --query "Configuration.LastModified" \
  --output text

# Expected: Recent timestamp (within last 5 minutes)

# 5. Verify CloudFront is serving new content
curl -I $PROD_URL | grep -i "x-cache"

# Expected: Should show CloudFront cache status

# 6. Monitor error logs
aws logs tail /aws/lambda/growksh-website-contact-prod --follow --region ap-south-1 &
aws logs tail /aws/apigateway/growksh-website-api-prod --follow --region ap-south-1 &

# Kill after 30 seconds of no errors:
# Press Ctrl+C
```

### Smoke Testing

Quick functional tests to verify deployment:

```bash
# 1. Test contact form submission
curl -X POST https://api.example.com/prod/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "phone": "+91-9999999999"
  }'

# Expected: HTTP 200, contact stored in DynamoDB

# 2. Test authentication
curl -X POST https://api.example.com/prod/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'

# Expected: HTTP 200, user created in Cognito

# 3. Verify static assets loading
curl -I https://cloudfront-domain/index.html | head -10

# Expected: HTTP 200, Content-Length present, Cache-Control header present

# 4. Check core pages load
curl https://cloudfront-domain/ | grep -q "Growksh"

# Expected: Exit code 0 (page contains expected content)
```

---

## Production Monitoring

### CloudWatch Dashboards

View production metrics:

```bash
# Create custom dashboard
aws cloudwatch put-dashboard \
  --dashboard-name growksh-website-prod \
  --dashboard-body file://dashboard-config.json

# View Lambda metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=growksh-website-contact-prod \
  --start-time 2025-12-24T00:00:00Z \
  --end-time 2025-12-25T00:00:00Z \
  --period 3600 \
  --statistics Average,Maximum,Minimum \
  --region ap-south-1
```

### Real-time Logs

Monitor production in real-time:

```bash
# All Lambda logs
aws logs tail /aws/lambda --follow --region ap-south-1 | grep prod

# API Gateway logs
aws logs tail /aws/apigateway/growksh-website-api-prod --follow --region ap-south-1

# CloudFront logs
aws logs tail /aws/cloudfront/growksh-website-prod --follow --region ap-south-1

# Combined view (requires log insights)
aws logs start-query \
  --log-group-name /aws/lambda/growksh-website-contact-prod \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, @message | filter @message like /ERROR/ | stats count()'
```

### Alerts

Configure CloudWatch alarms:

```bash
# Alert on Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-website-prod-lambda-errors \
  --alarm-description "Alert when Lambda errors exceed threshold" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=growksh-website-contact-prod \
  --alarm-actions arn:aws:sns:ap-south-1:720427058396:growksh-alerts

# Alert on high API latency
aws cloudwatch put-metric-alarm \
  --alarm-name growksh-website-prod-api-latency \
  --alarm-description "Alert when API latency is high" \
  --metric-name Duration \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --threshold 3000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=growksh-website-contact-prod \
  --alarm-actions arn:aws:sns:ap-south-1:720427058396:growksh-alerts
```

---

## Production Rollback Procedures

### When to Rollback

Rollback immediately if:
- ❌ Website is not accessible
- ❌ Authentication is broken
- ❌ Critical API endpoints return errors
- ❌ More than 10% of requests fail
- ❌ Lambda cold starts exceed 10 seconds

### Rollback Procedure

**Option 1: Code Rollback** (Preferred - safest)

```bash
# Revert to previous working commit
git log --oneline | head -5
# Identify last good commit hash

# Create rollback branch
git checkout -b rollback/from-commit-abc123
git reset --hard abc123

# Merge to main
git checkout main
git merge rollback/from-commit-abc123
git push origin main

# GitHub Actions automatically deploys
# Monitor logs for success
```

**Option 2: CloudFormation Rollback** (If code is correct)

```bash
# Rollback individual stacks
aws cloudformation cancel-update-stack \
  --stack-name growksh-website-api-lambdas-prod \
  --region ap-south-1

# Or manually update to previous version
aws cloudformation update-stack \
  --stack-name growksh-website-api-lambdas-prod \
  --template-body file://06-api-lambdas-stack.yaml \
  --parameters file://parameters/prod-06-api-lambdas.json \
  --region ap-south-1
```

**Option 3: Immediate Lambda Rollback** (Emergency)

```bash
# Get previous function version
aws lambda get-function-code-location \
  --function-name growksh-website-contact-prod \
  --region ap-south-1

# Download previous version
aws lambda get-function \
  --function-name growksh-website-contact-prod \
  --region ap-south-1 \
  --query 'Code.Location' \
  --output text | xargs curl -o lambda-previous.zip

# Publish version
aws lambda update-function-code \
  --function-name growksh-website-contact-prod \
  --zip-file fileb://lambda-previous.zip \
  --region ap-south-1
```

### Post-Rollback

After rollback:

1. ✅ Verify services are healthy
2. ✅ Run smoke tests again
3. ✅ Check error logs are clear
4. ✅ Notify team
5. ✅ Schedule incident review
6. ✅ Root cause analysis
7. ✅ Fix and re-test in develop

---

## Production Maintenance

### Weekly Tasks

```bash
# 1. Review CloudWatch metrics
aws cloudwatch list-metrics --namespace AWS/Lambda --region ap-south-1

# 2. Check for Lambda version creep
aws lambda list-functions --region ap-south-1 | jq '.Functions[] | .FunctionName, .Version'

# 3. Verify backups exist
aws dynamodb list-backups \
  --table-name growksh-website-contact-prod \
  --region ap-south-1

# 4. Check CloudFront cache hit ratio
aws cloudfront get-distribution-statistics \
  --id <DISTRIBUTION_ID> \
  --query 'Distribution.DistributionConfig.DefaultCacheBehavior'
```

### Monthly Tasks

```bash
# 1. Review cost usage
aws ce get-cost-and-usage \
  --time-period Start=$(date -d 'first day of month' '+%Y-%m-%d'),End=$(date '+%Y-%m-%d') \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# 2. Update Lambda layers
# ... update dependencies ...
# Deploy new layer versions

# 3. Security scan
# Run AWS Config compliance checks
aws configservice describe-compliance-by-config-rule

# 4. Performance analysis
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --start-time $(date -d '30 days ago' '+%Y-%m-%dT%H:%M:%S') \
  --end-time $(date '+%Y-%m-%dT%H:%M:%S') \
  --period 86400 \
  --statistics Average,Maximum
```

### Quarterly Tasks

```bash
# 1. Disaster recovery drill
# Test restore from DynamoDB backup

# 2. Infrastructure review
# Review CloudFormation drift

# 3. Security audit
# Check IAM permissions are least-privilege

# 4. Cost optimization
# Review unused resources

# 5. Documentation review
# Update runbooks and procedures
```

---

## Production Troubleshooting

### Issue: Website Returns 403 Forbidden

```bash
# Check CloudFront OAC configuration
aws cloudfront get-distribution \
  --id <DISTRIBUTION_ID> \
  --region ap-south-1 \
  --query 'Distribution.DistributionConfig.Origins'

# Check S3 bucket policy
aws s3api get-bucket-policy \
  --bucket growksh-website-assets-prod

# Check bucket ACL
aws s3api get-bucket-acl \
  --bucket growksh-website-assets-prod
```

### Issue: API Returns 500 Internal Server Error

```bash
# Check Lambda function for errors
aws logs tail /aws/lambda/growksh-website-contact-prod --follow

# Check CloudWatch logs for exceptions
aws logs filter-log-events \
  --log-group-name /aws/lambda/growksh-website-contact-prod \
  --filter-pattern "ERROR" \
  --start-time $(date -d '5 minutes ago' +%s)000

# Check Lambda IAM permissions
aws lambda get-policy \
  --function-name growksh-website-contact-prod

# Test function directly
aws lambda invoke \
  --function-name growksh-website-contact-prod \
  --payload '{"httpMethod":"GET","path":"/contact"}' \
  --region ap-south-1 \
  output.json
cat output.json
```

### Issue: Slow API Response Time

```bash
# Check Lambda metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=growksh-website-contact-prod \
  --start-time $(date -d '1 hour ago' '+%Y-%m-%dT%H:%M:%S') \
  --end-time $(date '+%Y-%m-%dT%H:%M:%S') \
  --period 300 \
  --statistics Maximum,Average \
  --region ap-south-1

# Check DynamoDB capacity
aws dynamodb describe-table \
  --table-name growksh-website-contact-prod \
  --region ap-south-1 \
  --query 'Table.BillingModeSummary'

# Check for cold starts
aws logs filter-log-events \
  --log-group-name /aws/lambda/growksh-website-contact-prod \
  --filter-pattern "REPORT" \
  --query 'events[0:5]'
```

---

## Best Practices

1. **Never deploy on Friday afternoon** - Difficult to get support if issues occur
2. **Always test in develop first** - No exceptions
3. **Keep deployments small** - Easier to debug issues
4. **Monitor for 30 minutes after deployment** - Catch issues early
5. **Have rollback plan ready** - Before deploying anything
6. **Document all changes** - Update CHANGELOG.md
7. **Alert on errors** - Configure CloudWatch alarms
8. **Review costs monthly** - Catch unexpected increases early
9. **Backup before major changes** - DynamoDB snapshots
10. **Keep team informed** - Post deployment notifications

---

**Last Updated**: Dec 24, 2025
**Status**: Production Ready
**On-Call**: Team rotation in Slack #production-oncall
