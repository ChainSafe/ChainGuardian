import path from "path";
import electron from "electron";
import logger from "electron-log";

import {getConfig} from "../../../config/config";
import {V4Keystore} from "../keystore";
import {removeDirRecursive} from "./file";

export const cleanUpAccount = async(): Promise<void> => {
    const config = getConfig(electron.remote.app);
    try {
        await Promise.all([
            removeDirRecursive(config.storage.dataDir),
            removeDirRecursive(config.db.name),
        ]);
    } catch (e) {
        logger.error("Error occurred while cleaning up account: ", e.message);
    }
};

export const deleteKeystore = (directory: string, publicKey: string) => {
    const selectedV4Keystore = new V4Keystore(path.join(directory, `${publicKey}.json`));
    selectedV4Keystore.destroy();
};
