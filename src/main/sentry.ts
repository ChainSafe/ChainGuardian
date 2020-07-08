import {Event} from "@sentry/electron";
import {isReportingEnabled} from "../renderer/services/utils/reporting";
/* eslint-disable @typescript-eslint/no-require-imports */
export async function initSentry(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
        const {init} = (process.type === "browser"
            ? require("@sentry/electron/dist/main")
            : require("@sentry/electron/dist/renderer"));

        const version = (process.type === "browser"
            ? require("electron").app.getVersion()
            : require("electron").remote.app.getVersion());

        if (await isReportingEnabled()) {
            init({
                dsn: process.env.SENTRY_DSN,
                release: version,
                beforeSend: (event: Event) => {
                    if (event.exception && event.exception.values.length > 0 &&
                        // https://github.com/getsentry/sentry-electron/issues/237
                        event.exception.values[0].value.includes("Do not know how to serialize a BigInt"))
                    {
                        return null;
                    }

                    return event;
                },
            });
        }
    }
}
