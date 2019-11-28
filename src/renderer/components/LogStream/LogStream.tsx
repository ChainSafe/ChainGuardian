import * as React from "react";
import {useState, useEffect} from "react";

export interface ILogStreamProps {
    stream: any;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logStream, setLogStream] = useState([]);
    
    useEffect(()=>{
        const reader = props.stream.getReader();
        reader.read().then(function processText(data: any){
            if (data.done) {
                console.log("Stream done");
            }
            setLogStream(logStream.concat(data.value));
            reader.releaseLock();
        });
    },[logStream]);

    return(
        <React.Fragment>
            {logStream.map((data: any) =>{
                return(
                    <div key={data} className="log-data">{data}</div>
                );
            })}
        </React.Fragment> 
    );
};