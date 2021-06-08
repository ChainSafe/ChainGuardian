/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable camelcase */

export type SignedBeaconBlockData = {
    message: Block;
    signature: string;
};

export interface Block {
    slot: string;
    proposer_index: string;
    parent_root: string;
    state_root: string;
    body: Body;
}

export interface Body {
    randao_reveal: string;
    eth1_data: Eth1Data;
    graffiti: string;
    proposer_slashings: ProposerSlashing[];
    attester_slashings: AttestationSlashing[];
    attestations: Attestation[];
    deposits: Deposit[];
    voluntary_exits: VoluntaryExit[];
}

export interface Eth1Data {
    deposit_root: string;
    deposit_count: string;
    block_hash: string;
}

export interface ProposerSlashing {
    signed_header_1: SignedHeader;
    signed_header_2: SignedHeader;
}

export interface SignedHeader {
    message: SignedHeaderMessage;
    signature: string;
}

export interface SignedHeaderMessage {
    slot: string;
    proposer_index: string;
    parent_root: string;
    state_root: string;
    body_root: string;
}

export interface AttestationSlashing {
    attestation_1: AttestationSlashingAttestation;
    attestation_2: AttestationSlashingAttestation;
}

export interface AttestationSlashingAttestation {
    attesting_indices?: string[] | null;
    signature: string;
    data: AttestationData;
}

export interface AttestationData {
    slot: string;
    index: string;
    beacon_block_root: string;
    source: SourceOrTarget;
    target: SourceOrTarget;
}

export interface SourceOrTarget {
    epoch: string;
    root: string;
}

export interface Attestation {
    aggregation_bits: string;
    signature: string;
    data: AttestationData;
}

export interface Deposit {
    proof?: string[] | null;
    data: DepositData;
}

export interface DepositData {
    pubkey: string;
    withdrawal_credentials: string;
    amount: string;
    signature: string;
}

export interface VoluntaryExit {
    message: VoluntaryExitMessage;
    signature: string;
}

export interface VoluntaryExitMessage {
    epoch: string;
    validator_index: string;
}
