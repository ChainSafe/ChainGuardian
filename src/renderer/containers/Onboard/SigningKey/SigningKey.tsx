import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonSecondary, ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";

export default function SigningKey(): ReactElement {
    return (
        <>
            <h1>Enter your signing key</h1>
            <p>You’ll need this for signing blocks and attestations on your behalf</p>
            <div className='action-buttons'>
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT)}>
                    <ButtonSecondary buttonId='import' large>
                        IMPORT
                    </ButtonSecondary>
                </Link>
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_KEY_GENERATE)}>
                    <ButtonPrimary buttonId='generate' large>
                        GENERATE
                    </ButtonPrimary>
                </Link>
            </div>
        </>
    );
}
