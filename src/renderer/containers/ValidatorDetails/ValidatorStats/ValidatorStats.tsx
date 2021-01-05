import React, {ReactElement, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {exportKeystore} from "../../../services/utils/account";
import {IValidator} from "../../../ducks/validator/slice";
import {createNotification} from "../../../ducks/notification/actions";
import {SimpleLineChart, SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import {ResponsiveContainer} from "recharts";
import database from "../../../services/db/api/database";
import {utils} from "ethers";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [data, setData] = useState<SimpleLineChartRecord[]>([]);

    const onExportValidator = (): void => {
        const result = exportKeystore(validator);
        // show notification only if success or error, not on cancel
        if (result) {
            dispatch(
                createNotification({
                    source: history.location.pathname,
                    title: result.message,
                    level: result.level,
                }),
            );
        }
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
                <ButtonSecondary onClick={onExportValidator}>EXPORT</ButtonSecondary>
            </div>

            <div className='node-graph-container' style={{width: "100%"}}>
                <div className='graph-header'>
                    <div className='graph-title'>Validator Balance</div>
                </div>
                <div className='graph-content'>
                    <ResponsiveContainer width='100%' height={200}>
                        <SimpleLineChart data={data} tooltip={{formatter, labelFormatter, separator: " "}} />
                    </ResponsiveContainer>
                </div>
            </div>
            <br />
            <p>Performance statistics are coming soon!</p>
        </div>
    );
};
