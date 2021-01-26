import React, {ReactElement, useEffect, useState} from "react";
import {ButtonPrimitive, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IValidator} from "../../../ducks/validator/slice";
import {SimpleLineChart, SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {ResponsiveContainer, TickFormatterFunction} from "recharts";
import database from "../../../services/db/api/database";
import {utils} from "ethers";
import {remote, shell} from "electron";
import ReactTooltip from "react-tooltip";
import {Switch} from "../../../components/Switch/Switch";
import {getValidatorBalanceChartData} from "../../../services/utils/charts";
import path from "path";
import {useDispatch} from "react-redux";
import { exportValidator } from "../../../ducks/validator/actions";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const [epochData, setEpochData] = useState<SimpleLineChartRecord[]>([]);
    const [dateData, setDateData] = useState<SimpleLineChartRecord[]>([]);
    const [useDate, setUseData] = useState(false);

    const dispatch = useDispatch();

    const onBeaconChainClick = (): void => {
        const network = validator.network !== "mainnet" ? validator.network + "." : "";
        const validatorId = validator.publicKey.substr(2);
        shell.openExternal(`https://${network}beaconcha.in/validator/${validatorId}`);
    };

    const onExportValidator = (): void => {
        const savePath = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
            title: `Saving keystore and slashing db for "${validator.name}"`,
            defaultPath: remote.app.getPath("home"),
            buttonLabel: "Export",
            properties: ["openDirectory"],
        });
        if (savePath && savePath.length) {
            dispatch(exportValidator(savePath[0], validator.publicKey));
        }
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
                <div className='button-spacing'>
                    <ReactTooltip />
                    <ButtonSecondary onClick={onBeaconChainClick} data-tip='Ethereum 2.0 Beacon Chain Explorer'>
                        Explorer
                    </ButtonSecondary>
                    <ButtonPrimitive onClick={onExportValidator} data-tip='Export validator keystore and slashing db'>
                        Export
                    </ButtonPrimitive>
                </div>
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
