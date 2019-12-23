import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonSecondary, ButtonPrimary,ButtonInverted} from "../../../components/Button/ButtonStandard";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";

export default function WithdrawalKey(): ReactElement {
    return (
        <>
            <h1>Get a withdrawal key</h1>
            <p>In case your signing key gets compromised,
                all of your validator balance will be withdrawn to this wallet.
                Once a deposit is submitted, you cannot change this wallet.
                We suggest storing this separately for the signing key.</p>
            <div className="action-buttons">
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT)}>
                    <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                </Link>

                <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
            </div>

            <div className="flex-column centered">
                <h5 className="input-or">OR</h5>

                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD)}>
                    <ButtonInverted>SKIP</ButtonInverted>
                </Link>

                <p className="small">If you skip, we won’t be able to generate a deposit transaction.</p>
            </div>
        </>
    );
}
