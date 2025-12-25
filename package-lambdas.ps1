#!/usr/bin/env powershell
# Script to package Lambda functions and upload to S3

$S3Bucket = "growksh-website-lambda-code-dev"
$AWSRegion = "ap-south-1"
$Environment = "dev"

Write-Host "Lambda Packaging and Upload Script" -ForegroundColor Cyan

# API Lambda functions to package
$APILambdas = @{
    "contact" = @{
        "source" = "aws-lambda\contact"
        "files" = @("index.js", "package.json", "package-lock.json")
    }
    "signup" = @{
        "source" = "aws-lambda\auth"
        "files" = @("signup.js", "package.json", "package-lock.json")
    }
    "verify-email" = @{
        "source" = "aws-lambda\auth"
        "files" = @("verify-email.js", "package.json", "package-lock.json")
    }
    "check-admin" = @{
        "source" = "aws-lambda\auth"
        "files" = @("define-auth-challenge.js", "package.json", "package-lock.json")
    }
}

# Cognito Lambda functions to package
$CognitoLambdas = @{
    "pre-sign-up" = @{
        "source" = "aws-lambda\auth"
        "files" = @("pre-sign-up.js", "package.json", "package-lock.json")
    }
    "custom-message" = @{
        "source" = "aws-lambda\auth"
        "files" = @("custom-message.js", "package.json", "package-lock.json")
    }
    "define-auth-challenge" = @{
        "source" = "aws-lambda\auth"
        "files" = @("define-auth-challenge.js", "package.json", "package-lock.json")
    }
    "create-auth-challenge" = @{
        "source" = "aws-lambda\auth"
        "files" = @("create-auth-challenge.js", "package.json", "package-lock.json")
    }
    "verify-auth-challenge" = @{
        "source" = "aws-lambda\auth"
        "files" = @("verify-auth-challenge.js", "package.json", "package-lock.json")
    }
    "post-confirmation" = @{
        "source" = "aws-lambda\auth"
        "files" = @("post-confirmation.js", "package.json", "package-lock.json")
    }
}

function Package-Lambda {
    param([string]$Name, [string]$SourceDir, [array]$Files)
    
    Write-Host "Packaging: $Name" -ForegroundColor Yellow
    
    $TempDir = Join-Path $env:TEMP "lambda-$Name-$([guid]::NewGuid().ToString().Substring(0,8))"
    $ZipPath = "$Name-$Environment.zip"
    
    try {
        New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
        
        # Copy source files (aws-sdk is built-in to Lambda)
        Get-ChildItem -Path $SourceDir -File | Where-Object { $_.Name -match '\.js$' -or $_.Name -eq 'package.json' } | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination (Join-Path $TempDir $_.Name) -Force
        }
        
        if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
        
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::CreateFromDirectory($TempDir, $ZipPath, 'Optimal', $false)
        
        $ZipSize = (Get-Item $ZipPath).Length / 1024
        Write-Host "Created: $ZipPath ($('{0:F2}' -f $ZipSize) KB)" -ForegroundColor Green
        
        return $ZipPath
    }
    finally {
        if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
    }
}

# Check S3 bucket
Write-Host "Verifying S3 bucket: $S3Bucket" -ForegroundColor Cyan
aws s3api head-bucket --bucket $S3Bucket --region $AWSRegion 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 bucket not found" -ForegroundColor Red
    exit 1
}
Write-Host "S3 bucket exists`n" -ForegroundColor Green

# Package API Lambdas
Write-Host "Packaging API Lambda Functions" -ForegroundColor Cyan
$APIZips = @()
foreach ($name in $APILambdas.Keys) {
    $lambda = $APILambdas[$name]
    $zip = Package-Lambda -Name $name -SourceDir $lambda.source -Files $lambda.files
    if ($zip) {
        $APIZips += @{ Name = $name; Path = $zip }
    }
}

# Upload API Lambdas
Write-Host "`nUploading API Lambda ZIPs to S3" -ForegroundColor Cyan
foreach ($item in $APIZips) {
    Write-Host "Uploading: $($item.Path)" -ForegroundColor Yellow
    aws s3 cp $item.Path "s3://$S3Bucket/contact/$($item.Path)" --region $AWSRegion 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Uploaded successfully" -ForegroundColor Green
        Remove-Item $item.Path -Force
    }
}

# Package Cognito Lambdas
Write-Host "`nPackaging Cognito Lambda Functions" -ForegroundColor Cyan
$CognitoZips = @()
foreach ($name in $CognitoLambdas.Keys) {
    $lambda = $CognitoLambdas[$name]
    $zip = Package-Lambda -Name $name -SourceDir $lambda.source -Files $lambda.files
    if ($zip) {
        $CognitoZips += @{ Name = $name; Path = $zip }
    }
}

# Upload Cognito Lambdas
Write-Host "`nUploading Cognito Lambda ZIPs to S3" -ForegroundColor Cyan
foreach ($item in $CognitoZips) {
    Write-Host "Uploading: $($item.Path)" -ForegroundColor Yellow
    aws s3 cp $item.Path "s3://$S3Bucket/auth/$($item.Path)" --region $AWSRegion 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Uploaded successfully" -ForegroundColor Green
        Remove-Item $item.Path -Force
    }
}

Write-Host "`nComplete!" -ForegroundColor Green
Write-Host "API Lambdas: $($APIZips.Count) uploaded" -ForegroundColor Green
Write-Host "Cognito Lambdas: $($CognitoZips.Count) uploaded" -ForegroundColor Green
