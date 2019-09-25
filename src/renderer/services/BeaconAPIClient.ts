import axios from 'axios';
import {
    uint64,
    bool,
    SyncingStatus,
    Fork,
    BLSPubkey,
    Epoch,
    ValidatorDuty,
    Slot,
    BeaconBlock,
    uint8,
    Shard,
    IndexedAttestation
} from '@chainsafe/eth2.0-types';
import {
    FETCH_NODE_VERSION,
    FETCH_GENESIS_TIME,
    POLL_NODE_SYNCING,
    FETCH_FORK_INFORMATION
} from '../constants/apiUrls';

interface Syncing {
    is_syncing: bool;
    sync_status: SyncingStatus;
}

interface ForkInformation {
    chain_id: uint64;
    fork: Fork;
}

enum Responses {
    'Success' = 200,
    'InvalidRequest' = 400,
    'NotFound' = 404,
    'InternalError' = 500,
    'CurrentlySyncing' = 503
}

interface BeaconAPIClientInterface {
    fetchNodeVersion(): Promise<string>;
    fetchGenesisTime(): Promise<uint64>;
    fetchNodeSyncing(): Promise<Syncing>;
    fetchForkInformation(): Promise<ForkInformation>;
    /*
  fetchValidatorDuties(validator_pubkeys: BLSPubkey[], epoch: Epoch): ValidatorDuty;
  fetchValidatorBlock(slot: Slot, randao_reveal: string): BeaconBlock;
  publishSignedBlock(beacon_block: BeaconBlock): Responses;
  produceAttestation(validator_pubkey: BLSPubkey,
    poc_bit: uint8,
    slot: Slot,
    shard: Shard): IndexedAttestation
  publishSignedAttestation(attestation: IndexedAttestation): Responses
  */
}

export class BeaconAPIClient implements BeaconAPIClientInterface {
    async fetchNodeVersion() {
        let result: string = '';

        const promise: Promise<string> = new Promise((res, rej) => {
            this.fetchFromApi(FETCH_NODE_VERSION, (err: any, response: string) => {
                if (!err) {
                    res(response);
                } else {
                    console.log(err);
                }
            });
        });

        // wait until the promise returns us a value
        result = await promise;
        return result;
    }

    async fetchGenesisTime() {
        let result: uint64 = '';

        const promise: Promise<uint64> = new Promise((res, rej) => {
            this.fetchFromApi(FETCH_GENESIS_TIME, (err: any, response: uint64) => {
                if (!err) {
                    res(response);
                } else {
                    console.log(err);
                }
            });
        });

        // wait until the promise returns us a value
        result = await promise;
        return result;
    }

    async fetchNodeSyncing() {
        let result: any = null;

        const promise: Promise<Syncing> = new Promise((res, rej) => {
            this.fetchFromApi(POLL_NODE_SYNCING, (err: any, response: Syncing) => {
                if (!err) {
                    res(response);
                } else {
                    console.log(err);
                }
            });
        });

        // wait until the promise returns us a value
        result = await promise;
        return result;
    }

    async fetchForkInformation() {
        let result: any = null;

        const promise: Promise<ForkInformation> = new Promise((res, rej) => {
            this.fetchFromApi(FETCH_FORK_INFORMATION, (err: any, response: ForkInformation) => {
                if (!err) {
                    res(response);
                } else {
                    console.log(err);
                }
            });
        });

        // wait until the promise returns us a value
        result = await promise;
        return result;
    }

    /**
     * Helper function for POST method
     * @param url endpoint url
     * @param data request body
     * @param callback callback function that will return either response or error
     */
    postToApi = (url: string, data: any = {}, callback: Function) => {
        axios
            .post(url, data)
            .then(response => {
                callback(null, response);
            })
            .catch(err => {
                callback(err, null);
            });
    };

    /**
     * Helper function for GET method
     * @param url endpoint url
     * @param callback callback function that will return either response or error
     */
    fetchFromApi = (url: string, callback: Function) => {
        // TODO call real API

        // NOTE timeout simaluting real API call
        setTimeout(() => {
            switch (url) {
                case FETCH_NODE_VERSION:
                    callback(null, '1');
                    break;
                case FETCH_GENESIS_TIME:
                    callback(null, 2);
                    break;
                case POLL_NODE_SYNCING:
                    callback(null, {
                        is_syncing: true,
                        sync_status: {
                            startingBlock: 1,
                            currentBlock: 2,
                            highestBlock: 3
                        }
                    });
                    break;
                case FETCH_FORK_INFORMATION:
                    callback(null, {
                        chain_id: 1,
                        fork: {
                            previousVersion: 1,
                            currentVersion: 2,
                            epoch: 3
                        }
                    });
                    break;
                default:
                    break;
            }
        }, 1000);

        /*
    axios.get(url)
        .then(response => {
            callback(null, response)
        }).catch(err => {
            callback(err, null)
        })
    */
    };
}
