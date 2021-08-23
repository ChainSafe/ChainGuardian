import {CgEth2Base} from "./CgEth2Base";
import {Json, ContainerType} from "@chainsafe/ssz";
import {StateId} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {ForkName} from "@chainsafe/lodestar-params";
import {allForks, ssz, Slot, Root} from "@chainsafe/lodestar-types";
import {CgDebugApi} from "../interface";

type SlotRoot = {slot: Slot; root: Root};

export class CgEth2DebugApi extends CgEth2Base implements CgDebugApi {
    private slotRootContainerType = new ContainerType<SlotRoot>({
        fields: {
            slot: ssz.Slot,
            root: ssz.Root,
        },
    });

    public async connectToPeer(peerIdStr: string, multiaddr: string[]): Promise<void> {
        await this.post(`/eth/v1/debug/connect/${peerIdStr}`, multiaddr);
    }

    public async disconnectPeer(peerIdStr: string): Promise<void> {
        await this.post(`/eth/v1/debug/disconnect/${peerIdStr}`, undefined);
    }

    public async getHeads(): Promise<{data: SlotRoot[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/debug/beacon/heads");
        return {data: response.data.map((data) => this.slotRootContainerType.fromJson(data, {case: "snake"}))};
    }

    public async getState(stateId: StateId): Promise<{data: allForks.BeaconState}> {
        const response = await this.get<{data: Json}>(`/eth/v1/debug/beacon/states/${stateId}`);
        return {data: ssz.phase0.BeaconState.fromJson(response.data, {case: "snake"})};
    }

    public async getStateV2(stateId: StateId): Promise<{data: allForks.BeaconState; version: ForkName}> {
        const response = await this.get<{data: Json; version: ForkName}>(`/eth/v2/debug/beacon/states/${stateId}`);
        return {
            data: ssz[response.version].BeaconState.fromJson(response.data, {case: "snake"}),
            version: response.version,
        };
    }
}
