import React, {ReactElement, useEffect, useState} from "react";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IValidator} from "../../../ducks/validator/slice";
import {SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import database from "../../../services/db/api/database";
import {shell} from "electron";
import ReactTooltip from "react-tooltip";
import {getValidatorBalanceChartData, getAttestationEfficiencyChartData} from "../../../services/utils/charts";
import {ValidatorBalanceChart} from "./ValidatorBalanceChart";
import {ValidatorAttestationEfficiencyChart} from "./ValidatorAttestationEfficiencyChart";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const [epochData, setEpochData] = useState<SimpleLineChartRecord[]>([]);
    const [dateData, setDateData] = useState<SimpleLineChartRecord[]>([]);
    const [useDate, setUseDate] = useState(false);

    const [attestationData, setAttestationData] = useState<SimpleLineChartRecord[]>([]);

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

            const attestations = await database.validator.attestationEffectiveness.get(validator.publicKey);
            setAttestationData(getAttestationEfficiencyChartData(attestations));
        };
        intervalFn();
        const interval = setInterval(intervalFn, 2 * 60 * 1000);
        return (): void => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className='validator-details-stats'>
            <div className='row space-between'>
                <h2>{validator.name}</h2>
                <ReactTooltip />
                <ButtonSecondary onClick={onBeaconChainClick} data-tip='Ethereum 2.0 Beacon Chain Explorer'>
                    Explorer
                </ButtonSecondary>
            </div>
            <div className='beacon-node-charts-container'>
                <ValidatorBalanceChart
                    dateData={dateData}
                    epochData={epochData}
                    useDate={useDate}
                    setUseDate={setUseDate}
                />
                <ValidatorAttestationEfficiencyChart data={attestationData} />
            </div>
            <br />
            <p>Performance statistics are coming soon!</p>
        </div>
    );
};
