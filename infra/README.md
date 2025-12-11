# Deploying the Contact API (SAM)

This folder contains an AWS SAM template to deploy a simple contact API backed by DynamoDB.

Prerequisites
- AWS CLI configured with credentials and a default region
- AWS SAM CLI installed (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Node 18+ for the Lambda

Quick deploy

1. From the repo root, package and deploy with SAM (choose a stack name):

```bash
cd infra
sam build --use-container
sam deploy --guided
```

2. During guided deploy, set the stack name, confirm capabilities, and note the `ContactApiEndpoint` output.

3. After deployment, set your Vite env variable `VITE_CONTACT_API_URL` to the endpoint URL (the full path to `/contact`) and rebuild the site.

Local testing
- You can run the Lambda locally with `sam local start-api` after `sam build`:

```bash
sam build
sam local start-api
```

This will make the POST /contact endpoint available at `http://localhost:3000/contact` by default.

Security note
- The SAM template configures the Lambda with a managed DynamoDB policy allowing CRUD on the created table. Consider using least-privilege policies if you expand the function.
