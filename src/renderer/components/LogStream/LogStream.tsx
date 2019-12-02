import * as React from "react";
import {useState, useEffect} from "react";

export interface ILogStreamProps {
    stream: ReadableStream;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logs, setLogs] = useState<string[]>([]);
    
    useEffect(()=>{
        const reader = props.stream.getReader();
        reader.read().then(({value}: {value: string})=>{
            setLogs(logs.concat([value]));
            reader.releaseLock();
        });
    },[logs]);

    return(
        <React.Fragment>
            {logs.map((logEntry: string) =>{
                return(
                    <div key={logEntry} className="log-data">{logEntry}</div>
                );
            })}
        </React.Fragment> 
    );
};