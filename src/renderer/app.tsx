import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";
import {init as initBLS} from "@chainsafe/bls";

import {initSentry} from "../main/sentry";
import Application from "./containers/Application";
import "./style/index.scss";
import store from "./ducks/store";
import {mainLogger} from "../main/logger";
import {Overlays} from "./overlays";
import {MemoryRouter as Router} from "react-router";
import {Tracking} from "./containers/Tracking/Tracking";

initSentry();

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element): void => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Router>
                    <Component />
                    <Overlays />
                    <Tracking />
                </Router>
            </Provider>
        </AppContainer>,
        mainElement,
    );
};

initBLS("herumi")
    .then(() => {
        try {
            render(Application);
        } catch (e) {
            mainLogger.error(e);
        }
    })
    .catch((e) => mainLogger.error(e));
