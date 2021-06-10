/* eslint-disable camelcase */

export type Assignments = {
    epoch: string;
    assignments: {
        beacon_committees: string[];
        committee_index: string;
        attester_slot: string;
        proposer_slots: string[];
        public_key: string;
        validator_index: string;
    }[];
    next_page_token: string;
    total_size: number;
};

export type Duty = {
    committee: string[];
    committee_index: string;
    attester_slot: string;
    proposer_slots: string[];
    public_key: string;
    validator_index: string;
    status: string;
};

export type DutiesResponse = {
    current_epoch_duties: Duty[];
    next_epoch_duties: Duty[];
};

export type ValidatorStatusResponse = {
    public_key: string;
    withdrawal_credentials: string;
    effective_balance: string;
    slashed: boolean;
    activation_eligibility_epoch: string;
    activation_epoch: string;
    exit_epoch: string;
    withdrawable_epoch: string;
};

export type ValidatorStateResponse = {
    status: string;
    eth1_deposit_block_number: string;
    deposit_inclusion_slot: string;
    activation_epoch: string;
    position_in_activation_queue: string;
};

export type BeaconBlock = {
    slot: string;
    proposer_index: string;
    parent_root: string;
    state_root: string;
    body: {
        randao_reveal: string;
        eth1_data: {
            deposit_root: string;
            deposit_count: string;
            block_hash: string;
        };
        graffiti: string;
        proposer_slashings: ProposerSlashing[];
        attester_slashings: AttesterSlashing[];
        attestations: Attestation[];
        deposits: Deposit[];
        voluntary_exits: SignedVoluntaryExit[];
    };
};

export type ProposerSlashing = {
    header_1: SignedBeaconBlockHeader;
    header_2: SignedBeaconBlockHeader;
};

export type SignedBeaconBlockHeader = {
    signature: string;
    header: BeaconBlockHeader;
};

export type BeaconBlockHeader = {
    slot: string;
    proposer_index: string;
    parent_root: string;
    state_root: string;
    body_root: string;
};

export type AttesterSlashing = {
    attestation_1: IndexedAttestation;
    attestation_2: IndexedAttestation;
};

export type IndexedAttestation = {
    attesting_indices: string[];
    signature: string;
    data: AttestationData;
};

export type Attestation = {
    aggregation_bits: string;
    data: AttestationData;
    signature: string;
};

export type AttestationData = {
    slot: string;
    committee_index: string;
    beacon_block_root: string;
    source: Checkpoint;
    target: Checkpoint;
};

export type Checkpoint = {
    epoch: string;
    root: string;
};

export type Deposit = {
    proof: string[];
    data: {
        public_key: string;
        withdrawal_credentials: string;
        amount: string;
        signature: string;
    };
};

export type SignedVoluntaryExit = {
    exit: VoluntaryExit;
    signature: string;
};

export type VoluntaryExit = {
    epoch: string;
    validator_index: string;
};

export type SignedBeaconBlock = {
    block: BeaconBlock;
    signature: string;
};

export type AggregateAttestationAndProof = {
    aggregator_index: string;
    aggregate: Attestation;
    selection_proof: string;
};

export type SignedAggregateAttestationAndProof = {
    message: AggregateAttestationAndProof;
    signature: string;
};

export type ChainHead = {
    head_slot: string;
    head_epoch: string;
    head_block_root: string;

    finalized_slot: string;
    finalized_epoch: string;
    finalized_block_root: string;

    justified_slot: string;
    justified_epoch: string;
    justified_block_root: string;

    previous_justified_slot: string;
    previous_justified_epoch: string;
    previous_justified_block_root: string;
};

export type ListBlocksResponse = {
    blockContainers: BeaconBlockContainer[];
    next_page_token: string;
    total_size: number;
};

export type BeaconBlockContainer = {
    block: SignedBeaconBlock;
    block_root: string;
    canonical: boolean;
};
