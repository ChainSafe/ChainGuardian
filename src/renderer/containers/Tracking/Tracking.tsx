import React from "react";
import {initializeTracking, matomo} from "../../services/tracking";
import {ipcRenderer} from "electron";
import {useHistory} from "react-router";

export const Tracking: React.FC = () => {
    const history = useHistory();

    React.useEffect(() => {
        (async (): Promise<void> => {
            await initializeTracking(history);
            if (matomo) matomo.trackEvent({category: "application", action: "start"});
        })();
        ipcRenderer.on("close-confirm", () => {
            if (matomo) matomo.trackEvent({category: "application", action: "quit"});
        });
    }, []);

    return null;
};
