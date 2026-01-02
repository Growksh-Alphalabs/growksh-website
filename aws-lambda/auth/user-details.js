/**
 * User Details Lambda
 *
 * Returns comprehensive user status/details for the currently authenticated user.
 *
 * Auth: expects Authorization: Bearer <AccessToken>
 *
 * Data sources:
 * - Cognito GetUser (via AccessToken): attributes + MFA settings
 * - Cognito AdminGetUser (via Username from GetUser): status flags (Enabled/UserStatus) + timestamps
 */

const {
  CognitoIdentityProviderClient,
  GetUserCommand,
  AdminGetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

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
  };
}

function getBearerToken(headers) {
  const authHeader =
    headers?.Authorization || headers?.authorization || headers?.AUTHORIZATION;
  if (!authHeader || typeof authHeader !== 'string') return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  return match[1].trim();
}

function attrsToMap(attrs) {
  const map = {};
  (attrs || []).forEach((a) => {
    if (a && a.Name) map[a.Name] = a.Value;
  });
  return map;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return response(200, { message: 'OK' });
    }

    if (event.httpMethod !== 'GET') {
      return response(405, { error: 'Method not allowed' });
    }

    const accessToken = getBearerToken(event.headers || {});
    if (!accessToken) {
      return response(401, { authenticated: false, error: 'Missing access token' });
    }

    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      return response(500, { error: 'COGNITO_USER_POOL_ID is not configured' });
    }

    const client = new CognitoIdentityProviderClient({});

    // 1) GetUser: uses AccessToken (best for "current user")
    const getUserRes = await client.send(
      new GetUserCommand({
        AccessToken: accessToken,
      })
    );

    const username = getUserRes?.Username;
    const getUserAttrs = attrsToMap(getUserRes?.UserAttributes);

    // 2) AdminGetUser: fetches account-level status fields
    let adminRes = null;
    if (username) {
      adminRes = await client.send(
        new AdminGetUserCommand({
          UserPoolId: userPoolId,
          Username: username,
        })
      );
    }

    const adminAttrs = attrsToMap(adminRes?.UserAttributes);
    const mergedAttrs = {
      ...getUserAttrs,
      ...adminAttrs,
    };

    const email = mergedAttrs.email;
    const email_verified = mergedAttrs.email_verified || 'false';

    return response(200, {
      authenticated: true,
      username: username || adminRes?.Username,
      email,
      email_verified,

      // AdminGetUser status fields
      enabled: adminRes?.Enabled,
      user_status: adminRes?.UserStatus,
      user_create_date: adminRes?.UserCreateDate,
      user_last_modified_date: adminRes?.UserLastModifiedDate,

      // GetUser MFA fields
      preferred_mfa_setting: getUserRes?.PreferredMfaSetting,
      user_mfa_setting_list: getUserRes?.UserMFASettingList,
      mfa_options: getUserRes?.MFAOptions,

      // Full attribute map for debugging/clients
      attributes: mergedAttrs,
    });
  } catch (e) {
    // Normalize common auth errors
    if (
      e?.name === 'NotAuthorizedException' ||
      e?.__type === 'NotAuthorizedException'
    ) {
      return response(401, { authenticated: false, error: 'Not authorized' });
    }

    console.error('user-details error:', e);
    return response(500, { error: e?.message || 'Internal server error' });
  }
};
