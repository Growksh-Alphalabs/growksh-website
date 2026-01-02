#!/bin/bash

# Cleanup orphaned WAF stacks from deleted feature branches
# Scans for WAF stacks in us-east-1 and identifies those from feature branches
# that no longer exist in the git repository.
#
# Usage: ./cleanup-orphaned-waf.sh [--dry-run] [--force]
# Examples:
#   ./cleanup-orphaned-waf.sh --dry-run    # Show what would be deleted
#   ./cleanup-orphaned-waf.sh --force      # Delete without confirmation
#   ./cleanup-orphaned-waf.sh              # Interactive mode (confirm each deletion)

set -e

DRY_RUN=false
FORCE_DELETE=false
REGION="us-east-1"  # WAF is always in us-east-1

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE_DELETE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--force]"
      exit 1
      ;;
  esac
done

echo "🔍 Scanning for orphaned WAF stacks..."
echo "📍 Region: $REGION"
echo ""

# Get all WAF stacks matching feature-* pattern
WAF_STACKS=$(aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --region "$REGION" \
  --query "StackSummaries[?contains(StackName, '-waf-feature-')].StackName" \
  --output text)

if [ -z "$WAF_STACKS" ]; then
  echo "✅ No feature WAF stacks found in $REGION"
  exit 0
fi

echo "Found WAF stacks from feature branches:"
echo "$WAF_STACKS" | tr ' ' '\n' | sed 's/^/  - /'
echo ""

# Extract feature hashes and check if corresponding branches exist
ORPHANED_STACKS=()
ACTIVE_STACKS=()

for stack in $WAF_STACKS; do
  # Extract feature hash from stack name (e.g., "growksh-website-waf-feature-abc123" -> "feature-abc123")
  FEATURE_ID=$(echo "$stack" | grep -oE 'feature-[a-z0-9]+' | head -1)

  if [ -z "$FEATURE_ID" ]; then
    echo "⚠️  Could not extract feature ID from stack: $stack"
    continue
  fi

  # Check if corresponding ephemeral environment stacks exist in ap-south-1
  # (WAF is in us-east-1, but other stacks are in ap-south-1)
  EPHEMERAL_STACKS=$(aws cloudformation list-stacks \
    --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
    --region "ap-south-1" \
    --query "StackSummaries[?contains(StackName, '$FEATURE_ID')].StackName" \
    --output text 2>/dev/null || echo "")

  if [ -z "$EPHEMERAL_STACKS" ]; then
    # No other stacks found for this feature - it's orphaned
    ORPHANED_STACKS+=("$stack")
    echo "🗑️  ORPHANED: $stack (no corresponding stacks in ap-south-1)"
  else
    # Other stacks still exist for this feature
    ACTIVE_STACKS+=("$stack")
    echo "✅ ACTIVE: $stack (has related stacks in ap-south-1)"
  fi
done

echo ""

if [ ${#ORPHANED_STACKS[@]} -eq 0 ]; then
  echo "✨ No orphaned WAF stacks found!"
  exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Found ${#ORPHANED_STACKS[@]} orphaned WAF stack(s) to delete:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

for stack in "${ORPHANED_STACKS[@]}"; do
  echo "  🗑️  $stack"
done

echo ""

if [ "$DRY_RUN" = true ]; then
  echo "🏃 DRY RUN MODE - No stacks will be deleted"
  exit 0
fi

if [ "$FORCE_DELETE" = false ]; then
  echo "⚠️  These stacks will be DELETED permanently!"
  read -p "Continue with deletion? (yes/no): " confirmation

  if [ "$confirmation" != "yes" ]; then
    echo "❌ Cancelled by user"
    exit 0
  fi
fi

echo ""
echo "🧹 Starting deletion of ${#ORPHANED_STACKS[@]} orphaned WAF stack(s)..."
echo ""

DELETED_COUNT=0
FAILED_COUNT=0

for stack in "${ORPHANED_STACKS[@]}"; do
  echo "Deleting: $stack"

  if aws cloudformation delete-stack \
    --stack-name "$stack" \
    --region "$REGION" 2>&1 | tee /tmp/delete-$stack.log; then

    echo "  ✅ Delete initiated for $stack"
    ((DELETED_COUNT++))

    # Optional: Wait for deletion to complete
    echo "  ⏳ Waiting for stack deletion to complete..."
    if aws cloudformation wait stack-delete-complete \
      --stack-name "$stack" \
      --region "$REGION" 2>/dev/null; then
      echo "  ✅ Stack fully deleted: $stack"
    else
      echo "  ⚠️  Stack deletion in progress (may take a few minutes)"
    fi
  else
    echo "  ❌ Failed to delete $stack"
    cat /tmp/delete-$stack.log
    ((FAILED_COUNT++))
  fi

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Cleanup Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deletion initiated: $DELETED_COUNT stacks"
echo "❌ Failed: $FAILED_COUNT stacks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED_COUNT -gt 0 ]; then
  echo "⚠️  Some stacks failed to delete. Check logs above."
  exit 1
else
  echo "✨ Cleanup complete! Orphaned WAF stacks have been deleted."
  echo "💰 Cost savings: ~$6 per deleted WAF stack per month"
  exit 0
fi
