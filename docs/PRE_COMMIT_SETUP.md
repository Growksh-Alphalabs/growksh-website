# Pre-Commit Hooks Setup Guide

## Overview

This project uses pre-commit hooks to validate code and infrastructure before commits. Hooks run automatically when you commit changes and prevent commits that don't meet quality standards.

## What Gets Validated

### CloudFormation Templates
- **Tool**: cfn-lint
- **Files**: `infra/cloudformation/**/*.yaml`
- **Checks**:
  - Syntax validation
  - Resource configuration best practices
  - Parameter and output validation
  - CloudFormation intrinsic function usage

### Code Quality
- **YAML validation**: `.github/workflows/**/*.yaml` (excludes CloudFormation)
- **JSON validation**: All JSON files including `package.json`
- **Trailing whitespace**: Removed automatically
- **End-of-file fixers**: Ensures consistent file endings
- **Line endings**: Normalizes to LF (Unix style)
- **Merge conflicts**: Prevents accidental merge conflict markers
- **Private keys**: Detects exposed secrets and credentials

## Installation

### Option 1: Automatic Installation (Recommended)

The pre-commit framework is configured in `.pre-commit-config.yaml`. Install it once:

```bash
# Install pre-commit framework
pip install pre-commit

# Install git hooks
pre-commit install
```

### Option 2: Manual Setup

If you prefer not to use pre-commit, you can manually run validations:

```bash
# Validate all CloudFormation templates
cfn-lint infra/cloudformation/*.yaml

# Run all pre-commit checks manually
python -m pre_commit run --all-files
```

## Usage

### Automatic (When You Commit)

Once installed, the hooks run automatically:

```bash
git add .
git commit -m "Your commit message"
# Hooks run automatically - if they fail, commit is blocked
```

### Manual (Any Time)

Run hooks manually without committing:

```bash
# Check all files
python -m pre_commit run --all-files

# Check specific hook
python -m pre_commit run cfn-python-lint --all-files

# Check only changed files (useful during development)
python -m pre_commit run
```

## Hooks Configuration

### cfn-python-lint
- **Purpose**: Validates CloudFormation templates
- **Auto-fix**: No (displays errors)
- **Files**: `infra/cloudformation/**/*.yaml`
- **Skip**: SAM templates are excluded from basic YAML validation

### Prettier
- **Purpose**: Code formatting
- **Auto-fix**: Yes (automatically fixes formatting)
- **Files**: JavaScript, JSON, CSS, Markdown

### Pre-commit-hooks (Standard Hooks)
- **Trailing whitespace**: Removed automatically
- **End-of-file fixer**: Fixed automatically
- **Mixed line endings**: Normalized to LF
- **YAML validation**: Checks syntax
- **JSON validation**: Checks syntax
- **Merge conflict detection**: Prevents bad merges

### Detect Private Key
- **Purpose**: Prevents accidental credential commits
- **Auto-fix**: No (blocks commit with details)
- **False positives**: Add to `.secrets.baseline` if needed

## Handling Pre-Commit Failures

### CloudFormation Validation Fails

```bash
# Check what cfn-lint found
cfn-lint infra/cloudformation/your-template.yaml

# Fix issues in the template
vim infra/cloudformation/your-template.yaml

# Try committing again
git commit -m "Fix: CloudFormation template validation"
```

### Line Endings or Whitespace Issues

The hooks auto-fix these. Simply:

```bash
git add .  # Re-stage the fixed files
git commit -m "Your message"
```

### Detect Secrets False Positive

If you have a legitimate string flagged as a secret:

```bash
# Update baseline to allow it
python -m detect_secrets scan --baseline .secrets.baseline

# Commit the updated baseline
git add .secrets.baseline
git commit -m "Update: Allow legitimate string in codebase"
```

## Updating Hooks

Pre-commit checks for updates periodically:

```bash
# Update all hooks to latest versions
python -m pre_commit autoupdate

# Commit the changes
git add .pre-commit-config.yaml
git commit -m "chore: Update pre-commit hook versions"
```

## Disabling Hooks Temporarily

If you absolutely need to bypass hooks (not recommended):

```bash
# Use --no-verify flag (skips ALL pre-commit checks)
git commit --no-verify -m "Emergency fix"
```

**Note**: Use sparingly! Hooks exist to maintain code quality.

## CI/CD Integration

Pre-commit hooks run locally before commits. Additionally:

- GitHub Actions validates templates during PR reviews
- CloudFormation deployment validates before applying changes
- All committed code has already passed hook validation

## Troubleshooting

### Pre-commit command not found

```bash
# Check if installed
python -m pre_commit --version

# If not found, install it
pip install --user pre-commit
```

### Hooks not running on commit

```bash
# Verify installation
ls -la .git/hooks/pre-commit

# Reinstall if missing
pre-commit install
```

### Specific file exemptions needed?

Edit `.pre-commit-config.yaml`:

```yaml
hooks:
  - id: cfn-python-lint
    exclude: ^infra/cloudformation/old-stack.yaml$
```

## See Also

- [CloudFormation Documentation](IMPLEMENTATION_COMPLETE.md)
- [Development Environment](DEVELOPMENT_ENVIRONMENT.md)
- [GitHub Actions Workflows](.github/workflows/deploy-ephemeral.yaml)
