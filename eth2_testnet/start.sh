#!/bin/bash

rm -rf /opt/eth2_testnet/genesis.ssz
rm -rf ~/.lighthouse/beacon
rm -rf ~/.lighthouse/validators
/opt/wait-for.sh eth1-node:8545
sleep 10
lcli --spec minimal interop-genesis -d /opt/eth2_testnet 16
lighthouse -s minimal account validator new \
  --testnet-dir /opt/eth2_testnet \
  --send-deposits \
  --account-index 0 \
  --eth1-endpoint http://eth1-node:8545 \
  --password /opt/passwd.txt \
  --deposit-value 32000000000 \
  insecure \
  0 16
lighthouse -s minimal bn --eth1 --eth1-endpoint http://eth1-node:8545 --http --http-address 0.0.0.0 --maxpeers 0 --testnet-dir /opt/eth2_testnet
