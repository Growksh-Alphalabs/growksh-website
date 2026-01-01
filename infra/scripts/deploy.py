#!/usr/bin/env python3
"""
Growksh Infrastructure Deployment Script

This script automates the deployment of CloudFormation stacks with proper
parameterization for multi-account, multi-environment deployment.

Usage:
    python3 deploy.py --environment prod --region us-east-1 --verify-secret <secret>
    python3 deploy.py --environment feature-123 --frontend-url https://feature.growksh.com
"""

import argparse
import json
import subprocess
import sys
import os
import secrets
import string
from pathlib import Path
from typing import Dict, List, Optional


class DeploymentConfig:
    """Configuration for CloudFormation deployment"""
    
    def __init__(
        self,
        environment: str,
        region: str,
        ses_email: str,
        verify_base_url: str,
        verify_secret: Optional[str] = None,
        lambda_code_bucket: Optional[str] = None,
        lambda_code_source_env: Optional[str] = None,
        debug_otp: bool = False,
    ):
        self.environment = environment
        self.region = region
        self.ses_email = ses_email
        self.verify_base_url = verify_base_url
        self.verify_secret = verify_secret or self._generate_secret()
        self.lambda_code_bucket = lambda_code_bucket or ""
        self.lambda_code_source_env = lambda_code_source_env or environment
        self.debug_otp = "1" if debug_otp else "0"
    
    @staticmethod
    def _generate_secret(length: int = 32) -> str:
        """Generate a random secret for HMAC"""
        chars = string.ascii_letters + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))
    
    def get_stack_name(self, stack_number: int) -> str:
        """Get CloudFormation stack name"""
        stack_names = {
            2: "growksh-website-cognito",
            6: "growksh-website-api",
            7: "growksh-website-cognito-lambdas",
            8: "growksh-website-api-lambdas",
        }
        if stack_number not in stack_names:
            raise ValueError(f"Invalid stack number: {stack_number}")
        return f"{stack_names[stack_number]}-{self.environment}"
    
    def get_template_path(self, stack_number: int) -> str:
        """Get CloudFormation template path"""
        return f"infra/cloudformation/{stack_number:02d}-*.yaml"
    
    def get_cognito_parameters(self) -> Dict[str, str]:
        """Get parameters for Cognito User Pool stack"""
        return {
            "Environment": self.environment,
            "EnableTriggers": "false",  # Deploy without triggers first
        }
    
    def get_cognito_lambda_parameters(self) -> Dict[str, str]:
        """Get parameters for Cognito Lambdas stack"""
        return {
            "Environment": self.environment,
            "LambdaCodeSourceEnv": self.lambda_code_source_env,
            "LambdaCodeBucketName": self.lambda_code_bucket,
            "SESSourceEmail": self.ses_email,
            "VerifyBaseUrl": self.verify_base_url,
            "VerifySecret": self.verify_secret,
            "DebugLogOTP": self.debug_otp,
        }
    
    def get_api_lambda_parameters(self) -> Dict[str, str]:
        """Get parameters for API Lambdas stack"""
        return {
            "Environment": self.environment,
            "LambdaCodeSourceEnv": self.lambda_code_source_env,
            "LambdaCodeBucketName": self.lambda_code_bucket,
            "VerifyBaseUrl": self.verify_base_url,
            "VerifySecret": self.verify_secret,
        }
    
    def get_api_gateway_parameters(self) -> Dict[str, str]:
        """Get parameters for API Gateway stack"""
        return {
            "Environment": self.environment,
        }


class CloudFormationDeployer:
    """Handles CloudFormation stack deployment"""
    
    def __init__(self, region: str, dry_run: bool = False):
        self.region = region
        self.dry_run = dry_run
    
    def deploy_stack(
        self,
        stack_name: str,
        template_path: str,
        parameters: Dict[str, str],
        capabilities: Optional[List[str]] = None,
    ) -> bool:
        """Deploy a CloudFormation stack"""
        
        # Build parameter overrides
        param_list = [f"{k}={v}" for k, v in parameters.items()]
        
        # Build command
        cmd = [
            "aws", "cloudformation", "deploy",
            "--stack-name", stack_name,
            "--template-file", template_path,
            "--region", self.region,
            "--no-fail-on-empty-changeset",
        ]
        
        if param_list:
            cmd.extend(["--parameter-overrides"] + param_list)
        
        if capabilities:
            cmd.extend(["--capabilities"] + capabilities)
        
        print(f"\n{'='*70}")
        print(f"Deploying: {stack_name}")
        print(f"Region: {self.region}")
        print(f"Template: {template_path}")
        print(f"Parameters:")
        for k, v in parameters.items():
            # Mask sensitive values
            value = v if k not in ["VerifySecret"] else "***"
            print(f"  {k}: {value}")
        print(f"{'='*70}\n")
        
        if self.dry_run:
            print(f"[DRY RUN] Would execute: {' '.join(cmd)}")
            return True
        
        try:
            result = subprocess.run(cmd, check=True)
            return result.returncode == 0
        except subprocess.CalledProcessError as e:
            print(f"❌ Deployment failed: {e}", file=sys.stderr)
            return False
    
    def get_stack_output(self, stack_name: str, output_key: str) -> Optional[str]:
        """Get a specific output from deployed stack"""
        try:
            result = subprocess.run(
                [
                    "aws", "cloudformation", "describe-stacks",
                    "--stack-name", stack_name,
                    "--region", self.region,
                    "--query", f"Stacks[0].Outputs[?OutputKey=='{output_key}'].OutputValue",
                    "--output", "text",
                ],
                capture_output=True,
                text=True,
                check=True,
            )
            return result.stdout.strip() if result.stdout.strip() else None
        except subprocess.CalledProcessError:
            return None


def main():
    parser = argparse.ArgumentParser(
        description="Deploy Growksh infrastructure to AWS",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Deploy to dev environment
  %(prog)s --environment dev --region ap-south-1 --ses-email noreply@growksh.com

  # Deploy to production with custom secret
  %(prog)s --environment prod --region us-east-1 \\
    --ses-email noreply@growksh.com \\
    --verify-secret MySecretKey123456789

  # Deploy feature branch with dry-run
  %(prog)s --environment feature-123 --region ap-south-1 --dry-run

  # Deploy with pre-existing Lambda code bucket
  %(prog)s --environment prod --lambda-code-bucket my-existing-bucket \\
    --lambda-code-source-env prod
        """,
    )
    
    parser.add_argument(
        "--environment", "-e",
        required=True,
        help="Environment name (dev, staging, prod, feature-XXX)",
    )
    parser.add_argument(
        "--region", "-r",
        default="ap-south-1",
        help="AWS region (default: ap-south-1)",
    )
    parser.add_argument(
        "--ses-email",
        default="noreply@growksh.com",
        help="SES verified email for sending OTPs (default: noreply@growksh.com)",
    )
    parser.add_argument(
        "--verify-base-url",
        help="Base URL for email verification link (default: https://<environment>.growksh.com/auth/verify-email)",
    )
    parser.add_argument(
        "--verify-secret",
        help="Secret for HMAC verification (auto-generated if not provided)",
    )
    parser.add_argument(
        "--lambda-code-bucket",
        help="S3 bucket containing Lambda ZIPs (auto-created if not provided)",
    )
    parser.add_argument(
        "--lambda-code-source-env",
        help="Environment suffix in Lambda code (default: same as --environment)",
    )
    parser.add_argument(
        "--debug-otp",
        action="store_true",
        help="Enable debug logging for OTP Lambda functions",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deployed without actually deploying",
    )
    parser.add_argument(
        "--skip-lambda-stacks",
        action="store_true",
        help="Skip Lambda stack deployment (only deploy Cognito and API Gateway)",
    )
    
    args = parser.parse_args()
    
    # Set default verify base URL
    verify_base_url = args.verify_base_url
    if not verify_base_url:
        if args.environment == "prod":
            verify_base_url = "https://growksh.com/auth/verify-email"
        else:
            verify_base_url = f"https://{args.environment}.growksh.com/auth/verify-email"
    
    # Create config
    config = DeploymentConfig(
        environment=args.environment,
        region=args.region,
        ses_email=args.ses_email,
        verify_base_url=verify_base_url,
        verify_secret=args.verify_secret,
        lambda_code_bucket=args.lambda_code_bucket,
        lambda_code_source_env=args.lambda_code_source_env,
        debug_otp=args.debug_otp,
    )
    
    # Create deployer
    deployer = CloudFormationDeployer(region=args.region, dry_run=args.dry_run)
    
    print("\n" + "="*70)
    print("GROWKSH INFRASTRUCTURE DEPLOYMENT")
    print("="*70)
    print(f"Environment: {config.environment}")
    print(f"Region: {config.region}")
    print(f"SES Email: {config.ses_email}")
    print(f"Verify Base URL: {config.verify_base_url}")
    print(f"Verify Secret: {'[auto-generated]' if not args.verify_secret else '[provided]'}")
    print(f"Lambda Code Source Env: {config.lambda_code_source_env}")
    print(f"Lambda Code Bucket: {config.lambda_code_bucket or '[will be auto-created]'}")
    if args.dry_run:
        print(f"DRY RUN MODE: Changes will NOT be applied")
    print("="*70 + "\n")
    
    # Deployment order
    deployments = [
        (2, "Cognito User Pool (without triggers)", config.get_cognito_parameters()),
    ]
    
    if not args.skip_lambda_stacks:
        deployments.extend([
            (7, "Cognito Lambda Triggers", config.get_cognito_lambda_parameters()),
            (2, "Cognito User Pool (enable triggers)", {"Environment": config.environment, "EnableTriggers": "true"}),
            (8, "API Lambda Functions", config.get_api_lambda_parameters()),
        ])
    
    deployments.append(
        (6, "API Gateway", config.get_api_gateway_parameters())
    )
    
    # Execute deployments
    for stack_num, description, params in deployments:
        stack_name = config.get_stack_name(stack_num)
        template_path = f"infra/cloudformation/{stack_num:02d}-*.yaml"
        
        # Resolve template path glob
        template_files = list(Path(".").glob(template_path))
        if not template_files:
            print(f"❌ Template not found: {template_path}", file=sys.stderr)
            sys.exit(1)
        
        template_path = str(template_files[0])
        
        capabilities = ["CAPABILITY_NAMED_IAM"] if stack_num in [7, 8] else []
        
        success = deployer.deploy_stack(
            stack_name=stack_name,
            template_path=template_path,
            parameters=params,
            capabilities=capabilities,
        )
        
        if not success and not args.dry_run:
            print(f"❌ Deployment failed at stack {stack_num}: {description}", file=sys.stderr)
            sys.exit(1)
        
        print(f"✅ {description}: {stack_name}\n")
    
    # Output next steps
    if not args.dry_run:
        print("\n" + "="*70)
        print("DEPLOYMENT COMPLETE")
        print("="*70)
        print("\nNext steps:")
        print(f"1. Get Cognito User Pool ID:")
        print(f"   aws cloudformation describe-stacks --stack-name {config.get_stack_name(2)} \\")
        print(f"     --region {args.region} --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text")
        print(f"\n2. Get Cognito Client ID:")
        print(f"   aws cloudformation describe-stacks --stack-name {config.get_stack_name(2)} \\")
        print(f"     --region {args.region} --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text")
        print(f"\n3. Get API Endpoint:")
        print(f"   aws cloudformation describe-stacks --stack-name {config.get_stack_name(6)} \\")
        print(f"     --region {args.region} --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text")
        print(f"\n4. Update public/runtime-config.js with the above values")
        print(f"\n5. Rebuild and deploy frontend")
        print("="*70 + "\n")


if __name__ == "__main__":
    main()
