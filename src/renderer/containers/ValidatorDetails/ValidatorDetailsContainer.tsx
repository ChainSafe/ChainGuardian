import React, {useState} from "react";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";

export const ValidatorDetailsContainer = () => {
    const [currentTab, setCurrentTab] = useState(1);
    const history = useHistory();

    const tabs = [
        {tabId: 1, tabName: "Validator stats"},
        {tabId: 2, tabName: "Beacon node"},
    ];

    return (
        <Background scrollable={true}>
            <div className="validator-details-container validator-container">
                <BackButton onClick={(): void => history.goBack()} />
                <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
            </div>
        </Background>
    );
};
