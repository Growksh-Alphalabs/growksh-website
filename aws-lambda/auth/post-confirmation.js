/**
 * Post Confirmation Lambda Trigger
 * Handles post-confirmation events (runs after user confirms email)
 */

exports.handler = async (event) => {
  console.log('PostConfirmation event:', JSON.stringify(event, null, 2));

  // User email has been confirmed
  // You can add custom logic here if needed

  return event;
};
