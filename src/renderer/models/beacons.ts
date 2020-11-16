export type Beacon = {
    url: string;
    localDockerId?: string;
};

interface IBeacons {
    beacons: Beacon[];
}

export class Beacons implements IBeacons {
    public beacons: Beacon[] = [];

    public static createNodes(beacons: Beacon[]): Beacons | null {
        const list = new Beacons();
        beacons.forEach(({url, localDockerId}) => list.addNode(url, localDockerId));

        return list;
    }

    public static createBeacon(url: string, localDockerId?: string): Beacons | null {
        const beacon = new Beacons();
        beacon.addNode(url, localDockerId);

        return beacon;
    }

    // Add new node to the list that has unique values
    public addNode(url: string, localDockerId?: string): void {
        if (!this.beacons.some(({url: beaconUrl}) => beaconUrl === url)) {
            this.beacons.push({url, localDockerId});
        }
    }

    /**
     * Remove Beacon from list
     * @param url of beacon in the list
     * @returns {[boolean, boolean]} first param represents if is beacon removed second represents if is local
     * */
    public removeNode(url: string): [boolean, boolean] {
        const index = this.beacons.findIndex(({url: beaconUrl}) => beaconUrl !== url);
        if (index !== -1) {
            const spliced = this.beacons.splice(index, 1)[0];
            return [true, !!spliced.localDockerId];
        }
        return [false, false];
    }
}
