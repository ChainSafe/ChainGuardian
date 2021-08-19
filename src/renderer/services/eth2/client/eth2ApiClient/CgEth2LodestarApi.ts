import {CgEth2Base} from "./CgEth2Base";
import {
    BlockProcessorQueueItem,
    GossipQueueItem,
    RegenQueueItem,
    SyncChainDebugState,
} from "@chainsafe/lodestar-api/lib/routes/lodestar";
import {Epoch} from "@chainsafe/lodestar-types";
import {CgLodestarApi} from "../interface";

export class CgEth2LodestarApi extends CgEth2Base implements CgLodestarApi {
    public getBlockProcessorQueueItems(): Promise<BlockProcessorQueueItem[]> {
        throw new Error(" not implemented");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getGossipQueueItems(gossipType: string): Promise<GossipQueueItem[]> {
        throw new Error(" not implemented");
    }

    public getLatestWeakSubjectivityCheckpointEpoch(): Promise<{data: Epoch}> {
        throw new Error(" not implemented");
    }

    public getRegenQueueItems(): Promise<RegenQueueItem[]> {
        throw new Error(" not implemented");
    }

    public getSyncChainsDebugState(): Promise<{data: SyncChainDebugState[]}> {
        throw new Error(" not implemented");
    }

    public getWtfNode(): Promise<{data: string}> {
        throw new Error(" not implemented");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public writeHeapdump(dirpath?: string): Promise<{data: {filepath: string}}> {
        throw new Error(" not implemented");
    }
}
