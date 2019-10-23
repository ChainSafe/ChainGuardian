import {hot} from "react-hot-loader/root";
import * as React from "react";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import LoginContainer from "../containers/LoginContainer";
import OnboardContainer from "../containers/onboard/OnboardContainer";

const Application = (): ReactElement => (
    <Router>
        <Switch>
            <Route path="/onboard" component={OnboardContainer} />
            <Route path="/login" component={LoginContainer}/>ž
            <Redirect from="/" to="/login" />
        </Switch>
    </Router>

);

export default hot(Application);
