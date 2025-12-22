/*
 * Cognito Verify Auth Challenge Response trigger
 * - Compares the user's answer with the privateChallengeParameters.secretLoginCode
 */

exports.handler = async (event) => {
  try {
    const expected = event.request.privateChallengeParameters && event.request.privateChallengeParameters.secretLoginCode
    const provided = event.request.challengeAnswer

    const correct = expected && provided && expected === provided

    event.response.answerCorrect = !!correct

    return event
  } catch (err) {
    console.error('VerifyAuthChallengeResponse error', err)
    event.response.answerCorrect = false
    return event
  }
}
exports.handler = async (event) => {
  console.log('VerifyAuthChallenge invoked', { userName: event.userName })
  const expected = event.request.privateChallengeParameters && event.request.privateChallengeParameters.expectedAnswer
  const provided = event.request.challengeAnswer
  console.log('Expected present?', !!expected, 'Provided present?', !!provided)

  const answerCorrect = expected && provided && expected === provided
  console.log('Answer correct:', !!answerCorrect)

  event.response.answerCorrect = !!answerCorrect

  return event
}
