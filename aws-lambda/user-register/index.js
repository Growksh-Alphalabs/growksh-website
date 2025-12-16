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

    // Create the user with a random temp password. Do NOT mark email as verified
    // and allow Cognito to send the verification/invite email to the user.
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    console.log('Calling AdminCreateUser for', email, 'in pool', userPoolId)
    // Note: remove MessageAction:'SUPPRESS' and do not set email_verified so
    // Cognito will send its verification/invite email to the user.
    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...(name ? [{ Name: 'name', Value: name }] : []),
        ...(phone ? [{ Name: 'phone_number', Value: phone }] : [])
      ],
      TemporaryPassword: tempPassword,
      DesiredDeliveryMediums: ['EMAIL']
    }).promise()

    console.log('AdminCreateUser succeeded for', email)
    return response(201, { message: 'User created' })
  } catch (err) {
    console.warn('user-register error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
