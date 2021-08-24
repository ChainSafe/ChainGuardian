import {CgEth2Base} from "./CgEth2Base";
import {
    NetworkIdentity,
    NodePeer,
    PeerCount,
    FilterGetPeers,
    SyncingStatus,
} from "@chainsafe/lodestar-api/lib/routes/node";
import {Json} from "@chainsafe/ssz";
import querystring from "querystring";
import {CgNodeApi} from "../interface";
import {networkIdentityContainerType} from "../ssz";

export class CgEth2NodeApi extends CgEth2Base implements CgNodeApi {
    public async getHealth(): Promise<void> {
        await this.get<{data: Json}>("/eth/v1/node/health");
    }

    public async getNetworkIdentity(): Promise<{data: NetworkIdentity}> {
        const response = await this.get<{data: Json}>("/eth/v1/node/identity");
        return {data: networkIdentityContainerType.fromJson(response.data, {case: "snake"})};
    }

    public async getNodeVersion(): Promise<{data: {version: string}}> {
        return await this.get("/eth/v1/node/version");
    }

    public async getPeer(peerId: string): Promise<{data: NodePeer}> {
        return await this.get(`/eth/v1/node/peers/${peerId}`);
    }

    public async getPeerCount(): Promise<{data: PeerCount}> {
        return await this.get("/eth/v1/node/peer_count");
    }

    public async getPeers(filters?: FilterGetPeers): Promise<{data: NodePeer[]; meta: {count: number}}> {
        const query = querystring.stringify(filters);
        return await this.get(`/eth/v1/node/peers?${query}`);
    }

    public async getSyncingStatus(): Promise<{data: SyncingStatus}> {
        return await this.get("/eth/v1/node/syncing");
    }
}
