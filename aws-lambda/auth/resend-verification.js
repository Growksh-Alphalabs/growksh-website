/**
 * Resend Verification Link Lambda Function
 * Sends the magic-link verification email again (for users who exist but are not yet email_verified).
 */

const nodeCrypto = require('crypto');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json',
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
    isBase64Encoded: false,
  };
}

function parseJsonBody(event) {
  if (!event || event.body == null) return {};

  let raw = event.body;
  if (event.isBase64Encoded && typeof raw === 'string') {
    raw = Buffer.from(raw, 'base64').toString('utf8');
  }

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON body');
    }
  }

  if (typeof raw === 'object') return raw;
  return {};
}

function buildMagicLink(email, verifyBaseUrl, verifySecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const token = nodeCrypto
    .createHmac('sha256', verifySecret)
    .update(`${email}:${timestamp}`)
    .digest('hex');

  const link = `${verifyBaseUrl}?email=${encodeURIComponent(email)}&token=${token}&t=${timestamp}`;
  return link;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'POST') {
      return response(405, { error: 'Method not allowed' });
    }

    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const verifySecret = process.env.VERIFY_SECRET;
    const verifyBaseUrl = process.env.VERIFY_BASE_URL;
    const fromEmail = process.env.SES_SOURCE_EMAIL;

    if (!userPoolId) {
      return response(500, { error: 'COGNITO_USER_POOL_ID is not configured' });
    }

    if (!verifySecret || !verifyBaseUrl) {
      return response(500, { error: 'VERIFY_SECRET / VERIFY_BASE_URL are not configured' });
    }

    if (!fromEmail) {
      return response(500, { error: 'SES_SOURCE_EMAIL is not configured' });
    }

    let body;
    try {
      body = parseJsonBody(event);
    } catch (e) {
      return response(400, { error: e.message || 'Invalid request body' });
    }

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (!email) {
      return response(400, { error: 'Email is required' });
    }

    const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

    let user;
    try {
      user = await cognito.send(
        new AdminGetUserCommand({
          UserPoolId: userPoolId,
          Username: email,
        })
      );
    } catch (e) {
      if (e && (e.name === 'UserNotFoundException' || e.__type === 'UserNotFoundException')) {
        return response(200, { sent: false, exists: false, message: 'User not found' });
      }
      console.error('resend-verification AdminGetUser error:', e);
      return response(500, { error: e.message || 'Internal server error' });
    }

    const attrs = Array.isArray(user?.UserAttributes) ? user.UserAttributes : [];
    const emailVerifiedAttr = attrs.find((a) => a && a.Name === 'email_verified');
    const email_verified = (emailVerifiedAttr && emailVerifiedAttr.Value) || 'false';

    if (email_verified === 'true') {
      return response(200, { sent: false, exists: true, email_verified, message: 'Email is already verified' });
    }

    const verificationLink = buildMagicLink(email, verifyBaseUrl, verifySecret);

    const ses = new SESClient({ region: process.env.AWS_REGION });
    await ses.send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: 'Verify your email for Growksh' },
          Body: {
            Text: {
              Data: `Hello,\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nGrowksh Team`,
            },
          },
        },
      })
    );

    return response(200, { sent: true, exists: true, email_verified: 'false', message: 'Verification link sent' });
  } catch (e) {
    console.error('resend-verification handler error:', e);
    return response(500, { error: e.message || 'Internal server error' });
  }
};
