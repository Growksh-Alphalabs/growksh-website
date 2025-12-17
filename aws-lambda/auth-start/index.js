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
    const email = body && body.email
    const userPoolId = process.env.USER_POOL_ID
    const clientId = process.env.COGNITO_CLIENT_ID
    if (!email || !userPoolId || !clientId) return response(400, { message: 'Missing email or pool/client id' })

    console.log('AuthStart: adminInitiateAuth for', email)
    const res = await cognito.adminInitiateAuth({
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: 'CUSTOM_AUTH',
      AuthParameters: { USERNAME: email }
    }).promise()

    console.log('AuthStart result keys:', Object.keys(res || {}))
    return response(200, { challengeName: res.ChallengeName, session: res.Session, challengeParameters: res.ChallengeParameters })
  } catch (err) {
    console.warn('AuthStart error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
