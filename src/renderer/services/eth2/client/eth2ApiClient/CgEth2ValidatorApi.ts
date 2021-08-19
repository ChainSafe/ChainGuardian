import {CgEth2Base} from "./CgEth2Base";
import {
    SyncCommitteeSubscription,
    BeaconCommitteeSubscription,
    ProposerDuty,
    SyncDuty,
    AttesterDuty,
} from "@chainsafe/lodestar-api/lib/routes/validator";
import {
    altair,
    phase0,
    Slot,
    BLSSignature,
    CommitteeIndex,
    ValidatorIndex,
    Root,
    allForks,
    Epoch,
    ssz,
} from "@chainsafe/lodestar-types";
import {ForkName} from "@chainsafe/lodestar-params";
import {ContainerType, Json, toHexString} from "@chainsafe/ssz";
import querystring from "querystring";
import {ArrayOf} from "@chainsafe/lodestar-api/lib/utils";
import {CgValidatorApi} from "../interface";

export class CgEth2ValidatorApi extends CgEth2Base implements CgValidatorApi {
    private beaconCommitteeSubscriptionContainerType = new ContainerType<BeaconCommitteeSubscription>({
        fields: {
            validatorIndex: ssz.ValidatorIndex,
            committeeIndex: ssz.CommitteeIndex,
            committeesAtSlot: ssz.Slot,
            slot: ssz.Slot,
            isAggregator: ssz.Boolean,
        },
    });

    private syncCommitteeSubscriptionContainerType = new ContainerType<SyncCommitteeSubscription>({
        fields: {
            validatorIndex: ssz.ValidatorIndex,
            syncCommitteeIndices: ArrayOf(ssz.CommitteeIndex),
            untilEpoch: ssz.Epoch,
        },
    });

    private attesterDutyContainerType = new ContainerType<AttesterDuty>({
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

    private proposerDutyContainerType = new ContainerType<ProposerDuty>({
        fields: {
            slot: ssz.Slot,
            validatorIndex: ssz.ValidatorIndex,
            pubkey: ssz.BLSPubkey,
        },
    });

    private syncDutyContainerType = new ContainerType<SyncDuty>({
        fields: {
            pubkey: ssz.BLSPubkey,
            validatorIndex: ssz.ValidatorIndex,
            validatorSyncCommitteeIndices: ArrayOf(ssz.Number64),
        },
    });

    public async getAggregatedAttestation(attestationDataRoot: Root, slot: Slot): Promise<{data: phase0.Attestation}> {
        const query = querystring.stringify({
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            attestation_data_root: toHexString(attestationDataRoot),
        });
        const response = await this.get<{data: Json}>(`/eth/v1/validator/aggregate_attestation?${query}`);
        return {
            data: ssz.phase0.Attestation.fromJson(response.data),
        };
    }

    public async getAttesterDuties(
        epoch: Epoch,
        validatorIndices: ValidatorIndex[],
    ): Promise<{data: AttesterDuty[]; dependentRoot: Root}> {
        // eslint-disable-next-line camelcase
        const response = await this.post<Json, {data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/attester/${epoch}`,
            validatorIndices,
        );
        return {
            data: response.data.map((data) => this.attesterDutyContainerType.fromJson(data)),
            dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }

    public async getProposerDuties(epoch: Epoch): Promise<{data: ProposerDuty[]; dependentRoot: Root}> {
        // eslint-disable-next-line camelcase
        const response = await this.get<{data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/proposer/${epoch}`,
        );
        return {
            data: response.data.map((data) => this.proposerDutyContainerType.fromJson(data)),
            dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }

    public async getSyncCommitteeDuties(
        epoch: number,
        validatorIndices: ValidatorIndex[],
    ): Promise<{data: SyncDuty[]; dependentRoot: Root}> {
        // eslint-disable-next-line camelcase
        const response = await this.post<Json, {data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/sync/${epoch}`,
            validatorIndices,
        );
        return {
            data: response.data.map((data) => this.syncDutyContainerType.fromJson(data)),
            dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }

    public async prepareBeaconCommitteeSubnet(subscriptions: BeaconCommitteeSubscription[]): Promise<void> {
        const data = subscriptions.map((data) => this.beaconCommitteeSubscriptionContainerType.toJson(data));
        await this.post<Json, {data: Json}>(`/eth/v1/validator/beacon_committee_subscriptions`, data);
    }

    public async prepareSyncCommitteeSubnets(subscriptions: SyncCommitteeSubscription[]): Promise<void> {
        const data = subscriptions.map((data) => this.syncCommitteeSubscriptionContainerType.toJson(data));
        await this.post<Json, {data: Json}>(`/eth/v1/validator/sync_committee_subscriptions`, data);
    }

    public async produceAttestationData(index: CommitteeIndex, slot: Slot): Promise<{data: phase0.AttestationData}> {
        const query = querystring.stringify({
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_index: index,
        });
        const response = await this.get<{data: Json}>(`/eth/v1/validator/attestation_data?${query}`);
        return {
            data: ssz.phase0.AttestationData.fromJson(response.data),
        };
    }

    public async produceBlock(
        slot: Slot,
        randaoReveal: BLSSignature,
        graffiti: string,
    ): Promise<{data: allForks.BeaconBlock; version: ForkName}> {
        const query = querystring.stringify({
            grafitti: graffiti,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            randao_reveal: toHexString(randaoReveal),
        });
        const response = await this.get<{data: Json; version: ForkName}>(`/eth/v1/validator/blocks/${slot}?${query}`);
        return {
            data: ssz[response.version].BeaconBlock.fromJson(response.data),
            version: response.version,
        };
    }

    public async produceSyncCommitteeContribution(
        slot: Slot,
        subcommitteeIndex: number,
        beaconBlockRoot: Root,
    ): Promise<{data: altair.SyncCommitteeContribution}> {
        const query = querystring.stringify({
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            subcommittee_index: subcommitteeIndex,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            beacon_block_root: toHexString(beaconBlockRoot),
        });
        const response = await this.get<{data: Json}>(`/eth/v1/validator/sync_committee_contribution?${query}`);
        return {
            data: ssz.altair.SyncCommitteeContribution.fromJson(response.data),
        };
    }

    public async publishAggregateAndProofs(signedAggregateAndProofs: phase0.SignedAggregateAndProof[]): Promise<void> {
        const data = signedAggregateAndProofs.map((data) => ssz.phase0.SignedAggregateAndProof.toJson(data));
        await this.post<Json, {data: Json}>(`/eth/v1/validator/aggregate_and_proofs`, data);
    }

    public async publishContributionAndProofs(
        contributionAndProofs: altair.SignedContributionAndProof[],
    ): Promise<void> {
        const data = contributionAndProofs.map((data) => ssz.altair.SignedContributionAndProof.toJson(data));
        await this.post<Json, {data: Json}>(`/eth/v1/validator/contribution_and_proofs`, data);
    }
}
