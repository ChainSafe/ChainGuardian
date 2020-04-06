import {ipcRenderer} from "electron";

import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container} from "./container";

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

    public async stopAll(): Promise<void> {
        await Promise.all(
            Object.values(this.DockerRegistry).map(container => container.stop())
        );
    }
}

export const DockerRegistry = new DockerRegistryClass();
Object.freeze(DockerRegistry);

ipcRenderer.on("stop-docker", async() => {
    await DockerRegistry.stopAll();
});
