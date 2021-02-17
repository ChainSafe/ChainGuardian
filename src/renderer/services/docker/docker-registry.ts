import {ipcRenderer} from "electron";

import {Container} from "./container";
import {DockerStats, Stats} from "./stats";
import {runCmd} from "../utils/cmd";
import {Command} from "./command";
import {mainLogger} from "../../../main/logger";

type Registry = {[network: string]: Container};

class DockerRegistryClass {
    private DockerRegistry: Registry = {};
    private stats: DockerStats;

    public constructor() {
        Command.stats().then((cmd) => {
            const onExit = async (code: number | null, signal: string | null): Promise<void> => {
                if (signal === "SIGTERM" || signal === "SIGINT" || (code === 1 && signal === null)) {
                    const {stdout} = runCmd(cmd, {onExit});
                    this.stats.updateReadable(stdout);
                } else {
                    mainLogger.warn("unhandled exit performance monitor", code, signal);
                }
            };
            const {stdout} = runCmd(cmd, {onExit});
            this.stats = new DockerStats(stdout);
            Object.freeze(DockerRegistry);
        });
    }

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

ipcRenderer &&
    ipcRenderer.on("stop-docker", async () => {
        await DockerRegistry.stopAll();
    });
