import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";

import {IValidator, storeNotificationAction} from "../../../actions";
import {LineGraph, IntervalEnum} from "../../../components/LineGraph/LineGraph";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {exportKeystore} from "../../../services/utils/account";

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
            dispatch(storeNotificationAction({
                source: history.location.pathname,
                title: result.message,
                level: result.level
            }));
        }
    };

    return (
        <div className="validator-details-stats">
            <div className="row space-between">
                <h2>Validator {validatorId}</h2>
                <ButtonSecondary onClick={onExportValidator}>EXPORT</ButtonSecondary>
            </div>

            {true ? <p>Performance statistics are coming soon!</p> :
                <div className="row">
                    <LineGraph
                        title="Validator Balance"
                        defaultInterval={IntervalEnum.MONTH}
                        getData={async (): Promise<number[]> => [2356,3213,8934,7924,7924]}
                    />
                </div>
            }
        </div>
    );
};
