/**
 * Create Auth Challenge Lambda Trigger
 * Generates OTP and sends it via email for passwordless login
 */

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { marshall } = require("@aws-sdk/util-dynamodb");

let dynamodbClient = null;
let sesClient = null;

function getDynamoDBClient() {
  if (!dynamodbClient) {
    dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
  }
  return dynamodbClient;
}

function getSESClient() {
  if (!sesClient) {
    sesClient = new SESClient({ region: process.env.AWS_REGION });
  }
  return sesClient;
}

exports.handler = async (event) => {
  console.log('CreateAuthChallenge event:', JSON.stringify(event, null, 2));

  const { request, response } = event;

  if (request.challengeName === 'CUSTOM_CHALLENGE') {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const email = request.userAttributes.email;
      const ttl = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes expiry

      if (process.env.DEBUG_LOG === '1') {
        console.log('Generated OTP:', otp, 'for email:', email);
      }

      // Store OTP in DynamoDB
      const dynamodb = getDynamoDBClient();
      await dynamodb.send(new PutItemCommand({
        TableName: process.env.OTP_TABLE,
        Item: marshall({
          email,
          otp,
          ttl,
          createdAt: new Date().toISOString(),
        }),
      }));

      console.log('OTP stored in DynamoDB for:', email);

      // Send OTP via SES
      const ses = getSESClient();
      await ses.send(new SendEmailCommand({
        Source: process.env.SES_SOURCE_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: {
            Data: 'Your Growksh Login OTP',
          },
          Body: {
            Text: {
              Data: `Your one-time password (OTP) is: ${otp}\n\nValid for 10 minutes.\n\nDo not share this code with anyone.`,
            },
          },
        },
      }));

      console.log('OTP sent successfully to:', email);
    } catch (error) {
      console.error('Error in CreateAuthChallenge:', error);
      throw new Error('Failed to generate and send OTP');
    }

    // Set challenge metadata
    response.publicChallengeParameters = {
      email: request.userAttributes.email,
    };
    response.privateChallengeParameters = {
      otp: otp,
      email: request.userAttributes.email,
    };
  }

  return event;
};
