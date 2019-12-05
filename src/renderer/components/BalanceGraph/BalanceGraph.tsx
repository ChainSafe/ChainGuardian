import * as React from "react";
import {useState, useEffect} from "react";
import { 
    LineChart, Line, XAxis, Tooltip,
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
enum Months {
    JAN = 0,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC
}

export interface IBalanceGraphProps {
    defaultInterval?: IntervalEnum;
    getData: () => Promise<number[]>;
}

export const BalanceGraph: React.FunctionComponent<IBalanceGraphProps> = (props: IBalanceGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [interval, setInterval] = useState<IntervalEnum>(IntervalEnum.WEEK);

    const formatDate = (date: string): string=>{
        const month = date.slice(4,7).toUpperCase();
        const day = date.slice(8,10);
        return month + " " + day;
    };

    const setXAxis = (array: Promise<number[]>, time: IntervalEnum): void=>{
        const dataArray: Array<object> = [];
        const dateToday = new Date();
        switch (time) {
            case IntervalEnum.HOUR: {
                const minute = dateToday.getMinutes();
                for (let i = 5; i >=0; i--) {
                    dataArray.push({
                        name: ((minute-10*i)<0 ? 60+(minute-10*i) : (minute-10*i)) + "'",
                        value: array[i]
                    });
                }
                break;
            }
            case IntervalEnum.DAY: {
                const hour = dateToday.getHours();
                for (let i = 9; i >=0; i--) {
                    dataArray.push({
                        name: (hour-i)<1 ? 24+hour-i : hour-i + "h",
                        value: array[i]
                    });
                }
                break;
            }
            case IntervalEnum.WEEK: {
                const day = dateToday.getDay();
                for (let i = 6; i >=0; i--) {
                    dataArray.push({
                        name: (day-i)<0 ? Days[7+day-i] : Days[day-i],
                        value: array[i]
                    });
                }
                break;
            }
            case IntervalEnum.MONTH: {
                for (let i = 29; i >=0; i--) {
                    const yesterday = new Date(new Date().setDate(new Date().getDate()-i-30));
                    dataArray.push({
                        name: formatDate(yesterday.toString()),
                        value: array[i]
                    });
                }
                break;
            }
            case IntervalEnum.YEAR: {
                const month = dateToday.getMonth();
                for (let i = 11; i >=0; i--) {
                    dataArray.push({
                        name: (month-i)<0 ? Months[12+month-i] : Months[month-i],
                        value: array[i]
                    });
                }
                break;
            }
        }
        setData(dataArray);
    };

    useEffect(()=>{
        const dataValueArray = props.getData();
        switch (interval) {
            case IntervalEnum.HOUR: setXAxis(dataValueArray, IntervalEnum.HOUR);
                break;
            case IntervalEnum.DAY: setXAxis(dataValueArray, IntervalEnum.DAY);
                break;
            case IntervalEnum.WEEK: setXAxis(dataValueArray, IntervalEnum.WEEK);
                break;
            case IntervalEnum.MONTH: setXAxis(dataValueArray, IntervalEnum.MONTH);
                break;
            case IntervalEnum.YEAR: setXAxis(dataValueArray, IntervalEnum.YEAR);
                break;
        }
    },[interval]);

    const handleOptionClick = (IntervalValue: IntervalEnum): void=>{
        setInterval(IntervalValue);
        props.getData();
    };

    return(
        <div className="balance-graph">
            <div className="graph-header">
                <div className="graph-title">Validator Balance</div>
                <div className="graph-options">
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.HOUR);}} 
                        className={`graph-option ${(interval===IntervalEnum.HOUR ? "selected" : "")}`}
                    >1H</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.DAY);}} 
                        className={`graph-option ${(interval===IntervalEnum.DAY ? "selected" : "")}`}
                    >1D</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.WEEK);}} 
                        className={`graph-option ${(interval===IntervalEnum.WEEK ? "selected" : "")}`}
                    >1W</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.MONTH);}} 
                        className={`graph-option ${(interval===IntervalEnum.MONTH ? "selected" : "")}`}
                    >1M</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.YEAR);}} 
                        className={`graph-option ${(interval===IntervalEnum.YEAR ? "selected" : "")}`}
                    >1Y</div>
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
                <Tooltip />
                <Line 
                    type="step" 
                    dataKey="value" 
                    stroke="#76DF9A" 
                    dot={false}
                />
            </LineChart>
        </div>
    );
};