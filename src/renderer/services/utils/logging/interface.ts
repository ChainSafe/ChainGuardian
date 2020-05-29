import {Readable} from "stream";

export type LogSource = "stdout" | "stderr" | "unknown";

export interface ILogRecord {
    log: string;
    source: LogSource,
}

export interface ICGLogger {
    push(log: string, source?: LogSource): void;
    addStreamSource(stream: Readable, source?: LogSource): void;
    getLogIterator(): AsyncIterable<ILogRecord[]>;
    getLogs(): ILogRecord[];
}
