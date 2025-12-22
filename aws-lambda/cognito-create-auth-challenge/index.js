/*
 * Cognito Create Auth Challenge trigger
 * - Generates a 6-digit code for new sessions
 * - Stores code in privateChallengeParameters.secretLoginCode
 * - Puts a 'hint' into publicChallengeParameters
 * - Sends the code via SES to the user's email
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

// instantiate SES client once for connection reuse
const ses = new SESClient({})

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

exports.handler = async (event) => {
  try {
    // Only support CUSTOM_CHALLENGE flows
    if (event.request.challengeName && event.request.challengeName !== 'CUSTOM_CHALLENGE') {
      return event
    }

    const session = event.request.session || []

    // If this is a new session (no previous challenge), create a code
    const isNew = !session || session.length === 0

    if (isNew) {
      const code = generateCode()

      // Private: stored so client cannot see it
      event.response.privateChallengeParameters = {
        secretLoginCode: code
      }

      // Public hint (per prompt, we place the code under 'hint' — if you prefer masking, change here)
      event.response.publicChallengeParameters = {
        hint: code
      }

      event.response.challengeMetadata = 'SECRET_LOGIN_CODE'

      // Send email via SES (non-blocking if SES not configured)
      const to = event.request.userAttributes && event.request.userAttributes.email
      const source = process.env.SES_SOURCE_EMAIL

      if (to && source) {
        const body = `Your login code is: ${code}`
        const params = {
          Destination: { ToAddresses: [to] },
          Message: {
            Subject: { Data: 'Your login code' },
            Body: { Text: { Data: body } }
          },
          Source: source
        }
        try {
          await ses.send(new SendEmailCommand(params))
          console.log('Sent login code to', to)
        } catch (sendErr) {
          console.error('Failed to send login code via SES', sendErr)
        }
      } else {
        console.warn('SES_SOURCE_EMAIL or recipient email not configured; skipping send')
      }
    } else {
      // For subsequent challenges, keep existing private params
      // AWS passes them through automatically; do nothing
    }

    return event
  } catch (err) {
    console.error('CreateAuthChallenge error', err)
    return event
  }
}
const AWS = require('aws-sdk')
const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' })

function generateOTP(length = 6) {
  let otp = ''
  for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10)
  return otp
}

exports.handler = async (event) => {
  // Called when Cognito needs to create/send a challenge (OTP)
  console.log('CreateAuthChallenge invoked', { triggerSource: event.triggerSource, userName: event.userName })
  console.log('Event.request summary:', {
    userAttributes: event.request && event.request.userAttributes ? { email: event.request.userAttributes.email } : {},
    sessionLength: event.request && event.request.session ? event.request.session.length : 0
  })

  const email = (event.request.userAttributes && event.request.userAttributes.email) || event.request.username

  const otp = generateOTP(6)

  // Set the expected answer in privateChallengeParameters
  event.response.publicChallengeParameters = { email }
  event.response.privateChallengeParameters = { expectedAnswer: otp }
  event.response.challengeMetadata = `OTP:${Date.now()}`

  // Send the OTP via SES
  const source = process.env.SES_SOURCE_EMAIL || 'noreply@growksh.com'
  const subject = 'Your verification code'
  const body = `Your Growksh verification code is: ${otp}. It expires in 10 minutes.`

  try {
    console.log('Sending OTP to', email)
    await ses.sendEmail({
      Source: source,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } }
      }
    }).promise()
    console.log('OTP sent to', email)
  } catch (err) {
    console.warn('Failed to send OTP via SES', err && err.stack ? err.stack : err)
    // For debugging: log the OTP in CloudWatch when SES fails so you can complete test flows.
    // WARNING: Logging OTPs is insecure for production; this helps diagnose delivery issues only.
    try {
      if (process.env.DEBUG_LOG_OTP === '1') {
        console.log(`DEBUG_LOG_OTP enabled — OTP for ${email}: ${otp}`)
      } else {
        console.log('SES send failed; OTP hidden. Set DEBUG_LOG_OTP=1 in env to reveal OTP in logs for testing.')
      }
    } catch (logErr) {
      console.warn('Failed writing debug OTP log', logErr)
    }
  }

  return event
}
