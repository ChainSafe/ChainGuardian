#!/bin/bash

#
# Resets the beacon state genesis time to now.
#

source ./vars.env

find ./data/validators/ -maxdepth 1 -type f -delete
sudo rm -rf ./data/beacon ./data/beacon2

NOW=$(date +%s)

docker run -v $TESTNET_DIR:/root/testnet $DOCKER_LCLI_IMAGE lcli \
  --testnet-dir /root/testnet \
	change-genesis-time /root/testnet/genesis.ssz $NOW

echo "Reset genesis time to now ($NOW)"
