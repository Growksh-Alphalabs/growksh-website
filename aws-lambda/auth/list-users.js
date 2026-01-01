/**
 * List Users Lambda Function (Admin-only)
 * Returns a small list of Cognito users with email + email_verified.
 */

const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const { CognitoJwtVerifier } = require('aws-jwt-verify');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
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

function getBearerToken(event) {
  const raw =
    event?.headers?.Authorization ||
    event?.headers?.authorization ||
    event?.multiValueHeaders?.Authorization?.[0] ||
    event?.multiValueHeaders?.authorization?.[0] ||
    '';

  const trimmed = (raw || '').toString().trim();
  if (!trimmed) return '';
  if (trimmed.toLowerCase().startsWith('bearer ')) return trimmed.slice(7).trim();
  return trimmed;
}

async function requireAdmin(token) {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (!userPoolId || !clientId) {
    throw new Error('COGNITO_USER_POOL_ID / COGNITO_CLIENT_ID are not configured');
  }

  const verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'id',
    clientId,
  });

  const payload = await verifier.verify(token);
  const groups = payload['cognito:groups'] || [];
  const isAdmin = Array.isArray(groups) && groups.includes('admin');

  if (!isAdmin) {
    const err = new Error('Not authorized');
    err.statusCode = 403;
    throw err;
  }
}

function pickAttr(attrs, name) {
  const a = Array.isArray(attrs) ? attrs.find((x) => x && x.Name === name) : null;
  return a && a.Value != null ? String(a.Value) : '';
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'GET') {
      return response(405, { error: 'Method not allowed' });
    }

    const token = getBearerToken(event);
    if (!token) {
      return response(401, { error: 'Missing Authorization bearer token' });
    }

    await requireAdmin(token);

    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      return response(500, { error: 'COGNITO_USER_POOL_ID is not configured' });
    }

    const limitRaw = event?.queryStringParameters?.limit;
    const limit = Math.min(Math.max(parseInt(limitRaw || '25', 10) || 25, 1), 60);

    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    const res = await client.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: limit,
      })
    );

    const users = Array.isArray(res?.Users) ? res.Users : [];

    const items = users.map((u) => {
      const attrs = u.Attributes || [];
      const email = pickAttr(attrs, 'email');
      const email_verified = pickAttr(attrs, 'email_verified') || 'false';
      return {
        username: u.Username,
        email,
        email_verified,
        enabled: !!u.Enabled,
        status: u.UserStatus,
      };
    });

    return response(200, { users: items });
  } catch (e) {
    const statusCode = e && e.statusCode ? e.statusCode : 500;
    console.error('list-users error:', e);
    return response(statusCode, { error: e.message || 'Internal server error' });
  }
};
