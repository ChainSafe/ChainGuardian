import {IValidator} from "./DashboardContainer";
import {remote} from "electron";
import {KEYSTORE_DEFAULT_DIRECTORY} from "../../constants/keystore";
import {Level} from "../../components/Notification/NotificationEnums";
import {copyFile} from "../../services/utils/file-utils";

const app = remote.app;
const dialog = remote.dialog;

export interface IExportStatus {
    message: string;
    level: Level;
}

export const exportKeystore = (validator: IValidator): IExportStatus | null => {
    const savePath = dialog.showSaveDialogSync(remote.getCurrentWindow(),{
        title: `Saving keystore for validator ${validator.name}`,
        buttonLabel: "Export",
        filters: [{name: "Keystore", extensions: ["json"]}],
        defaultPath: `${app.getPath("home")}/${validator.name}.json`,
    });
    // save keystore if destination selected
    if (savePath) {
        const keystorePath = `${KEYSTORE_DEFAULT_DIRECTORY}/${validator.name}.json`;
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