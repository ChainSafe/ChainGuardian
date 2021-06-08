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
        proposer_index: data.proposer_index,
        parent_root: base64ToHex(data.parent_root),
        state_root: base64ToHex(data.state_root),
        body: {
            randao_reveal: base64ToHex(data.body.randao_reveal),
            graffiti: base64ToHex(data.body.graffiti),
            eth1_data: {
                deposit_root: base64ToHex(data.body.eth1_data.deposit_root),
                deposit_count: data.body.eth1_data.deposit_count,
                block_hash: base64ToHex(data.body.eth1_data.block_hash),
            },
            proposer_slashings: data.body.proposer_slashings.map(mapProposerSlashing),
            attester_slashings: data.body.attester_slashings.map(mapAttesterSlashing),
            attestations: data.body.attestations.map(mapAttestation),
            deposits: data.body.deposits.map(mapDeposit),
            voluntary_exits: data.body.voluntary_exits.map(mapVoluntaryExit),
        },
    } as unknown) as Json);

export const mapProposerSlashing = (proposerSlashing: PrysmProposerSlashing): ProposerSlashing => ({
    signed_header_1: mapSignedHeader(proposerSlashing.header_1),
    signed_header_2: mapSignedHeader(proposerSlashing.header_2),
});

export const mapSignedHeader = (signedHeader: PrysmSignedBeaconBlockHeader): SignedHeader => ({
    message: {
        slot: signedHeader.header.slot,
        proposer_index: signedHeader.header.proposer_index,
        parent_root: base64ToHex(signedHeader.header.parent_root),
        state_root: base64ToHex(signedHeader.header.state_root),
        body_root: base64ToHex(signedHeader.header.body_root),
    },
    signature: base64ToHex(signedHeader.signature),
});

export const mapAttesterSlashing = (attesterSlashing: PrysmAttesterSlashing): AttestationSlashing => ({
    attestation_1: mapAttesterSlashingAttestation(attesterSlashing.attestation_1),
    attestation_2: mapAttesterSlashingAttestation(attesterSlashing.attestation_2),
});

export const mapAttesterSlashingAttestation = (
    attesterSlashing: PrysmIndexedAttestation,
): AttestationSlashingAttestation => ({
    attesting_indices: attesterSlashing.attesting_indices || [],
    signature: base64ToHex(attesterSlashing.signature),
    data: mapAttestationData(attesterSlashing.data),
});

export const mapAttestation = (attestation: PrysmAttestation): Attestation => ({
    aggregation_bits: base64ToHex(attestation.aggregation_bits),
    signature: base64ToHex(attestation.signature),
    data: mapAttestationData(attestation.data),
});

export const mapAttestationData = (data: PrysmAttestationData): AttestationData => ({
    slot: data.slot,
    index: data.committee_index,
    beacon_block_root: base64ToHex(data.beacon_block_root),
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
        pubkey: base64ToHex(deposit.data.public_key),
        withdrawal_credentials: base64ToHex(deposit.data.withdrawal_credentials),
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
