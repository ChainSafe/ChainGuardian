import React from "react";
import {useHistory} from "react-router";
import {storeNotificationAction} from "../../../actions";
import {BalanceGraph, IntervalEnum} from "../../../components/BalanceGraph/BalanceGraph";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {IRootState} from "../../../reducers";
import {useSelector, useDispatch} from "react-redux";
import {exportKeystore} from "../../../services/utils/account";

interface IValidatorStatsProps {
    validatorId: number;
}

export const ValidatorStats = ({validatorId}: IValidatorStatsProps) => {
    const validators = useSelector((state: IRootState) => state.auth.validators);
    const history = useHistory();
    const dispatch = useDispatch();

    const onExportValidator = (index: number): void => {
        const result = exportKeystore(validators[index]);
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
            <ButtonSecondary onClick={(): void => onExportValidator(validatorId)}>EXPORT</ButtonSecondary>

            <div className="row">
                <BalanceGraph
                    defaultInterval={IntervalEnum.MONTH}
                    getData={async () => [2356,3213,8934,7924,7924]}
                />
            </div>
        </div>
    );
};
