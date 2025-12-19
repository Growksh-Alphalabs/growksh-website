const AWS = require('aws-sdk');
const crypto = require('crypto');

const cognito = new AWS.CognitoIdentityServiceProvider();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json'
};

function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...headers },
    body: JSON.stringify(body)
  };
}

function htmlResponse(statusCode, html) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    },
    body: html
  };
}

// Verify the token signature
function verifyToken(token) {
  const secret = process.env.VERIFY_SECRET;
  if (!secret) {
    throw new Error('VERIFY_SECRET not configured');
  }

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) {
    throw new Error('Invalid token format');
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  // Decode payload
  const payloadStr = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  const payload = JSON.parse(payloadStr);

  // Check expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token has expired');
  }

  return payload;
}

exports.handler = async (event) => {
  try {
    console.log('verify-email invoked');

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return response(204, {});
    }

    // Get token from query parameters
    const queryParams = event.queryStringParameters || {};
    const token = queryParams.token;

    if (!token) {
      return htmlResponse(400, `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification Failed</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                .error { color: #dc3545; }
                .success { color: #28a745; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Email Verification Failed</h1>
                <p>Missing verification token. Please use the link from your verification email.</p>
            </div>
        </body>
        </html>
      `);
    }

    // Verify token
    let payload;
    try {
      payload = verifyToken(token);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return htmlResponse(400, `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification Failed</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                .error { color: #dc3545; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Email Verification Failed</h1>
                <p>Invalid or expired verification link. Please request a new verification email.</p>
            </div>
        </body>
        </html>
      `);
    }

    const { email } = payload;
    const userPoolId = process.env.USER_POOL_ID;

    // Confirm user signup
    await cognito.adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: email
    }).promise();

    // Update email_verified attribute
    await cognito.adminUpdateUserAttributes({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email_verified', Value: 'true' }
      ]
    }).promise();

    console.log(`Email verified for user: ${email}`);

    return htmlResponse(200, `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Email Verified Successfully</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .container { max-width: 600px; margin: 0 auto; }
              .success { color: #28a745; }
              .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #007bff; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 4px; 
                  margin-top: 20px; 
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1 class="success">Email Verified Successfully!</h1>
              <p>Your email address has been verified. You can now log in to your account.</p>
              <p>
                  <a href="/auth/login" class="button">Go to Login</a>
              </p>
          </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error('Email verification error:', err);

    let errorMessage = 'Email verification failed. Please try again.';
    let errorTitle = 'Verification Failed';

    if (err.code === 'UserNotFoundException') {
      errorMessage = 'User not found. The account may have been deleted.';
    } else if (err.code === 'ExpiredCodeException') {
      errorMessage = 'Verification link has expired. Please request a new one.';
    } else if (err.code === 'CodeMismatchException') {
      errorMessage = 'Invalid verification code.';
    } else if (err.code === 'NotAuthorizedException') {
      errorMessage = 'Email is already verified.';
      errorTitle = 'Already Verified';
    }

    return htmlResponse(400, `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${errorTitle}</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .container { max-width: 600px; margin: 0 auto; }
              .error { color: #dc3545; }
              .info { color: #17a2b8; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1 class="${err.code === 'NotAuthorizedException' ? 'info' : 'error'}">${errorTitle}</h1>
              <p>${errorMessage}</p>
          </div>
      </body>
      </html>
    `);
  }
};