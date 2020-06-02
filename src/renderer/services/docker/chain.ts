import * as logger from "electron-log";

import database from "../db/api/database";
import {getNetworkConfig} from "../eth2/networks";
import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container, IDocker} from "./container";
import {DockerRegistry} from "./docker-registry";
import {DockerPort} from "./type";

export class BeaconChain extends Container {
    public static async startBeaconChain(
        network: SupportedNetworks,
        ports?: DockerPort[],
        waitUntilReady = false,
    ): Promise<BeaconChain> {
        const imageName = BeaconChain.getContainerName(network);
        // Check if docker image already exists
        const existingBC = DockerRegistry.getContainer(imageName);
        if (existingBC) {
            return existingBC as BeaconChain;
        }

        const bc = new BeaconChain({
            ...getNetworkConfig(network).dockerConfig,
            name: imageName,
            ports,
        });
        DockerRegistry.addContainer(imageName, bc);

        logger.info(`Going to run docker beacon chain ${imageName}...`);
        await bc.run();
        logger.info(`${imageName} docker beacon chain should be up!`);
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
                        logger.info(`Container ${node.localDockerId} not found.`);
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
    public async run(): Promise<IDocker> {
        if (await Container.exists(this.params.name)) {
            logger.info(`Going to start existing container ${this.params.name}`);
            return await super.startStoppedContainer();
        }
        return await super.run();
    }
}
