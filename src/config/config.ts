import {join} from "path";
import {app as mainApp, App} from "electron";
import path from "path";

const env = process.env;

export interface IConfig {
    storage: {
        dataDir: string;
        home: string;
        accountsDir: string;
    };
    db: {
        name: string;
    };
}

export function getConfig(app?: App): IConfig {
    // eslint-disable-next-line no-param-reassign
    app = app || mainApp;
    if (!app) {
        throw new Error("Cannot get config before app is initialized");
    }
    const storageConfig = {
        dataDir: app.getPath("userData"),
        home: app.getPath("home"),
        accountsDir: path.join(app.getPath("userData"), "accounts"),
    };

    const dbConfig = {
        name: env.CG_DATABASE_LOCATION || join(storageConfig.dataDir, "db/chainguardian.db"),
    };

    return {
        storage: storageConfig,
        db: dbConfig,
    };
}
