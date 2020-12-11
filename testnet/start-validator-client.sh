#! /bin/bash

exec lighthouse --debug-level $DEBUG_LEVEL validator \
  --allow-unsynced --init-slashing-protection \
  --testnet-dir /root/testnet \
  --datadir /root
