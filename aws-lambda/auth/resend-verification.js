/**
 * Resend Verification (Magic Link) Lambda
 *
 * POST /auth/resend-verification
 * Body: { email: string }
 *
 * Sends a magic-link verification email ONLY if the user exists and email_verified != true.
 */

const nodeCrypto = require('crypto');
const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

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

function attrValue(attrs, name) {
  if (!Array.isArray(attrs)) return undefined;
  const a = attrs.find((x) => x && x.Name === name);
  return a && typeof a.Value === 'string' ? a.Value : undefined;
}

function normalizeBoolString(value) {
  if (typeof value !== 'string') return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'true') return 'true';
  if (v === 'false') return 'false';
  return undefined;
}

function buildMagicLink(email, verifyBaseUrl, verifySecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const token = nodeCrypto
    .createHmac('sha256', verifySecret)
    .update(`${email}:${timestamp}`)
    .digest('hex');

  return `${verifyBaseUrl}?email=${encodeURIComponent(email)}&token=${token}&t=${timestamp}`;
}

let sesClient;
function getSes() {
  if (!sesClient) {
    sesClient = new SESClient({ region: process.env.AWS_REGION });
  }
  return sesClient;
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
    const sourceEmail = process.env.SES_SOURCE_EMAIL;
    const verifyBaseUrl = process.env.VERIFY_BASE_URL;
    const verifySecret = process.env.VERIFY_SECRET;

    if (!userPoolId) return response(500, { error: 'COGNITO_USER_POOL_ID is not configured' });
    if (!sourceEmail) return response(500, { error: 'SES_SOURCE_EMAIL is not configured' });
    if (!verifyBaseUrl) return response(500, { error: 'VERIFY_BASE_URL is not configured' });
    if (!verifySecret) return response(500, { error: 'VERIFY_SECRET is not configured' });

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
      const name = e && (e.name || e.__type);
      if (name === 'UserNotFoundException') {
        // Do not leak too much detail.
        return response(200, { ok: true, sent: false });
      }
      console.error('resend-verification AdminGetUser error:', e);
      return response(500, { error: e.message || 'Internal server error' });
    }

    const emailVerified = normalizeBoolString(attrValue(user?.UserAttributes, 'email_verified'));
    if (emailVerified === 'true') {
      return response(200, { ok: true, sent: false, alreadyVerified: true });
    }

    const name = attrValue(user?.UserAttributes, 'name') || (email.includes('@') ? email.split('@')[0] : 'User');
    const link = buildMagicLink(email, verifyBaseUrl, verifySecret);

    const subject = 'Verify your email for Growksh';
    const text = `Hello ${name},\n\nTo sign in to Growksh, please verify your email by clicking the link below:\n\n${link}\n\nThis link will expire in 24 hours.\n\nBest regards,\nGrowksh Team\n`;

    try {
      const ses = getSes();
      await ses.send(
        new SendEmailCommand({
          Source: sourceEmail,
          Destination: { ToAddresses: [email] },
          Message: {
            Subject: { Data: subject },
            Body: { Text: { Data: text } },
          },
        })
      );
    } catch (e) {
      console.error('resend-verification SES send error:', e);
      return response(500, { error: 'Failed to send verification email' });
    }

    return response(200, { ok: true, sent: true });
  } catch (e) {
    console.error('resend-verification handler error:', e);
    return response(500, { error: e.message || 'Internal server error' });
  }
};
