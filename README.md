# Growksh Website

A full-stack React + Vite application with passwordless authentication powered by AWS Cognito, Lambda, and DynamoDB.

## Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with Cognito User Pool, Lambda, DynamoDB, SES, and API Gateway configured
- Environment variables configured in `.env.local`

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env.local` with:
   ```
   VITE_COGNITO_USER_POOL_ID=ap-south-1_xxxxx
   VITE_COGNITO_CLIENT_ID=xxxxx
   VITE_API_URL=https://your-api-gateway-id.execute-api.ap-south-1.amazonaws.com/Prod
   VITE_AWS_REGION=ap-south-1
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture

### Frontend (React + Vite)
- **Auth Pages:** Signup, Login (passwordless OTP), Email verification, Admin login
- **Admin Panel:** Protected admin dashboard with role-based access control
- **State Management:** AuthContext with Cognito integration
- **Styling:** Tailwind CSS with custom theme
- **Deployment:** S3 + CloudFront CDN with Route53 DNS management

### Backend (AWS Lambda + Cognito)
- **8 Lambda Functions:**
  - `pre-sign-up.js` - Auto-verify users on signup
  - `custom-message.js` - Customize Cognito emails
  - `define-auth-challenge.js` - Define CUSTOM_AUTH flow
  - `create-auth-challenge.js` - Generate 6-digit OTP
  - `verify-auth-challenge.js` - Validate OTP
  - `signup.js` - Handle signup endpoint
  - `verify-email.js` - Verify email with HMAC tokens
  - `post-confirmation.js` - User post-signup setup

- **Infrastructure:** 9 CloudFormation stacks
  - 00-iam-stack: IAM roles and policies
  - 01-database-stack: DynamoDB tables
  - 02-cognito-stack: Cognito User Pool
  - 03-waf-stack: AWS WAFv2 protection
  - 04-lambda-code-bucket-stack: Lambda code S3 bucket
  - 05-storage-cdn-stack: S3 + CloudFront + SSL
  - 06-api-gateway-stack: REST API endpoints
  - 07-cognito-lambdas-stack: Auth Lambdas
  - 08-api-lambdas-stack: API Lambdas

- **Database:** DynamoDB tables for OTP storage (10-min TTL) and contacts
- **Email:** SES for OTP and verification email delivery
- **DNS:** Route53 for custom domain management (AWS CLI UPSERT)

## Key Features

### User Authentication
- **Passwordless OTP Flow:** 6-digit codes sent via email
- **Email Verification:** HMAC-signed links (24-hr expiry)
- **Unified Login:** Auto-detects if email is registered
- **Session Management:** Token storage in localStorage with validation

### Admin Features
- **Protected Routes:** Admin dashboard accessible only to admin group members
- **Role-Based Access:** Cognito groups integration
- **OTP Login:** Same passwordless flow as regular users
- **Admin Check:** Pre-verification before OTP is sent

## Important Files

- `src/context/AuthContext.jsx` - Global auth state and functions
- `src/lib/cognito.js` - AWS Cognito integration
- `src/components/Auth/` - Auth components (Signup, Login, AdminLogin, VerifyEmail)
- `src/components/common/ProtectedRoute.jsx` - Route protection wrapper
- `infra/cloudformation/` - 9 modular CloudFormation templates
- `infra/scripts/deploy-stacks.sh` - Deployment orchestration
- `docs/` - Comprehensive documentation

## Deployment

### Automated Deployment (GitHub Actions)

**Feature Branches** (`feature/*`)
- Automatic deployment to ephemeral environment
- Auto-cleanup on PR close
- Workflow: `.github/workflows/deploy-ephemeral.yaml`

**Development** (`develop` branch)
- Automatic deployment to dev environment
- Workflow: `.github/workflows/deploy-develop.yaml`
- Duration: 10-15 minutes

**Production** (`main` branch)
- Requires manual approval in GitHub Actions
- Workflow: `.github/workflows/deploy-prod.yaml`
- Creates GitHub release on successful deployment
- Duration: 10-15 minutes (after approval)

### Manual Deployment

```bash
# Deploy to development
./infra/scripts/deploy-stacks.sh dev

# Deploy to production
./infra/scripts/deploy-stacks.sh prod

# Deploy ephemeral environment
./infra/scripts/deploy-stacks.sh feature-branch-name
```

See `docs/DEPLOYMENT_RUNBOOK.md` for complete deployment guide.

## Documentation

Comprehensive documentation available in `/docs/`:
- `QUICKSTART.md` - Getting started guide
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `AUTH_IMPLEMENTATION.md` - Technical implementation details
- `ADMIN_SETUP.md` - Admin user setup and configuration
- `PROJECT_STRUCTURE.md` - Project file organization

## Support

For detailed setup instructions and troubleshooting, see the `/docs/` folder.
