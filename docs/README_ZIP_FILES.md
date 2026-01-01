# ℹ️ About .zip Files

## Lambda Function Packages

The following `.zip` files in the repository root are **NEEDED** for deployment:

```
✅ KEEP THESE - They are Lambda function packages
├─ pre-sign-up-dev.zip              (Cognito trigger)
├─ custom-message-dev.zip           (Cognito trigger)
├─ define-auth-challenge-dev.zip    (Cognito trigger)
├─ create-auth-challenge-dev.zip    (Cognito trigger)
├─ verify-auth-challenge-dev.zip    (Cognito trigger)
├─ post-confirmation-dev.zip        (Cognito trigger)
├─ signup-dev.zip                   (API Lambda)
├─ verify-email-dev.zip             (API Lambda)
├─ check-user-dev.zip               (API Lambda)
├─ check-admin-dev.zip              (API Lambda)
└─ contact-dev.zip                  (API Lambda)
```

## Why These Files Are Needed

These ZIP files are:
- ✅ Lambda function packages (compiled/bundled code)
- ✅ Referenced by CloudFormation stacks (Stack 07 and 08)
- ✅ Uploaded to S3 bucket during deployment
- ✅ Required for CloudFormation to create Lambda functions

## Where They're Used

```
CloudFormation Stack 07 (Cognito Lambdas):
├─ S3Key: auth/pre-sign-up-dev.zip
├─ S3Key: auth/custom-message-dev.zip
├─ S3Key: auth/define-auth-challenge-dev.zip
├─ S3Key: auth/create-auth-challenge-dev.zip
├─ S3Key: auth/verify-auth-challenge-dev.zip
└─ S3Key: auth/post-confirmation-dev.zip

CloudFormation Stack 08 (API Lambdas):
├─ S3Key: auth/signup-dev.zip
├─ S3Key: auth/verify-email-dev.zip
├─ S3Key: auth/check-user-dev.zip
├─ S3Key: auth/check-admin-dev.zip
└─ S3Key: contact/index-dev.zip
```

## How They Get There

1. **Code is packaged**: `cd aws-lambda && make package`
   - Creates the `.zip` files from source code
   - Puts them in repository root

2. **Files are uploaded to S3**: `make upload`
   - Uploads ZIPs to S3 bucket
   - CloudFormation references them from S3

3. **CloudFormation creates Lambda functions**: `deploy.ps1` or `deploy.py`
   - Creates Lambda functions using ZIPs from S3
   - Sets environment variables
   - Attaches IAM roles

## Do NOT Delete

These files must be kept in the repository for deployment to work:
- ❌ Do NOT delete these .zip files
- ❌ Do NOT remove from version control
- ✅ DO commit them to git
- ✅ DO use them during deployment

## Storage Notes

- These files are in `.gitignore` by default (usually)
- They're generated from source code in `aws-lambda/`
- They're re-created when you run `make package`
- They should be kept current with source code changes

## Summary

```
Status: ✅ ALL .zip FILES ARE NEEDED

Total Lambda Functions: 11
├─ Cognito Triggers: 6
└─ API Functions: 5

Total .zip Files: 11 (one per function)
Location: Repository root
Size: Varies per function (typically 1-10 MB each)
Purpose: Lambda function deployment packages
Delete?: NO - They are essential
```

---

**Next**: Deploy using `.\infra\scripts\deploy.ps1` or `python3 infra\scripts\deploy.py`

