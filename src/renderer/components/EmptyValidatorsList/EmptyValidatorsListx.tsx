import React from "react";
import {OnBoardingRoutes, Routes} from "../../constants/routes";
import {ButtonPrimary, ButtonSecondary} from "../Button/ButtonStandard";
import {Link} from "react-router-dom";

interface IEmptyValidatorsListProps {
    hasBeacons: boolean;
}

export const EmptyValidatorsList: React.FC<IEmptyValidatorsListProps> = ({hasBeacons}) => (
    <div className='validator-container'>
        <div className='box empty-list'>
            <div className='flex-column centered'>
                <h2>No {hasBeacons ? "validators" : "beacon nodes"} found.</h2>
                <p>Please add new {hasBeacons ? "validator" : "beacon node"} to start using ChainGuardian.</p>
            </div>

            {hasBeacons ? (
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING)}>
                    <ButtonPrimary buttonId={"add-validator"}>CREATE VALIDATOR</ButtonPrimary>
                </Link>
            ) : (
                <Link to={Routes.ADD_BEACON_NODE}>
                    <ButtonSecondary buttonId={"add-beacon"}>ADD NEW BEACON NODE</ButtonSecondary>
                </Link>
            )}
        </div>
    </div>
);
