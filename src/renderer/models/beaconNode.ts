export interface IBeaconNode {
    url: string;
}

export class BeaconNode implements IBeaconNode {
    public url: string;

    public constructor(url: string) {
        this.url = url;
    }
}