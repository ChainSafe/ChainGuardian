import {hot} from "react-hot-loader/root";
import React from "react";
import {MemoryRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import {OnboardContainer} from "./Onboard/OnboardContainer";
import {Routes} from "../constants/routes";
import {AddBeaconNodeContainer} from "./AddBeaconNode/AddBeaconNode";
import {BeaconNodesContainer} from "./BeaconNodes/BeaconNodes";
import {DashboardContainer} from "./Dashboard/DashboardContainer";
import {ValidatorDetailsContainer} from "./ValidatorDetails/ValidatorDetailsContainer";
import {AssignBeaconNode} from "./AssignBeaconNode/AssignBeaconNode";

const Application = (): ReactElement => (
    <div className='cg-app'>
        <Router>
            <Switch>
                <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer} />
                <Route path={Routes.DASHBOARD_ROUTE} component={DashboardContainer} />
                <Route path={Routes.VALIDATOR_DETAILS} component={ValidatorDetailsContainer} />
                <Route path={Routes.BEACON_NODES} component={BeaconNodesContainer} />
                <Route path={Routes.ADD_BEACON_NODE} component={AddBeaconNodeContainer} />
                <Route path={Routes.ASSIGN_BEACON_NODE} component={AssignBeaconNode} />
                <Redirect from='/' to={Routes.DASHBOARD_ROUTE} />
            </Switch>
        </Router>
    </div>
);

export default hot(Application);
