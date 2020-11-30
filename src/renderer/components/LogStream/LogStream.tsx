import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {getLogMessageType} from "../../services/docker/utils";
import {ILogRecord} from "../../services/utils/logging/interface";

export interface ILogStreamProps {
    source?: AsyncIterable<ILogRecord[]>;
    linesLimit?: number;
}

export const LogStream: React.FC<ILogStreamProps> = ({source, linesLimit = 1000}) => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLogs = useCallback(
        (logRecords: ILogRecord[]) => {
            setLogs((logs) => {
                const newState = [...new Set([...logs, ...logRecords.map(({log}) => log)])];
                if (newState.length > linesLimit) {
                    newState.splice(0, newState.length - linesLimit);
                }
                return newState;
            });
        },
        [setLogs],
    );

    useEffect(() => {
        if (source) {
            (async function (): Promise<void> {
                for await (const logRecords of source) {
                    addLogs(logRecords);
                }
            })();
        }
        return (): void => {
            setLogs([]);
        };
    }, []);

    return (
        <React.Fragment>
            {logs.length === 0 ? <div className='log-data'>There are no logs.</div> : null}

            {logs.map((logEntry: string) => {
                const type = getLogMessageType(logEntry);
                return (
                    <div key={logEntry} className={`log-data ${type}`}>
                        {logEntry}
                    </div>
                );
            })}
        </React.Fragment>
    );
};
