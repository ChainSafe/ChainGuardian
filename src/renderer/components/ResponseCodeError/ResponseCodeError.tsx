import * as React from "react";
import {useState, useEffect} from "react";
import {PieChart, Pie, Tooltip, Cell} from "recharts";
import {IntervalEnum} from "../LineGraph/LineGraph";

export interface IResponseCodeErrorProps {
    getData: (interval: IntervalEnum) => Promise<Array<object>>;
}

const COLORS = ["#09BC8A", "#EDFF86", "#EA526F"];

export const ResponseCodeError: React.FunctionComponent<IResponseCodeErrorProps> = (props: IResponseCodeErrorProps) => {
    const [data, setData] = useState<Array<object>>([]);
    const [intervalOption, setIntervalOption] = useState<IntervalEnum>(IntervalEnum.DAY);
    const [refreshIntervalId, setRefreshIntervalId] = useState<number>(0);

    const handleOptionClick = (IntervalValue: IntervalEnum): void => {
        setIntervalOption(IntervalValue);
    };

    const renderGraphIntervalOption = (IntervalValue: IntervalEnum): string => {
        let selector = "";
        intervalOption === IntervalValue ? (selector = "selected") : null;
        return `graph-option ${selector}`;
    };

    const awaitData = async (): Promise<void> => {
        const dataValueArray = await props.getData(intervalOption);
        setData(dataValueArray);
    };

    useEffect(() => {
        awaitData();
        clearInterval(refreshIntervalId);

        const refreshIntervalValue = window.setInterval(awaitData, 300000);
        setRefreshIntervalId(refreshIntervalValue);

        return (): void => {
            clearInterval(refreshIntervalId);
        };
    }, [intervalOption]);

    return (
        <div className='node-graph-container'>
            <div className='graph-header'>
                <div className='graph-title'>Response Code Errors</div>
                <div className='graph-options'>
                    <div
                        onClick={(): void => {
                            handleOptionClick(IntervalEnum.DAY);
                        }}
                        className={renderGraphIntervalOption(IntervalEnum.DAY)}>
                        DAY
                    </div>
                    <div
                        onClick={(): void => {
                            handleOptionClick(IntervalEnum.WEEK);
                        }}
                        className={renderGraphIntervalOption(IntervalEnum.WEEK)}>
                        WEEK
                    </div>
                    <div
                        onClick={(): void => {
                            handleOptionClick(IntervalEnum.MONTH);
                        }}
                        className={renderGraphIntervalOption(IntervalEnum.MONTH)}>
                        MONTH
                    </div>
                </div>
            </div>
            <div className='graph-content'>
                <div className='graph-legend'>
                    <div className='legend-item success'>SUCCESS</div>
                    <div className='legend-item warning'>WARNING</div>
                    <div className='legend-item error'>ERROR</div>
                </div>
                <PieChart width={180} height={180}>
                    <Tooltip isAnimationActive={false} />
                    <Pie
                        animationBegin={100}
                        animationDuration={1000}
                        data={data}
                        innerRadius={55}
                        outerRadius={89}
                        dataKey='value'
                        startAngle={90}
                        endAngle={-270}
                        minAngle={10}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        </div>
    );
};
