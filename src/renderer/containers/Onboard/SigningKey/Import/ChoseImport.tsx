import React, {FC} from "react";
import {Link} from "react-router-dom";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {ButtonPrimary, ButtonSecondary} from "../../../../components/Button/ButtonStandard";

// TODO: improve styling
export const ChoseImport: FC = () => (
    <>
        <h1>Chose</h1>
        <p>Pick now or go home</p>
        <div className="action-buttons">
            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_FILE)}>
                <ButtonSecondary buttonId="import" large>FILE</ButtonSecondary>
            </Link>
            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC)}>
                <ButtonPrimary buttonId="generate" large>MNEMONIC</ButtonPrimary>
            </Link>
        </div>
    </>
);
