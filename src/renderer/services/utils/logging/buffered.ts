import {FifoQueue} from "../queue/fifo";
import {ICGLogger, ILogRecord, LogSource} from "./interface";
import {EventIterator} from "event-iterator";
import {Readable} from "stream";

export interface IBufferedLoggerOptions {
    maxCache: number;
}

export class BufferedLogger implements ICGLogger {
    private readonly cachedLogs: FifoQueue<ILogRecord>;
    private readonly opts: IBufferedLoggerOptions;

    public constructor(opts?: Partial<IBufferedLoggerOptions>) {
        this.opts = Object.assign({}, {maxCache: 1000}, opts);
        this.cachedLogs = new FifoQueue<ILogRecord>(this.opts.maxCache);
    }

    public getLogs(): ILogRecord[] {
        return this.cachedLogs.getAll();
    }

    public getLogIterator(): AsyncGenerator<ILogRecord[]> {
        const cachedLogs = this.cachedLogs.getAll();
        const logSource = this.cachedLogs;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (async function* () {
            yield cachedLogs;
            yield* new EventIterator<ILogRecord[]>(({push}) => {
                const logHandler = (log: ILogRecord[]): void => {
                    push(log);
                };
                logSource.on("data", logHandler);
                return (): void => {
                    logSource.removeListener("data", logHandler);
                };
            });
        })();
    }

    public addStreamSource(stream: Readable, source: LogSource = "unknown"): void {
        stream.on("data", (chunk) => {
            this.push(chunk, source);
        });
    }

    public removeAllStreamSourceListeners(stream: Readable): void {
        stream.removeAllListeners();
    }

    public push(log: string | Uint8Array, source: LogSource = "unknown"): void {
        if (Buffer.isBuffer(log)) {
            log = log.toString();
        }
        if (log && typeof log === "string") {
            this.cachedLogs.push(
                ...log
                    .split("\n")
                    .filter((l) => !!l)
                    .map((logLine) => ({
                        log: logLine,
                        source,
                    })),
            );
        }
    }
}
