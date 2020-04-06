import * as logger from "electron-log";

import database from "../db/api/database";
import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container} from "./container";
import {DockerRegistry} from "./docker-registry";

type LogType = "info" | "error";
type LogCallbackFunc = (type: LogType, message: string) => void;

export class BeaconChain extends Container {
    public static DefaultPorts = ["4000:4001", "13000:13000"];

    public static async startPrysmBeaconChain(
        ports = BeaconChain.DefaultPorts,
        waitUntilReady = false,
    ): Promise<BeaconChain> {
        const existingBC = DockerRegistry.getContainer(SupportedNetworks.PRYSM);
        if (existingBC) {
            return existingBC as BeaconChain;
        }

        const bc = new BeaconChain({
            image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
            name: BeaconChain.getContainerName(SupportedNetworks.PRYSM),
            restart: "unless-stopped",
            ports,
            volume: `${SupportedNetworks.PRYSM}-chain-data:/data`,
            cmd: "--datadir=/data --grpc-gateway-port 4001"
        });
        DockerRegistry.addContainer(SupportedNetworks.PRYSM, bc);

        await bc.run();
        if (waitUntilReady) {
            while (!(await bc.isRunning())) { /* */ }
        }
        return bc;
    }

    public static async startAllLocalBeaconNodes(): Promise<void> {
        const savedNodes = await database.beaconNodes.getAll();
        logger.info("Going to start all stopped local beacon nodes...");
        const promises: any = [];
        for (let i = 0; i < savedNodes.length; i++) {
            savedNodes[i].nodes.map((node) => {
                if (node.localDockerId) {
                    const promise = new Promise(async(resolve, reject) => {
                        const image = await Container.getImage(node.localDockerId);
                        if (image) {
                            await BeaconChain.loadStoppedChain(node.localDockerId, image);
                        } else {
                            return reject("Image not found.");
                        }
                        resolve();
                    });
                    promises.push(promise);
                }
            });
        }
        await Promise.all(promises);
        logger.info(`Started ${promises.length} local beacon nodes.`);
    }

    public static getContainerName(network: string): string {
        return `${network}-beacon-node`;
    }

    public static getNetworkFromContainerName(containerName: string): SupportedNetworks|undefined {
        const name = containerName.split("-")[0];
        if (name === SupportedNetworks.PRYSM) {
            return SupportedNetworks.PRYSM;
        }
    }

    public listenToLogs(callback: LogCallbackFunc): void {
        const logs = this.getLogs();
        if (!logs) {
            throw new Error("Logs not found");
        }

        logs.stderr.on("data", function(output: Buffer) {
            const message = output.toString();
            const isInfo = message.substr(0, 40).includes("level=info");
            const type = isInfo ? "info" : "error";
            callback(type, message);
        });
    }

    private static async loadStoppedChain(name: string, image: string): Promise<void> {
        const bc = new BeaconChain({
            name,
            image,
        });
        await bc.startStoppedContainer();
        const network = BeaconChain.getNetworkFromContainerName(name);
        DockerRegistry.addContainer(network!, bc);
    }
}
