import React, {ReactElement, useEffect, useState} from "react";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IValidator} from "../../../ducks/validator/slice";
import {SimpleLineChart, SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {ResponsiveContainer, TickFormatterFunction} from "recharts";
import database from "../../../services/db/api/database";
import {utils} from "ethers";
import {shell} from "electron";
import ReactTooltip from "react-tooltip";
import {Switch} from "../../../components/Switch/Switch";
import {getValidatorBalanceChartData} from "../../../services/utils/charts";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const [epochData, setEpochData] = useState<SimpleLineChartRecord[]>([]);
    const [dateData, setDateData] = useState<SimpleLineChartRecord[]>([]);
    const [useDate, setUseData] = useState(false);

    const onBeaconChainClick = (): void => {
        const network = validator.network !== "mainnet" ? validator.network + "." : "";
        const validatorId = validator.publicKey.substr(2);
        shell.openExternal(`https://${network}beaconcha.in/validator/${validatorId}`);
    };

    useEffect(() => {
        const intervalFn = async (): Promise<void> => {
            const balances = await database.validator.balance.get(validator.publicKey);

            const {epoch, date} = getValidatorBalanceChartData(balances.records, validator.network);
            setEpochData(epoch);
            setDateData(date);
        };
        intervalFn();
        const interval = setInterval(intervalFn, 2 * 60 * 1000);
        return (): void => {
            clearInterval(interval);
        };
    }, []);

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
        <div className='validator-details-stats'>
            <div className='row space-between'>
                <h2>{validator.name}</h2>
                <ReactTooltip />
                <ButtonSecondary onClick={onBeaconChainClick} data-tip='Ethereum 2.0 Beacon Chain Explorer'>
                    Explorer
                </ButtonSecondary>
            </div>

            <div className='node-graph-container' style={{width: "100%"}}>
                <div className='graph-header'>
                    <div className='graph-title'>Validator Balance</div>
                    <Switch checked={useDate} onChange={setUseData} offLabel='Epoch' onLabel='Date' />
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
            <br />
            <p>Performance statistics are coming soon!</p>
        </div>
    );
};
