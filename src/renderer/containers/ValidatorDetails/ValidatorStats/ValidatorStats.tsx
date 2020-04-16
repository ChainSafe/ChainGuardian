import React from "react";
import {BalanceGraph, IntervalEnum} from "../../../components/BalanceGraph/BalanceGraph";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {exportKeystore} from "../../Dashboard/export";

interface IValidatorStatsProps {
    validatorId: number;
}

export const ValidatorStats = ({ validatorId }: IValidatorStatsProps) => {
    const onExportValidator = (index: number): void => {
        const result = exportKeystore(validators[index]);
        // show notification only if success or error, not on cancel
        if (result) {
            displayNotification(result.message, result.level);
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
