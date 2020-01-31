import * as React from "react";
import {useState, useEffect} from "react";
import {NotificationStacked} from "./components/Notification/NotificationStacked";
import {Notification} from "./components/Notification/Notification";
import {Horizontal, Level, Vertical} from "./components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {IRootState} from "./reducers/index";
import {INotificationState} from "./reducers/notification";

const NotificationRendererContainer: React.FunctionComponent<Pick<IRootState, "notificationArray">> = (props) => {
    
    console.log("Notification array: ");
    console.log(props.notificationArray);

    const mapNotifications = (array: Array<INotificationState>, stacked?: boolean): React.ReactElement => {
        if(stacked){
            // New Component - stacked notifications from bottom up
            return(
                <div className={`notification-stacked-container right bottom`}>
                {array.map((n, index)=>
                    <NotificationStacked
                        key={index}
                        title={n.title}
                        isVisible={n.isVisible}
                        level={n.level}
                        horizontalPosition={n.horizontalPosition}
                        verticalPosition={n.verticalPosition}
                        onClose={()=>{}}
                    >
                        {n.content}
                    </NotificationStacked>)}
                </div>
            );
        } else{
            // Absolutly positioned Notifications - old Notification Component
            return(
                <>
                {array.map((n, index)=>
                    <Notification
                        key={index}
                        title={n.title}
                        isVisible={n.isVisible}
                        level={n.level}
                        horizontalPosition={n.horizontalPosition}
                        verticalPosition={n.verticalPosition}
                        onClose={()=>{}}
                    >
                        {n.content}
                    </Notification>)}
                </>
            );
        }
    }
    return(
        <>
            {mapNotifications(props.notificationArray.stacked, true)}
            {mapNotifications(props.notificationArray.other)}
        </>
    );
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "notificationArray"> => ({
    notificationArray: state.notificationArray,
});

export const NotificationRenderer = connect(
    mapStateToProps,
    null
)(NotificationRendererContainer);