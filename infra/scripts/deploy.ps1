# Growksh Infrastructure Deployment Script (PowerShell)
# This script automates CloudFormation deployment with proper parameterization
#
# Usage:
#   .\deploy.ps1 -Environment prod -Region us-east-1 -VerifySecret "mySecret123"
#   .\deploy.ps1 -Environment feature-123 -VerifyBaseUrl "https://feature.growksh.com"

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$Environment,
    
    [Parameter()]
    [string]$Region = "ap-south-1",
    
    [Parameter()]
    [string]$SESEmail = "noreply@growksh.com",
    
    [Parameter()]
    [string]$VerifyBaseUrl,
    
    [Parameter()]
    [string]$VerifySecret,
    
    [Parameter()]
    [string]$LambdaCodeBucket,
    
    [Parameter()]
    [string]$LambdaCodeSourceEnv = $Environment,
    
    [Parameter()]
    [switch]$DebugOTP,
    
    [Parameter()]
    [switch]$DryRun,
    
    [Parameter()]
    [switch]$SkipLambdaStacks
)

# ===========================
# Helper Functions
# ===========================

function Generate-Secret {
    param([int]$Length = 32)
    $chars = [char[]]'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    $random = New-Object System.Random
    $secret = -join (1..$Length | ForEach-Object { $chars[$random.Next($chars.Count)] })
    return $secret
}

function Get-StackName {
    param([int]$StackNumber)
    $stackNames = @{
        2 = "growksh-website-cognito"
        6 = "growksh-website-api"
        7 = "growksh-website-cognito-lambdas"
        8 = "growksh-website-api-lambdas"
    }
    if (-not $stackNames.ContainsKey($StackNumber)) {
        throw "Invalid stack number: $StackNumber"
    }
    return "$($stackNames[$StackNumber])-$Environment"
}

function Get-TemplatePath {
    param([int]$StackNumber)
    $templatePath = "infra\cloudformation\{0:D2}-*.yaml" -f $StackNumber
    $resolved = Resolve-Path $templatePath -ErrorAction SilentlyContinue
    if (-not $resolved) {
        throw "Template not found: $templatePath"
    }
    return $resolved.Path
}

function Deploy-Stack {
    param(
        [string]$StackName,
        [string]$TemplatePath,
        [hashtable]$Parameters,
        [string[]]$Capabilities,
        [bool]$IsDryRun
    )
    
    Write-Host "`n$('='*70)" -ForegroundColor Cyan
    Write-Host "Deploying: $StackName" -ForegroundColor Cyan
    Write-Host "Region: $Region" -ForegroundColor Cyan
    Write-Host "Template: $TemplatePath" -ForegroundColor Cyan
    Write-Host "Parameters:" -ForegroundColor Cyan
    foreach ($key in $Parameters.Keys) {
        $value = if ($key -eq "VerifySecret") { "***" } else { $Parameters[$key] }
        Write-Host "  $key`: $value" -ForegroundColor Cyan
    }
    Write-Host "$('='*70)`n" -ForegroundColor Cyan
    
    # Build parameter overrides
    $paramOverrides = @()
    foreach ($key in $Parameters.Keys) {
        $paramOverrides += "$key=$($Parameters[$key])"
    }
    
    # Build command
    $cmdArgs = @(
        "cloudformation", "deploy",
        "--stack-name", $StackName,
        "--template-file", $TemplatePath,
        "--region", $Region,
        "--no-fail-on-empty-changeset"
    )
    
    if ($paramOverrides.Count -gt 0) {
        $cmdArgs += "--parameter-overrides"
        $cmdArgs += $paramOverrides
    }
    
    if ($Capabilities.Count -gt 0) {
        $cmdArgs += "--capabilities"
        $cmdArgs += $Capabilities
    }
    
    if ($IsDryRun) {
        Write-Host "[DRY RUN] Would execute: aws $($cmdArgs -join ' ')" -ForegroundColor Yellow
        return $true
    }
    
    try {
        & aws $cmdArgs
        if ($LASTEXITCODE -eq 0) {
            return $true
        } else {
            Write-Host "ERROR: Deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Get-StackOutput {
    param(
        [string]$StackName,
        [string]$OutputKey
    )
    
    try {
        $result = & aws cloudformation describe-stacks `
            --stack-name $StackName `
            --region $Region `
            --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue" `
            --output text `
            2>$null
        
        return if ($result) { $result } else { $null }
    } catch {
        return $null
    }
}

# ===========================
# Main Execution
# ===========================

try {
    # Set default verify base URL
    if (-not $VerifyBaseUrl) {
        if ($Environment -eq "prod") {
            $VerifyBaseUrl = "https://growksh.com/auth/verify-email"
        } else {
            $VerifyBaseUrl = "https://$Environment.growksh.com/auth/verify-email"
        }
    }
    
    # Generate secret if not provided
    if (-not $VerifySecret) {
        $VerifySecret = Generate-Secret
    }
    
    # Display configuration
    Write-Host "`n$('='*70)" -ForegroundColor Yellow
    Write-Host "GROWKSH INFRASTRUCTURE DEPLOYMENT" -ForegroundColor Yellow
    Write-Host "$('='*70)" -ForegroundColor Yellow
    Write-Host "Environment: $Environment" -ForegroundColor White
    Write-Host "Region: $Region" -ForegroundColor White
    Write-Host "SES Email: $SESEmail" -ForegroundColor White
    Write-Host "Verify Base URL: $VerifyBaseUrl" -ForegroundColor White
    Write-Host "Verify Secret: [auto-generated]" -ForegroundColor White
    Write-Host "Lambda Code Source Env: $LambdaCodeSourceEnv" -ForegroundColor White
    Write-Host "Lambda Code Bucket: $(if ($LambdaCodeBucket) { $LambdaCodeBucket } else { '[will be auto-created]' })" -ForegroundColor White
    if ($DryRun) {
        Write-Host "DRY RUN MODE: Changes will NOT be applied" -ForegroundColor Red
    }
    Write-Host "$('='*70)`n" -ForegroundColor Yellow
    
    # Prepare deployment list
    $deployments = @(
        @{
            StackNumber = 2
            Description = "Cognito User Pool (without triggers)"
            Parameters = @{
                Environment = $Environment
                EnableTriggers = "false"
            }
            Capabilities = @()
        }
    )
    
    if (-not $SkipLambdaStacks) {
        $deployments += @(
            @{
                StackNumber = 7
                Description = "Cognito Lambda Triggers"
                Parameters = @{
                    Environment = $Environment
                    LambdaCodeSourceEnv = $LambdaCodeSourceEnv
                    LambdaCodeBucketName = $LambdaCodeBucket
                    SESSourceEmail = $SESEmail
                    VerifyBaseUrl = $VerifyBaseUrl
                    VerifySecret = $VerifySecret
                    DebugLogOTP = if ($DebugOTP) { "1" } else { "0" }
                }
                Capabilities = @("CAPABILITY_NAMED_IAM")
            },
            @{
                StackNumber = 2
                Description = "Cognito User Pool (enable triggers)"
                Parameters = @{
                    Environment = $Environment
                    EnableTriggers = "true"
                }
                Capabilities = @()
            },
            @{
                StackNumber = 8
                Description = "API Lambda Functions"
                Parameters = @{
                    Environment = $Environment
                    LambdaCodeSourceEnv = $LambdaCodeSourceEnv
                    LambdaCodeBucketName = $LambdaCodeBucket
                    VerifyBaseUrl = $VerifyBaseUrl
                    VerifySecret = $VerifySecret
                }
                Capabilities = @("CAPABILITY_NAMED_IAM")
            }
        )
    }
    
    $deployments += @(
        @{
            StackNumber = 6
            Description = "API Gateway"
            Parameters = @{
                Environment = $Environment
            }
            Capabilities = @()
        }
    )
    
    # Execute deployments
    $failedStacks = @()
    foreach ($deployment in $deployments) {
        $stackName = Get-StackName -StackNumber $deployment.StackNumber
        $templatePath = Get-TemplatePath -StackNumber $deployment.StackNumber
        
        $success = Deploy-Stack `
            -StackName $stackName `
            -TemplatePath $templatePath `
            -Parameters $deployment.Parameters `
            -Capabilities $deployment.Capabilities `
            -IsDryRun $DryRun
        
        if ($success) {
            Write-Host "✅ $($deployment.Description): $stackName`n" -ForegroundColor Green
        } else {
            Write-Host "❌ $($deployment.Description): $stackName`n" -ForegroundColor Red
            $failedStacks += $stackName
        }
    }
    
    # Check for failures
    if ($failedStacks.Count -gt 0 -and -not $DryRun) {
        Write-Host "`n❌ Deployment failed at the following stacks:" -ForegroundColor Red
        $failedStacks | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        exit 1
    }
    
    # Output next steps
    if (-not $DryRun) {
        Write-Host "`n$('='*70)" -ForegroundColor Green
        Write-Host "DEPLOYMENT COMPLETE" -ForegroundColor Green
        Write-Host "$('='*70)" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor White
        
        $cognitoStackName = Get-StackName -StackNumber 2
        $apiStackName = Get-StackName -StackNumber 6
        
        Write-Host "`n1. Get Cognito User Pool ID:" -ForegroundColor Cyan
        Write-Host "   aws cloudformation describe-stacks --stack-name $cognitoStackName ``" -ForegroundColor White
        Write-Host "     --region $Region --query 'Stacks[0].Outputs[?OutputKey==``UserPoolId``].OutputValue' --output text" -ForegroundColor White
        
        Write-Host "`n2. Get Cognito Client ID:" -ForegroundColor Cyan
        Write-Host "   aws cloudformation describe-stacks --stack-name $cognitoStackName ``" -ForegroundColor White
        Write-Host "     --region $Region --query 'Stacks[0].Outputs[?OutputKey==``UserPoolClientId``].OutputValue' --output text" -ForegroundColor White
        
        Write-Host "`n3. Get API Endpoint:" -ForegroundColor Cyan
        Write-Host "   aws cloudformation describe-stacks --stack-name $apiStackName ``" -ForegroundColor White
        Write-Host "     --region $Region --query 'Stacks[0].Outputs[?OutputKey==``ApiEndpoint``].OutputValue' --output text" -ForegroundColor White
        
        Write-Host "`n4. Update public/runtime-config.js with the above values" -ForegroundColor Cyan
        Write-Host "`n5. Rebuild and deploy frontend" -ForegroundColor Cyan
        Write-Host "$('='*70)`n" -ForegroundColor Green
    }
}
catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
