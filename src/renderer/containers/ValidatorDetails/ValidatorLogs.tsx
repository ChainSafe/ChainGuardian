import React, {ReactElement} from "react";
import {LogStream} from "../../components/LogStream/LogStream";
import {ApiLogger} from "../../services/eth2/client/logger";

export const ValidatorLogs = (): ReactElement => {
    const logger = new ApiLogger();

    return (
      <div>
          <div className="box log-stream-container">
              <h3>Log Stream</h3>
              <LogStream stream={logger.stream} />
          </div>
      </div>
    );
};
