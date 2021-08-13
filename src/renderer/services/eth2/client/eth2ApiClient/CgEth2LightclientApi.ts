import {CgEth2Base} from "./CgEth2Base";
import {Api} from "@chainsafe/lodestar-api/lib/routes/lightclient";
import {altair, Epoch, SyncPeriod} from "@chainsafe/lodestar-types";
import {Path} from "@chainsafe/ssz";

export class CgEth2LightclientApi extends CgEth2Base implements Api {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getBestUpdates(from: SyncPeriod, to: SyncPeriod): Promise<{data: altair.LightClientUpdate[]}> {
        throw new Error("getBestUpdates not implemented");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getInitProof(epoch: Epoch): Promise<{data: any /*Proof*/}> {
        throw new Error("getInitProof not implemented");
    }

    public async getLatestUpdateFinalized(): Promise<{data: altair.LightClientUpdate}> {
        throw new Error("getLatestUpdateFinalized not implemented");
    }

    public async getLatestUpdateNonFinalized(): Promise<{data: altair.LightClientUpdate}> {
        throw new Error("getLatestUpdateNonFinalized not implemented");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getStateProof(stateId: string, paths: Path[]): Promise<{data: any /*Proof*/}> {
        throw new Error("getStateProof not implemented");
    }
}
