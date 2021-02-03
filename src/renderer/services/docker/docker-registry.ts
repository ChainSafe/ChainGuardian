import {ipcRenderer} from "electron";

import {Container} from "./container";
import {DockerStats, Stats} from "./dockerStats";

type Registry = {[network: string]: Container};

class DockerRegistryClass {
    private DockerRegistry: Registry = {};
    private stats = new DockerStats();

    public getAllStatsIterator(): AsyncGenerator<Stats[]> {
        return this.stats.getAllStatsIterator();
    }

    public getStatsIterator(id: string | number): AsyncGenerator<Stats> {
        return this.stats.getStatsIterator(id);
    }

    public addContainer(name: string, container: Container): void {
        this.DockerRegistry[name] = container;
    }

    public removeContainer(name: string): void {
        delete this.DockerRegistry[name];
    }

    public getContainer(name: string): Container | null {
        return this.DockerRegistry[name];
    }

    public async stopAll(): Promise<void> {
        await Promise.all(Object.values(this.DockerRegistry).map((container) => container.stop()));
    }

    public async removeContainerPermanently(name: string): Promise<void> {
        const container = this.getContainer(name);
        if (container) {
            await container.stop();
            await container.remove();
        } else {
            throw new Error(`Docker container ${name} not found`);
        }
    }
}

export const DockerRegistry = new DockerRegistryClass();
Object.freeze(DockerRegistry);

ipcRenderer &&
    ipcRenderer.on("stop-docker", async () => {
        await DockerRegistry.stopAll();
    });
