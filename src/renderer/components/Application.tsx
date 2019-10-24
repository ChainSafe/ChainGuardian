import {hot} from "react-hot-loader/root";
import * as React from "react";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import OnboardContainer from "../containers/onboard/OnboardContainer";
import LoginContainer from "../containers/Login/LoginContainer";

const Application = (): ReactElement => (
    <Router>
        <Switch>
            <Route path="/onboard" component={OnboardContainer} />
            <Route path="/login" component={LoginContainer}/>
            <Redirect from="/" to="/login" />
        </Switch>
    </Router>

);

export default hot(Application);
