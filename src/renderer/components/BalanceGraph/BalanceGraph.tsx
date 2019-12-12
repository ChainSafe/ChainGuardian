import * as React from "react";
import {normalizeHour,normalizeDay,normalizeWeek,
    normalizeMonth,normalizeYear} from "../../services/balance_graph/normalizeDataPoints";
import {useState, useEffect} from "react";
import { LineChart, Line, XAxis, Tooltip,} from "recharts";

export enum IntervalEnum {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}

export interface IBalanceGraphProps {
    defaultInterval: IntervalEnum;
    /**
     * HOUR-last 60 minutes - 60 values
     * DAY-last 24 hours - 24 values
     * WEEK-last 7 days - 7 values
     * MONTH-last 12 days - 12 values
     * YEAR-last 12 months- 12 values
     */
    getData: (interval: IntervalEnum) => Promise<number[]>;
}

export const BalanceGraph: React.FunctionComponent<IBalanceGraphProps> = (props: IBalanceGraphProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [intervalOption, setIntervalOption] = useState<IntervalEnum>(props.defaultInterval);
    const [refreshIntervalId, setRefreshIntervalId] = useState<number>(0);
    const [lastRefreshTime, setLastRefreshTime] = useState<number>(new Date().getTime());

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
        setIntervalOption(IntervalValue);
        const timeOnClick = new Date().getTime();
        setLastRefreshTime(timeOnClick);
    };

    const renderGraphIntervalOption = (IntervalValue: IntervalEnum): string => {
        let selector = "";
        intervalOption===IntervalValue ? selector="selected" : null;
        return `graph-option ${selector}`;
    };

    const awaitData = async (): Promise<void>=>{
        props.getData(intervalOption).then((dataValueArray)=>{
            setXAxis(dataValueArray, intervalOption);
        });
    };

    const refresh = (intervalHandler: () => void): void => {
        const localRefreshInterval = window.setInterval(intervalHandler, 60000);
        setRefreshIntervalId(localRefreshInterval);
    };

    useEffect(()=>{
        
        clearInterval(refreshIntervalId);

        switch (intervalOption) {
            case IntervalEnum.HOUR: {
                const timeOnInterval = new Date().getTime();
                const intervalHandler = (): void =>{
                    setLastRefreshTime(timeOnInterval);
                };
                refresh(intervalHandler);
            }
                break;
            case IntervalEnum.DAY: {
                const intervalHandler = (): void =>{
                    const timeOnInterval = new Date().getTime();
                    const diffInSeconds = (timeOnInterval - lastRefreshTime)/1000;
                    const hourToSeconds = 3600;
                    if(diffInSeconds >= hourToSeconds){
                        setLastRefreshTime(timeOnInterval);
                    }
                };
                refresh(intervalHandler);
            }
                break;
            case IntervalEnum.WEEK:
            case IntervalEnum.MONTH: {
                const intervalHandler = (): void =>{
                    const timeOnInterval = new Date().getTime();
                    const diffInSeconds = (timeOnInterval - lastRefreshTime)/1000;
                    const dayToSeconds = 86400;
                    if(diffInSeconds >= dayToSeconds){
                        setLastRefreshTime(timeOnInterval);
                    }
                };
                refresh(intervalHandler);
            }
                break;
            case IntervalEnum.YEAR: {
                const intervalHandler = (): void =>{
                    const timeOnInterval = new Date().getTime();
                    const diffInSeconds = (timeOnInterval - lastRefreshTime)/1000;
                    const monthToSeconds = 2678400;
                    if(diffInSeconds >= monthToSeconds){
                        setLastRefreshTime(timeOnInterval);
                    }
                };
                refresh(intervalHandler);
            }
                break;
        }

        awaitData();

    },[intervalOption,lastRefreshTime]);

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
                margin={{top: 5, bottom: 0, left: 20, right: 20,}}>
                <XAxis dataKey="name" stroke="#9ba7af" 
                    interval="preserveStartEnd" tickLine={false}/>
                <Tooltip isAnimationActive={false}/>
                <Line type="step" dataKey="value" stroke="#76DF9A" dot={false}/>
            </LineChart>
        </div>
    );
};