#!/bin/bash

lcli -s minimal interop-genesis -t $(date +%s) -d /opt/cg_testnet 32
lighthouse -s minimal bn --eth1 --eth1-endpoint http://eth1-node:8545 --http --http-address 0.0.0.0 --maxpeers 0 --testnet-dir /opt/cg_testnet testnet -r file ssz /opt/cg_testnet/genesis.ssz