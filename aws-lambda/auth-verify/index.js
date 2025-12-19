const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json'
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  }
}

exports.handler = async (event) => {
  try {
    console.log('auth-verify invoked')

    if (event.httpMethod === 'OPTIONS') return response(204, {})

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    console.log('Request body:', body)
    const { email, session, answer } = body || {}

    if (!email || !answer) {
      return response(400, { message: 'Missing email or answer', code: 'MISSING_PARAMS' })
    }

    const clientId = process.env.COGNITO_CLIENT_ID
    if (!clientId) return response(500, { message: 'Server configuration error', code: 'CONFIG_ERROR' })

    const params = {
      ClientId: clientId,
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: String(answer)
      },
      Session: session
    }

    console.log('Calling respondToAuthChallenge for', email)
    const result = await cognito.respondToAuthChallenge(params).promise()
    console.log('respondToAuthChallenge result:', JSON.stringify(result))

    // If authentication succeeded, result.AuthenticationResult will be present
    if (result && result.AuthenticationResult) {
      return response(200, { success: true, authenticationResult: result.AuthenticationResult })
    }

    // If a further challenge is required, forward the ChallengeName and Session
    return response(200, { success: false, challengeName: result.ChallengeName, session: result.Session })

  } catch (err) {
    console.error('auth-verify error:', err)
    if (err.code === 'NotAuthorizedException' || err.code === 'CodeMismatchException') {
      return response(401, { message: 'Invalid code or not authorized', code: err.code })
    }
    if (err.code === 'UserNotFoundException') {
      return response(404, { message: 'User not found', code: 'USER_NOT_FOUND' })
    }
    return response(500, { message: 'Failed to verify code', code: 'INTERNAL_ERROR', error: err.message })
  }
}
