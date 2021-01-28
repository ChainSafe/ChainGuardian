import React, {ReactElement, useEffect, useState} from "react";
import {ButtonPrimitive, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IValidator} from "../../../ducks/validator/slice";
import {SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";
import database from "../../../services/db/api/database";
import {remote, shell} from "electron";
import ReactTooltip from "react-tooltip";
import {getValidatorBalanceChartData, getAttestationEfficiencyChartData} from "../../../services/utils/charts";
import {ValidatorBalanceChart} from "./ValidatorBalanceChart";
import {ValidatorAttestationEfficiencyChart, AttestationRecord} from "./ValidatorAttestationEfficiencyChart";
import {useDispatch} from "react-redux";
import {exportValidator} from "../../../ducks/validator/actions";

interface IValidatorStatsProps {
    validator: IValidator;
}

export const ValidatorStats = ({validator}: IValidatorStatsProps): ReactElement => {
    const [epochData, setEpochData] = useState<SimpleLineChartRecord[]>([]);
    const [dateData, setDateData] = useState<AttestationRecord[]>([]);
    const [useDate, setUseDate] = useState(false);

    const [attestationData, setAttestationData] = useState<SimpleLineChartRecord[]>([]);

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
