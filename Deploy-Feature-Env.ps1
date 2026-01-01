# PowerShell Deployment Script for feature-77d07ae1 Environment
# This script deploys all CloudFormation stacks and Lambda functions for the feature environment
# 
# Usage: .\Deploy-Feature-Env.ps1
#
# Prerequisites:
# - AWS CLI installed and configured with credentials for account 720427058396
# - PowerShell 5.1+ (Windows)
# - npm installed (for packaging Lambdas)

param(
    [string]$Environment = "feature-77d07ae1",
    [string]$Region = "ap-south-1",
    [string]$AccountId = "720427058396"
)

$ErrorActionPreference = "Stop"

# Colors for output
$green = @{ ForegroundColor = "Green" }
$yellow = @{ ForegroundColor = "Yellow" }
$red = @{ ForegroundColor = "Red" }

Write-Host "`n========================================" @green
Write-Host "🚀 Growksh Website Deployment" @green
Write-Host "========================================`n" @green

Write-Host "Environment: $Environment"
Write-Host "Region: $Region"
Write-Host "Account: $AccountId`n"

# Step 0: Verify AWS Credentials
Write-Host "Step 0️⃣: Verifying AWS Credentials..." @yellow

try {
    $identity = aws sts get-caller-identity --region $Region | ConvertFrom-Json
    $currentAccount = $identity.Account
    
    if ($currentAccount -ne $AccountId) {
        Write-Host "❌ ERROR: Wrong AWS account!" @red
        Write-Host "  Current: $currentAccount"
        Write-Host "  Required: $AccountId"
        exit 1
    }
    
    Write-Host "✅ AWS Account verified: $currentAccount`n" @green
} catch {
    Write-Host "❌ Failed to verify AWS credentials: $_" @red
    exit 1
}

# Step 1: Package Lambda Functions
Write-Host "Step 1️⃣: Packaging Lambda Functions..." @yellow

try {
    # Run the PowerShell packaging script
    & .\package-lambdas.ps1
    Write-Host "✅ Lambda functions packaged`n" @green
} catch {
    Write-Host "❌ Failed to package Lambdas: $_" @red
    exit 1
}

# Step 2: Deploy CloudFormation Stacks
Write-Host "Step 2️⃣: Deploying CloudFormation Stacks..." @yellow
Write-Host "(This may take 10-15 minutes)`n"

try {
    # Use the bash deploy script via WSL or direct AWS CLI calls
    # For Windows users without WSL, we'll use AWS CLI directly
    
    $templateDir = "infra/cloudformation"
    $paramDir = "infra/cloudformation/parameters"
    $ephemeralAssetsBucket = "growksh-website-ephemeral-assets-$Environment"
    $lambdaCodeBucket = "growksh-website-lambda-code-$Environment"
    
    # Stacks to deploy in order
    $stacks = @(
        @{
            Name = "growksh-website-iam-$Environment"
            Template = "$templateDir/00-iam-stack.yaml"
            Params = @{
                Environment = $Environment
            }
        },
        @{
            Name = "growksh-website-database-$Environment"
            Template = "$templateDir/01-database-stack.yaml"
            Params = @{
                Environment = $Environment
                IsEphemeral = "true"
            }
        },
        @{
            Name = "growksh-website-waf-$Environment"
            Template = "$templateDir/03-waf-stack.yaml"
            Params = @{
                Environment = $Environment
            }
            Region = "us-east-1"
        },
        @{
            Name = "growksh-website-lambda-code-bucket-$Environment"
            Template = "$templateDir/04-lambda-code-bucket-stack.yaml"
            Params = @{
                Environment = $Environment
                BucketName = $lambdaCodeBucket
                IsEphemeral = "true"
            }
        },
        @{
            Name = "growksh-website-cognito-lambdas-$Environment"
            Template = "$templateDir/07-cognito-lambdas-stack.yaml"
            Params = @{
                Environment = $Environment
                LambdaCodeBucketName = $lambdaCodeBucket
                SESSourceEmail = "noreply@growksh.com"
                VerifyBaseUrl = "https://$ephemeralAssetsBucket.s3.amazonaws.com/auth/verify-email"
                DebugLogOTP = "1"
            }
        },
        @{
            Name = "growksh-website-cognito-$Environment"
            Template = "$templateDir/02-cognito-stack.yaml"
            Params = @{
                Environment = $Environment
                EnableTriggers = "true"
            }
        },
        @{
            Name = "growksh-website-storage-cdn-$Environment"
            Template = "$templateDir/05-storage-cdn-stack.yaml"
            Params = @{
                Environment = $Environment
                BucketName = $ephemeralAssetsBucket
                IsEphemeral = "true"
            }
        },
        @{
            Name = "growksh-website-api-$Environment"
            Template = "$templateDir/06-api-gateway-stack.yaml"
            Params = @{
                Environment = $Environment
            }
        },
        @{
            Name = "growksh-website-api-lambdas-$Environment"
            Template = "$templateDir/08-api-lambdas-stack.yaml"
            Params = @{
                Environment = $Environment
                LambdaCodeBucketName = $lambdaCodeBucket
                SESSourceEmail = "noreply@growksh.com"
                VerifyBaseUrl = "https://$ephemeralAssetsBucket.s3.amazonaws.com/auth/verify-email"
            }
        }
    )
    
    foreach ($stack in $stacks) {
        $stackName = $stack.Name
        $template = $stack.Template
        $stackRegion = if ($stack.Region) { $stack.Region } else { $Region }
        
        Write-Host "  📦 Deploying: $stackName (region: $stackRegion)..."
        
        # Build parameter overrides
        $paramOverrides = @()
        foreach ($key in $stack.Params.Keys) {
            $paramOverrides += "ParameterKey=$key,ParameterValue=$($stack.Params[$key])"
        }
        
        # Deploy stack
        aws cloudformation deploy `
            --template-file $template `
            --stack-name $stackName `
            --parameter-overrides $paramOverrides `
            --capabilities CAPABILITY_NAMED_IAM `
            --region $stackRegion `
            --no-fail-on-empty-changeset 2>&1 | Tee-Object -Variable deployLog | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ❌ Failed to deploy $stackName" @red
            Write-Host $deployLog
            exit 1
        }
        
        Write-Host "  ✅ Stack deployed: $stackName`n"
    }
    
    Write-Host "✅ All CloudFormation stacks deployed`n" @green
} catch {
    Write-Host "❌ Failed to deploy stacks: $_" @red
    exit 1
}

# Step 3: Upload Lambda Code to S3
Write-Host "Step 3️⃣: Uploading Lambda Code to S3..." @yellow

try {
    $lambdaCodeBucket = "growksh-website-lambda-code-$Environment"
    
    # Upload auth Lambdas
    $authZips = Get-ChildItem -Path "aws-lambda/auth" -Filter "*-$Environment.zip" -ErrorAction SilentlyContinue
    foreach ($zip in $authZips) {
        $zipName = $zip.Name
        Write-Host "  📦 Uploading: $zipName..."
        aws s3 cp "aws-lambda/auth/$zipName" "s3://$lambdaCodeBucket/auth/$zipName" `
            --region $Region 2>&1 | Out-Null
    }
    
    # Upload contact Lambda
    $contactZips = Get-ChildItem -Path "aws-lambda/contact" -Filter "*-$Environment.zip" -ErrorAction SilentlyContinue
    foreach ($zip in $contactZips) {
        $zipName = $zip.Name
        Write-Host "  📦 Uploading: $zipName..."
        aws s3 cp "aws-lambda/contact/$zipName" "s3://$lambdaCodeBucket/contact/$zipName" `
            --region $Region 2>&1 | Out-Null
    }
    
    Write-Host "✅ Lambda code uploaded to S3`n" @green
} catch {
    Write-Host "❌ Failed to upload Lambda code: $_" @red
    exit 1
}

# Step 4: Verify Deployment
Write-Host "Step 4️⃣: Verifying Deployment..." @yellow

try {
    # Check Lambda functions
    $lambdaFunctions = aws lambda list-functions `
        --region $Region `
        --query "Functions[?contains(FunctionName, '$Environment')].FunctionName" `
        --output json | ConvertFrom-Json
    
    if ($lambdaFunctions.Count -gt 0) {
        Write-Host "  ✅ Found $($lambdaFunctions.Count) Lambda functions"
        foreach ($func in $lambdaFunctions) {
            Write-Host "    - $func"
        }
    } else {
        Write-Host "  ⚠️  No Lambda functions found" @yellow
    }
    
    # Check Cognito triggers
    $poolId = "ap-south-1_NiqhNWvf8"
    $poolConfig = aws cognito-idp describe-user-pool `
        --user-pool-id $poolId `
        --region $Region `
        --query 'UserPool.LambdaConfig' `
        --output json | ConvertFrom-Json
    
    if ($poolConfig.PreSignUp) {
        Write-Host "  ✅ Cognito triggers configured"
    } else {
        Write-Host "  ⚠️  Cognito triggers not found" @yellow
    }
    
    Write-Host "`n"
} catch {
    Write-Host "⚠️  Verification failed: $_" @yellow
}

# Step 5: Success Message
Write-Host "========================================" @green
Write-Host "✅ Deployment Complete!" @green
Write-Host "========================================" @green
Write-Host "`nNext Steps:`n"
Write-Host "1. Hard refresh CloudFront: Ctrl+Shift+R on https://d12jf2jvld5mg4.cloudfront.net/"
Write-Host "2. Test signup on the frontend"
Write-Host "3. Test sign-in with OTP"
Write-Host "`nIf you encounter issues, see: DEPLOYMENT_FOR_FEATURE_77D07AE1.md`n"

exit 0
