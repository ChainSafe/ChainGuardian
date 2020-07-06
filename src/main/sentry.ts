/* eslint-disable @typescript-eslint/no-require-imports */
export function initSentry(): void {
    if (process.env.NODE_ENV === "production") {
        const {init} = (process.type === "browser"
            ? require("@sentry/electron/dist/main")
            : require("@sentry/electron/dist/renderer"));

        const version = (process.type === "browser"
            ? require("electron").app.getVersion()
            : require("electron").remote.app.getVersion());

        init({dsn: process.env.SENTRY_DSN, release: version});
    }
}
