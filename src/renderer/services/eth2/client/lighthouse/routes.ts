export enum LighthouseRoutes {
    GET_GENESIS_TIME = "/beacon/genesis_time",
    GET_FORK= "/beacon/fork",
    GET_GENESIS_VALIDATORS_ROOT = "/beacon/genesis_validators_root",
    GET_VERSION = "/node/version",
    GET_SYNC_STATUS = "/lighthouse/syncing",
    GET_VALIDATORS = "/beacon/validators",

    //validator related
    GET_DUTIES = "/validator/duties",
    GET_ATTESTATION = "/validator/attestation",
    PUBLISH_ATTESTATION = "/validator/attestation",
    GET_BLOCK = "/validator/block",
    PUBLISH_BLOCK = "/validator/block",
    SUBSCRIBE_TO_COMMITTEE_SUBNET = "/validator/subscribe",
    GET_AGGREGATED_ATTESTATION = "/validator/aggregate_attestation",
    PUBLISH_AGGREGATES_AND_PROOFS = "/validator/aggregate_and_proofs"
}