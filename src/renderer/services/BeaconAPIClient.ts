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
    FETCH_FORK_INFORMATION,
    FETCH_VALIDATOR_DUTIES,
    FETCH_VALIDATOR_BLOCK,
    PUBLISH_SIGNED_BLOCK,
    PRODUCE_ATTESTATION,
    PUBLISH_SIGNED_ATTESTATION
} from '../constants/apiUrls';

interface Syncing {
    is_syncing: bool;
    sync_status: SyncingStatus;
}

interface ForkInformation {
    chain_id: uint64;
    fork: Fork;
}

interface BeaconAPIClientInterface {
    fetchNodeVersion(): Promise<string>;
    fetchGenesisTime(): Promise<uint64>;
    fetchNodeSyncing(): Promise<Syncing>;
    fetchForkInformation(): Promise<ForkInformation>;
    fetchValidatorDuties(validator_pubkeys: BLSPubkey[], epoch: Epoch): Promise<ValidatorDuty>;
    fetchValidatorBlock(slot: Slot, randao_reveal: string): Promise<BeaconBlock>;
    publishSignedBlock(beacon_block: BeaconBlock): Promise<any>;
    produceAttestation(
        validator_pubkey: BLSPubkey,
        poc_bit: uint8,
        slot: Slot,
        shard: Shard
    ): Promise<IndexedAttestation>;
    publishSignedAttestation(attestation: IndexedAttestation): Promise<any>;
}

export class BeaconAPIClient implements BeaconAPIClientInterface {
    async fetchNodeVersion() {
        // TODO handle error catch
        try {
            const result = await this.genericFetch<string>(FETCH_NODE_VERSION);
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async fetchGenesisTime() {
        // TODO handle error catch
        try {
            const result = await this.genericFetch<uint64>(FETCH_GENESIS_TIME);
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async fetchNodeSyncing() {
        // TODO handle error catch
        try {
            const result = await this.genericFetch<Syncing>(POLL_NODE_SYNCING);
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async fetchForkInformation() {
        // TODO handle error catch
        try {
            const result = this.genericFetch<ForkInformation>(FETCH_FORK_INFORMATION);
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async fetchValidatorDuties(validator_pubkeys: BLSPubkey[], epoch: Epoch) {
        // TODO handle error catch
        try {
            const result = this.genericFetch<ValidatorDuty>(FETCH_VALIDATOR_DUTIES(validator_pubkeys, epoch));
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async fetchValidatorBlock(slot: Slot, randao_reveal: string) {
        // TODO handle error catch
        try {
            const result = this.genericFetch<BeaconBlock>(FETCH_VALIDATOR_BLOCK(slot, randao_reveal));
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async publishSignedBlock(beacon_block: BeaconBlock) {
        // TODO handle error catch
        try {
            const result = await this.genericPost<any>(PUBLISH_SIGNED_BLOCK(beacon_block));
            return result.status;
        } catch (error) {
            return error.response.status;
        }
    }

    async produceAttestation(validator_pubkey: BLSPubkey, poc_bit: uint8, slot: Slot, shard: Shard) {
        // TODO handle error catch
        try {
            const result = await this.genericFetch<IndexedAttestation>(
                PRODUCE_ATTESTATION(validator_pubkey, poc_bit, slot, shard)
            );
            return result;
        } catch (error) {
            return error.response.status;
        }
    }

    async publishSignedAttestation(attestation: IndexedAttestation) {
        // TODO handle error catch
        try {
            const result = await this.genericPost<any>(PUBLISH_SIGNED_ATTESTATION(attestation));
            return result.status;
        } catch (error) {
            return error.response.status;
        }
    }

    /**
     * Function that encapsulate executing GET method and returns Promise with generic type
     * @param url endpoint for fetch
     */
    async genericFetch<T>(url: string): Promise<T> {
        let result: T;

        const promise: Promise<T> = new Promise((resolve, reject) => {
            this.fetchFromApi(url, (err: any, response: any) => {
                if (!err) {
                    resolve(response.data);
                } else {
                    reject(err);
                }
            });
        });

        // wait until the promise returns us a value
        result = await promise;
        return result;
    }

    /**
     * Function that encapsulate executing POST method and returns Promise with generic type
     * @param url endpoint for fetch
     * @param data body for POST method
     */
    async genericPost<T>(url: string, ...data: any[]): Promise<T> {
        let result: T;

        const promise: Promise<T> = new Promise((resolve, reject) => {
            this.postToApi(url, data, (err: any, response: any) => {
                if (!err) {
                    resolve(response);
                } else {
                    reject(err);
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
                // TODO handle error.response, error.request
                callback(err, null);
            });
    };

    /**
     * Helper function for GET method
     * @param url endpoint url
     * @param callback callback function that will return either response or error
     */
    fetchFromApi = (url: string, callback: Function) => {
        axios
            .get(url)
            .then(response => {
                callback(null, response);
            })
            .catch(err => {
                callback(err, null);
            });
    };
}
