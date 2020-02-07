import { SupportedNetworks } from './chain';
import { Container } from './container';

type Registry = { [network: string]: Container }

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
}

export const DockerRegistry = new DockerRegistryClass();
Object.freeze(DockerRegistry);
