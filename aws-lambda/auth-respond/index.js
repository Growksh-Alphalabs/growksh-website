const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Content-Type': 'application/json'
}

function response(statusCode, body) {
  return { statusCode, headers: corsHeaders, body: JSON.stringify(body) }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return response(204, { message: 'OK' })
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { email, session, answer } = body || {}
    const userPoolId = process.env.USER_POOL_ID
    const clientId = process.env.COGNITO_CLIENT_ID
    if (!email || !userPoolId || !clientId || !session || !answer) return response(400, { message: 'Missing parameters' })

    console.log('AuthRespond: adminRespondToAuthChallenge for', email)
    const res = await cognito.adminRespondToAuthChallenge({
      UserPoolId: userPoolId,
      ClientId: clientId,
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: String(answer)
      },
      Session: session
    }).promise()

    console.log('AuthRespond result keys:', Object.keys(res || {}))
    // On success, res.AuthenticationResult will contain tokens
    return response(200, { success: true, result: res })
  } catch (err) {
    console.warn('AuthRespond error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
