import {PassThrough} from "stream";
import {createLogger, format, Logger, transports} from "winston";
import {defaultLogLevel, LogLevel, ILogger, ILoggerOptions} from "@chainsafe/lodestar-utils";
import chalk from "chalk";
import {ICGLogger, ILogRecord} from "../../utils/logging/interface";
import {BufferedLogger} from "../../utils/logging/buffered";

export class ValidatorLogger implements ILogger {
    private winston: Logger;
    private _level: LogLevel;
    private _silent: boolean;
    private bufferedLogger: ICGLogger;

    public constructor(options?: Partial<ILoggerOptions>) {
        options = {
            level: LogLevel[defaultLogLevel],
            module: "",
            ...options
        };
        const stream = new PassThrough();
        this.bufferedLogger = new BufferedLogger({maxCache: 1000});
        this.bufferedLogger.addStreamSource(stream);
        this.winston = createLogger({
            level: LogLevel[LogLevel.verbose], // log level switching handled in `createLogEntry`
            defaultMeta: {
                module: options.module
            },
            transports: [
                new transports.Stream({
                    stream,
                    format: format.combine(
                        format.timestamp({
                            format: "YYYY-MM-DD HH:mm:ss"
                        }),
                        format.printf((info) => {
                            const paddingBetweenInfo = 30;

                            const infoString = (info.module || info.namespace || "");
                            const infoPad = paddingBetweenInfo - infoString.length;

                            return (
                                `${info.timestamp} ${info.level.padStart(infoPad)}: ${info.message}`
                            );
                        }),
                        format.colorize(),
                    )
                })
            ],
            exitOnError: false
        });
        //@ts-ignore
        this._level = LogLevel[options.level];
        this._silent = false;
    }

    public debug(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.debug, message, context);
    }

    public info(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.info, message, context);
    }

    public important(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.info, chalk.red(message as string), context);
    }

    public error(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.error, message, context);
    }

    public warn(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.warn, message, context);
    }

    public verbose(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.verbose, message, context);
    }

    public silly(message: string | object, context?: object): void {
        this.createLogEntry(LogLevel.silly, message, context);
    }

    public set level(level: LogLevel) {
        this.winston.level = LogLevel[level];
        this._level = level;
    }

    public get level(): LogLevel {
        return this._level;
    }

    public set silent(silent: boolean) {
        this._silent = silent;
    }

    public get silent(): boolean {
        return this._silent;
    }

    public child(options: ILoggerOptions): ValidatorLogger {
        const logger = Object.create(ValidatorLogger.prototype);
        const winston = this.winston.child({namespace: options.module});
        return Object.assign(logger, {
            winston,
            _level: options.level,
            _silent: this._silent
        });
    }

    public getLogIterator(): AsyncIterable<ILogRecord[]> {
        return this.bufferedLogger.getLogIterator();
    }

    private createLogEntry(level: LogLevel, message: string | object, context: object = {}): void {
        if (this.silent || level > this._level) {
            return;
        }

        if (typeof message === "object") {
            this.winston.log(LogLevel[level], JSON.stringify(message));
        } else {
            this.winston.log(LogLevel[level], message, context);
        }
    }

}
