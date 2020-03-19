import {SupportedNetworks} from "./chain";
import {Container} from "./container";
import database from '../db/api/database';

type Registry = { [network: string]: Container };

class DockerRegistryClass {
    private DockerRegistry: Registry = {};

    public addContainer(network: SupportedNetworks, container: Container): void {
        this.DockerRegistry[network] = container;
    }

    public removeContainer(network: SupportedNetworks): void {
        delete this.DockerRegistry[network];
    }

    public getContainer(network: SupportedNetworks): Container|null {
        return this.DockerRegistry[network];
    }

    public async startAllLocalBeaconNodes(): Promise<void> {
        const savedNodes = await database.beaconNodes.get("");
        if (savedNodes) {
            const promises = [];
            for (let i = 0; i < savedNodes.nodes.length; i++) {
                if (!!savedNodes.nodes[i].localDockerId) {
                    promises.push(Container.startStoppedContainer(savedNodes.nodes[i].localDockerId));
                }
            }
            await Promise.all(promises);
        }
    }
}

export const DockerRegistry = new DockerRegistryClass();
Object.freeze(DockerRegistry);
