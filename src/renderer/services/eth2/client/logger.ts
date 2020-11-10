import {PassThrough, Writable} from "stream";
import {consoleTransport, ILoggerOptions, WinstonLogger} from "@chainsafe/lodestar-utils";
import {ICGLogger, ILogRecord} from "../../utils/logging/interface";
import {BufferedLogger} from "../../utils/logging/buffered";
import TransportStream from "winston-transport";

export class ValidatorLogger extends WinstonLogger {
    private bufferedLogger: ICGLogger;

    public constructor(options?: Partial<ILoggerOptions>, transports?: TransportStream[]) {
        const stream = new PassThrough();
        transports = [consoleTransport, stream];
        super(options, transports);
        this.bufferedLogger = new BufferedLogger({maxCache: 1000});
        this.bufferedLogger.addStreamSource(stream);
    }

    public getLogIterator(): AsyncIterable<ILogRecord[]> {
        return this.bufferedLogger.getLogIterator();
    }

    public profile(): void {
        throw new Error("not implemented");
    }

    public stream(): Writable {
        throw new Error("not implemented");
    }
}
