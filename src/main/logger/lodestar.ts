import {Context, ILogger, LogLevel} from "@chainsafe/lodestar-utils";
import {error, info, silly, verbose, warn} from "electron-log";
import {Writable} from "winston-transport";

export class LodestarLogger implements ILogger {
    public level: LogLevel;
    public silent: boolean;

    public error(message: string, context?: Context | Error): void {
        error(message, context);
    }

    public warn(message: string, context?: Context | Error): void {
        warn(message, context);
    }

    public info(message: string, context?: Context | Error): void {
        info(message, context);
    }

    public important(message: string, context?: Context | Error): void {
        info(message, context);
    }

    public verbose(message: string, context?: Context | Error): void {
        verbose(message, context);
    }

    public debug(message: string, context?: Context | Error): void {
        verbose(message, context);
    }

    public silly(message: string, context?: Context | Error): void {
        silly(message, context);
    }

    public profile(): void {
        throw new Error("Method not implemented.");
    }

    public stream(): Writable {
        throw new Error("Method not implemented.");
    }
    public child(): ILogger {
        return this;
    }
}
