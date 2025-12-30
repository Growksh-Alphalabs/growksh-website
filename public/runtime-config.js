// Runtime configuration loaded before the React app.
//
// This file is copied as-is to the deployed site (e.g., S3/CloudFront).
// Update it after each deployment to point the frontend at the new Cognito
// User Pool and App Client without rebuilding the app bundle.
//
// AUTOMATED: VITE_API_URL is automatically populated by the deployment script.
// MANUAL: Update VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID if needed.

window.__GROWKSH_RUNTIME_CONFIG__ = {
  // Cognito User Pool (example: ap-south-1_AbCdEfGhI)
  // Auto-updated by deployment script from CloudFormation exports
  VITE_COGNITO_USER_POOL_ID: 'ap-south-1_eZJJn3M9A',

  // Cognito App Client ID (no secret)
  // Auto-updated by deployment script from CloudFormation exports
  VITE_COGNITO_CLIENT_ID: '2uaba43qlqlnach4jdbk3mm29p',

  // Backend API base URL (API Gateway invoke URL)
  // AUTO-POPULATED by deployment script from CloudFormation exports
  // For local dev, this falls back to .env.local VITE_API_URL
  VITE_API_URL: 'https://b5230xgtzl.execute-api.ap-south-1.amazonaws.com/Prod',

  // Optional: AWS region override
  VITE_AWS_REGION: 'ap-south-1',

  // Toggle fake auth ("1" or "true" to enable)
  VITE_USE_FAKE_AUTH: '1',
};

try {
  console.info('[Growksh] runtime-config loaded', Object.keys(window.__GROWKSH_RUNTIME_CONFIG__ || {}));
} catch {}
