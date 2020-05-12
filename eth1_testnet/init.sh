#!/bin/bash
rm -rf /opt/eth1datadir
if [ ! -d /root/.ethereum/keystore ]; then
    echo "/root/.ethereum/keystore not found, running 'geth init'..."
    geth --nousb init --datadir /opt/eth1datadir /tmp/genesis.json
    geth --nousb account import /tmp/signer.key --datadir /opt/eth1datadir --password "/tmp/passwd.txt"
    echo "Display account list"
    geth --nousb account list --datadir /opt/eth1datadir
    echo "...done!"
fi

geth --datadir /opt/eth1datadir "$@"