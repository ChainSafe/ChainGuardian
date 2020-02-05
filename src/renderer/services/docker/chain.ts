import { Container } from './container';

export class BeaconChain extends Container {
    public static startPrysmBeaconChain(): BeaconChain {
        const bc = new BeaconChain({
            image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
            name: "Prysm-beacon-node",
            restart: "unless-stopped",
            ports: ["4000:4000", "13000:13000"],
            // volume?
        });
        // bc.run();
        return bc;
    }
}
