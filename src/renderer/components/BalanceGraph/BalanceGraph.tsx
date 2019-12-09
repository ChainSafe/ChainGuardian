import * as React from "react";
import {normalizeHour,normalizeDay,normalizeWeek,
    normalizeMonth,normalizeYear} from "../../services/balance_graph/normalizeDataPoints";
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

export interface IBalanceGraphProps {
    defaultInterval: IntervalEnum;
    getData: (interval: IntervalEnum) => Promise<number[]>;
    //HOUR-last 60 minutes - 60 values
    //DAY-last 24 hours - 24 values
    //WEEK-last 7 days - 7 values
    //MONTH-last 12 days - 12 values
    //YEAR-last 12 months- 12 values
}

export const BalanceGraph: React.FunctionComponent<IBalanceGraphProps> = (props: IBalanceGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [interval, setInterval] = useState<IntervalEnum>(props.defaultInterval);
    const [refreshInterval, setRefreshInterval] = useState<number>(0);

    const setXAxis = (array: number[], interval: IntervalEnum): void=>{
        let dataArray: Array<object> = [];
        switch (interval) {
            case IntervalEnum.HOUR: dataArray=normalizeHour(dataArray,array);
                break;
            case IntervalEnum.DAY: dataArray=normalizeDay(dataArray,array);
                break;
            case IntervalEnum.WEEK: dataArray=normalizeWeek(dataArray,array);
                break;
            case IntervalEnum.MONTH: dataArray=normalizeMonth(dataArray,array);
                break;
            case IntervalEnum.YEAR: dataArray=normalizeYear(dataArray,array);
                break;
        }
        setData(dataArray);
    };

    const handleOptionClick = (IntervalValue: IntervalEnum): void=>{
        setInterval(IntervalValue);
        props.getData(interval);
    };

    const renderGraphIntervalOption = (IntervalValue: IntervalEnum): string => {
        let selector = "";
        interval===IntervalValue ? selector="selected" : null;
        return `graph-option ${selector}`;
    };

    const awaitData = async (): Promise<void>=>{
        props.getData(interval).then((dataValueArray)=>{
            setXAxis(dataValueArray, interval);
        });
    };

    useEffect(()=>{
        clearInterval(refreshInterval);

        const timeNow = new Date();
        const msUntil = (60-(timeNow.getSeconds()))*1000;
        const minUntil = ((60-(timeNow.getMinutes()-1))*1000*60)+msUntil;
        const hourUntil = ((24-(timeNow.getHours()-1))*1000*60*60)+minUntil;

        switch (interval) {
            case IntervalEnum.HOUR: {
                const intervalHandler = (): void =>{
                    awaitData();
                    const localRefreshInterval = window.setInterval(awaitData, 60000);
                    setRefreshInterval(localRefreshInterval);
                };
                window.setTimeout(intervalHandler,msUntil);
            }
                break;
            case IntervalEnum.DAY: {
                const intervalHandler = (): void =>{
                    awaitData();
                    const localRefreshInterval = window.setInterval(awaitData, 3600000);
                    setRefreshInterval(localRefreshInterval);
                };
                window.setTimeout(intervalHandler,minUntil);
            }
                break;
            case (IntervalEnum.WEEK || IntervalEnum.MONTH): {
                const intervalHandler = (): void =>{
                    awaitData();
                    const localRefreshInterval = window.setInterval(awaitData, 86400000);
                    setRefreshInterval(localRefreshInterval);
                };
                window.setTimeout(intervalHandler,hourUntil);
            }
                break;
            case IntervalEnum.YEAR: {
                const intervalHandler = (): void =>{
                    if (timeNow.getDate()===1){
                        awaitData();
                    }
                    const localRefreshInterval = window.setInterval(awaitData, 86400000);
                    setRefreshInterval(localRefreshInterval);
                };
                window.setTimeout(intervalHandler, hourUntil);
            }
                break;
        }
        awaitData();
    },[interval]);

    return(
        <div className="balance-graph">
            <div className="graph-header">
                <div className="graph-title">Validator Balance</div>
                <div className="graph-options">
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.HOUR);}} 
                        className={renderGraphIntervalOption(IntervalEnum.HOUR)}
                    >1H</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.DAY);}} 
                        className={renderGraphIntervalOption(IntervalEnum.DAY)}
                    >1D</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.WEEK);}} 
                        className={renderGraphIntervalOption(IntervalEnum.WEEK)}
                    >1W</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.MONTH);}} 
                        className={renderGraphIntervalOption(IntervalEnum.MONTH)}
                    >1M</div>
                    <div onClick={(): void=>{handleOptionClick(IntervalEnum.YEAR);}} 
                        className={renderGraphIntervalOption(IntervalEnum.YEAR)}
                    >1Y</div>
                </div>
            </div>
            <LineChart
                width={624} height={199} data={data}
                margin={{top: 5, bottom: 0, left: 30, right: 30,}}>
                <XAxis dataKey="name" stroke="#9ba7af" 
                    interval="preserveStartEnd" tickLine={false}/>
                <Tooltip isAnimationActive={false}/>
                <Line type="step" dataKey="value" stroke="#76DF9A" dot={false}/>
            </LineChart>
        </div>
    );
};