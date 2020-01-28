import {hot} from "react-hot-loader/root";
import * as React from "react";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import OnboardContainer from "../containers/Onboard/OnboardContainer";
import {LoginContainer} from "../containers/Login/LoginContainer";
import {Routes} from "../constants/routes";
import {DashboardContainer} from "../containers/Dashboard/DashboardContainer";
import {CheckPasswordContainer} from "../containers/AddValidator/CheckPassword";
import {ConfirmModal} from "../components/ConfirmModal/ConfirmModal"
import {storeBeforeQuitAction} from "../actions/beforeQuit" 
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {IRootState} from "../reducers/index";

const ApplicationContainer: React.FunctionComponent<IInjectedProps &  Pick<IRootState, "beforeQuit">> = 
    (props): ReactElement => {
        
        React.useEffect(()=>{
            console.log(props.beforeQuit.beforeQuit);
        },[])
        return(
            <>
                <Router>
                    <Switch>
                        <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer}/>
                        <Route path={Routes.LOGIN_ROUTE} component={LoginContainer}/>
                        <Route path={Routes.DASHBOARD_ROUTE} component={DashboardContainer}/>
                        <Route path={Routes.CHECK_PASSWORD} component={CheckPasswordContainer}/>
                        <Redirect from="/" to={Routes.LOGIN_ROUTE}/>
                    </Switch>
                </Router>;
                <ConfirmModal
                    showModal={props.beforeQuit.beforeQuit}
                    question="Are you sure?"
                    onOKClick={()=>{}}
                    onCancelClick={()=>{}}
                />
            </>
        );
    }
    
// export default hot(Application);

interface IInjectedProps{
    storeBeforeQuit: typeof storeBeforeQuitAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "beforeQuit"> => ({
    beforeQuit: state.beforeQuit,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeBeforeQuit: storeBeforeQuitAction
        },
        dispatch
    );

export const Application = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationContainer);
