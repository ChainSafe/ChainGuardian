import React from "react";
import {Switch} from "../../../components/Switch/Switch";
import {ResponsiveContainer, TickFormatterFunction} from "recharts";
import {SimpleLineChart, SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {utils} from "ethers";

interface IProps {
    useDate: boolean;
    dateData: SimpleLineChartRecord[];
    epochData: SimpleLineChartRecord[];
    setUseDate: (checked: boolean) => void;
}

export const ValidatorBalanceChart: React.FC<IProps> = ({useDate, dateData, epochData, setUseDate}) => {
    const formatter = (value: string | number | Array<string | number>): [string, string] => [
        utils.formatEther(utils.parseUnits(value.toString(), "gwei")),
        "ETH",
    ];
    const labelFormatter = (label: string | number): React.ReactNode => {
        const index = (useDate ? dateData : epochData).findIndex((value) => value.label === label);
        if (index !== -1) {
            return (
                <span>
                    Epoch {epochData[index].label}
                    <br />
                    {dateData[index].label}
                </span>
            );
        }
        return "unknown";
    };
    const tickFormatter: TickFormatterFunction = (tick: string) => (useDate ? tick.slice(0, -6) : tick);

    return (
        <div className='node-graph-container' style={{width: 850}}>
            <div className='graph-header'>
                <div className='graph-title'>Validator Balance</div>
                <Switch checked={useDate} onChange={setUseDate} offLabel='Epoch' onLabel='Date' />
            </div>
            <div className='graph-content'>
                <ResponsiveContainer width='100%' height={200}>
                    <SimpleLineChart
                        data={useDate ? dateData : epochData}
                        tooltip={{formatter, labelFormatter, separator: " "}}
                        xAxis={{
                            height: 40,
                            label: {value: useDate ? "date" : "epoch", position: "insideBottom"},
                            interval: "preserveStartEnd",
                            tickFormatter,
                        }}
                        yAxis={{
                            hide: false,
                            tick: false,
                            axisLine: false,
                            width: 3,
                            label: {value: "ETH", angle: -90, position: "insideLeft", offset: -8},
                        }}
                    />
                </ResponsiveContainer>
            </div>
        </div>
    );
};
