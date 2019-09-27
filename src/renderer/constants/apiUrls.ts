import { Epoch, Slot, Shard, BLSPubkey, BeaconBlock, uint8, IndexedAttestation } from '@chainsafe/eth2.0-types';
import { DEFAULT_HOSTNAME, DEFAULT_PORT } from './defaultConstants';

export const API_URL: string = `https://${process.env.HOSTNAME || DEFAULT_HOSTNAME}:${process.env.PORT ||
    DEFAULT_PORT}`;

/**
 * Minimal Beacon Node API for Validator
 *
 * A minimal API specification for the beacon node, which enables
 * a validator to connect and perform its obligations on the Ethereum
 * 2.0 phase 0 beacon chain.
 */

export const FETCH_NODE_VERSION: string = `/node/version`;
export const FETCH_GENESIS_TIME: string = `/node/genesis_time`;
export const POLL_NODE_SYNCING: string = `/node/syncing`;
export const FETCH_FORK_INFORMATION: string = `/node/fork`;
export const PUBLISH_SIGNED_BLOCK: string = `/validator/block?beacon_block`;
export const PUBLISH_SIGNED_ATTESTATION: string = `/validator/attestation`;

export const FETCH_VALIDATOR_DUTIES: Function = (validatorPubKeys: BLSPubkey[], epoch: Epoch) => {
    const hexPubKeys = validatorPubKeys.map(key => key.toString('hex'));
    return `/validator/duties?validator_pubkeys=${hexPubKeys}&epoch=${epoch}`;
};

export const FETCH_VALIDATOR_BLOCK: Function = (slot: Slot, randaoReveal: string) => {
    return `/validator/block?slot=${slot}&randao_reveal=${randaoReveal}`;
};

export const PRODUCE_ATTESTATION: Function = (validatorPubkey: BLSPubkey, pocBit: uint8, slot: Slot, shard: Shard) => {
    const hexPubKey = validatorPubkey.toString('hex');
    return `/validator/attestation?validator_pubkey=${hexPubKey}&poc_bit=${pocBit}&slot=${slot}&shard=${shard}`;
};
