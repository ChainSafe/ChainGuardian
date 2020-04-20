import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";

import {storeNotificationAction} from "../../../actions";
import {BalanceGraph, IntervalEnum} from "../../../components/BalanceGraph/BalanceGraph";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {exportKeystore} from "../../../services/utils/account";
import {IValidator} from "../../Dashboard/DashboardContainer";

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
            <h2>Validator {validatorId}</h2>
            <ButtonSecondary onClick={onExportValidator}>EXPORT</ButtonSecondary>

            <div className="row">
                <BalanceGraph
                    defaultInterval={IntervalEnum.MONTH}
                    getData={async () => [2356,3213,8934,7924,7924]}
                />
            </div>
        </div>
    );
};
