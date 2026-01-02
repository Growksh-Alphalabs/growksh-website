/**
 * Check User Lambda Function
 * Returns whether a user exists in Cognito.
 */

const { CognitoIdentityProviderClient, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

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

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'POST') {
      return response(405, { error: 'Method not allowed' });
    }

    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      return response(500, { error: 'COGNITO_USER_POOL_ID is not configured' });
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

    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

    try {
      const res = await client.send(
        new AdminGetUserCommand({
          UserPoolId: userPoolId,
          Username: email,
        })
      );

      const attrs = Array.isArray(res?.UserAttributes) ? res.UserAttributes : [];
      const emailVerifiedAttr = attrs.find((a) => a && a.Name === 'email_verified');
      const email_verified_raw =
        emailVerifiedAttr && typeof emailVerifiedAttr.Value === 'string'
          ? emailVerifiedAttr.Value
          : undefined;
      const email_verified =
        typeof email_verified_raw === 'string'
          ? email_verified_raw.trim().toLowerCase()
          : undefined;

      return response(200, {
        exists: true,
        ...(email_verified ? { email_verified } : {}),
      });
    } catch (e) {
      if (e && (e.name === 'UserNotFoundException' || e.__type === 'UserNotFoundException')) {
        return response(200, { exists: false });
      }
      console.error('check-user error:', e);
      return response(500, { error: e.message || 'Internal server error' });
    }
  } catch (e) {
    console.error('check-user handler error:', e);
    return response(500, { error: e.message || 'Internal server error' });
  }
};
