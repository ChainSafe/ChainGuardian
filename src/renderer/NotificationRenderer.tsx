import * as React from "react";
import {useState, useEffect} from "react";
import {Notification} from "./components/Notification/Notification";
import {Horizontal, Level, Vertical} from "./components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "./reducers/index";
import {storeNotificationAction} from "./actions/notification";

const NotificationRendererContainer: React.FunctionComponent<
    IInjectedProps & Pick<IRootState, "notificationArray">> = (props) => {

    console.log(props.notificationArray.notificationArray);

    return(
        <Notification
            title="Global notification"
            isVisible={true}
            level={Level.ERROR}
            horizontalPosition={Horizontal.CENTER}
            verticalPosition={Vertical.TOP}
            onClose={()=>{}}
        >
            TEST
        </Notification>
    );
}

interface IInjectedProps {
    notification: typeof storeNotificationAction
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "notificationArray"> => ({
    notificationArray: state.notificationArray,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            notification: storeNotificationAction,
        },
        dispatch
    );

export const NotificationRenderer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationRendererContainer);