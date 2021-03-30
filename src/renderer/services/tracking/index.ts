import MatomoTracker from "@datapunt/matomo-tracker-js";
import database from "../db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {Routes} from "../../constants/routes";
import {useHistory} from "react-router";

export let matomo: null | MatomoTracker = null;

export const initializeTracking = async (history: ReturnType<typeof useHistory>): Promise<void> => {
    const setting = await database.settings.get(DEFAULT_ACCOUNT);
    if (!setting) history.push(Routes.CONSENT);
    else if (setting.reporting) startMatomo();
};

let timer: number | undefined;
const startTimer = (): void => {
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    timer = setInterval(async () => {
        const setting = await database.settings.get(DEFAULT_ACCOUNT);
        if (Date.now() >= setting.lastTrack + day) {
            const account = await database.account.get(DEFAULT_ACCOUNT);
            if (account) {
                const validators = account.getValidatorsAddresses();
                await Promise.all(
                    validators.map(
                        async (key): Promise<void> => {
                            const effectiveness = await database.validator.attestationEffectiveness.get(key);
                            const value = effectiveness.getAverageAttestationEfficiency(Date.now(), Date.now() - day);
                            if (matomo) matomo.trackEvent({category: "attestation", action: "average", value});
                        },
                    ),
                );
                await database.settings.set(DEFAULT_ACCOUNT, {lastTrack: Date.now()});
            }
        }
    }, hour) as number;
};

export const startMatomo = (): void => {
    matomo = new MatomoTracker({
        urlBase: "https://chainguardian.matomo.cloud/",
        siteId: 1,
        linkTracking: false,
    });
    startTimer();
};

export const stopMatomo = (): void => {
    matomo = null;
    if (timer) clearInterval(timer);
    timer = undefined;
};
