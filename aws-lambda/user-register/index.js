const AWS = require('aws-sdk')
const crypto = require('crypto')
const cognito = new AWS.CognitoIdentityServiceProvider()
const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' })

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
    // Cognito messaging. We'll send our own verification link via SES.
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'

    console.log('Calling AdminCreateUser for', email, 'in pool', userPoolId)
    // Let Cognito send the built-in invite/verification email by not
    // suppressing messages here. Cognito will send an email with a
    // temporary password / verification flow to the user.
    // Do NOT include `phone_number` attribute here to avoid triggering
    // Cognito SMS delivery (which requires SMS configuration). We still
    // capture phone on the frontend if you want to store it elsewhere,
    // but omitting it prevents SMS verification attempts.
    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...(name ? [{ Name: 'name', Value: name }] : [])
      ],
      TemporaryPassword: tempPassword,
      MessageAction: 'SUPPRESS'
    }).promise()
    // Compose and send verification link via SES. The frontend verification
    // endpoint will confirm the user in Cognito then redirect to the login page.
    const verifyBaseEnv = process.env.VERIFY_BASE_URL || ''
    const source = process.env.SES_SOURCE_EMAIL || ''
    const secret = process.env.VERIFY_SECRET || process.env.VERIFY_SECRET_KEY || ''

    // Build a sensible fallback verify base using the incoming request Host and stage
    const host = (event.headers && (event.headers.Host || event.headers.host)) || ''
    const stage = (event.requestContext && event.requestContext.stage) || ''
    const fallbackBase = host ? `https://${host}${stage ? '/' + stage : ''}/auth/verify-email` : ''
    const verifyBase = verifyBaseEnv || fallbackBase

    if (!secret) {
      console.warn('VERIFY_SECRET not set; cannot generate signed verification token. Set VERIFY_SECRET to enable verification links.')
    } else {
      // Token: base64url(payload).base64url(hmac(payload))
      const payload = { email, exp: Date.now() + 24 * 60 * 60 * 1000 }
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
      const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
      const token = `${payloadB64}.${sig}`
      const verifyUrl = verifyBase ? `${verifyBase}${verifyBase.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : `token=${encodeURIComponent(token)}`

      // Log the verification URL for debugging when enabled. This allows testing
      // the verify flow even if SES or VERIFY_BASE_URL are not configured.
      try {
        if (process.env.DEBUG_LOG_VERIFY === '1') {
          console.log(`DEBUG_VERIFY_URL for ${email}: ${verifyUrl}`)
        }
      } catch (e) {
        console.warn('Failed to write debug verify log', e && e.message)
      }

      // Only attempt SES send if we have both a source address and a verify base
      if (!verifyBaseEnv || !source) {
        console.warn('VERIFY_BASE_URL or SES_SOURCE_EMAIL not set; skipping SES send. Verification URL logged if DEBUG_LOG_VERIFY=1')
      } else {
        const subject = 'Verify your email'
        const body = `Hi ${name || ''},\n\nPlease verify your email by clicking this link:\n\n${verifyUrl}\n\nIf you did not sign up, you can ignore this message.`
        try {
          console.log('Sending verification email to', email)
          await ses.sendEmail({
            Source: source,
            Destination: { ToAddresses: [email] },
            Message: { Subject: { Data: subject }, Body: { Text: { Data: body } } }
          }).promise()
          console.log('Verification email sent to', email)
        } catch (err) {
          console.warn('Failed to send verification email via SES', err && err.stack ? err.stack : err)
        }
      }
    }

    console.log('AdminCreateUser succeeded for', email)
    return response(201, { message: 'User created' })
  } catch (err) {
    console.warn('user-register error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
