/**
 * Verify Auth Challenge Response Lambda Trigger
 * Verifies the OTP provided by the user matches the stored OTP
 */

const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

let dynamodbClient = null;
let cognitoClient = null;

function getDynamoDBClient() {
  if (!dynamodbClient) {
    dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
  }
  return dynamodbClient;
}

function getCognitoClient() {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  }
  return cognitoClient;
}

async function tryMarkEmailVerified(email) {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  if (!userPoolId) return;

  try {
    const cognito = getCognitoClient();
    await cognito.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [{ Name: "email_verified", Value: "true" }],
      })
    );
    console.log("Marked email_verified=true for:", email);
  } catch (error) {
    console.error("Failed to mark email_verified (non-fatal):", error);
  }
}

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

    // Treat successful email OTP as email verification (best-effort)
    await tryMarkEmailVerified(email);

    // Clean up OTP from DynamoDB
    try {
      const dynamodb = getDynamoDBClient();
      await dynamodb.send(new DeleteItemCommand({
        TableName: process.env.OTP_TABLE,
        Key: marshall({ email }),
      }));
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
