import {
    Attestation as PrysmAttestation,
    AttestationData as PrysmAttestationData,
    AttesterSlashing as PrysmAttesterSlashing,
    Deposit as PrysmDeposit,
    BeaconBlock as PrysmBeaconBlock,
    IndexedAttestation as PrysmIndexedAttestation,
    ProposerSlashing as PrysmProposerSlashing,
    SignedBeaconBlockHeader as PrysmSignedBeaconBlockHeader,
    SignedVoluntaryExit as PrysmSignedVoluntaryExit,
    AttestationEvent,
} from "./types";
import {base64ToHex} from "./utils";
import {
    ProposerSlashing,
    SignedHeader,
    AttestationSlashing,
    AttestationSlashingAttestation,
    Attestation,
    AttestationData,
    Deposit,
    VoluntaryExit,
} from "./map.types";
import {Json} from "@chainsafe/ssz";

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

export const mapProduceBlockResponseToStandardProduceBlock = (data: PrysmBeaconBlock): Json /*Block*/ =>
    (({
        slot: data.slot,
        proposer_index: data.proposerIndex,
        parent_root: base64ToHex(data.parentRoot),
        state_root: base64ToHex(data.stateRoot),
        body: {
            randao_reveal: base64ToHex(data.body.randaoReveal),
            graffiti: base64ToHex(data.body.graffiti),
            eth1_data: {
                deposit_root: base64ToHex(data.body.eth1Data.depositRoot),
                deposit_count: data.body.eth1Data.depositCount,
                block_hash: base64ToHex(data.body.eth1Data.blockHash),
            },
            proposer_slashings: data.body.proposerSlashings.map(mapProposerSlashing),
            attester_slashings: data.body.attesterSlashings.map(mapAttesterSlashing),
            attestations: data.body.attestations.map(mapAttestation),
            deposits: data.body.deposits.map(mapDeposit),
            voluntary_exits: data.body.voluntaryExits.map(mapVoluntaryExit),
        },
    } as unknown) as Json);

export const mapProposerSlashing = (proposerSlashing: PrysmProposerSlashing): ProposerSlashing => ({
    signed_header_1: mapSignedHeader(proposerSlashing.header1),
    signed_header_2: mapSignedHeader(proposerSlashing.header2),
});

export const mapSignedHeader = (signedHeader: PrysmSignedBeaconBlockHeader): SignedHeader => ({
    message: {
        slot: signedHeader.header.slot,
        proposer_index: signedHeader.header.proposerIndex,
        parent_root: base64ToHex(signedHeader.header.parentRoot),
        state_root: base64ToHex(signedHeader.header.stateRoot),
        body_root: base64ToHex(signedHeader.header.bodyRoot),
    },
    signature: base64ToHex(signedHeader.signature),
});

export const mapAttesterSlashing = (attesterSlashing: PrysmAttesterSlashing): AttestationSlashing => ({
    attestation_1: mapAttesterSlashingAttestation(attesterSlashing.attestation1),
    attestation_2: mapAttesterSlashingAttestation(attesterSlashing.attestation2),
});

export const mapAttesterSlashingAttestation = (
    attesterSlashing: PrysmIndexedAttestation,
): AttestationSlashingAttestation => ({
    attesting_indices: attesterSlashing.attestingIndices || [],
    signature: base64ToHex(attesterSlashing.signature),
    data: mapAttestationData(attesterSlashing.data),
});

export const mapAttestation = (attestation: PrysmAttestation): Attestation => ({
    aggregation_bits: base64ToHex(attestation.aggregationBits),
    signature: base64ToHex(attestation.signature),
    data: mapAttestationData(attestation.data),
});

export const mapAttestationData = (data: PrysmAttestationData): AttestationData => ({
    slot: data.slot,
    index: data.committeeIndex,
    beacon_block_root: base64ToHex(data.beaconBlockRoot),
    source: {
        epoch: data.source.epoch,
        root: base64ToHex(data.source.root),
    },
    target: {
        epoch: data.target.epoch,
        root: base64ToHex(data.target.root),
    },
});

export const mapDeposit = (deposit: PrysmDeposit): Deposit => ({
    proof: deposit.proof || [],
    data: {
        pubkey: base64ToHex(deposit.data.publicKey),
        withdrawal_credentials: base64ToHex(deposit.data.withdrawalCredentials),
        amount: deposit.data.amount,
        signature: base64ToHex(deposit.data.signature),
    },
});

export const mapVoluntaryExit = (voluntaryExit: PrysmSignedVoluntaryExit): VoluntaryExit => ({
    message: {
        epoch: voluntaryExit.exit.epoch,
        validator_index: voluntaryExit.exit.epoch,
    },
    signature: base64ToHex(voluntaryExit.signature),
});

export const mapAttestationEvent = (attestation: AttestationEvent): Attestation => ({
    aggregation_bits: base64ToHex(attestation.aggregation_bits),
    signature: base64ToHex(attestation.signature),
    data: {
        slot: attestation.data.slot,
        index: attestation.data.index,
        beacon_block_root: base64ToHex(attestation.data.beacon_block_root),
        source: {
            epoch: attestation.data.source.epoch,
            root: base64ToHex(attestation.data.source.root),
        },
        target: {
            epoch: attestation.data.target.epoch,
            root: base64ToHex(attestation.data.target.root),
        },
    },
});
