import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonSecondary, ButtonPrimary, ButtonPrimitive} from "../../../components/Button/ButtonStandard";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";

export default function WithdrawalKey(): ReactElement {
    return (
        <>
            <h1>Get a withdrawal key</h1>
            <p>In case your signing key gets compromised, 
                all of your validator balance will be withdrawn to this wallet. 
                Once a deposit is submitted, you cannot change this wallet. 
                We suggest storing this separately from the signing key.</p>
            <div className="action-buttons">
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT)}>
                    <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                </Link>
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_KEY_GENERATE)}>
                    <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
                </Link>
            </div>
            <h5 className="input-or">OR</h5>
            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE)}>
                <ButtonPrimitive buttonId="skip">SKIP</ButtonPrimitive>
            </Link>
            <div className="skip-notes" >If you skip, we won’t be able to generate a deposit transaction</div>
        </>
    );
}
