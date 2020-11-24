import * as logger from "electron-log";

import database from "../db/api/database";
import {getNetworkConfig} from "../eth2/networks";
import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container, IDocker} from "./container";
import {DockerRegistry} from "./docker-registry";
import {DockerPort} from "./type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export class BeaconChain extends Container {
    public static async startBeaconChain(
        network: SupportedNetworks,
        ports?: DockerPort[],
        waitUntilReady = false,
        options?: Partial<IConfigureBNSubmitOptions>,
    ): Promise<BeaconChain> {
        const imageName = BeaconChain.getContainerName(network);
        // Check if docker container already exists in app memory
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
        if (options) await bc.lighthouseRun(options);
        else await bc.run();
        logger.info(`${imageName} docker beacon chain should be up!`);
        if (waitUntilReady) {
            while (!(await bc.isRunning())) {
                /* */
            }
        }
        return bc;
    }

    public static async startAllLocalBeaconNodes(): Promise<void> {
        const savedNodes = await database.beacons.get();
        if (savedNodes) {
            logger.info("Going to start all stopped local beacon nodes...");
            for (const beacon of savedNodes.beacons) {
                if (beacon.docker) {
                    const image = await Container.getImageName(beacon.docker.id);
                    if (image) {
                        await BeaconChain.restartBeaconChainContainer(beacon.docker.id, image);
                    } else {
                        logger.info(`Container ${beacon.docker.id} not found.`);
                    }
                }
            }
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

    public async lighthouseRun(options: Partial<IConfigureBNSubmitOptions>): Promise<IDocker> {
        if (await Container.exists(this.params.name)) {
            logger.info(`Going to start existing container ${this.params.name}`);
            return await super.startStoppedContainer();
        }
        const path = options.folderPath ? `-v ${options.folderPath}:/root/.lighthouse` : "";

        const rpcPort = `-p 127.0.0.1:${options.rpcPort || 5052}:${options.rpcPort || 5052}`;
        const libp2pAndDiscoveryPorts =
            options.libp2pPort === options.discoveryPort
                ? `-p ${options.libp2pPort}:${options.libp2pPort}`
                : `-p ${options.libp2pPort}:${options.libp2pPort} -p ${options.discoveryPort}:${options.discoveryPort}`;

        const params =
            `--name localhost-beacon-node ${path} ${rpcPort} ${libp2pAndDiscoveryPorts}` +
            `sigp/lighthouse lighthouse beacon_node` +
            `--testnet pyrmont` +
            `--port ${options.libp2pPort || 9000}` +
            `--discovery-port ${options.discoveryPort || 9000}` +
            `--http --http-address 0.0.0.0  --http-port ${options.rpcPort || 5052}` +
            `--eth1-endpoint ${options.eth1Url}`;
        console.log(params);
        return await super.customRun(params);
    }
}
