import {CommitteeIndex, Epoch, Slot} from "@chainsafe/lodestar-types";
import crypto from "crypto";
import {AttestationData, Attestation} from "@chainsafe/lodestar-types/phase0";

/**
 * Generates a fake attestation data for test purposes.
 * @returns {AttestationData}
 * @param sourceEpoch
 * @param targetEpoch
 * @param index
 * @param slot
 */

export function generateAttestationData(
    sourceEpoch: Epoch,
    targetEpoch: Epoch,
    index: CommitteeIndex = 1,
    slot: Slot = 1,
): AttestationData {
    return {
        slot: slot,
        index: index,
        beaconBlockRoot: crypto.randomBytes(32),
        source: {
            epoch: sourceEpoch,
            root: Buffer.alloc(32),
        },
        target: {
            epoch: targetEpoch,
            root: Buffer.alloc(32),
        },
    };
}

export function generateAttestation(override: Partial<Attestation> = {}): Attestation {
    return {
        // @ts-ignore
        aggregationBits: [],
        data: {
            slot: 0,
            index: 0,
            beaconBlockRoot: Buffer.alloc(32),
            source: {
                epoch: 0,
                root: Buffer.alloc(32),
            },
            target: {
                epoch: 0,
                root: Buffer.alloc(32),
            },
        },
        signature: Buffer.alloc(96),
        ...override,
    };
}

export function generateEmptyAttestation(): Attestation {
    return generateAttestation();
}
