import React, {ReactElement, useState} from "react";
import {useHistory, useParams} from "react-router";
import {useSelector} from "react-redux";
import {RouteComponentProps} from "react-router-dom";

import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";
import {ValidatorLogs} from "./ValidatorLogs";
import {ValidatorStats} from "./ValidatorStats/ValidatorStats";
import {IRootState} from "../../ducks/reducers";
import {getValidator, getValidatorKeys} from "../../ducks/validator/selectors";

export const ValidatorDetailsContainer = (props: RouteComponentProps<{}, {}, {tab: "BN"}>): ReactElement => {
    const [currentTab, setCurrentTab] = useState(props.location?.state?.tab! === "BN" ? 2 : 0);
    const history = useHistory();
    const {publicKey} = useParams();
    const validatorKeys = useSelector(getValidatorKeys);
    const validatorsIndex = validatorKeys.indexOf(publicKey);
    const validator = useSelector((state: IRootState) => getValidator(state, {publicKey}));
    const validatorId = validatorsIndex > 0 ? validatorsIndex : 0;

    const tabs = [
        {tabId: 0, tabName: "Validator stats", index: validatorId},
        {tabId: 1, tabName: "Validator logs", index: validatorId},
    ];

    return (
        <Background scrollable={true}>
            <div className='flex-column stretch validator-container'>
                <div className='validator-details-container row'>
                    <BackButton onClick={(): void => history.goBack()} />
                    <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
                </div>
                <div className='container-scroll-y'>
                    {currentTab === tabs[0].tabId ? <ValidatorStats validator={validator} /> : null}

                    {currentTab === tabs[1].tabId ? <ValidatorLogs logger={validator.logger} /> : null}
                </div>
            </div>
        </Background>
    );
};
