export type Assignments = {
    epoch: string;
    assignments: {
        beaconCommittees: string[];
        committeeIndex: string;
        attesterSlot: string;
        proposerSlots: string[];
        publicKey: string;
        validatorIndex: string;
    }[];
    nextPageToken: string;
    totalSize: number;
};

export type Duty = {
    committee: string[];
    committeeIndex: string;
    attesterSlot: string;
    proposerSlots: string[];
    publicKey: string;
    validatorIndex: string;
    status: string;
};

export type DutiesResponse = {
    currentEpochDuties: Duty[];
    nextEpochDuties: Duty[];
};

export type ValidatorStatusResponse = {
    publicKey: string;
    withdrawalCredentials: string;
    effectiveBalance: string;
    slashed: boolean;
    activationEligibilityEpoch: string;
    activationEpoch: string;
    exitEpoch: string;
    withdrawableEpoch: string;
};

export type ValidatorStateResponse = {
    status: string;
    eth1DepositBlockNumber: string;
    depositInclusionSlot: string;
    activationEpoch: string;
    positionInActivationQueue: string;
};

export type BeaconBlock = {
    slot: string;
    proposerIndex: string;
    parentRoot: string;
    stateRoot: string;
    body: {
        randaoReveal: string;
        eth1Data: {
            depositRoot: string;
            depositCount: string;
            blockHash: string;
        };
        graffiti: string;
        proposerSlashings: ProposerSlashing[];
        attesterSlashings: AttesterSlashing[];
        attestations: Attestation[];
        deposits: Deposit[];
        voluntaryExits: SignedVoluntaryExit[];
    };
};

export type ProposerSlashing = {
    header1: SignedBeaconBlockHeader;
    header2: SignedBeaconBlockHeader;
};

export type SignedBeaconBlockHeader = {
    signature: string;
    header: BeaconBlockHeader;
};

export type BeaconBlockHeader = {
    slot: string;
    proposerIndex: string;
    parentRoot: string;
    stateRoot: string;
    bodyRoot: string;
};

export type AttesterSlashing = {
    attestation1: IndexedAttestation;
    attestation2: IndexedAttestation;
};

export type IndexedAttestation = {
    attestingIndices: string[];
    signature: string;
    data: AttestationData;
};

export type Attestation = {
    aggregationBits: string;
    data: AttestationData;
    signature: string;
};

export type AttestationData = {
    slot: string;
    committeeIndex: string;
    beaconBlockRoot: string;
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
        publicKey: string;
        withdrawalCredentials: string;
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
    validatorIndex: string;
};

export type SignedBeaconBlock = {
    block: BeaconBlock;
    signature: string;
};

export type AggregateAttestationAndProof = {
    aggregatorIndex: string;
    aggregate: Attestation;
    selectionProof: string;
};

export type SignedAggregateAttestationAndProof = {
    message: AggregateAttestationAndProof;
    signature: string;
};

export type ChainHead = {
    headSlot: string;
    headEpoch: string;
    headBlockRoot: string;

    finalizedSlot: string;
    finalizedEpoch: string;
    finalizedBlockRoot: string;

    justifiedSlot: string;
    justifiedEpoch: string;
    justifiedBlockRoot: string;

    previousJustifiedSlot: string;
    previousJustifiedEpoch: string;
    previousJustifiedBlockRoot: string;
};

export type ListBlocksResponse = {
    blockContainers: BeaconBlockContainer[];
    nextPageToken: string;
    totalSize: number;
};

export type BeaconBlockContainer = {
    block: SignedBeaconBlock;
    blockRoot: string;
    canonical: boolean;
};

export type AttestationEvent = {
    // eslint-disable-next-line camelcase
    aggregation_bits: string;
    data: {
        // eslint-disable-next-line camelcase
        beacon_block_root: string;
        index: string;
        slot: string;
        source: Checkpoint;
        target: Checkpoint;
    };
    signature: string;
};

export type AttestationEventV2 = {
    // eslint-disable-next-line camelcase
    aggregator_index: string;
    aggregate: AttestationEvent;
    // eslint-disable-next-line camelcase
    selection_proof: string;
};
