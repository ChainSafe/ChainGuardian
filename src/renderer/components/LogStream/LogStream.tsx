import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {getLogMessageType} from "../../services/docker/utils";
import {ILogRecord} from "../../services/utils/logging/interface";

export interface ILogStreamProps {
    source?: AsyncIterable<ILogRecord[]>;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLogs = useCallback(
        (logRecords: ILogRecord[]) => {
            setLogs((logs) => logs.concat(logRecords.map((l) => l.log)));
        },
        [setLogs],
    );

    useEffect(() => {
        if (props.source) {
            (async function (): Promise<void> {
                for await (const logRecords of props.source) {
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
