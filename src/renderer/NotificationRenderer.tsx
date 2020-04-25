import * as React from "react";
import {Notification} from "./components/Notification/Notification";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "./reducers";
import {INotificationState} from "./reducers/notification";
import {removeNotificationAction} from "./actions";

const NotificationRendererContainer: React.FunctionComponent<
IInjectedProps & Pick<IRootState, "notificationArray">> = (props) => {

    const mapNotifications = (array: Array<INotificationState>): React.ReactElement => {
        return(
            <>
                {array.map((n, index) =>
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
            </>
        );
    };
    return (
        <>
            <div className={"notification-stacked-container right bottom"}>
                {mapNotifications(props.notificationArray.stacked)}
            </div>
            <div>
                {mapNotifications(props.notificationArray.other)}
            </div>
        </>
    );
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
