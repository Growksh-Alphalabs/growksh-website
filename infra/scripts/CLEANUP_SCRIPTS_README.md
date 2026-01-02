# Cleanup Scripts

This directory contains scripts for cleaning up ephemeral and orphaned resources.

## Scripts

### 1. `cleanup-stacks.sh` - Ephemeral Stack Cleanup (Automatic)

**Purpose**: Automatically delete all stacks for an ephemeral environment when a PR is closed.

**Location**: Called automatically by GitHub Actions when PR is closed
**Triggered**: `deploy-ephemeral.yaml` workflow on `pull_request closed` event

**Manual Usage**:
```bash
# Delete only failed stacks for an environment (safe mode)
./infra/scripts/cleanup-stacks.sh feature-abc123

# Delete all stacks for an environment (used by GitHub Actions)
CLEANUP_SUCCESSFUL_STACKS=true ./infra/scripts/cleanup-stacks.sh feature-abc123
```

**What It Deletes** (in reverse dependency order):
1. API Lambda functions
2. Cognito Lambda functions
3. API Gateway
4. Storage/CDN (invalidates CloudFront first)
5. Lambda code bucket
6. Cognito
7. **WAF (now handles us-east-1 region correctly)** ⭐
8. Database
9. IAM roles

**Region Handling**:
- Default region: `ap-south-1` (can be overridden with `AWS_REGION` env var)
- **WAF stacks**: Automatically deleted from `us-east-1` (where WAF must be)

---

### 2. `cleanup-orphaned-waf.sh` - Orphaned WAF Cleanup (Manual)

**Purpose**: Find and delete WAF stacks from deleted feature branches that weren't cleaned up.

**Usage**:
```bash
# Scan and show what would be deleted (dry-run)
./infra/scripts/cleanup-orphaned-waf.sh --dry-run

# Interactive mode - asks for confirmation before deleting
./infra/scripts/cleanup-orphaned-waf.sh

# Force delete without asking
./infra/scripts/cleanup-orphaned-waf.sh --force
```

**How It Works**:
1. **Scans** all WAF stacks in `us-east-1` matching pattern `*-waf-feature-*`
2. **Checks** if corresponding stacks exist in `ap-south-1` for each feature
3. **Identifies** orphaned WAF stacks (no other stacks found for that feature)
4. **Prompts** for confirmation (unless `--force` flag used)
5. **Deletes** orphaned WAF stacks
6. **Calculates** cost savings (~$6/month per WAF stack)

**Example Output**:
```
🔍 Scanning for orphaned WAF stacks...
📍 Region: us-east-1

Found WAF stacks from feature branches:
  - growksh-website-waf-feature-abc123
  - growksh-website-waf-feature-def456

🗑️  ORPHANED: growksh-website-waf-feature-abc123 (no corresponding stacks in ap-south-1)
✅ ACTIVE: growksh-website-waf-feature-def456 (has related stacks in ap-south-1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found 1 orphaned WAF stack(s) to delete:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🗑️  growksh-website-waf-feature-abc123

⚠️  These stacks will be DELETED permanently!
Continue with deletion? (yes/no): yes

🧹 Starting deletion of 1 orphaned WAF stack(s)...
```

---

## When Each Script Runs

### Automatic (No User Action Needed)

| Event | Script | Condition |
|-------|--------|-----------|
| **PR created/updated** | `deploy-stacks.sh` | Deploy ephemeral stacks |
| **PR closed** | `cleanup-stacks.sh` | Delete ephemeral stacks & WAF |
| **Push to develop** | `deploy-stacks.sh` | Deploy/update dev stack |
| **Push to main** | `deploy-stacks.sh` | Deploy/update prod stack |

### Manual (Run When Needed)

| Scenario | Command |
|----------|---------|
| Find orphaned WAF stacks | `./cleanup-orphaned-waf.sh --dry-run` |
| Delete orphaned WAF stacks | `./cleanup-orphaned-waf.sh --force` |
| Cleanup failed dev deployment | `./cleanup-stacks.sh dev` |
| Cleanup failed prod deployment | `./cleanup-stacks.sh prod` |

---

## WAF Cleanup Improvements (Recent Changes)

✅ **Updated `cleanup-stacks.sh`**:
- Now correctly handles WAF deletion from `us-east-1` (WAF is always in us-east-1)
- Uses region parameter in delete_stack function
- Added comment explaining WAF region specificity

✨ **New `cleanup-orphaned-waf.sh`**:
- Automatically finds and cleans up orphaned WAF stacks
- Prevents accumulation of unused WAF stacks (saves ~$6/month each)
- Interactive with `--dry-run` and `--force` modes
- Shows cost savings estimate

---

## Troubleshooting

### Script fails to find stacks
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check CloudFormation stacks exist
aws cloudformation list-stacks --region us-east-1
aws cloudformation list-stacks --region ap-south-1
```

### WAF stack won't delete
```bash
# WAF might be attached to CloudFront distribution
# Check if CF distribution deletion completed first

# View WAF stack status
aws cloudformation describe-stacks \
  --stack-name growksh-website-waf-feature-abc123 \
  --region us-east-1
```

### Stuck in deletion
```bash
# Check stack events for errors
aws cloudformation describe-stack-events \
  --stack-name <stack-name> \
  --region us-east-1 \
  --query 'StackEvents[?ResourceStatus==`DELETE_FAILED`]'

# Force delete if stuck (careful!)
aws cloudformation delete-stack \
  --stack-name <stack-name> \
  --region us-east-1 \
  --force-delete
```

---

## Cost Impact

**By using these cleanup scripts**:
- ✅ Ephemeral stacks cleaned up automatically (PR closed)
- ✅ Orphaned WAF stacks can be identified and deleted manually
- ✅ Saves **~$6/month per orphaned WAF stack**
- ✅ Prevents accumulation of unused resources

**Example**: 5 orphaned WAF stacks = **$30/month savings** 💰

---

## Environment Variables

| Variable | Default | Used By | Purpose |
|----------|---------|---------|---------|
| `AWS_REGION` | `ap-south-1` | cleanup-stacks.sh | Region for most stacks |
| `CLEANUP_SUCCESSFUL_STACKS` | `false` | cleanup-stacks.sh | Also delete successful stacks (used by GitHub Actions) |
| `AWS_PROFILE` | (none) | Both scripts | AWS profile to use |

---

## Related Files

- [GitHub Actions Workflows](.github/workflows/)
  - `deploy-ephemeral.yaml` - Calls cleanup-stacks.sh on PR close
  - `deploy-develop.yaml` - Dev environment deployment
  - `deploy-prod.yaml` - Production deployment

- [Deployment Scripts](./infra/scripts/)
  - `deploy-stacks.sh` - Main deployment orchestration
  - `build-and-upload-lambdas.sh` - Lambda code packaging
  - `cleanup-stacks.sh` - Ephemeral stack cleanup
  - `cleanup-orphaned-waf.sh` - Orphaned WAF cleanup (NEW)
