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
        proposer_index: data.message.proposer_index,
        parent_root: hexToBase64(data.message.parent_root),
        state_root: hexToBase64(data.message.state_root),
        body: {
            randao_reveal: hexToBase64(data.message.body.randao_reveal),
            eth1_data: {
                deposit_root: hexToBase64(data.message.body.eth1_data.deposit_root),
                deposit_count: data.message.body.eth1_data.deposit_count,
                block_hash: hexToBase64(data.message.body.eth1_data.block_hash),
            },
            graffiti: hexToBase64(data.message.body.graffiti),
            proposer_slashings: data.message.body.proposer_slashings.map(mapProposerSlashing),
            attester_slashings: data.message.body.attester_slashings.map(mapAttesterSlashing),
            attestations: data.message.body.attestations.map(mapAttestation),
            deposits: data.message.body.deposits.map(mapDeposit),
            voluntary_exits: data.message.body.voluntary_exits.map(mapVoluntaryExit),
        },
    },
    signature: hexToBase64(data.signature),
});

export const mapProposerSlashing = (proposerSlashing: ProposerSlashing): PrysmProposerSlashing => ({
    header_1: mapSignedHeader(proposerSlashing.signed_header_1),
    header_2: mapSignedHeader(proposerSlashing.signed_header_2),
});

export const mapSignedHeader = (signedHeader: SignedHeader): PrysmSignedBeaconBlockHeader => ({
    header: {
        slot: signedHeader.message.slot,
        proposer_index: signedHeader.message.proposer_index,
        parent_root: hexToBase64(signedHeader.message.parent_root),
        state_root: hexToBase64(signedHeader.message.state_root),
        body_root: hexToBase64(signedHeader.message.body_root),
    },
    signature: hexToBase64(signedHeader.signature),
});

export const mapAttesterSlashing = (attesterSlashing: AttestationSlashing): PrysmAttesterSlashing => ({
    attestation_1: mapAttesterSlashingAttestation(attesterSlashing.attestation_1),
    attestation_2: mapAttesterSlashingAttestation(attesterSlashing.attestation_2),
});

export const mapAttesterSlashingAttestation = (
    attesterSlashing: AttestationSlashingAttestation,
): PrysmIndexedAttestation => ({
    attesting_indices: attesterSlashing.attesting_indices || [],
    data: mapAttestationData(attesterSlashing.data),
    signature: hexToBase64(attesterSlashing.signature),
});

export const mapAttestation = (attestation: Attestation): PrysmAttestation => ({
    aggregation_bits: hexToBase64(attestation.aggregation_bits),
    data: mapAttestationData(attestation.data),
    signature: hexToBase64(attestation.signature),
});

export const mapAttestationData = (data: AttestationData): PrysmAttestationData => ({
    slot: data.slot,
    committee_index: data.index,
    beacon_block_root: hexToBase64(data.beacon_block_root),
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
        public_key: hexToBase64(deposit.data.pubkey),
        withdrawal_credentials: hexToBase64(deposit.data.withdrawal_credentials),
        amount: deposit.data.amount,
        signature: hexToBase64(deposit.data.signature),
    },
});

export const mapVoluntaryExit = (voluntaryExit: VoluntaryExit): PrysmSignedVoluntaryExit => ({
    exit: {
        epoch: voluntaryExit.message.epoch,
        validator_index: voluntaryExit.message.validator_index,
    },
    signature: hexToBase64(voluntaryExit.signature),
});
