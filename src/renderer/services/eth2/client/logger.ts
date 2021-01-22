import {PassThrough} from "stream";
import {consoleTransport, ILoggerOptions, WinstonLogger} from "@chainsafe/lodestar-utils";
import {ICGLogger, ILogRecord} from "../../utils/logging/interface";
import {BufferedLogger} from "../../utils/logging/buffered";
import TransportStream from "winston-transport";
import winston from "winston";
import {createLogger} from "../../../../main/logger";

export class ValidatorLogger extends WinstonLogger {
    private bufferedLogger: ICGLogger;

    public constructor(options?: Partial<ILoggerOptions>, transports?: TransportStream[], publicKey?: string) {
        const stream = new PassThrough();
        transports = [new winston.transports.Stream({stream: stream}), consoleTransport];
        super(options, transports);
        this.bufferedLogger = new BufferedLogger({maxCache: 1000});
        this.bufferedLogger.addStreamSource(stream);

        if (publicKey) {
            // TODO: find more elegant solution for writing logs to file
            const validatorLogger = createLogger(publicKey, `validator/${publicKey}.log`);
            validatorLogger.transports.file.format = "{text}";
            validatorLogger.transports.console.level = false;

            const source = this.bufferedLogger.getLogIterator();
            (async function (): Promise<void> {
                for await (const logRecords of source) {
                    if (Array.isArray(logRecords)) {
                        logRecords.forEach((logRecord) => {
                            validatorLogger.log(logRecord.log);
                        });
                    } else validatorLogger.log(logRecords);
                }
            })();
        }
    }

    public getLogIterator(): AsyncIterable<ILogRecord[]> {
        return this.bufferedLogger.getLogIterator();
    }
}
