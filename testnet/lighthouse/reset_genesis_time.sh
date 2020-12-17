#!/bin/bash

#
# Resets the beacon state genesis time to now.
#

source ./vars.env

NOW=$(date +%s)

docker run -v $TESTNET_DIR:/root/testnet $DOCKER_LCLI_IMAGE lcli \
	change-genesis-time /root/testnet/genesis.ssz $NOW

echo "Reset genesis time to now ($NOW)"
