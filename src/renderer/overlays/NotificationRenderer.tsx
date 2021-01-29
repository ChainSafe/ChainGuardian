import * as React from "react";
import {Notification} from "../components/Notification/Notification";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {removeNotification} from "../ducks/notification/actions";
import {IRootState} from "../ducks/reducers";
import {INotificationState} from "../ducks/notification/slice";
import {getNotifications} from "../ducks/notification/selectors";

const NotificationRendererContainer: React.FunctionComponent<IInjectedProps & Pick<IRootState, "notificationArray">> = (
    props,
) => {
    const mapNotifications = (array: Array<INotificationState>): React.ReactElement => {
        return (
            <>
                {array.map((n, index) => (
                    <Notification
                        key={index}
                        title={n.title}
                        isVisible={n.isVisible}
                        level={n.level}
                        horizontalPosition={n.horizontalPosition}
                        verticalPosition={n.verticalPosition}
                        onClose={(): void => {
                            props.removeNotification(n.id);
                        }}>
                        {n.content}
                    </Notification>
                ))}
            </>
        );
    };
    return (
        <>
            <div className={"notification-stacked-container right bottom"}>
                {mapNotifications(props.notificationArray.stacked)}
            </div>
            <div>{mapNotifications(props.notificationArray.other)}</div>
        </>
    );
};

const mapStateToProps = (state: IRootState): Pick<IRootState, "notificationArray"> => ({
    notificationArray: getNotifications(state),
});

interface IInjectedProps {
    removeNotification: typeof removeNotification;
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            removeNotification: removeNotification,
        },
        dispatch,
    );

export const NotificationRenderer = connect(mapStateToProps, mapDispatchToProps)(NotificationRendererContainer);
