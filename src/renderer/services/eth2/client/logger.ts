import {ILogger, LogLevel} from "@chainsafe/lodestar-utils";
import * as electronLogger from "electron-log";

export class ApiLogger implements ILogger {
    
    public level = LogLevel.info;
    public silent = true;

    public child(): ILogger {
        return this;
    }

    public debug(message: string | object, context?: object): void {
        electronLogger.debug(message, context);
    }

    public error(message: string | object, context?: object): void {
        electronLogger.error(message, context);
    }

    public important(message: string | object, context?: object): void {
        electronLogger.warn(message, context);
    }

    public info(message: string | object, context?: object): void {
        electronLogger.info(message, context);
    }

    public silly(message: string | object, context?: object): void {
        electronLogger.verbose(message, context);
    }

    public verbose(message: string | object, context?: object): void {
        electronLogger.verbose(message, context);
    }

    public warn(message: string | object, context?: object): void {
        electronLogger.warn(message, context);
    }

}