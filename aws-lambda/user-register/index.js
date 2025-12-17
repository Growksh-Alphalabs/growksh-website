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

    // Create the user with a random temp password and ALLOW Cognito to send
    // the verification/invite email. Do NOT suppress messaging or try to
    // initiate the custom auth flow here — user must verify email first.
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    console.log('Calling AdminCreateUser for', email, 'in pool', userPoolId)
    // Suppress Cognito's default email invite so we can send a custom
    // verification link instead.
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

    // Create a verification token and store it in DynamoDB
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const vTable = process.env.VERIFICATIONS_TABLE
    if (vTable) {
      const doc = new AWS.DynamoDB.DocumentClient()
      await doc.put({ TableName: vTable, Item: { token, email, createdAt: Date.now() } }).promise()

      // Send a verification link via SES
      const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' })
      const source = process.env.SES_SOURCE_EMAIL || ''
      const frontend = process.env.FRONTEND_URL || ''
      const verifyUrl = `${frontend.replace(/\/$/, '')}/auth/verify?token=${encodeURIComponent(token)}`
      const subject = 'Verify your email address'
      const body = `Hi ${name || ''},\n\nPlease verify your email by clicking this link:\n${verifyUrl}\n\nIf you didn't request this, ignore this email.`
      try {
        console.log('Sending verification link to', email, 'via SES from', source)
        await ses.sendEmail({
          Source: source,
          Destination: { ToAddresses: [email] },
          Message: { Subject: { Data: subject }, Body: { Text: { Data: body } } }
        }).promise()
        console.log('Verification email sent to', email)
      } catch (err) {
        console.warn('Failed to send verification email via SES', err && err.stack ? err.stack : err)
      }
    } else {
      console.warn('VERIFICATIONS_TABLE not set; cannot issue verification token')
    }

    console.log('AdminCreateUser succeeded for', email)
    return response(201, { message: 'User created' })
  } catch (err) {
    console.warn('user-register error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
