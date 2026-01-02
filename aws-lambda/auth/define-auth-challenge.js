/**
 * Define Auth Challenge Lambda Trigger
 * Controls the Cognito CUSTOM_AUTH challenge flow.
 *
 * Passwordless OTP flow:
 * - If client has not provided an answer yet, ask for CUSTOM_CHALLENGE
 * - If answer is correct, issue tokens
 * - If answer is wrong too many times, fail authentication
 */

const { CognitoIdentityProviderClient, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

function normalizeBoolString(value) {
  if (typeof value !== 'string') return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'true') return 'true';
  if (v === 'false') return 'false';
  return undefined;
}

async function getEmailVerifiedFallback({ userPoolId, username }) {
  if (!userPoolId || !username) return undefined;
  try {
    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    const res = await client.send(
      new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: username,
      })
    );

    const attrs = Array.isArray(res?.UserAttributes) ? res.UserAttributes : [];
    const attr = attrs.find((a) => a && a.Name === 'email_verified');
    return normalizeBoolString(attr?.Value);
  } catch (e) {
    console.error('DefineAuthChallenge: AdminGetUser failed (non-fatal):', e);
    return undefined;
  }
}

exports.handler = async (event) => {
  console.log('DefineAuthChallenge event:', JSON.stringify(event, null, 2));

  const session = event.request.session || [];

  // If the user has successfully answered the custom challenge, Cognito will
  // include a session entry with challengeResult=true.
  const lastChallenge = session.length ? session[session.length - 1] : null;

  if (lastChallenge && lastChallenge.challengeName === 'CUSTOM_CHALLENGE' && lastChallenge.challengeResult === true) {
    // Enforce verified email before issuing tokens.
    // Cognito sometimes omits email_verified in trigger userAttributes, so we fall back to AdminGetUser.
    const inEvent = normalizeBoolString(event?.request?.userAttributes?.email_verified);

    let emailVerified = inEvent;
    if (!emailVerified) {
      emailVerified = await getEmailVerifiedFallback({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        username: event?.userName,
      });
    }

    if (emailVerified !== 'true') {
      console.log('DefineAuthChallenge: blocking token issuance (email not verified).', {
        userName: event?.userName,
        emailVerified,
      });
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
      return event;
    }

    event.response.issueTokens = true;
    event.response.failAuthentication = false;
    return event;
  }

  // Limit retries to reduce brute force risk
  const attempts = session.filter((s) => s.challengeName === 'CUSTOM_CHALLENGE').length;
  const maxAttempts = 3;

  if (attempts >= maxAttempts) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    return event;
  }

  // Ask Cognito to present a custom challenge (OTP)
  event.response.issueTokens = false;
  event.response.failAuthentication = false;
  event.response.challengeName = 'CUSTOM_CHALLENGE';

  return event;
};
