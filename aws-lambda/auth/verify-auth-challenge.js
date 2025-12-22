/**
 * Verify Auth Challenge Response Lambda Trigger
 * Verifies the OTP provided by the user matches the stored OTP
 */

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('VerifyAuthChallenge event:', JSON.stringify(event, null, 2));

  const { request, response } = event;
  const expectedOtp = request.privateChallengeParameters.otp;
  const userAnswer = request.challengeAnswer;
  const email = request.userAttributes.email;

  if (!expectedOtp || !userAnswer) {
    response.answerCorrect = false;
    return event;
  }

  // Verify OTP matches
  if (userAnswer.trim() === expectedOtp.trim()) {
    response.answerCorrect = true;
    console.log('OTP verified successfully for:', email);

    // Clean up OTP from DynamoDB
    try {
      await dynamodb
        .delete({
          TableName: process.env.OTP_TABLE,
          Key: { email },
        })
        .promise();
      console.log('OTP cleaned up for:', email);
    } catch (error) {
      console.error('Error cleaning up OTP:', error);
      // Don't fail auth if cleanup fails
    }
  } else {
    response.answerCorrect = false;
    console.log('OTP mismatch for email:', email, 'expected:', expectedOtp, 'got:', userAnswer);
  }

  return event;
};
