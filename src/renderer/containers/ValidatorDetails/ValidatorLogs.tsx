import React, {ReactElement} from "react";
import {LogStream} from "../../components/LogStream/LogStream";
import {ApiLogger} from "../../services/eth2/client/logger";

type ValidatorLogsProps = {
    logger?: ApiLogger,
};

export const ValidatorLogs = (props: ValidatorLogsProps): ReactElement => {
    return (
        <div>
            <div className="box log-stream-container">
                <h3>Log Stream</h3>
                <LogStream stream={props.logger ? props.logger.stream : undefined} />
            </div>
        </div>
    );
};
