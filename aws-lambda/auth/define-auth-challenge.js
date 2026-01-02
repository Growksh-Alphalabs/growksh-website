/**
 * Define Auth Challenge Lambda Trigger
 * Controls the Cognito CUSTOM_AUTH challenge flow.
 *
 * Passwordless OTP flow:
 * - If client has not provided an answer yet, ask for CUSTOM_CHALLENGE
 * - If answer is correct, issue tokens
 * - If answer is wrong too many times, fail authentication
 */

const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

let cognitoClient = null;

function getCognitoClient() {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  }
  return cognitoClient;
}

function normalizeBoolString(value) {
  if (value == null) return '';
  return String(value).trim().toLowerCase();
}

async function fetchEmailVerifiedFromCognito(email) {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  if (!userPoolId || !email) return '';

  try {
    const client = getCognitoClient();
    const res = await client.send(
      new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: email,
      })
    );
    const attrs = Array.isArray(res?.UserAttributes) ? res.UserAttributes : [];
    const emailVerifiedAttr = attrs.find((a) => a && a.Name === 'email_verified');
    return normalizeBoolString(emailVerifiedAttr && emailVerifiedAttr.Value);
  } catch (e) {
    console.error('DefineAuthChallenge: AdminGetUser failed:', e);
    return '';
  }
}

exports.handler = async (event) => {
  console.log('DefineAuthChallenge event:', JSON.stringify(event, null, 2));

  // This handler is intended for Cognito triggers. If invoked with a different event
  // shape (e.g., API Gateway), do nothing rather than throwing.
  if (!event || !event.request || !event.response) {
    console.log('DefineAuthChallenge: unsupported event shape (skipping)');
    return event;
  }

  const email = event?.request?.userAttributes?.email;
  let emailVerified = normalizeBoolString(event?.request?.userAttributes?.email_verified);

  // Some Cognito trigger events may omit email_verified. In that case, look it up.
  if (!emailVerified) {
    emailVerified = await fetchEmailVerifiedFromCognito(email);
  }

  if (emailVerified !== 'true') {
    console.log('Blocking auth: email not verified');
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    return event;
  }

  const session = event.request.session || [];

  // If the user has successfully answered the custom challenge, Cognito will
  // include a session entry with challengeResult=true.
  const lastChallenge = session.length ? session[session.length - 1] : null;

  if (lastChallenge && lastChallenge.challengeName === 'CUSTOM_CHALLENGE' && lastChallenge.challengeResult === true) {
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
