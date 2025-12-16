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
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return response(204, { message: 'OK' })
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    const { email, name, phone } = body || {}
    const userPoolId = process.env.USER_POOL_ID
    if (!email || !userPoolId) return response(400, { message: 'Missing email or userPoolId' })

    // Create the user with a random temp password, suppress messaging (we'll send OTP via custom auth)
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        ...(name ? [{ Name: 'name', Value: name }] : []),
        ...(phone ? [{ Name: 'phone_number', Value: phone }] : [])
      ],
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS'
    }).promise()

    return response(201, { message: 'User created' })
  } catch (err) {
    console.warn('user-register error', err)
    return response(500, { message: err.message || 'error' })
  }
}
