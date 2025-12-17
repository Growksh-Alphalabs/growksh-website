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
  const source = process.env.SES_SOURCE_EMAIL || 'noreply@example.com'
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
