# Deployment Architecture & Parameter Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AWS ACCOUNT (720427058396)                  │
│                     REGION (ap-south-1)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          CloudFront (Frontend Distribution)              │   │
│  │      https://d12jf2jvld5mg4.cloudfront.net              │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│                         │                                        │
│  ┌──────────────────────┴───────────────────────────────────┐   │
│  │         API Gateway (REST API)                           │   │
│  │  https://{id}.execute-api.ap-south-1.amazonaws.com       │   │
│  │                                                           │   │
│  │  ├─ POST /contact      ──┐                              │   │
│  │  ├─ POST /signup       ──┼──→ Lambda Integrations      │   │
│  │  ├─ POST /verify-email ──┤   (Stack 08)                │   │
│  │  ├─ POST /check-user   ──┤                              │   │
│  │  └─ POST /check-admin  ──┘                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
│           ┌─────────────┴────────────────┐                      │
│           │                              │                      │
│  ┌────────▼──────────────┐   ┌──────────▼───────────────┐      │
│  │  Cognito User Pool    │   │   API Lambda Functions   │      │
│  │  (Stack 02)           │   │   (Stack 08)             │      │
│  │                       │   │                          │      │
│  │  ┌─────────────────┐  │   │  • contact               │      │
│  │  │ Lambda Triggers │  │   │  • signup                │      │
│  │  │ (Stack 07):     │  │   │  • verify-email          │      │
│  │  │                 │  │   │  • check-user            │      │
│  │  │ • pre-sign-up   │  │   │  • check-admin           │      │
│  │  │ • custom-msg    │  │   │                          │      │
│  │  │ • auth-challenge│  │   │  (Exported ARNs)         │      │
│  │  │ • post-confirm  │  │   └──────────────────────────┘      │
│  │  └─────────────────┘  │                                      │
│  │  (Exported ARNs)      │                                      │
│  └───────────────────────┘                                      │
│           │                                                      │
│           │                                                      │
│  ┌────────▼──────────────────────────────────────────────┐     │
│  │         S3 Bucket (Lambda Code)                       │     │
│  │  growksh-website-lambda-code-{Env}-{Region}          │     │
│  │                                                        │     │
│  │  ├─ auth/                                             │     │
│  │  │  ├─ signup-dev.zip                                 │     │
│  │  │  ├─ custom-message-dev.zip                         │     │
│  │  │  ├─ pre-sign-up-dev.zip                            │     │
│  │  │  ├─ check-user-dev.zip                             │     │
│  │  │  ├─ verify-email-dev.zip                           │     │
│  │  │  └─ ... (other auth functions)                     │     │
│  │  │                                                     │     │
│  │  └─ contact/                                          │     │
│  │     └─ index-dev.zip                                  │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## CloudFormation Stack Dependency Graph

```
Stack 02: Cognito User Pool
(EnableTriggers=false)
        │
        ├─────→ Stack 07: Cognito Lambda Triggers
        │        (Pre-sign-up, Custom-msg, Auth-challenge, Post-confirm)
        │        ├─ Exports 6 Lambda ARNs
        │        └─ Requires: S3 bucket with code ZIPs
        │
        ├─────→ Stack 02: Cognito User Pool
        │        (EnableTriggers=true)
        │        ├─ Imports 6 Lambda ARNs from Stack 07
        │        └─ Attaches triggers to user pool
        │
        ├─────→ Stack 08: API Lambda Functions
        │        (Contact, Signup, Verify-email, Check-user, Check-admin)
        │        ├─ Exports 5 Lambda ARNs
        │        └─ Requires: S3 bucket with code ZIPs
        │
        └─────→ Stack 06: API Gateway
                 ├─ Imports 5 Lambda ARNs from Stack 08
                 ├─ Imports 1 Lambda ARN from Stack 07 (custom-message for verify-email)
                 └─ Creates REST API with CORS endpoints

┌─────────────────────────────────────────────────────┐
│          Deployment Order (CRITICAL)                │
├─────────────────────────────────────────────────────┤
│ 1. Stack 02 with EnableTriggers=false               │
│ 2. Stack 07 (Cognito Lambdas)                       │
│ 3. Stack 02 with EnableTriggers=true                │
│ 4. Stack 08 (API Lambdas)                           │
│ 5. Stack 06 (API Gateway)                           │
└─────────────────────────────────────────────────────┘
```

---

## Parameter Flow Across Stacks

```
User Provides:
├─ Environment (prod, staging, dev, feature-123)
├─ Region (ap-south-1, us-east-1, etc.)
├─ SES Email (noreply@growksh.com)
├─ Verify Secret (32+ random chars)
├─ Verify Base URL (https://growksh.com/auth/verify-email)
├─ Lambda Code Source Env (dev, prod, etc.)
└─ Lambda Code Bucket (optional, auto-creates if not provided)

       ↓
       ↓
┌─────────────────────────────────────────────┐
│  Deployment Script                          │
│  (deploy.ps1 / deploy.py)                   │
└──┬──────────────────────────────────────────┘
   │
   ├─→ Stack 02 (Cognito User Pool)
   │   Parameters:
   │   ├─ Environment ✓
   │   └─ EnableTriggers ✓
   │
   ├─→ Stack 07 (Cognito Lambdas)
   │   Parameters:
   │   ├─ Environment ✓
   │   ├─ LambdaCodeSourceEnv ✓
   │   ├─ LambdaCodeBucketName ✓
   │   ├─ SESSourceEmail ✓
   │   ├─ VerifyBaseUrl ✓
   │   ├─ VerifySecret ✓
   │   └─ DebugLogOTP ✓
   │
   ├─→ Stack 02 (Update - Enable Triggers)
   │   Parameters:
   │   ├─ Environment ✓
   │   └─ EnableTriggers=true ✓
   │   Imports from Stack 07:
   │   └─ 6 Lambda ARNs ✓
   │
   ├─→ Stack 08 (API Lambdas)
   │   Parameters:
   │   ├─ Environment ✓
   │   ├─ LambdaCodeSourceEnv ✓
   │   ├─ LambdaCodeBucketName ✓
   │   ├─ VerifyBaseUrl ✓
   │   └─ VerifySecret ✓
   │
   └─→ Stack 06 (API Gateway)
       Parameters:
       └─ Environment ✓
       Imports from Stack 07:
       ├─ Custom-message Lambda ARN ✓
       └─ (For verify-email endpoint)
       Imports from Stack 08:
       ├─ Contact Lambda ARN ✓
       ├─ Signup Lambda ARN ✓
       ├─ Verify-email Lambda ARN ✓
       ├─ Check-user Lambda ARN ✓
       └─ Check-admin Lambda ARN ✓
```

---

## Parameterization Strategy

### Hardcoded → Parameterized Transformation

```
OLD (Account-Specific):
┌─────────────────────────────────────────────────────┐
│  S3 Bucket: growksh-website-lambda-code-           │
│             720427058396-dev                        │
│  Includes AccountId: 720427058396 ❌               │
│  Can't reuse in other account                       │
└─────────────────────────────────────────────────────┘

NEW (Account-Agnostic):
┌─────────────────────────────────────────────────────┐
│  S3 Bucket: growksh-website-lambda-code-           │
│             ${Environment}-${AWS::Region}          │
│  Resolves to: prod-ap-south-1                      │
│  Evaluates in target account: ✓                    │
└─────────────────────────────────────────────────────┘


OLD (Account-Specific):
┌─────────────────────────────────────────────────────┐
│  Lambda ARN: arn:aws:lambda:ap-south-1:            │
│              720427058396:function:contact         │
│  Hardcoded AccountId: 720427058396 ❌              │
└─────────────────────────────────────────────────────┘

NEW (Account-Agnostic):
┌─────────────────────────────────────────────────────┐
│  Lambda ARN: !ImportValue                           │
│              'growksh-website-${Environment}-      │
│              contact-lambda-arn'                    │
│  Resolves from Stack 08: ✓                         │
│  Works in any account: ✓                           │
└─────────────────────────────────────────────────────┘
```

---

## Multi-Environment Deployment Example

### Scenario: Deploy to Dev, Staging, and Prod

```
┌─────────────────────────────────────────────────────┐
│           Shared Code (One CodeBase)                │
├─────────────────────────────────────────────────────┤
│ ├─ infra/cloudformation/*.yaml (parameterized)     │
│ ├─ aws-lambda/auth/*.js (environment-agnostic)     │
│ ├─ aws-lambda/contact/*.js (environment-agnostic)  │
│ └─ public/runtime-config.js (updated per env)      │
└──┬──────────────────────────────────────────────────┘
   │
   ├─────────────────────────────────────────────────┐
   │                                                  │
   ▼ Deploy Stack 07 with                           ▼
   LambdaCodeSourceEnv=dev                          (generates dev ZIPs)
   │
   ├─ growksh-website-lambda-code-dev-ap-south-1
   │  ├─ auth/signup-dev.zip
   │  ├─ auth/custom-message-dev.zip
   │  └─ ... (other dev ZIPs)
   │
   ├─────────────────────────────────────────────────┐
   │                                                  │
   ▼ Deploy to Dev                                   ▼
   Environment=dev                                    ▼ Deploy to Staging
   LambdaCodeSourceEnv=dev                           Environment=staging
   │                                                  LambdaCodeSourceEnv=dev
   │                                                  │
   ├─ Stack 02: growksh-website-cognito-dev         ├─ Stack 02: growksh-website-cognito-staging
   │            (ap-south-1_5ltaHHFNd)              │            (ap-south-1_xxxxx)
   │                                                  │
   ├─ Stack 07: growksh-website-cognito-            ├─ Stack 07: growksh-website-cognito-
   │            lambdas-dev                          │            lambdas-staging
   │            Pulls: dev ZIPs ✓                    │            Pulls: dev ZIPs ✓
   │                                                  │
   ├─ Stack 08: growksh-website-api-lambdas-dev    ├─ Stack 08: growksh-website-api-lambdas-
   │            Pulls: dev ZIPs ✓                    │            staging
   │                                                  │            Pulls: dev ZIPs ✓
   │                                                  │
   └─ Stack 06: growksh-website-api-dev             └─ Stack 06: growksh-website-api-staging

        ▼ Deploy to Prod
           Environment=prod
           LambdaCodeSourceEnv=dev

        ├─ Stack 02: growksh-website-cognito-prod
        │            (ap-south-1_J0S26HesM)
        │
        ├─ Stack 07: growksh-website-cognito-lambdas-prod
        │            Pulls: dev ZIPs ✓
        │
        ├─ Stack 08: growksh-website-api-lambdas-prod
        │            Pulls: dev ZIPs ✓
        │
        └─ Stack 06: growksh-website-api-prod
```

**Key Insight**: Same code (dev ZIPs) deployed to multiple environments by changing only the `Environment` parameter!

---

## Constants Matrix

```
                 Hardcoded   Parameterized   Auto-Generated   Environment-Specific
┌─────────────────────────────────────────────────────────────────────────────────┐
│ AWS Account ID      ❌          ❌                ✅                  ❌           │
│ AWS Region          ❌          ❌                ✅                  ✅           │
│ Environment         ❌          ✅                ❌                  ✅           │
│ SES Email           ✅ (code)   ✅                ❌                  ❌           │
│ Verify Secret       ❌          ✅                ❌                  ❌           │
│ Verify Base URL     ❌          ✅                ❌                  ✅           │
│ Lambda Code Bucket  ❌          ✅                ✅ (if not given)   ✅           │
│ Lambda Code Env     ❌          ✅                ❌                  ⚠️ (shared)   │
│ Cognito Pool ID     ❌          ❌                ✅                  ✅           │
│ Cognito Client ID   ❌          ❌                ✅                  ✅           │
│ API Endpoint        ❌          ❌                ✅                  ✅           │
│ Lambda ARNs         ❌ (old)    ❌ (new uses)    ✅ (via export)     ✅           │
└─────────────────────────────────────────────────────────────────────────────────┘

Legend:
✅ = Correct approach / How it's done now
❌ = Wrong approach / Legacy method
⚠️ = Can be shared across environments
```

---

## Environment-Specific Configuration Checklist

### For Each Environment (dev, staging, prod):

```
ENVIRONMENT = prod
REGION = us-east-1

1. AWS CLI Configuration
   ├─ Credentials: [prod account profile]
   └─ Region: us-east-1

2. SES Setup
   └─ aws ses verify-email-identity --email noreply@growksh.com

3. Generate Secrets
   ├─ VerifySecret: <random 32+ chars>
   └─ Record in secure location

4. Define Frontend
   ├─ Domain: growksh.com
   ├─ CloudFront URL: https://growksh.com
   └─ Verify Base URL: https://growksh.com/auth/verify-email

5. Package Lambda Code
   ├─ Package as: dev (or environment-specific)
   ├─ Upload to S3: growksh-website-lambda-code-dev-us-east-1
   └─ Verify ZIPs exist:
      ├─ auth/signup-dev.zip ✓
      ├─ auth/custom-message-dev.zip ✓
      └─ ... etc

6. Deploy Stacks
   ├─ Stack 02 (EnableTriggers=false)
   ├─ Stack 07 (LambdaCodeSourceEnv=dev)
   ├─ Stack 02 (EnableTriggers=true)
   ├─ Stack 08
   └─ Stack 06

7. Capture Outputs
   ├─ Cognito Pool ID: ap-south-1_xxxxx
   ├─ Cognito Client ID: xxxxx
   └─ API Endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/prod

8. Update Runtime Config
   ├─ File: public/runtime-config.js
   ├─ VITE_COGNITO_USER_POOL_ID: from output
   ├─ VITE_COGNITO_CLIENT_ID: from output
   ├─ VITE_API_URL: from output
   └─ VITE_AWS_REGION: us-east-1

9. Deploy Frontend
   ├─ Rebuild: npm run build
   ├─ Deploy to CloudFront
   └─ Test signup flow
```

