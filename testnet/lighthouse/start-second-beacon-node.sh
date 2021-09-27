#!/usr/bin/env bash

exec lighthouse --debug-level $DEBUG_LEVEL beacon_node \
  --dummy-eth1 --http --http-address 0.0.0.0 --http-port 4050 \
  --enr-address 127.0.0.1 --enr-udp-port 9900 --enr-tcp-port 9900 \
	--testnet-dir /root/testnet \
	--datadir /root/beacon2 \
  --port 9910 --boot-nodes $(cat /root/beacon/beacon/network/enr.dat)