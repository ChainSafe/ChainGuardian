import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonSecondary, ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";

export default function WithdrawalKey(): ReactElement {
    return (
        <>
            <h1>Enter your withdrawal key</h1>
            <p>In case your signing key gets compromised,
                all of your validator balance will be withdrawn to this wallet.
                Once a deposit is submitted, you cannot change this wallet.
                We suggest storing this separately fro the signing key</p>
            <div className="action-buttons">
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT)}>
                    <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                </Link>

                <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
            </div>
        </>
    );
}
