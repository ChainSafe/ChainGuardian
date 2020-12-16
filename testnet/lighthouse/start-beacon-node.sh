#! /bin/bash

exec lighthouse --debug-level $DEBUG_LEVEL beacon_node \
  --dummy-eth1 --http --http-address 0.0.0.0 \
  --enr-address 127.0.0.1 --enr-udp-port 9000 --enr-tcp-port 9000 \
  --testnet-dir /root/testnet \
  --datadir /root/beacon
