import {PassThrough} from "stream";
import {ILoggerOptions, WinstonLogger, TransportOpts, TransportType} from "@chainsafe/lodestar-utils";
import {ICGLogger, ILogRecord} from "../../utils/logging/interface";
import {BufferedLogger} from "../../utils/logging/buffered";
import {createLogger} from "../../../../main/logger";

export class ValidatorLogger extends WinstonLogger {
    private bufferedLogger: ICGLogger;

    public constructor(options?: Partial<ILoggerOptions>, publicKey?: string) {
        const stream = new PassThrough();
        const transports: TransportOpts[] = [
            {type: TransportType.stream, stream: stream, level: options.level},
            {type: TransportType.console, level: options.level},
        ];
        super(options, transports);
        this.bufferedLogger = new BufferedLogger({maxCache: 1000, transformer: this.transformer});
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

    private transformer(logLine: string): string {
        return logLine.replace(/(\[\]\s{10,20}|.\[3[0-9]m)/g, "");
    }
}
