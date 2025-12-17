const AWS = require('aws-sdk')
const crypto = require('crypto')
const cognito = new AWS.CognitoIdentityServiceProvider()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

function response(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...(extraHeaders || {}) },
    body: body ? JSON.stringify(body) : ''
  }
}

function base64urlDecode(input) {
  // Replace URL-safe chars and pad
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  while (input.length % 4) input += '='
  return Buffer.from(input, 'base64').toString('utf8')
}

function verifyToken(token, secret) {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const payloadB64 = parts[0]
  const sig = parts[1]
  const h = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64')
  // normalize base64 -> base64url for comparison
  const hUrl = h.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  if (!crypto.timingSafeEqual(Buffer.from(hUrl), Buffer.from(sig))) return null
  try {
    const json = JSON.parse(base64urlDecode(payloadB64))
    if (json.exp && Date.now() > json.exp) return null
    return json
  } catch (e) {
    return null
  }
}

exports.handler = async (event) => {
  try {
    console.log('VerifyEmail invoked', { query: event.queryStringParameters })
    const token = event.queryStringParameters && event.queryStringParameters.token
    const secret = process.env.VERIFY_SECRET || process.env.VERIFY_SECRET_KEY || ''
    if (!secret) {
      console.warn('VERIFY_SECRET not configured')
      return response(500, { message: 'Server not configured' })
    }
    const payload = verifyToken(token, secret)
    if (!payload || !payload.email) {
      console.warn('Invalid or expired token')
      // Redirect to login with error message (as query param) or show simple message
      const redirect = (process.env.LOGIN_REDIRECT_URL || '/') + '?verified=0'
      return { statusCode: 302, headers: { Location: redirect, ...corsHeaders }, body: '' }
    }

    const email = payload.email
    const userPoolId = process.env.USER_POOL_ID
    if (!userPoolId) {
      console.warn('USER_POOL_ID not set')
      return response(500, { message: 'Server misconfigured' })
    }

    try {
      console.log('Confirming user in Cognito', email)
      await cognito.adminConfirmSignUp({ UserPoolId: userPoolId, Username: email }).promise()
      console.log('adminConfirmSignUp succeeded for', email)
    } catch (err) {
      console.warn('adminConfirmSignUp failed, attempting to update attributes', err && err.message)
      try {
        await cognito.adminUpdateUserAttributes({ UserPoolId: userPoolId, Username: email, UserAttributes: [{ Name: 'email_verified', Value: 'true' }] }).promise()
        console.log('Set email_verified for', email)
      } catch (uErr) {
        console.warn('Failed to set email_verified', uErr && uErr.message)
      }
    }

    // Redirect to login page and prefill email (no autostart)
    const redirectBase = process.env.LOGIN_REDIRECT_URL || '/auth/login'
    const redirectTo = `${redirectBase}?email=${encodeURIComponent(email)}`
    return { statusCode: 302, headers: { Location: redirectTo, ...corsHeaders }, body: '' }
  } catch (err) {
    console.warn('verify-email error', err && err.stack ? err.stack : err)
    return response(500, { message: err.message || 'error' })
  }
}
