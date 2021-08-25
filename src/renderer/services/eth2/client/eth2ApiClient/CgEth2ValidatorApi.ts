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
import {Json, toHexString} from "@chainsafe/ssz";
import {CgValidatorApi} from "../interface";
import {
    proposerDutyContainerType,
    attesterDutyContainerType,
    syncDutyContainerType,
    beaconCommitteeSubscriptionContainerType,
    syncCommitteeSubscriptionContainerType,
} from "../ssz";

export class CgEth2ValidatorApi extends CgEth2Base implements CgValidatorApi {
    public async getAggregatedAttestation(attestationDataRoot: Root, slot: Slot): Promise<{data: phase0.Attestation}> {
        const response = await this.get<{data: Json}>(`/eth/v1/validator/aggregate_attestation`, {
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            attestation_data_root: toHexString(attestationDataRoot),
        });
        return {
            data: ssz.phase0.Attestation.fromJson(response.data, {case: "snake"}),
        };
    }

    public async getAttesterDuties(
        epoch: Epoch,
        validatorIndices: ValidatorIndex[],
    ): Promise<{data: AttesterDuty[]; dependentRoot: Root}> {
        // eslint-disable-next-line camelcase
        const response = await this.post<Json, {data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/attester/${epoch}`,
            validatorIndices.map(String),
        );
        return {
            data: response.data.map((data) => attesterDutyContainerType.fromJson(data, {case: "snake"})),
            dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }

    public async getProposerDuties(epoch: Epoch): Promise<{data: ProposerDuty[]; dependentRoot: Root}> {
        // eslint-disable-next-line camelcase
        const response = await this.get<{data: Json[]; dependent_root: Json}>(
            `/eth/v1/validator/duties/proposer/${epoch}`,
        );
        return {
            data: response.data.map((data) => proposerDutyContainerType.fromJson(data, {case: "snake"})),
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
            data: response.data.map((data) => syncDutyContainerType.fromJson(data, {case: "snake"})),
            dependentRoot: ssz.Root.fromJson(response.dependent_root),
        };
    }

    public async prepareBeaconCommitteeSubnet(subscriptions: BeaconCommitteeSubscription[]): Promise<void> {
        const data = subscriptions.map((data) =>
            beaconCommitteeSubscriptionContainerType.toJson(data, {case: "snake"}),
        );
        await this.post<Json, {data: Json}>(`/eth/v1/validator/beacon_committee_subscriptions`, data);
    }

    public async prepareSyncCommitteeSubnets(subscriptions: SyncCommitteeSubscription[]): Promise<void> {
        const data = subscriptions.map((data) => syncCommitteeSubscriptionContainerType.toJson(data, {case: "snake"}));
        await this.post<Json, {data: Json}>(`/eth/v1/validator/sync_committee_subscriptions`, data);
    }

    public async produceAttestationData(index: CommitteeIndex, slot: Slot): Promise<{data: phase0.AttestationData}> {
        const response = await this.get<{data: Json}>(`/eth/v1/validator/attestation_data`, {
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_index: index,
        });
        return {
            data: ssz.phase0.AttestationData.fromJson(response.data, {case: "snake"}),
        };
    }

    public async produceBlock(
        slot: Slot,
        randaoReveal: BLSSignature,
        graffiti: string,
    ): Promise<{data: allForks.BeaconBlock; version: ForkName}> {
        const response = await this.get<{data: Json; version: ForkName}>(`/eth/v1/validator/blocks/${slot}`, {
            grafitti: graffiti,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            randao_reveal: toHexString(randaoReveal),
        });
        return {
            data: ssz[response.version].BeaconBlock.fromJson(response.data, {case: "snake"}),
            version: response.version,
        };
    }

    public async produceSyncCommitteeContribution(
        slot: Slot,
        subcommitteeIndex: number,
        beaconBlockRoot: Root,
    ): Promise<{data: altair.SyncCommitteeContribution}> {
        const response = await this.get<{data: Json}>(`/eth/v1/validator/sync_committee_contribution`, {
            slot: slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            subcommittee_index: subcommitteeIndex,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            beacon_block_root: toHexString(beaconBlockRoot),
        });
        return {
            data: ssz.altair.SyncCommitteeContribution.fromJson(response.data, {case: "snake"}),
        };
    }

    public async publishAggregateAndProofs(signedAggregateAndProofs: phase0.SignedAggregateAndProof[]): Promise<void> {
        const data = signedAggregateAndProofs.map((data) =>
            ssz.phase0.SignedAggregateAndProof.toJson(data, {case: "snake"}),
        );
        await this.post<Json, {data: Json}>(`/eth/v1/validator/aggregate_and_proofs`, data);
    }

    public async publishContributionAndProofs(
        contributionAndProofs: altair.SignedContributionAndProof[],
    ): Promise<void> {
        const data = contributionAndProofs.map((data) =>
            ssz.altair.SignedContributionAndProof.toJson(data, {case: "snake"}),
        );
        await this.post<Json, {data: Json}>(`/eth/v1/validator/contribution_and_proofs`, data);
    }
}
