import React, {ReactElement, useState} from "react";
import {useHistory, useParams} from "react-router";
import {useSelector} from "react-redux";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";
import {IRootState} from "../../reducers";
import {BeaconNode} from "./BeaconNode/BeaconNode";
import {ValidatorStats} from "./ValidatorStats/ValidatorStats";

export const ValidatorDetailsContainer = (): ReactElement => {
    const [currentTab, setCurrentTab] = useState(0);
    const history = useHistory();
    const {id} = useParams();
    const validatorId = id ? parseInt(id) : 0;
    const validators = Object.values(useSelector((state: IRootState) => state.validators));
    const beaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const validatorBeaconNodes = beaconNodes[validators[validatorId].publicKey] || [];

    const tabs = [
        {tabId: 0, tabName: "Validator stats", index: validatorId},
    ];
    // Load dynamically all validator's beacon node in tabs
    validatorBeaconNodes.forEach((node, index) => tabs.push({
        tabId: tabs.length + index,
        tabName: "Beacon node",
        index,
    }));

    return (
        <Background scrollable={true}>
            <div className="flex-column stretch validator-container">
                <div className="validator-details-container row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
                </div>

                {currentTab === tabs[0].tabId ?
                    <ValidatorStats validator={validators[validatorId]} validatorId={validatorId} />
                    : null}

                {tabs.map(tab => (tab.tabName === "Beacon node" && currentTab === tab.tabId ?
                    <BeaconNode key={tab.tabId} node={validatorBeaconNodes[tab.index]} />
                    : null
                ))}
            </div>
        </Background>
    );
};
