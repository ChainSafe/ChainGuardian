#!/usr/bin/env bash

exec lighthouse --debug-level $DEBUG_LEVEL beacon_node \
  --dummy-eth1 --http --http-address 0.0.0.0 --http-port 6052 \
	--testnet-dir /root/testnet \
	--datadir /root/beacon2 \
  --port 9902 --boot-nodes $(cat /root/beacon/beacon/network/enr.dat)