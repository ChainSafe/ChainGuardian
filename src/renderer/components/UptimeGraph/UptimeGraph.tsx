import * as React from "react";
import {useState, useEffect} from "react";
import {BarChart, Bar, XAxis, Tooltip} from "recharts"; 

export interface IUptimeGraphProps {
    getData: () => Promise<Array<Object>>;
}

export const UptimeGraph: React.FunctionComponent<IUptimeGraphProps> = (props: IUptimeGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    
    const awaitData = async (): Promise<void>=>{
        await props.getData().then((dataValueArray)=>{
           setData(dataValueArray);
        });
    };

    useEffect(()=>{
        awaitData();
    },[])
    return(
        <div className="node-graph-container" >
            <div className="graph-header" >
                <div className="graph-title">Uptime</div>
                <div className="graph-option position">TODAY</div>
            </div>
            <div>
                <BarChart
                width={405}
                height={202}
                data={data}
                >
                    <XAxis dataKey="name"/>
                    <Tooltip/>
                    <Bar dataKey="pv" stackId="a" fill="#EA526F" />
                    <Bar dataKey="uv" stackId="a" fill="#09BC8A" />
                </BarChart>
            </div>
        </div>
        
    );
}