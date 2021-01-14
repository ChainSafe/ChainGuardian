import database from "../db/api/database";
import {getNetworkConfig} from "../eth2/networks";
import {SupportedNetworks} from "../eth2/supportedNetworks";
import {Container, IDocker} from "./container";
import {DockerRegistry} from "./docker-registry";
import {IDockerRunParams} from "./type";
import {chainGuardianLogger} from "../../../main/logger";

export class BeaconChain extends Container {
    public static async startBeaconChain(
        network: SupportedNetworks,
        params: Partial<Exclude<IDockerRunParams, "name">> = {},
        waitUntilReady = false,
    ): Promise<BeaconChain> {
        const imageName = BeaconChain.getContainerName(network);
        // Check if docker container already exists in app memory
        const existingBC = DockerRegistry.getContainer(imageName);
        if (existingBC) {
            return existingBC as BeaconChain;
        }

        const bc = new BeaconChain({
            ...getNetworkConfig(network).dockerConfig,
            ...params,
            restart: "unless-stopped",
            name: imageName,
        });
        DockerRegistry.addContainer(imageName, bc);

        chainGuardianLogger.info(`Going to run docker beacon chain ${imageName}...`);
        bc.run();
        chainGuardianLogger.info(`${imageName} docker beacon chain should be up!`);
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
            chainGuardianLogger.info("Going to start all stopped local beacon nodes...");
            for (const beacon of savedNodes.beacons) {
                if (beacon.docker) {
                    const image = await Container.getImageName(beacon.docker.id);
                    if (image) {
                        await BeaconChain.restartBeaconChainContainer(beacon.docker.id, image);
                    } else {
                        chainGuardianLogger.warn(`Container ${beacon.docker.id} not found.`);
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
        chainGuardianLogger.info(`Started ${name} local beacon node.`);
    }
    public async run(): Promise<IDocker> {
        if (await Container.exists(this.params.name)) {
            chainGuardianLogger.info(`Going to start existing container ${this.params.name}`);
            return await super.startStoppedContainer();
        }
        return await super.run();
    }
}
