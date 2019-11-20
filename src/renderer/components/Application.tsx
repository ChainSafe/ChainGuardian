import {hot} from "react-hot-loader/root";
import * as React from "react";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import OnboardContainer from "../containers/Onboard/OnboardContainer";
import LoginContainer from "../containers/Login/LoginContainer";
import DepositTxContainer from "../containers/DepositTx/DepositTxContainer";
import {Routes} from "../constants/routes";


const Application = (): ReactElement => (
    <Router>
        <Switch>
            <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer} />
            <Route path={Routes.LOGIN_ROUTE} component={LoginContainer} />
            <Redirect from="/" to={Routes.LOGIN_ROUTE} />
        </Switch>
    </Router>

);

export default hot(Application);
