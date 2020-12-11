#! /bin/bash

exec lighthouse --debug-level $DEBUG_LEVEL beacon_node \
  --dummy-eth1 --http --http-address 0.0.0.0 \
  --testnet-dir /root/testnet \
  --datadir /root/beacon
