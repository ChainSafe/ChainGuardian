import * as React from "react";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

export enum IntervalEnum {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}

enum Days {
    SUN = 0,MON,TUE,WED,THU,FRI,SAT,
}

export interface IBalanceGraphProps {
    defaultInterval?: IntervalEnum;
    onOptionClick: () => void;
    getData: () => Promise<number[]>;
}

export const BalanceGraph: React.FunctionComponent<IBalanceGraphProps> = (props: IBalanceGraphProps) => {
    const dataValueArray = props.getData();
    
    let data: Array<object> = [];

    for (let i = 0; i < dataValueArray.length; i++) {
        data.push({
            name: Days[i],
            value: dataValueArray[i]
        })
    }
    const date = new Date;
    return(
        <div className="balance-graph">
            {console.log(date.getDate())}
            <div className="graph-header">
                <div className="graph-title">Validator Balance</div>
                <div className="graph-options">
                    <div onClick={(): void=>{props.onOptionClick();}} className="graph-option">1H</div>
                    <div className="graph-option">1D</div>
                    <div className="graph-option">1W</div>
                    <div className="graph-option">1M</div>
                    <div className="graph-option">1Y</div>
                    <div className="graph-option">ALL</div>
                </div>
            </div>
            <LineChart
                width={624}
                height={199}
                data={data}
                margin={{top: 5, bottom: 0, left: 30, right: 30,}}>
                <XAxis 
                    dataKey="name" 
                    stroke="#9ba7af" 
                    interval="preserveStartEnd"
                    tickLine={false}
                />
                {/* <Tooltip /> */}
                <Line 
                    animationDuration={1000}
                    type="step" 
                    dataKey="value" 
                    stroke="#76DF9A" 
                    dot={false}
                    label={{dy: -15}}
                    />
            </LineChart>
        </div>
    );
}