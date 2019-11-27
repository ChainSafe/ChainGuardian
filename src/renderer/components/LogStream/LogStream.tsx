import * as React from "react";
import {useState, useEffect} from "react";
import { resolve } from "q";
import { render } from "react-dom";

export interface ILogStreamProps {
    stream: any;
}

export const LogStream: React.FunctionComponent<ILogStreamProps> = (props: ILogStreamProps) => {
    const [logStream, getLogStream] = useState([]);
    const [status, setStatus] = useState(false);
    
    useEffect(()=>{
        console.log("load component test");
        const reader = props.stream.getReader();
        // reader.releaseLock();
        reader.read().then(function processText({value, done}){
            if (done) {
                console.log("Stream done");
                setStatus(done)
            }

            getLogStream(logStream.push(value));
            console.log(logStream);
            // console.log(logStream[0]);
            // console.log(logStream[1]);
            // console.log(logStream[2]);

            return reader.read().then(processText);
        });
    },[]);

    let n: number = 0;
    const renderData = ():any=>{
        do {
            if (logStream[n]){
                // console.log(logStream[n]
                return(<p>{logStream[n]}</p>);
            } else {return (<p>null</p>)}
            n++;
        } while (!status);
    }

    return(
        <React.Fragment>
            {/* {logStream.map((data: any) =>{
                <div>{data}</div>
            })} */}
            {renderData()}
        </React.Fragment> 
    )
}