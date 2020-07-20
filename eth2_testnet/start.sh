#!/bin/bash

rm -rf /opt/eth2_testnet/genesis.ssz
rm -rf ~/.lighthouse/beacon
rm -rf ~/.lighthouse/validators
#/opt/wait-for.sh eth1-node:8545
#sleep 10

#rm -rf /opt/eth2_testnet/validators/**/.lock
#lighthouse am validator deposit \
#  --testnet-dir /opt/eth2_testnet \
#  --validator-dir /opt/eth2_testnet/validators \
#  --spec minimal \
#  --from-address E574F2A090380F4AF972b7CB1dF95aD21b566F37 \
#  --validator all \
#  --eth1-http http://eth1-node:8545

lcli \
	--spec minimal \
	interop-genesis \
	--testnet-dir /opt/eth2_testnet \
	16

#lighthouse -s minimal bn  --eth1 --eth1-endpoint http://eth1-node:8545 --http --http-address 0.0.0.0 --max-peers 0 --testnet-dir /opt/eth2_testnet
lighthouse -s minimal bn  --dummy-eth1 --disable-discovery --http --http-address 0.0.0.0 --max-peers 0 --testnet-dir /opt/eth2_testnet
