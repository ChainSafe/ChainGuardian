import {ElectronLog, create} from "electron-log";

export const createLogger = (name: string, file: string): ElectronLog => {
    const logger = create(name);
    logger.transports.file.fileName = file;

    if (process.env.NODE_ENV === "production") logger.transports.console.level = false;

    return logger;
};

export const mainLogger = createLogger("mainLogger", "core.log");

export const cgLogger = createLogger("chainGuardian", "chainGuardian.log");

export const getBeaconLogfileFromURL = (host: string): string => {
    const url = new URL(host);
    let sanitizedName = (url.host + url.pathname).replace(/[^a-zA-Z0-9:]/g, "_");
    if (sanitizedName[sanitizedName.length - 1] === "_") sanitizedName = sanitizedName.slice(0, -1);
    return `beacon/${sanitizedName}.log`;
};
