exports.handler = async (event) => {
  // Compare the provided answer with the expected answer stored in privateChallengeParameters
  const expected = event.request.privateChallengeParameters && event.request.privateChallengeParameters.expectedAnswer
  const provided = event.request.challengeAnswer

  const answerCorrect = expected && provided && expected === provided

  event.response.answerCorrect = !!answerCorrect

  return event
}
