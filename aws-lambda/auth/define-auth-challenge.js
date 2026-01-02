/**
 * Define Auth Challenge Lambda Trigger
 * Controls the Cognito CUSTOM_AUTH challenge flow.
 *
 * Passwordless OTP flow:
 * - If client has not provided an answer yet, ask for CUSTOM_CHALLENGE
 * - If answer is correct, issue tokens
 * - If answer is wrong too many times, fail authentication
 */

exports.handler = async (event) => {
  console.log('DefineAuthChallenge event:', JSON.stringify(event, null, 2));

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
