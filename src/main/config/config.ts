import {join} from "path";
import {app} from "electron";

const env = process.env;

export interface IConfig {
    storage: {
        dataDir: string,
        logsDir: string
    },
    db: {
        name: string
    }
}

export function getConfig(): IConfig {
    if(!app) {
        throw new Error("Cannot get config before app is initialized");
    }
    const storageConfig = {
        dataDir: app.getPath("userData"),
        logsDir: app.getPath("logs")
    };

    const dbConfig = {
        name: join(storageConfig.dataDir, "db/chainguardian.db") || env.DB_NAME as string
    };

    return {
        storage: storageConfig,
        db: dbConfig
    };
}