import * as React from "react";
import {useState, useEffect} from "react";
import {Readable} from "stream";
import {getLogMessageType} from "../../services/docker/utils";

export interface ILogStreamProps {
    stream?: Readable;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(()=> {
        props.stream && props.stream.on("data", (chunk: Buffer)=>{
            setLogs(logs.concat([chunk.toString()]));
        });
    },[logs]);

    return(
        <React.Fragment>
            {logs.length === 0 ? <div className="log-data">There are no logs.</div> : null}

            {logs.map((logEntry: string) => {
                const type = getLogMessageType(logEntry);
                return (
                    <div key={logEntry} className={`log-data ${type}`}>{logEntry}</div>
                );
            })}
        </React.Fragment>
    );
};
