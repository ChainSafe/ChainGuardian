import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {CommitteeIndex, Slot} from "@chainsafe/lodestar-types";

export function computeSubnetForCommittee(
    config: IBeaconConfig,
    committeesPerSlot: number,
    slot: Slot,
    committeeIndex: CommitteeIndex,
): number {
    const slotsSinceEpochStart = slot % config.params.SLOTS_PER_EPOCH;
    const committeesSinceEpochStart = committeesPerSlot * slotsSinceEpochStart;
    return (committeesSinceEpochStart + committeeIndex) % 64;
}
