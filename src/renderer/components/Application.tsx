import {hot} from "react-hot-loader/root";
import * as React from "react";
import {MemoryRouter as Router, Switch, Route} from "react-router-dom";
import {ReactElement} from "react";
import LoginContainer from "../containers/LoginContainer";
import OnboardContainer from "../containers/onboard/OnboardContainer";

const Application = (): ReactElement => (
    <Router>
        <Switch>
            <Route path="/onboard" component={OnboardContainer} />
            <Route path="/" component={LoginContainer}/>
        </Switch>
    </Router>

);

export default hot(Application);
