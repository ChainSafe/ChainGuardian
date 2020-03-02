import {IValidator} from "./DashboardContainer";
import {remote} from "electron";
import {Level} from "../../components/Notification/NotificationEnums";
import {copyFile} from "../../services/utils/file";
import * as path from "path";
import {getConfig} from "../../../config/config";
import {DEFAULT_ACCOUNT} from "../../constants/account";

const app = remote.app;
const dialog = remote.dialog;

export interface IExportStatus {
    message: string;
    level: Level;
}

export const exportKeystore = (validator: IValidator): IExportStatus | null => {
    const savePath = dialog.showSaveDialogSync(remote.getCurrentWindow(),{
        title: `Saving keystore for validator "${validator.name}"`,
        buttonLabel: "Export",
        filters: [{name: "Keystore", extensions: ["json"]}],
        defaultPath: path.join(app.getPath("home"), `${validator.publicKey}.json`),
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