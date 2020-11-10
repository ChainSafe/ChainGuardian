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

    public static createNodes(nodes: BeaconNode[]): BeaconNodes | null {
        const list = new BeaconNodes();
        nodes.map((node) => list.addNode(node.url, node.localDockerId));

        return list;
    }

    // Add new node to the list that has unique values
    public addNode(url: string, localDockerId?: string): void {
        const found = this.nodes.filter((node) => node.url === url && node.localDockerId === localDockerId);
        if (found.length === 0) {
            this.nodes.push({url, localDockerId});
        }
    }

    public removeNode(localDockerId: string): boolean {
        const initialNodesLength = this.nodes.length;
        this.nodes = this.nodes.filter((f) => f.localDockerId !== localDockerId);

        return initialNodesLength > this.nodes.length;
    }
}
