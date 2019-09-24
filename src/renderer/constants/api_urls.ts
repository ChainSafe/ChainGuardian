export const API_URL: String = `https://${process.env.HOSTNAME}:${process.env.PORT}`;

/**
 * Minimal Beacon Node API for Validator
 *
 * A minimal API specification for the beacon node, which enables
 * a validator to connect and perform its obligations on the Ethereum
 * 2.0 phase 0 beacon chain.
 */

export const FETCH_NODE_VERSION: String = `${API_URL}/node/version`;
export const FETCH_GENESIS_TIME: String = `${API_URL}/node/genesis_time`;
export const POLL_NODE_SYNCING: String = `${API_URL}/node/syncing`;
export const FETCH_FORK_INFORMATION: String = `${API_URL}/node/fork`;

export const FETCH_VALIDATOR_DUTIES: Function = (validator_pubkeys: String[], epoch: Number) => {
    return `${API_URL}/validator/duties?validator_pubkeys=${validator_pubkeys}&epoch=${epoch}`;
};

export const FETCH_VALIDATOR_BLOCK: Function = (slot: Number, randao_reveal: String) => {
    return `${API_URL}/validator/block?slot=${slot}&randao_reveal=${randao_reveal}`;
};

export const PUBLISH_SIGNED_BLOCK: Function = (beacon_block: Object) => {
    return `${API_URL}/validator/block?beacon_block=${beacon_block}`;
};

export const PRODUCE_ATTESTATION: Function = (
    validator_pubkey: String,
    poc_bit: Number,
    slot: Number,
    shard: Number
) => {
    return `${API_URL}/validator/attestation?validator_pubkey=${validator_pubkey}&poc_bit=${poc_bit}&slot=${slot}&shard=${shard}`;
};
