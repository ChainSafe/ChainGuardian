import path from "path";
import electron, {remote} from "electron";
import logger from "electron-log";

import {getConfig} from "../../../config/config";
import {Level} from "../../components/Notification/NotificationEnums";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {IValidator} from "../../containers/Dashboard/DashboardContainer";
import {Command} from "../docker/command";
import {DockerRegistry} from "../docker/docker-registry";
import {V4Keystore} from "../keystore";
import {runCmdAsync} from "./cmd";
import {copyFile, removeDirRecursive} from "./file";
import {networks} from "../eth2/networks";

export const cleanUpAccount = async(): Promise<void> => {
    const config = getConfig(electron.remote.app);
    try {
        await Promise.all([
            removeDirRecursive(config.storage.dataDir),
            removeDirRecursive(config.db.name),
            deleteBeaconNodeContainers(),
        ]);
    } catch (e) {
        logger.error("Error occurred while cleaning up account: ", e.message);
    }
};

export const deleteKeystore = (directory: string, publicKey: string): void => {
    const selectedV4Keystore = new V4Keystore(path.join(directory, `${publicKey}.json`));
    selectedV4Keystore.destroy();
};

export const deleteBeaconNodeContainers = async(): Promise<void> => {
    await Promise.all(networks.map(async(network) => {
        if (network.networkName !== "localhost") {
            return await DockerRegistry.removeContainerPermanently(network.dockerConfig.name);
        }
    }));
};

export interface IExportStatus {
    message: string;
    level: Level;
}

export const exportKeystore = (validator: IValidator): IExportStatus | null => {
    const savePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(),{
        title: `Saving keystore for validator "${validator.name}"`,
        buttonLabel: "Export",
        filters: [{name: "Keystore", extensions: ["json"]}],
        defaultPath: path.join(remote.app.getPath("home"), `${validator.publicKey}.json`),
    });
    // save keystore if destination selected
    if (savePath) {
        const keystorePath = path.join(getConfig().storage.accountsDir, DEFAULT_ACCOUNT, `${validator.publicKey}.json`);
        const copyResult = copyFile(keystorePath, savePath);
        return {
            level: copyResult.success ? Level.INFO : Level.ERROR,
            message: copyResult.success ?
                `Successfully exported keystore for validator ${validator.name} to ${savePath}.` :
                `Export failed: ${copyResult.message}.`
        };
    }
    // destination path not selected
    return null;
};
