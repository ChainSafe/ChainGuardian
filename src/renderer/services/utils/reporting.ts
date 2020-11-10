import {DEFAULT_ACCOUNT} from "../../constants/account";
import database from "../db/api/database";

export const isReportingEnabled = async (account = DEFAULT_ACCOUNT): Promise<boolean> => {
    const settings = await database.settings.get(account);
    if (!settings) {
        // First time loading app, reporting until disabled (good for beta testing)
        return true;
    }

    return settings.reporting;
};
