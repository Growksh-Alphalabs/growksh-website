/**
 * Email Verification Lambda Function
 * Handles verification of email via magic link
 */

const crypto = require('crypto');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json',
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  console.log('Verify Email event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { message: 'OK' });
  }

  try {
    const queryParams = event.queryStringParameters || {};
    const { email, token, t } = queryParams;

    // Validate required parameters
    if (!email || !token || !t) {
      return response(400, {
        error: 'Missing required parameters: email, token, or timestamp',
      });
    }

    console.log('Verifying email:', email);

    // Verify token signature
    const secret = process.env.VERIFY_SECRET;
    const expectedToken = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${t}`)
      .digest('hex');

    if (token !== expectedToken) {
      console.log('Token mismatch for email:', email);
      return response(401, {
        error: 'Invalid verification token',
      });
    }

    // Check token expiry (valid for 24 hours)
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - parseInt(t);
    const maxAge = 24 * 60 * 60; // 24 hours

    if (tokenAge > maxAge) {
      console.log('Token expired for email:', email, 'age:', tokenAge);
      return response(401, {
        error: 'Verification link has expired. Please sign up again.',
      });
    }

    console.log('Email verified successfully:', email);

    return response(200, {
      message: 'Email verified successfully',
      email,
      redirect: `/login?email=${encodeURIComponent(email)}&verified=1`,
    });
  } catch (error) {
    console.error('Error in email verification:', error);
    return response(500, {
      error: error.message || 'Internal server error',
    });
  }
};
