/*
 * Cognito Define Auth Challenge trigger
 * - Only supports CUSTOM_CHALLENGE flows
 * - If no prior session: issue CUSTOM_CHALLENGE (do not issue tokens)
 * - If previous challenge passed: issue tokens
 * - If more than 3 failed attempts: fail authentication
 */

exports.handler = async (event) => {
  try {
    const session = event.request.session || []

    // If there is an incoming challenge name and it's not our custom one, reject
    if (event.request.challengeName && event.request.challengeName !== 'CUSTOM_CHALLENGE') {
      event.response.issueTokens = false
      event.response.failAuthentication = true
      return event
    }

    // Count failed custom-challenge attempts
    const failedCount = session.filter(s => s.challengeName === 'CUSTOM_CHALLENGE' && s.challengeResult === false).length

    if (failedCount >= 3) {
      event.response.issueTokens = false
      event.response.failAuthentication = true
      return event
    }

    // If no previous challenges, start the custom challenge
    if (!session || session.length === 0) {
      event.response.issueTokens = false
      event.response.challengeName = 'CUSTOM_CHALLENGE'
      event.response.failAuthentication = false
      return event
    }

    // Look at the last challenge result
    const last = session[session.length - 1]
    if (last && last.challengeName === 'CUSTOM_CHALLENGE' && last.challengeResult === true) {
      event.response.issueTokens = true
      event.response.failAuthentication = false
      return event
    }

    // Otherwise, issue another custom challenge
    event.response.issueTokens = false
    event.response.challengeName = 'CUSTOM_CHALLENGE'
    event.response.failAuthentication = false
    return event
  } catch (err) {
    console.error('DefineAuthChallenge error', err)
    // On error, fail to be safe
    event.response.issueTokens = false
    event.response.failAuthentication = true
    return event
  }
}
exports.handler = async (event) => {
  console.log('DefineAuthChallenge invoked', { userName: event.userName })
  // Decide whether to issue a custom challenge or succeed the authentication
  const session = event.request.session || []
  console.log('Session length:', session.length)

  if (session.length === 0) {
    event.response.challengeName = 'CUSTOM_CHALLENGE'
    event.response.issueTokens = false
    event.response.failAuthentication = false
  } else {
    const last = session[session.length - 1]
    console.log('Last session entry:', last && { challengeName: last.challengeName, challengeResult: last.challengeResult })
    if (last.challengeName === 'CUSTOM_CHALLENGE' && last.challengeResult === true) {
      event.response.issueTokens = true
      event.response.failAuthentication = false
    } else if (last.challengeName === 'CUSTOM_CHALLENGE' && last.challengeResult === false && session.length >= 3) {
      event.response.issueTokens = false
      event.response.failAuthentication = true
    } else {
      event.response.challengeName = 'CUSTOM_CHALLENGE'
      event.response.issueTokens = false
      event.response.failAuthentication = false
    }
  }

  return event
}
