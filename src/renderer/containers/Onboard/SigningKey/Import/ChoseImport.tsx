import React, {FC} from "react";
import {Link} from "react-router-dom";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {ButtonPrimary, ButtonSecondary} from "../../../../components/Button/ButtonStandard";

export const ChoseImport: FC = () => (
    <>
        <h1>Choose import method</h1>
        <p>Choose preferred import method</p>
        <div className='action-buttons'>
            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_FILE)}>
                <ButtonSecondary buttonId='import' large>
                    FILE
                </ButtonSecondary>
            </Link>
            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC)}>
                <ButtonPrimary buttonId='mnemonic' large>
                    MNEMONIC
                </ButtonPrimary>
            </Link>
        </div>
    </>
);
