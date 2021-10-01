#! /bin/bash

exec lighthouse --debug-level $DEBUG_LEVEL beacon_node \
  --dummy-eth1 --http --http-address 0.0.0.0 --http-port 4051  \
  --enr-address 127.0.0.1 --enr-udp-port 9901 --enr-tcp-port 9901 --port 9911 \
  --testnet-dir /root/testnet \
  --datadir /root/beacon
