#!/bin/bash

START_DELAY=30
CURRENT_TIME=$(date +%s)
GENESIS_TIME=$((CURRENT_TIME + START_DELAY))

/opt/teku/bin/teku \
 --network=minimal \
 --rest-api-enabled \
 --rest-api-cors-origins=http://localhost:2003 \
 --rest-api-host-allowlist=* \
 --log-file=/data/teku.log \
 --data-path=/data \
 --data-storage-mode=archive \
 --Xinterop-genesis-time=${GENESIS_TIME} \
 --Xinterop-owned-validator-start-index=0 \
 --Xinterop-owned-validator-count=7 \
 --Xinterop-number-of-validators=8 \
 --Xinterop-enabled \
 --p2p-enabled=false \
 --Xlog-wire-cipher-enabled \
 --Xlog-wire-mux-enabled \
 --Xlog-wire-gossip-enabled
