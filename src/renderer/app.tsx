import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";

import Application from "./containers/Application";
import store from "./store";
import "./style/index.scss";
import {ConfirmModal} from "./components/ConfirmModal/ConfirmModal";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element): void => {
    


    const handleBeforeQuit = (): boolean => {
        const x = store.getState();
        if(x){
            console.log(x.beforeQuit.beforeQuit);
            
            return x.beforeQuit.beforeQuit
        }else{
            return false
        }
    }
    
    
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
                <ConfirmModal
                    showModal={handleBeforeQuit()}
                    question="Are you sure?"
                    onOKClick={()=>{}}
                    onCancelClick={()=>{}}
                />
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
