import * as React from "react";
import {useState} from "react";

export interface ILogStreamProps {
    // path: string;
    // hostname: string;
    stream: any;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logStream, getLogStream] = useState([]);
    //---getReader---not working
    const reader = props.stream.getReader();
    reader.read().then(function processText({ done, value }){
        if (done) {
            console.log("Stream done");

        }
        
        getLogStream(logStream.push(value));
        return reader.read().then(processText);
    });

    return(
        <React.Fragment>
            {logStream.map((data: any) =>{
                <div>{data}</div>
            })}
        </React.Fragment>
        
    )
}