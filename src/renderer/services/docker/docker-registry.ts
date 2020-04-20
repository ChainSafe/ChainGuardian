import {ipcRenderer} from "electron";

import {Container} from "./container";

type Registry = { [network: string]: Container };

class DockerRegistryClass {
    private DockerRegistry: Registry = {};

    public addContainer(name: string, container: Container): void {
        this.DockerRegistry[name] = container;
    }

    public removeContainer(name: string): void {
        delete this.DockerRegistry[name];
    }

    public getContainer(name: string): Container|null {
        return this.DockerRegistry[name];
    }

    public async stopAll(): Promise<void> {
        await Promise.all(
            Object.values(this.DockerRegistry).map(container => container.stop())
        );
    }
}

export const DockerRegistry = new DockerRegistryClass();
Object.freeze(DockerRegistry);

ipcRenderer && ipcRenderer.on("stop-docker", async() => {
    await DockerRegistry.stopAll();
});
