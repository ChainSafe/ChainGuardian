import * as React from "react";
import {NotificationStacked} from "./components/Notification/NotificationStacked";
import {Notification} from "./components/Notification/Notification";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "./reducers/index";
import {INotificationStateObject} from "./reducers/notification";
import {removeNotificationAction} from "./actions/notification";

const NotificationRendererContainer: React.FunctionComponent<
IInjectedProps & Pick<IRootState, "notificationArray">> = (props) => {

    const mapNotifications = (arrays: INotificationStateObject): React.ReactElement => {
        return(
            <>
                <div className={"notification-stacked-container right bottom"}>
                    {arrays.stacked.map((n, index) =>
                        <NotificationStacked
                            key={index}
                            title={n.title}
                            isVisible={n.isVisible}
                            level={n.level}
                            horizontalPosition={n.horizontalPosition}
                            verticalPosition={n.verticalPosition}
                            onClose={(): void => {props.removeNotification(n.id);}}
                        >
                            {n.content}
                        </NotificationStacked>)}
                </div>
                <div>
                    {arrays.other.map((n, index) =>
                        <Notification
                            key={index}
                            title={n.title}
                            isVisible={n.isVisible}
                            level={n.level}
                            horizontalPosition={n.horizontalPosition}
                            verticalPosition={n.verticalPosition}
                            onClose={(): void => {props.removeNotification(n.id);}}
                        >
                            {n.content}
                        </Notification>)}
                </div>
            </>
        );
    };
    return mapNotifications(props.notificationArray);
};

interface IInjectedProps {
    removeNotification: typeof removeNotificationAction
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "notificationArray"> => ({
    notificationArray: state.notificationArray,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            removeNotification: removeNotificationAction
        },
        dispatch
    );

export const NotificationRenderer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationRendererContainer);