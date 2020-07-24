#!/bin/bash
set -e
#
# Produces a testnet specification and a genesis state where the genesis time
# is now.
#
lcli \
	--spec minimal \
	new-testnet \
	--deposit-contract-address 2f1598e74b146f5687174c13f8edcf490b2492e3 \
	--testnet-dir $1 \
	--genesis-delay 0 \
	--min-genesis-active-validator-count 16 \
	--force

echo Specification generated.


echo "Generating 15 validators concurrently..."

lcli \
	insecure-validators \
	--count 15 \
	--validators-dir $1/validators \
	--secrets-dir $1/secrets

echo Validators generated at $1/validators with keystore passwords at $1/secrets.
