import * as logger from "electron-log";
import {Readable} from "stream";

import database from "../db/api/database";
import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container} from "./container";
import {DockerRegistry} from "./docker-registry";
import {getLogMessageType} from "./utils";

type LogType = "info" | "error";
type LogCallbackFunc = (type: LogType, message: string) => void;

export class BeaconChain extends Container {
    public static DefaultPorts = ["4000:4001", "13000:13000"];

    public static async startPrysmBeaconChain(
        ports = BeaconChain.DefaultPorts,
        waitUntilReady = false,
    ): Promise<BeaconChain> {
        const imageName = BeaconChain.getContainerName(SupportedNetworks.PRYSM);
        // Check if docker image already exists
        const existingBC = DockerRegistry.getContainer(imageName);
        if (existingBC) {
            return existingBC as BeaconChain;
        }

        const bc = new BeaconChain({
            image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
            name: imageName,
            restart: "unless-stopped",
            ports,
            volume: `${SupportedNetworks.PRYSM}-chain-data:/data`,
            cmd: "--datadir=/data --grpc-gateway-port 4001"
        });
        DockerRegistry.addContainer(imageName, bc);

        await bc.run();
        if (waitUntilReady) {
            while (!(await bc.isRunning())) { /* */ }
        }
        return bc;
    }

    public static async startAllLocalBeaconNodes(): Promise<void> {
        const savedNodes = await database.beaconNodes.getAll();
        logger.info("Going to start all stopped local beacon nodes...");
        for (let i = 0; i < savedNodes.length; i++) {
            savedNodes[i].nodes.map(async(node) => {
                if (node.localDockerId) {
                    const image = await Container.getImageName(node.localDockerId);
                    if (image) {
                        await BeaconChain.restartBeaconChainContainer(node.localDockerId, image);
                    } else {
                        logger.info(`Image for container ${node.localDockerId} not found.`);
                    }
                }
            });
        }
    }

    public static getContainerName(network: string): string {
        return `${network}-beacon-node`;
    }

    private static async restartBeaconChainContainer(name: string, image: string): Promise<void> {
        const bc = new BeaconChain({
            name,
            image,
        });
        await bc.startStoppedContainer();
        DockerRegistry.addContainer(name, bc);
        logger.info(`Started ${name} local beacon node.`);
    }

    public listenToLogs(callback: LogCallbackFunc): void {
        const logs = this.getLogs();
        if (!logs) {
            throw new Error("Logs not found");
        }

        logs.stderr.on("data", function(output: Buffer) {
            const message = output.toString();
            const type = getLogMessageType(message);
            callback(type, message);
        });
    }

    public getLogStream(): Readable|null {
        const logs = this.getLogs();
        return logs ? logs.stderr : null;
    }
}
