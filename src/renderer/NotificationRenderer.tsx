import * as React from "react";
import {useState, useEffect} from "react";
import {Notification} from "./components/Notification/Notification";
import {Horizontal, Level, Vertical} from "./components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {IRootState} from "./reducers/index";

const NotificationRendererContainer: React.FunctionComponent<
Pick<IRootState, "notificationArray">> = (props) => {
    
    console.log("Notification array: ");
    console.log(props.notificationArray);

        return(
            <>
                {props.notificationArray.map((n, index)=>
                    <Notification
                        title={n.title}
                        isVisible={n.isVisible}
                        level={n.level}
                        horizontalPosition={n.horizontalPosition}
                        verticalPosition={n.verticalPosition}
                        onClose={()=>{}}
                    >
                        {n.content}
                    </Notification>
                )}
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