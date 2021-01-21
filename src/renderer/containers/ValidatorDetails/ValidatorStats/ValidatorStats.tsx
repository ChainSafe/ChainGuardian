import React, {ReactElement, useEffect, useState} from "react";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IValidator} from "../../../ducks/validator/slice";
import {SimpleLineChart, SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {ResponsiveContainer} from "recharts";
import database from "../../../services/db/api/database";
import {utils} from "ethers";
import {shell} from "electron";
import ReactTooltip from "react-tooltip";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const [data, setData] = useState<SimpleLineChartRecord[]>([]);

    const onBeaconChainClick = (): void => {
        const network = validator.network !== "mainnet" ? validator.network + "." : "";
        const validatorId = validator.publicKey.substr(2);
        shell.openExternal(`https://${network}beaconcha.in/validator/${validatorId}`);
    };

    useEffect(() => {
        const intervalFn = async (): Promise<void> => {
            const balances = await database.validator.balance.get(validator.publicKey);

            setData(balances.records.map(({balance, epoch}) => ({label: String(epoch), value: Number(balance)})));
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
    const labelFormatter = (label: string | number): string => `Epoch ${label}`;

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
                </div>
                <div className='graph-content'>
                    <ResponsiveContainer width='100%' height={200}>
                        <SimpleLineChart
                            data={data}
                            tooltip={{formatter, labelFormatter, separator: " "}}
                            xAxis={{
                                height: 40,
                                label: {value: "epoch", position: "insideBottom"},
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
