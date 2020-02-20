export interface IBeaconNode {
    url: string;
    validatorAddress: string;
}

export class BeaconNode implements IBeaconNode {
    public url: string;
    public validatorAddress: string;

    public constructor(node: IBeaconNode) {
        this.url = node.url;
        this.validatorAddress = node.validatorAddress;
    }
}