exports.handler = async (event) => {
  // Decide whether to issue a custom challenge or succeed the authentication
  const session = event.request.session || []

  if (session.length === 0) {
    event.response.challengeName = 'CUSTOM_CHALLENGE'
    event.response.issueTokens = false
    event.response.failAuthentication = false
  } else {
    const last = session[session.length - 1]
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
