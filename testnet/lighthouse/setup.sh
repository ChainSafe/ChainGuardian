#!/usr/bin/env bash

#
# Produces a testnet specification and a genesis state where the genesis time is now.
#

source ./vars.env
source ../../.env

docker run -v $TESTNET_DIR:/root/testnet $DOCKER_LCLI_IMAGE lcli \
	--spec mainnet \
	new-testnet \
	--deposit-contract-address 1234567890123456789012345678901234567890 \
	--testnet-dir /root/testnet \
	--genesis-delay 0 \
	--min-genesis-active-validator-count $GENESIS_COUNT \
	--force

echo Specification generated at $TESTNET_DIR.
echo "Generating $VALIDATOR_COUNT validators concurrently... (this may take a while)"

docker run -v $VALIDATORS_DIR:/root/validator -v $SECRETS_DIR:/root/secrets $DOCKER_LCLI_IMAGE lcli \
	insecure-validators \
	--count $VALIDATOR_COUNT \
	--validators-dir /root/validator \
	--secrets-dir /root/secrets

echo Validators generated at $VALIDATORS_DIR with keystore passwords at $SECRETS_DIR.
echo "Building genesis state... (this might take a while)"

docker run -v $TESTNET_DIR:/root/testnet $DOCKER_LCLI_IMAGE lcli \
	--spec mainnet \
	interop-genesis \
	--testnet-dir /root/testnet \
	$VALIDATOR_COUNT

echo Created genesis state in $TESTNET_DIR
