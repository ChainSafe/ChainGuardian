import { Epoch, Slot, Shard, BLSPubkey, BeaconBlock, uint8 } from '@chainsafe/eth2.0-types';

export const API_URL: String = `https://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || '3000'}`;

/**
 * Minimal Beacon Node API for Validator
 *
 * A minimal API specification for the beacon node, which enables
 * a validator to connect and perform its obligations on the Ethereum
 * 2.0 phase 0 beacon chain.
 */

export const FETCH_NODE_VERSION: string = `${API_URL}/node/version`;
export const FETCH_GENESIS_TIME: string = `${API_URL}/node/genesis_time`;
export const POLL_NODE_SYNCING: string = `${API_URL}/node/syncing`;
export const FETCH_FORK_INFORMATION: string = `${API_URL}/node/fork`;

export const FETCH_VALIDATOR_DUTIES: Function = (validator_pubkeys: BLSPubkey[], epoch: Epoch) => {
    return `${API_URL}/validator/duties?validator_pubkeys=${validator_pubkeys}&epoch=${epoch}`;
};

export const FETCH_VALIDATOR_BLOCK: Function = (slot: Slot, randao_reveal: string) => {
    return `${API_URL}/validator/block?slot=${slot}&randao_reveal=${randao_reveal}`;
};

export const PUBLISH_SIGNED_BLOCK: Function = (beacon_block: BeaconBlock) => {
    return `${API_URL}/validator/block?beacon_block=${beacon_block}`;
};

export const PRODUCE_ATTESTATION: Function = (
    validator_pubkey: BLSPubkey,
    poc_bit: uint8,
    slot: Slot,
    shard: Shard
) => {
    return `${API_URL}/validator/attestation?validator_pubkey=${validator_pubkey}&poc_bit=${poc_bit}&slot=${slot}&shard=${shard}`;
};
