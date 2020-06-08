import {hot} from "react-hot-loader/root";
import React, {useEffect} from "react";
import {MemoryRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import OnboardContainer from "../containers/Onboard/OnboardContainer";
import {BeaconChain} from "../services/docker/chain";
import {Routes} from "../constants/routes";
import {DashboardContainer} from "./Dashboard/DashboardContainer";
import {ValidatorDetailsContainer} from "./ValidatorDetails/ValidatorDetailsContainer";

const Application = (): ReactElement => {
    useEffect(() => {
        async function afterLoad(): Promise<void> {
            await BeaconChain.startAllLocalBeaconNodes();
        }

        afterLoad();
    }, []);

    return (
        <div className="cg-app">
            <Router>
                <Switch>
                    <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer}/>
                    <Route path={Routes.DASHBOARD_ROUTE} component={DashboardContainer}/>
                    <Route path={Routes.VALIDATOR_DETAILS} component={ValidatorDetailsContainer}/>
                    <Redirect from="/" to={Routes.DASHBOARD_ROUTE}/>
                </Switch>
            </Router>
        </div>
    );
};
export default hot(Application);
