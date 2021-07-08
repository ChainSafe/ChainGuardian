import React, {useState} from "react";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {useHistory, useParams} from "react-router";
import {useSelector} from "react-redux";
import {getBeaconByKey} from "../../ducks/beacon/selectors";
import {IRootState} from "../../ducks/reducers";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";
import {BeaconNodeDashboard} from "./dashboard/BeaconNodeDashboard";
import {BeaconNodeLogs} from "./BeaconNodeLogs";
import {BeaconNodePerformance} from "./BeaconNodePerformance";
import {BeaconNodeMetrics} from "./BeaconNodeMetrics";

export const BeaconNodeContainer: React.FC = () => {
    const history = useHistory();
    const {url} = useParams();
    const beacon = useSelector((state: IRootState) => getBeaconByKey(state, {key: decodeURIComponent(url)}));
    const [currentTab, setCurrentTab] = useState(0);

    const tabs = [{tabId: 0, tabName: "Dashboard", index: 0}];
    if (beacon.docker) {
        tabs.push({tabId: 1, tabName: "Logs", index: 0}, {tabId: 2, tabName: "Performance", index: 0});
    }
    tabs.push({tabId: 3, tabName: "Metrics", index: 0});

    return (
        <Background scrollable={true}>
            <div className='flex-column validator-container beacon-node-details-container'>
                <div className='row'>
                    <BackButton onClick={(): void => history.goBack()} />
                    <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
                </div>
                <div className='container-scroll-y'>
                    {currentTab === tabs[0]?.tabId && <BeaconNodeDashboard beacon={beacon} />}
                    {currentTab === tabs[1]?.tabId && <BeaconNodeLogs beacon={beacon} />}
                    {currentTab === tabs[2]?.tabId && <BeaconNodePerformance beacon={beacon} />}
                    {currentTab === tabs[3]?.tabId && <BeaconNodeMetrics beacon={beacon} />}
                </div>
            </div>
        </Background>
    );
};
