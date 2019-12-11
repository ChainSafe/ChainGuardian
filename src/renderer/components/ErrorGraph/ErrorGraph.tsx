import * as React from "react";
import {useState, useEffect} from "react";
import { 
    BarChart, Bar, XAxis, Tooltip,
} from "recharts";

export interface IErrorGraphProps {
    getData: () => Promise<number[]>;
}

export const ErrorGraph: React.FunctionComponent<IErrorGraphProps> = (props: IErrorGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [refreshIntervalId, setRefreshIntervalId] = useState<number>(0);
    const [lastRefreshTime,setLastRefreshTime] = useState<number>(0);

    function normalize (dataArray: Array<object>, array: number[]): Array<object> {
        const dateToday = new Date();
        const hour = dateToday.getHours();
        for (let i = 12; i >=0; i--) {
            dataArray.push({
                name: ((hour-i)<1 ? 24+hour-i : hour-i) + "h",
                errors: array[i]
            });
        }
        return dataArray;
    }

    const awaitData = async (): Promise<void>=>{
        props.getData().then((dataValueArray)=>{
            let dataArray: Array<object> = [];
            dataArray = normalize(dataArray,dataValueArray);
            setData(dataArray);
        });
    };

    const initalTime = () => {
        // const timeOnMount = new Date().getTime();
        setLastRefreshTime(new Date().getTime());
    }
    useEffect(()=>{
        initalTime();
        console.log(lastRefreshTime + " last refresh time");

        const intervalHandler = (): void => {
            const timeOnInterval = new Date().getTime();
            console.log(timeOnInterval + " time on interval")
            const diffInSeconds = (timeOnInterval-lastRefreshTime)/1000
            console.log(diffInSeconds + " diff");
            const hourToSeconds = 3600;
            if(diffInSeconds>=hourToSeconds){
                setLastRefreshTime(timeOnInterval);
                awaitData();
            }
        }

        const refreshInterval = window.setInterval(intervalHandler, 60000);
        setRefreshIntervalId(refreshInterval);

        awaitData();
    },[])

    return(
        <div className="balance-graph" >
            <div className="graph-header" >
                <div className="graph-title">Error Frequency</div>
                <div className="graph-option position" >IN THE LAST DAY</div>
            </div>
            <BarChart
            width={624} height={199} data={data}
            margin={{top: 5, bottom: 0, left: 10, right: 10,}}>
                <XAxis dataKey="name" stroke="#9ba7af" 
                    interval="preserveStartEnd" tickLine={false}/>
                <Tooltip contentStyle={{color: "red"}} cursor={false} isAnimationActive={false}/>
                <Bar dataKey="errors" fill="#C3CBCF" barSize={28}/>
            </BarChart>
        </div>
    );
}