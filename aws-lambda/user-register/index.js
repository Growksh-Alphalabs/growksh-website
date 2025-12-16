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
    console.log('user-register invoked')
    console.log('Event summary:', {
      path: event.path,
      httpMethod: event.httpMethod,
      headers: event.headers,
      requestContext: event.requestContext && { stage: event.requestContext.stage, resourceId: event.requestContext.resourceId }
    })

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      console.log('Handling OPTIONS preflight for /auth/register')
      return response(204, { message: 'OK' })
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    console.log('Request body:', body)
    const { email, name, phone } = body || {}
    const userPoolId = process.env.USER_POOL_ID
    if (!email || !userPoolId) {
      console.warn('Missing email or userPoolId', { email, userPoolId })
      return response(400, { message: 'Missing email or userPoolId' })
    }

    // Create the user with a random temp password and SUPPRESS the built-in
    // Cognito messaging. We'll trigger the CUSTOM_AUTH flow immediately after
    // creation so the CreateAuthChallenge Lambda sends an OTP via SES.
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    console.log('Calling AdminCreateUser for', email, 'in pool', userPoolId)
    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...(name ? [{ Name: 'name', Value: name }] : []),
        ...(phone ? [{ Name: 'phone_number', Value: phone }] : [])
      ],
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS'
    }).promise()

    // If we have a Cognito App Client ID available, start the CUSTOM_AUTH flow
    // for this user so the CreateAuthChallenge trigger runs and sends the OTP.
    const clientId = process.env.COGNITO_CLIENT_ID
    if (clientId) {
      try {
        console.log('Initiating CUSTOM_AUTH for', email, 'clientId', clientId)
        await cognito.adminInitiateAuth({
          UserPoolId: userPoolId,
          ClientId: clientId,
          AuthFlow: 'CUSTOM_AUTH',
          AuthParameters: { USERNAME: email }
        }).promise()
        console.log('adminInitiateAuth invoked successfully')
      } catch (err) {
        console.warn('adminInitiateAuth failed', err && err.stack ? err.stack : err)
      }
    } else {
      console.log('COGNITO_CLIENT_ID not set; skipping adminInitiateAuth. OTP will be sent on first sign-in instead.')
    }

    console.log('AdminCreateUser succeeded for', email)
    return response(201, { message: 'User created' })
  } catch (err) {
    console.warn('user-register error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
