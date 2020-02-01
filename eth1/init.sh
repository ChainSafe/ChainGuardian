#!/bin/bash
if [ ! -d /root/.ethereum/keystore ]; then
    echo "/root/.ethereum/keystore not found, running 'geth init'..."
    geth init --datadir /opt/eth1datadir /tmp/genesis.json
    echo "...done!"
fi

geth --datadir /opt/eth1datadir "$@"