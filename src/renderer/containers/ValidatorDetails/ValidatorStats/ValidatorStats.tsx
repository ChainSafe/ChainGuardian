import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";

import {LineGraph, IntervalEnum} from "../../../components/LineGraph/LineGraph";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {exportKeystore} from "../../../services/utils/account";
import {IValidator} from "../../../ducks/validator/slice";
import {createNotification} from "../../../ducks/notification/actions";

interface IValidatorStatsProps {
    validatorId: number;
    validator: IValidator;
}

export const ValidatorStats = ({validatorId, validator}: IValidatorStatsProps): ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();

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

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const renderBalanceGraph = (): React.ReactElement => (
        <div className='row'>
            <LineGraph
                title='Validator Balance'
                defaultInterval={IntervalEnum.MONTH}
                getData={async (): Promise<number[]> => [2356, 3213, 8934, 7924, 7924]}
            />
        </div>
    );

    return (
        <div className='validator-details-stats'>
            <div className='row space-between'>
                <h2>Validator {validatorId}</h2>
                <ButtonSecondary onClick={onExportValidator}>EXPORT</ButtonSecondary>
            </div>

            <p>Performance statistics are coming soon!</p>
        </div>
    );
};
