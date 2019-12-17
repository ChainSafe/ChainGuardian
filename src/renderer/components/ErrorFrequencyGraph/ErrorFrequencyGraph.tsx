import * as React from "react";
import {useState, useEffect} from "react";
import { 
    BarChart, Bar, XAxis, Tooltip,
} from "recharts";

export interface IErrorFrequencGraphProps {
    getData: () => Promise<number[]>;
}

export const ErrorFrequencGraph: React.FunctionComponent<IErrorFrequencGraphProps> = (
    props: IErrorFrequencGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [refreshIntervalId, setRefreshIntervalId] = useState<number>(0);
    const [lastRefreshTime,setLastRefreshTime] = useState<number>(new Date().getTime());

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
        // await props.getData().then((dataValueArray)=>{
        //     let dataArray: Array<object> = [];
        //     dataArray = normalize(dataArray,dataValueArray);
        //     setData(dataArray);

        const dataValueArray = await props.getData();
        let dataArray: Array<object> = [];
        dataArray = normalize(dataArray,dataValueArray);
        setData(dataArray);
    };

    const intervalHandler = (): void => {
        const timeOnInterval = new Date().getTime();
        const diffInSeconds = (timeOnInterval-lastRefreshTime)/1000;
        const hourToSeconds = 3600;
        if(diffInSeconds>=hourToSeconds){
            setLastRefreshTime(timeOnInterval);
        }
    };

    useEffect(()=>{
        awaitData();
        clearInterval(refreshIntervalId);

        const refreshInterval = window.setInterval(intervalHandler, 60000);
        setRefreshIntervalId(refreshInterval);

        return (): void =>{
            clearInterval(refreshIntervalId);
        };
    },[lastRefreshTime]);

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
};