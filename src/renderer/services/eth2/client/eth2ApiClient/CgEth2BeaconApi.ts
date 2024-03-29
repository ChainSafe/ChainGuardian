import {CgEth2Base} from "./CgEth2Base";
import {
    CommitteesFilters,
    StateId,
    EpochCommitteeResponse,
    EpochSyncCommitteeResponse,
    AttestationFilters,
    FinalityCheckpoints,
    ValidatorId,
    ValidatorResponse,
    ValidatorBalance,
    ValidatorFilters,
} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {phase0, allForks, Slot, Root, Epoch, altair, ssz} from "@chainsafe/lodestar-types";
import {BlockHeaderResponse, BlockId} from "@chainsafe/lodestar-api/lib/routes/beacon/block";
import {ForkName} from "@chainsafe/lodestar-params";
import {Json} from "@chainsafe/ssz";
import {publishNewBlock, signedNewAttestation} from "../../../../ducks/validator/actions";
import {matomo} from "../../../tracking";
import {CgBeaconApi, PoolStatus} from "../interface";
import {
    blockHeaderContainerType,
    epochCommitteeContainerType,
    epochSyncCommitteesResponseContainerType,
    finalityCheckpointsContainerType,
    validatorResponseContainerType,
    validatorBalanceContainerType,
} from "../ssz";
import logger from "electron-log";

export class CgEth2BeaconApi extends CgEth2Base implements CgBeaconApi {
    public async getBlock(
        blockId: BlockId,
    ): Promise<{
        data: allForks.SignedBeaconBlock;
    }> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/blocks/${blockId}`);
        return {data: ssz.phase0.SignedBeaconBlock.fromJson(response.data, {case: "snake"})};
    }

    public async getBlockV2(
        blockId: BlockId,
    ): Promise<{
        data: allForks.SignedBeaconBlock;
        version: ForkName;
    }> {
        const response = await this.get<{data: Json; version: ForkName}>(`/eth/v2/beacon/blocks/${blockId}`);
        return {
            data: ssz[response.version || ForkName.phase0].SignedBeaconBlock.fromJson(response.data, {case: "snake"}),
            version: response.version || ForkName.phase0,
        };
    }

    public async getBlockAttestations(
        blockId: BlockId,
    ): Promise<{
        data: phase0.Attestation[];
    }> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/blocks/${blockId}/attestations`);
        return {data: response.data.map((data) => ssz.phase0.Attestation.fromJson(data, {case: "snake"}))};
    }

    public async getBlockHeader(
        blockId: BlockId,
    ): Promise<{
        data: BlockHeaderResponse;
    }> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/headers/${blockId}`);
        return {
            data: blockHeaderContainerType.fromJson(response.data, {case: "snake"}),
        };
    }

    public async getBlockHeaders(
        filters: Partial<{
            slot: Slot;
            parentRoot: string;
        }> = {},
    ): Promise<{
        data: BlockHeaderResponse[];
    }> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/headers`, {
            slot: filters.slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            parent_root: filters.parentRoot,
        });
        return {data: response.data.map((data) => blockHeaderContainerType.fromJson(data, {case: "snake"}))};
    }

    public async getBlockRoot(
        blockId: BlockId,
    ): Promise<{
        data: Root;
    }> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/blocks/${blockId}/root`);
        return {data: ssz.Root.fromJson(response.data)};
    }

    public async publishBlock(block: allForks.SignedBeaconBlock): Promise<void> {
        const data = this.config.getForkTypes(block.message.slot).SignedBeaconBlock.toJson(block, {case: "snake"});
        await this.post("/eth/v1/beacon/blocks", data);

        if (this.publicKey && this.dispatch) {
            this.dispatch(publishNewBlock(this.publicKey, block.message.proposerIndex, block.message.slot));
        }
        if (process.env.NODE_ENV !== "validator-test" && matomo)
            matomo.trackEvent({category: "block", action: "proposed", value: block.message.slot});
    }

    public async getGenesis(): Promise<{data: phase0.Genesis}> {
        const response = await this.get<{data: Json}>("/eth/v1/beacon/genesis");
        return {data: ssz.phase0.Genesis.fromJson(response.data, {case: "snake"})};
    }

    public async getEpochCommittees(
        stateId: StateId,
        filters: CommitteesFilters = {},
    ): Promise<{data: EpochCommitteeResponse[]}> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/states/${stateId}/committees`, {
            slot: filters.slot,
            epoch: filters.epoch,
            index: filters.index,
        });
        return {data: response.data.map((data) => epochCommitteeContainerType.fromJson(data, {case: "snake"}))};
    }

    public async getEpochSyncCommittees(
        stateId: StateId,
        epoch: Epoch | undefined,
    ): Promise<{data: EpochSyncCommitteeResponse}> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/sync_committees`, {epoch});
        return {data: epochSyncCommitteesResponseContainerType.fromJson(response, {case: "snake"})};
    }

    public async getPoolAttestations(filters: Partial<AttestationFilters> = {}): Promise<{data: phase0.Attestation[]}> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/pool/attestations`, {
            slot: filters.slot,
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            committee_index: filters.committeeIndex,
        });
        return {data: response.data.map((data) => ssz.phase0.Attestation.fromJson(data, {case: "snake"}))};
    }

    public async getPoolAttesterSlashings(): Promise<{data: phase0.AttesterSlashing[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/beacon/pool/attester_slashings");
        return {data: response.data.map((data) => ssz.phase0.AttesterSlashing.fromJson(data, {case: "snake"}))};
    }

    public async getPoolProposerSlashings(): Promise<{data: phase0.ProposerSlashing[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/beacon/pool/proposer_slashings");
        return {data: response.data.map((data) => ssz.phase0.ProposerSlashing.fromJson(data, {case: "snake"}))};
    }

    public async getPoolVoluntaryExits(): Promise<{data: phase0.SignedVoluntaryExit[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/beacon/pool/voluntary_exits");
        return {data: response.data.map((data) => ssz.phase0.SignedVoluntaryExit.fromJson(data, {case: "snake"}))};
    }

    public async getStateFinalityCheckpoints(stateId: StateId): Promise<{data: FinalityCheckpoints}> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/finality_checkpoints`);
        return {data: finalityCheckpointsContainerType.fromJson(response.data, {case: "snake"})};
    }

    public async getStateFork(stateId: StateId): Promise<{data: phase0.Fork}> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/fork`);
        return {data: ssz.phase0.Fork.fromJson(response.data, {case: "snake"})};
    }

    public async getStateRoot(stateId: StateId): Promise<{data: Root}> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/root`);
        return {data: ssz.Root.fromJson(response.data)};
    }

    public async getStateValidator(stateId: StateId, validatorId: ValidatorId): Promise<{data: ValidatorResponse}> {
        const response = await this.get<{data: Json}>(`/eth/v1/beacon/states/${stateId}/validators/${validatorId}`);
        return {data: validatorResponseContainerType.fromJson(response.data, {case: "snake"})};
    }

    public async getStateValidatorBalances(
        stateId: StateId,
        indices: ValidatorId[] | undefined,
    ): Promise<{data: ValidatorBalance[]}> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/states/${stateId}/validator_balances`, {
            id: indices,
        });
        return {data: response.data.map((data) => validatorBalanceContainerType.fromJson(data, {case: "snake"}))};
    }

    public async getStateValidators(
        stateId: StateId,
        filters: ValidatorFilters = {},
    ): Promise<{data: ValidatorResponse[]}> {
        const response = await this.get<{data: Json[]}>(`/eth/v1/beacon/states/${stateId}/validators`, {
            id: filters.indices,
            status: filters.statuses,
        });
        return {data: response.data.map((data) => validatorResponseContainerType.fromJson(data, {case: "snake"}))};
    }

    public async submitPoolAttestations(attestations: phase0.Attestation[]): Promise<void> {
        const data = attestations.map((attestation) => ssz.phase0.Attestation.toJson(attestation, {case: "snake"}));
        await this.post("/eth/v1/beacon/pool/attestations", data);
        if (this.publicKey && this.dispatch) {
            attestations.forEach((attestation) => {
                const validatorIndexInCommittee = [...attestation.aggregationBits].findIndex((bit) => bit);
                if (validatorIndexInCommittee !== -1)
                    this.dispatch(
                        signedNewAttestation(
                            this.publicKey,
                            ssz.Root.toJson(attestation.data.beaconBlockRoot) as string,
                            attestation.data.index,
                            attestation.data.slot,
                            validatorIndexInCommittee,
                        ),
                    );
            });
        }
    }

    public async submitPoolAttesterSlashing(slashing: phase0.AttesterSlashing): Promise<void> {
        const data = ssz.phase0.AttesterSlashing.toJson(slashing, {case: "snake"});
        await this.post("/eth/v1/beacon/pool/attester_slashings", data);
    }

    public async submitPoolProposerSlashing(slashing: phase0.ProposerSlashing): Promise<void> {
        const data = ssz.phase0.ProposerSlashing.toJson(slashing, {case: "snake"});
        await this.post("/eth/v1/beacon/pool/proposer_slashings", data);
    }

    public async submitPoolVoluntaryExit(exit: phase0.SignedVoluntaryExit): Promise<void> {
        const data = ssz.phase0.SignedVoluntaryExit.toJson(exit, {case: "snake"});
        await this.post("/eth/v1/beacon/pool/voluntary_exits", data);
    }

    public async submitPoolSyncCommitteeSignatures(signatures: altair.SyncCommitteeMessage[]): Promise<void> {
        const data = signatures.map((signature) => ssz.altair.SyncCommitteeMessage.toJson(signature, {case: "snake"}));
        await this.post("/eth/v1/beacon/pool/sync_committees", data);
    }

    public async getPoolStatus(): Promise<PoolStatus> {
        const [attestations, attesterSlashings, voluntaryExits, proposerSlashings] = await Promise.all([
            this.get<{data: Json[]}>("/eth/v1/beacon/pool/attestations"),
            this.get<{data: Json[]}>("/eth/v1/beacon/pool/attester_slashings"),
            this.get<{data: Json[]}>("/eth/v1/beacon/pool/proposer_slashings"),
            this.get<{data: Json[]}>("/eth/v1/beacon/pool/voluntary_exits"),
        ]);

        return {
            attestations: attestations.data.length,
            attesterSlashings: attesterSlashings.data.length,
            voluntaryExits: voluntaryExits.data.length,
            proposerSlashings: proposerSlashings.data.length,
        };
    }

    public getWeakSubjectivityCheckpoint = async (): Promise<string> => {
        try {
            const url = `/eth/v1/beacon/states/finalized/finality_checkpoints`;
            const response = await this.httpClient.get<{
                // eslint-disable-next-line camelcase
                data: {finalized: {epoch: string; root: string}};
            }>(url);
            return `${response.data.finalized.root}:${response.data.finalized.epoch}`;
        } catch (e) {
            logger.error("Failed to fetch finality checkpoints", {error: e.message});
            return "";
        }
    };
}
