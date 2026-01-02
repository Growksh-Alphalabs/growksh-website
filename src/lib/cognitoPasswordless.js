import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider'

// instantiate client once for reuse; region will be picked from env if available
const REGION = (
  (typeof window !== 'undefined' && window.__GROWKSH_RUNTIME_CONFIG__ && window.__GROWKSH_RUNTIME_CONFIG__.VITE_AWS_REGION) ||
  import.meta.env.VITE_AWS_REGION ||
  'ap-south-1'
)
const client = new CognitoIdentityProviderClient({ region: REGION })

/**
 * Initiate a passwordless sign-in using CUSTOM_AUTH.
 * Returns the `Session` string which must be sent with the challenge response.
 */
export async function initiatePasswordless({ username, clientId }) {
  if (!username) throw new Error('username required')
  if (!clientId) throw new Error('clientId required')

  const cmd = new InitiateAuthCommand({
    AuthFlow: 'CUSTOM_AUTH',
    ClientId: clientId,
    AuthParameters: { USERNAME: username }
  })

  const res = await client.send(cmd)
  return res.Session
}

/**
 * Answer the custom challenge with the provided OTP/code.
 * On success Cognito will return AuthenticationResult which includes tokens.
 */
export async function answerCustomChallenge({ session, username, clientId, otpCode }) {
  if (!session) throw new Error('session required')
  if (!username) throw new Error('username required')
  if (!clientId) throw new Error('clientId required')
  if (!otpCode) throw new Error('otpCode required')

  const cmd = new RespondToAuthChallengeCommand({
    ChallengeName: 'CUSTOM_CHALLENGE',
    ClientId: clientId,
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      ANSWER: otpCode
    }
  })

  const res = await client.send(cmd)
  return res
}
