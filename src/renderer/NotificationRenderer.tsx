import * as React from "react";
import {useState, useEffect} from "react";
import {Notification} from "./components/Notification/Notification";
import {Horizontal, Level, Vertical} from "./components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "./reducers/index";

const NotificationRendererContainer: React.FunctionComponent<IInjectedProps> = (props) => {


    return(
        <Notification
        isVisible={true}
        level={Level.INFO}
        horizontalPosition={Horizontal.CENTER}
        verticalPosition={Vertical.CENTER}
        onClose={()=>{}}
        >
            TEST
        </Notification>
    );
}

interface IInjectedProps {
    // notification: typeof notificationAction
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            // notification: notificationAction,
        },
        dispatch
    );

export const NotificationRenderer = connect(
    null,
    mapDispatchToProps
)(NotificationRendererContainer);