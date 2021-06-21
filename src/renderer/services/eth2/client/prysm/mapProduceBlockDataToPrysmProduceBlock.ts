import {
    AttestationSlashingAttestation,
    Attestation,
    AttestationSlashing,
    AttestationData,
    Deposit,
    ProposerSlashing,
    SignedBeaconBlockData,
    SignedHeader,
    VoluntaryExit,
} from "./map.types";
import {
    Attestation as PrysmAttestation,
    AttestationData as PrysmAttestationData,
    AttesterSlashing as PrysmAttesterSlashing,
    Deposit as PrysmDeposit,
    IndexedAttestation as PrysmIndexedAttestation,
    ProposerSlashing as PrysmProposerSlashing,
    SignedBeaconBlockHeader as PrysmSignedBeaconBlockHeader,
    SignedVoluntaryExit as PrysmSignedVoluntaryExit,
    SignedBeaconBlock,
} from "./types";
import {hexToBase64} from "./utils";

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

export const mapProduceBlockDataToPrysmProduceBlock = (data: SignedBeaconBlockData): SignedBeaconBlock => ({
    block: {
        slot: data.message.slot,
        proposerIndex: data.message.proposer_index,
        parentRoot: hexToBase64(data.message.parent_root),
        stateRoot: hexToBase64(data.message.state_root),
        body: {
            randaoReveal: hexToBase64(data.message.body.randao_reveal),
            eth1Data: {
                depositRoot: hexToBase64(data.message.body.eth1_data.deposit_root),
                depositCount: data.message.body.eth1_data.deposit_count,
                blockHash: hexToBase64(data.message.body.eth1_data.block_hash),
            },
            graffiti: hexToBase64(data.message.body.graffiti),
            proposerSlashings: data.message.body.proposer_slashings.map(mapProposerSlashing),
            attesterSlashings: data.message.body.attester_slashings.map(mapAttesterSlashing),
            attestations: data.message.body.attestations.map(mapAttestation),
            deposits: data.message.body.deposits.map(mapDeposit),
            voluntaryExits: data.message.body.voluntary_exits.map(mapVoluntaryExit),
        },
    },
    signature: hexToBase64(data.signature),
});

export const mapProposerSlashing = (proposerSlashing: ProposerSlashing): PrysmProposerSlashing => ({
    header1: mapSignedHeader(proposerSlashing.signed_header_1),
    header2: mapSignedHeader(proposerSlashing.signed_header_2),
});

export const mapSignedHeader = (signedHeader: SignedHeader): PrysmSignedBeaconBlockHeader => ({
    header: {
        slot: signedHeader.message.slot,
        proposerIndex: signedHeader.message.proposer_index,
        parentRoot: hexToBase64(signedHeader.message.parent_root),
        stateRoot: hexToBase64(signedHeader.message.state_root),
        bodyRoot: hexToBase64(signedHeader.message.body_root),
    },
    signature: hexToBase64(signedHeader.signature),
});

export const mapAttesterSlashing = (attesterSlashing: AttestationSlashing): PrysmAttesterSlashing => ({
    attestation1: mapAttesterSlashingAttestation(attesterSlashing.attestation_1),
    attestation2: mapAttesterSlashingAttestation(attesterSlashing.attestation_2),
});

export const mapAttesterSlashingAttestation = (
    attesterSlashing: AttestationSlashingAttestation,
): PrysmIndexedAttestation => ({
    attestingIndices: attesterSlashing.attesting_indices || [],
    data: mapAttestationData(attesterSlashing.data),
    signature: hexToBase64(attesterSlashing.signature),
});

export const mapAttestation = (attestation: Attestation): PrysmAttestation => ({
    aggregationBits: hexToBase64(attestation.aggregation_bits),
    data: mapAttestationData(attestation.data),
    signature: hexToBase64(attestation.signature),
});

export const mapAttestationData = (data: AttestationData): PrysmAttestationData => ({
    slot: data.slot,
    committeeIndex: data.index,
    beaconBlockRoot: hexToBase64(data.beacon_block_root),
    source: {
        epoch: data.source.epoch,
        root: hexToBase64(data.source.root),
    },
    target: {
        epoch: data.target.epoch,
        root: hexToBase64(data.target.root),
    },
});

export const mapDeposit = (deposit: Deposit): PrysmDeposit => ({
    proof: deposit.proof || [],
    data: {
        publicKey: hexToBase64(deposit.data.pubkey),
        withdrawalCredentials: hexToBase64(deposit.data.withdrawal_credentials),
        amount: deposit.data.amount,
        signature: hexToBase64(deposit.data.signature),
    },
});

export const mapVoluntaryExit = (voluntaryExit: VoluntaryExit): PrysmSignedVoluntaryExit => ({
    exit: {
        epoch: voluntaryExit.message.epoch,
        validatorIndex: voluntaryExit.message.validator_index,
    },
    signature: hexToBase64(voluntaryExit.signature),
});
