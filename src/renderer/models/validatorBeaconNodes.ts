interface IValidatorBeaconNodes {
    nodes: string[];
}

export class ValidatorBeaconNodes implements IValidatorBeaconNodes {
    public nodes: string[] = [];

    public static createNodes(nodes: string[]): ValidatorBeaconNodes | null {
        const list = new ValidatorBeaconNodes();
        nodes.forEach((url) => list.addNode(url));

        return list;
    }

    // Add new node to the list that has unique values
    public addNode(url: string): void {
        if (!this.nodes.some((beaconUrl) => beaconUrl === url)) {
            this.nodes.push(url);
        }
    }

    public removeNode(url: string): boolean {
        const index = this.nodes.findIndex((beaconUrl) => beaconUrl === url);
        if (index !== -1) {
            this.nodes.splice(index, 1);
            return true;
        }
        return false;
    }
}
