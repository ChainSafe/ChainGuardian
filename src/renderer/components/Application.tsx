import {hot} from "react-hot-loader/root";
import * as React from "react";
import {ReactElement} from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import OnboardContainer from "../containers/Onboard/OnboardContainer";
import LoginContainer from "../containers/Login/LoginContainer";
import {OnBoardingRoutes, Routes} from "../constants/routes";


const Application = (): ReactElement => (
    <Router>
        <Switch>
            <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer} />
            <Route path={Routes.LOGIN_ROUTE} component={LoginContainer} />
            <Redirect from="/" to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD)} />
        </Switch>
    </Router>

);

export default hot(Application);
