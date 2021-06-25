#!/usr/bin/env bash

#
# Produces a testnet specification and a genesis state where the genesis time is now.
#

source ./vars.env
source ../../.env

docker run -v $TESTNET_DIR:/data $DOCKER_GENESIS_STATE_GEN_IMAGE \
	--output-ssz=/data/genesis.ssz \
	--num-validators=$VALIDATOR_COUNT \
	--mainnet-config=true

echo Created genesis state in $TESTNET_DIR
