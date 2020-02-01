#!/bin/bash
if [ ! -d /root/.ethereum/keystore ]; then
    echo "/root/.ethereum/keystore not found, running 'geth init'..."
    geth init /tmp/genesis.json
    echo "...done!"
fi

geth "$@"