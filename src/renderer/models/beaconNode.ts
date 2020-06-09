import {IGenericEth2Client} from "../services/eth2/client/interface";

export type BeaconNode = {
    url: string;
    localDockerId: string;
    isSyncing?: boolean;
    currentSlot?: string;
    client?: IGenericEth2Client;
};

interface IBeaconNodes {
    nodes: BeaconNode[];
}

export interface IValidatorBeaconNodes {
    [validatorAddress: string]: BeaconNode[];
}

export class BeaconNodes implements IBeaconNodes {
    public nodes: BeaconNode[] = [];

    public constructor(url: string, localDockerId = "") {
        this.nodes.push({url, localDockerId});
    }

    public static createNodes(nodes: BeaconNode[]): BeaconNodes|null {
        if (nodes.length > 0) {
            const list = new BeaconNodes(nodes[0].url, nodes[0].localDockerId);
            for (let i = 1; i < nodes.length; i++) {
                list.addNode(nodes[i].url, nodes[i].localDockerId);
            }
            return list;
        }

        return null;
    }

    public addNode(url: string, localDockerId: string): void {
        this.nodes.push({url, localDockerId});
    }

    public removeNode(localDockerId: string): boolean {
        const initialNodesLength = this.nodes.length;
        this.nodes = this.nodes.filter(f => f.localDockerId !== localDockerId);

        return initialNodesLength > this.nodes.length;
    }
}
