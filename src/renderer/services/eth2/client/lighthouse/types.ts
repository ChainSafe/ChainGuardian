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
    block_proposal_slots: number[]
}