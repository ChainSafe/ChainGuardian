import * as React from "react";
import {useState, useEffect} from "react";
import {BarChart, Bar, XAxis, Tooltip} from "recharts"; 

export interface IUptimeGraphProps {
    getData: () => Promise<Array<{up: number, down: number}>>;
}

export const UptimeGraph: React.FunctionComponent<IUptimeGraphProps> = (props: IUptimeGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);

    const setXAxis = (array: Array<{up: number, down: number}>): void =>{
        let dataArray: Array<object> = [];
        const hour = new Date().getHours();
        for (let i = 9; i >=0; i--) {
            dataArray.push({
                time: ((hour-i)<1 ? 24+hour-i : hour-i) + "h",
                up: array[i].up,
                down: array[i].down,
            });
        }
        setData(dataArray);
    }

    const awaitData = async (): Promise<void>=>{
        const array = await props.getData()
        setXAxis(array);
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
                barSize={21}
                data={data}
                >
                    <XAxis dataKey="time" stroke="#9ba7af" />
                    <Tooltip/>
                    <Bar dataKey="down" stackId="a" fill="#EA526F" />
                    <Bar dataKey="up" stackId="a" fill="#09BC8A" />
                </BarChart>
            </div>
        </div>
        
    );
}