import React, {useState} from "react";
import {useHistory, useParams} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";
import {ValidatorStats} from "./ValidatorStats/ValidatorStats";

export const ValidatorDetailsContainer = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const history = useHistory();
    const { id } = useParams();
    const validatorId = id ? parseInt(id) : 0;

    const tabs = [
        {tabId: 0, tabName: "Validator stats"},
        {tabId: 1, tabName: "Beacon node"},
    ];

    return (
        <Background scrollable={true}>
            <div className="flex-column stretch validator-container">
                <div className="validator-details-container row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
                </div>

                {currentTab === tabs[0].tabId ?
                    <ValidatorStats validatorId={validatorId} />
                : null}
            </div>
        </Background>
    );
};
