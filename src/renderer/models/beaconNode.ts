export type BeaconNode = {
    url: string;
    isLocalNetwork: boolean;
}

interface IBeaconNodes {
    nodes: BeaconNode[];
}

export interface IValidatorBeaconNodes {
    [validatorAddress: string]: BeaconNode[];
}

export class BeaconNodes implements IBeaconNodes {
    public nodes: BeaconNode[] = [];

    public constructor(url: string, isLocalNetwork = false) {
        this.nodes.push({ url, isLocalNetwork });
    }

    public addNode(url: string, isLocalNetwork = false): void {
        this.nodes.push({ url, isLocalNetwork });
    }
}