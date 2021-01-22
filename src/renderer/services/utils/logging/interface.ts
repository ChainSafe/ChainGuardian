import {Readable} from "stream";

export type LogSource = "stdout" | "stderr" | "unknown";

export interface ILogRecord {
    log: string;
    source: LogSource;
}

export interface ICGLogger {
    push(log: string, source?: LogSource): void;
    addStreamSource(stream: Readable, source?: LogSource): void;
    removeAllStreamSourceListeners(stream: Readable): void;
    getLogIterator(): AsyncIterable<ILogRecord[]>;
    getLogs(): ILogRecord[];
}
