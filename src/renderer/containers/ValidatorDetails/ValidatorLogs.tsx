import React, {ReactElement} from "react";
import {LogStream} from "../../components/LogStream/LogStream";
import {ValidatorLogger} from "../../services/eth2/client/module";

type ValidatorLogsProps = {
    logger?: ValidatorLogger;
};

export const ValidatorLogs = (props: ValidatorLogsProps): ReactElement => {
    return (
        <div>
            <div className='box log-stream-container'>
                <h4>Log Stream</h4>
                <LogStream source={props.logger ? props.logger.getLogIterator() : undefined} />
            </div>
        </div>
    );
};
