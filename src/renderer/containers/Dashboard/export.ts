import {IValidator} from "./DashboardContainer";
import fs from "fs";
import {remote} from "electron";
import {KEYSTORE_DEFAULT_DIRECTORY} from "../../constants/keystore";
import {Level} from "../../components/Notification/NotificationEnums";

const app = remote.app;
const dialog = remote.dialog;

export interface IExportStatus {
    status?: {
        message: string;
        level: Level;
    }
}

export const exportKeystore = (validator: IValidator): IExportStatus => {
    const savePath = dialog.showSaveDialogSync(remote.getCurrentWindow(),{
        title: `Saving keystore for validator ${validator.name}`,
        buttonLabel: "Export",
        filters: [{name: "KeyStore", extensions: ["json"]}],
        defaultPath: `${app.getPath("home")}/${validator.name}.json`,
    });
    // save keystore if destination selected
    if (savePath) {
        try {
            const keystorePath = `${KEYSTORE_DEFAULT_DIRECTORY}/${validator.name}.json`;
            const keystoreContent = fs.readFileSync(keystorePath, "utf-8");
            fs.writeFileSync(savePath, keystoreContent);
            return {status: {
                level: Level.INFO,
                message: `Successfully exported keystore for validator ${validator.name} to ${savePath}`
            }};
        } catch (e) {
            return {status: {
                level: Level.ERROR,
                message: `Export failed: ${e.message}`}
            };
        }
    }
    // destination path not selected
    return {};
};