import {PassThrough} from "stream";
import {consoleTransport, ILoggerOptions, LogLevel, WinstonLogger, Context} from "@chainsafe/lodestar-utils";
import {ICGLogger, ILogRecord} from "../../utils/logging/interface";
import {BufferedLogger} from "../../utils/logging/buffered";
import TransportStream from "winston-transport";
import winston from "winston";

// @ts-ignore
export class CGWinstonLogger extends WinstonLogger {
    private createLogEntry(level: LogLevel, message: string, context?: Context, error?: Error): void {
        //don't propagate if silenced or message level is more detailed than logger level
        // @ts-ignore
        if (this.silent || this.winston.levels[level] > this.winston.levels[this._level]) {
            return;
        }
        // @ts-ignore
        if (context?.error) delete context.error;
        // @ts-ignore
        this.winston[level](message, {context: JSON.stringify(context)});
    }
}

export class ValidatorLogger extends CGWinstonLogger {
    private bufferedLogger: ICGLogger;

    public constructor(options?: Partial<ILoggerOptions>, transports?: TransportStream[]) {
        const stream = new PassThrough();
        transports = [new winston.transports.Stream({stream: stream}), consoleTransport];
        super(options, transports);
        this.bufferedLogger = new BufferedLogger({maxCache: 1000});
        this.bufferedLogger.addStreamSource(stream);
    }

    public getLogIterator(): AsyncIterable<ILogRecord[]> {
        return this.bufferedLogger.getLogIterator();
    }
}
