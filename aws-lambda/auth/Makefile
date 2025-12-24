.PHONY: build-SignupFunction build-VerifyEmailFunction build-PreSignUpFunction build-CustomMessageFunction build-CreateAuthChallengeFunction build-DefineAuthChallengeFunction build-VerifyAuthChallengeFunction build-PostConfirmationFunction build-CheckAdminFunction build-%

build-SignupFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-VerifyEmailFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-PreSignUpFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-CustomMessageFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-CreateAuthChallengeFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-DefineAuthChallengeFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-VerifyAuthChallengeFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-PostConfirmationFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

build-CheckAdminFunction:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"

# Fallback for any new function logical IDs (SAM calls: make build-<LogicalId>)
build-%:
	npm install --production
	mkdir -p "$(ARTIFACTS_DIR)"
	cp -r . "$(ARTIFACTS_DIR)/"
