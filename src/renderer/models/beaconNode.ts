export type BeaconNode = {
    url: string;
    localDockerId: string;
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

    public addNode(url: string, localDockerId = ""): void {
        this.nodes.push({url, localDockerId});
    }
}