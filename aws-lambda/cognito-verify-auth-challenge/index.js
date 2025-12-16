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
