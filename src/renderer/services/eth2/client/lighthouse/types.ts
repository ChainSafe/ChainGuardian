/* eslint-disable camelcase */
export interface ILighthouseDutiesRequest {
    epoch: number,
    pubkeys: string[]
}
export interface ILighthouseDutiesResponse {
    validator_pubkey: string,
    validator_index: number,
    attestation_slot: number,
    attestation_committee_index: number,
    attestation_committee_position: number,
    block_proposal_slots: number[],
    aggregator_modulo: number
}

export type ILighthouseSyncResponse = {
    is_syncing: boolean,
    sync_status: {
        starting_slot: number,
        current_slot: number,
        highest_slot: number
    }
};
