import electronLog from "electron-log";
import {app} from "electron";

const createLogger = (name: string, file: string): electronLog.ElectronLog => {
    const logger = electronLog.create(name);
    logger.transports.file.fileName = file;

    if (process.env.NODE_ENV === "production" || !app.commandLine.hasSwitch("enable-devtools"))
        logger.transports.console.level = false;

    return logger;
};

export const mainLogger = createLogger("mainLogger", "core.log");
