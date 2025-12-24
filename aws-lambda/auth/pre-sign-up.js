/**
 * Pre Sign Up Lambda Trigger
 * Automatically confirms user and marks email as verified
 */

exports.handler = async (event) => {
  console.log('PreSignUp event:', JSON.stringify(event, null, 2));

  // Auto-confirm the user (skip confirmation step)
  event.response.autoConfirmUser = true;

  // Auto-verify attributes
  event.response.autoVerifyEmail = false;
  event.response.autoVerifyPhone = false;

  return event;
};
