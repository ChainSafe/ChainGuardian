import {ByteVectorType, ContainerType} from "@chainsafe/ssz";
import {BlockHeaderResponse} from "@chainsafe/lodestar-api/lib/routes/beacon/block";
import {ssz, StringType} from "@chainsafe/lodestar-types";
import {
    EpochCommitteeResponse,
    EpochSyncCommitteeResponse,
    FinalityCheckpoints,
    ValidatorBalance,
    ValidatorResponse,
    ValidatorStatus,
} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {ArrayOf} from "@chainsafe/lodestar-api/lib/utils";
import {DepositContract, ISpec} from "@chainsafe/lodestar-api/lib/routes/config";
import {BeaconPreset} from "@chainsafe/lodestar-params";
import {ChainConfig} from "@chainsafe/lodestar-config";
import {NetworkIdentity} from "@chainsafe/lodestar-api/lib/routes/node";
import {
    AttesterDuty,
    BeaconCommitteeSubscription,
    ProposerDuty,
    SyncCommitteeSubscription,
    SyncDuty,
} from "@chainsafe/lodestar-api/lib/routes/validator";
import { SlotRoot } from "./interface";

export const blockHeaderContainerType = new ContainerType<BlockHeaderResponse>({
    fields: {
        root: ssz.Root,
        canonical: ssz.Boolean,
        header: ssz.phase0.SignedBeaconBlockHeader,
    },
});

export const epochCommitteeContainerType = new ContainerType<EpochCommitteeResponse>({
    fields: {
        index: ssz.CommitteeIndex,
        slot: ssz.Slot,
        validators: ssz.phase0.CommitteeIndices,
    },
});

export const finalityCheckpointsContainerType = new ContainerType<FinalityCheckpoints>({
    fields: {
        previousJustified: ssz.phase0.Checkpoint,
        currentJustified: ssz.phase0.Checkpoint,
        finalized: ssz.phase0.Checkpoint,
    },
});

export const validatorResponseContainerType = new ContainerType<ValidatorResponse>({
    fields: {
        index: ssz.ValidatorIndex,
        balance: ssz.Gwei,
        status: new StringType<ValidatorStatus>(),
        validator: ssz.phase0.Validator,
    },
});

export const validatorBalanceContainerType = new ContainerType<ValidatorBalance>({
    fields: {
        index: ssz.ValidatorIndex,
        balance: ssz.Gwei,
    },
});

export const epochSyncCommitteesResponseContainerType = new ContainerType<EpochSyncCommitteeResponse>({
    fields: {
        validators: ArrayOf(ssz.ValidatorIndex),
        validatorAggregates: ArrayOf(ssz.ValidatorIndex),
    },
});

export const depositContractContainerType = new ContainerType<DepositContract>({
    fields: {
        chainId: ssz.Number64,
        address: new ByteVectorType({length: 20}),
    },
});

export const specContainerType = new ContainerType<ISpec>({
    fields: {
        ...BeaconPreset.fields,
        ...ChainConfig.fields,
    },
});

export const networkIdentityContainerType = new ContainerType<NetworkIdentity>({
    fields: {
        peerId: new StringType(),
        enr: new StringType(),
        p2pAddresses: ArrayOf(new StringType()),
        discoveryAddresses: ArrayOf(new StringType()),
        metadata: ssz.altair.Metadata,
    },
});

export const beaconCommitteeSubscriptionContainerType = new ContainerType<BeaconCommitteeSubscription>({
    fields: {
        validatorIndex: ssz.ValidatorIndex,
        committeeIndex: ssz.CommitteeIndex,
        committeesAtSlot: ssz.Slot,
        slot: ssz.Slot,
        isAggregator: ssz.Boolean,
    },
});

export const syncCommitteeSubscriptionContainerType = new ContainerType<SyncCommitteeSubscription>({
    fields: {
        validatorIndex: ssz.ValidatorIndex,
        syncCommitteeIndices: ArrayOf(ssz.CommitteeIndex),
        untilEpoch: ssz.Epoch,
    },
});

export const attesterDutyContainerType = new ContainerType<AttesterDuty>({
    fields: {
        pubkey: ssz.BLSPubkey,
        validatorIndex: ssz.ValidatorIndex,
        committeeIndex: ssz.CommitteeIndex,
        committeeLength: ssz.Number64,
        committeesAtSlot: ssz.Number64,
        validatorCommitteeIndex: ssz.Number64,
        slot: ssz.Slot,
    },
});

export const proposerDutyContainerType = new ContainerType<ProposerDuty>({
    fields: {
        slot: ssz.Slot,
        validatorIndex: ssz.ValidatorIndex,
        pubkey: ssz.BLSPubkey,
    },
});

export const syncDutyContainerType = new ContainerType<SyncDuty>({
    fields: {
        pubkey: ssz.BLSPubkey,
        validatorIndex: ssz.ValidatorIndex,
        validatorSyncCommitteeIndices: ArrayOf(ssz.Number64),
    },
});

export const slotRootContainerType = new ContainerType<SlotRoot>({
    fields: {
        slot: ssz.Slot,
        root: ssz.Root,
    },
});
