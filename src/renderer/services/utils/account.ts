import {SecretKey} from "@chainsafe/bls";
import electron, {remote} from "electron";
import path from "path";
import {getConfig} from "../../../config/config";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {DockerRegistry} from "../docker/docker-registry";
import {networks} from "../eth2/networks";
import {V4Keystore} from "../keystore";
import {removeDirRecursive} from "./file";
import {cgLogger} from "../../../main/logger";
import fs from "fs";
import {Interchange} from "@chainsafe/lodestar-validator/lib/slashingProtection/interchange";

export const cleanUpAccount = async (): Promise<void> => {
    const config = getConfig(electron.remote.app);
    try {
        await Promise.all([
            removeDirRecursive(config.storage.dataDir),
            removeDirRecursive(config.db.name),
            deleteBeaconNodeContainers(),
        ]);
    } catch (e) {
        cgLogger.error("Error occurred while cleaning up account: ", e.message);
    }
};

export const importKeystore = async (
    from: string,
    publicKey: string,
    password: string,
    name: string,
    newPassword?: string,
): Promise<string> => {
    const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
    const to = path.join(accountDirectory, publicKey + ".json");
    await V4Keystore.import(from, to, password, name, newPassword);

    return accountDirectory;
};

export const saveKeystore = async (
    signingKey: SecretKey,
    password: string,
    keyPath: string,
    name = "",
): Promise<string> => {
    const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
    await V4Keystore.create(
        path.join(accountDirectory, signingKey.toPublicKey().toHex() + ".json"),
        password,
        {
            privateKey: signingKey,
            publicKey: signingKey.toPublicKey(),
        },
        keyPath,
        name,
    );

    return accountDirectory;
};

export const deleteKeystore = (directory: string, publicKey: string): void => {
    const selectedV4Keystore = new V4Keystore(path.join(directory, `${publicKey}.json`));
    selectedV4Keystore.destroy();
};

export const deleteBeaconNodeContainers = async (): Promise<void> => {
    await Promise.all(
        networks.map(async (network) => {
            if (network.networkName !== "localhost") {
                try {
                    await DockerRegistry.removeContainerPermanently(network.dockerConfig.name);
                } catch (e) {
                    cgLogger.error(`Failed to remove Docker container: ${e.message}`);
                }
            }
        }),
    );
};

export const saveValidatorData = (
    exportPath: string,
    publicKey: string,
    name: string,
    slashingDB?: Interchange,
): void => {
    // store Keystore
    const keystorePath = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT, `${publicKey}.json`);
    const keystoreSavePath = path.join(exportPath, `keystore-${name}.json`);
    fs.copyFileSync(keystorePath, keystoreSavePath);

    // store slashing DB
    if (slashingDB) {
        const slashingDBSavePath = path.join(exportPath, `${name}-slashing-db.json`);
        fs.writeFileSync(slashingDBSavePath, JSON.stringify(slashingDB, null, 2));
    }
};
