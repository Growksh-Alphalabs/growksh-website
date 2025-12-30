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

   For deployed environments (S3/CloudFront), the app also supports runtime config via `public/runtime-config.js`.
   You can update that file after each deployment (e.g., from CloudFormation outputs) without rebuilding the frontend bundle.

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
- **Auth Pages:** Signup, Login (unified), OTP verification, Email verification
- **Admin Panel:** Protected admin dashboard with role-based access control
- **State Management:** AuthContext with Cognito integration
- **Styling:** Tailwind CSS with custom theme

### Backend (AWS Lambda + Cognito)
- **9 Lambda Functions:**
  - `pre-sign-up.js` - Auto-verify users on signup
  - `custom-message.js` - Customize Cognito emails
  - `define-auth-challenge.js` - Define CUSTOM_AUTH flow
  - `create-auth-challenge.js` - Generate 6-digit OTP
  - `verify-auth-challenge.js` - Validate OTP
  - `signup.js` - Handle signup endpoint
  - `verify-email.js` - Verify email with HMAC tokens
  - `post-confirmation.js` - User post-signup setup
  - `check-admin.js` - Verify admin group membership

- **Database:** DynamoDB table for OTP storage (10-min TTL)
- **Email:** SES for OTP and verification email delivery

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
- `infra/sam-template.yaml` - AWS infrastructure as code
- `docs/` - Comprehensive documentation

## Deployment

### Frontend (React)
- Build artifacts deployed to S3 + CloudFront
- GitHub Actions workflow: `.github/workflows/deploy-to-s3.yml`

### Backend (Lambda + Cognito)
- Infrastructure managed by SAM template
- GitHub Actions workflow: `.github/workflows/deploy-sam.yml`
- Deploy with: `sam deploy` in `infra/` folder

## Documentation

Comprehensive documentation available in `/docs/`:
- `QUICKSTART.md` - Getting started guide
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `AUTH_IMPLEMENTATION.md` - Technical implementation details
- `ADMIN_SETUP.md` - Admin user setup and configuration
- `PROJECT_STRUCTURE.md` - Project file organization

## Support

For detailed setup instructions and troubleshooting, see the `/docs/` folder.
