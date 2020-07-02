/* eslint-disable @typescript-eslint/no-require-imports */
export function initSentry(): void {
    if (process.env.NODE_ENV === "production") {
        const {init} = (process.type === "browser"
            ? require("@sentry/electron/dist/main")
            : require("@sentry/electron/dist/renderer"));

        init({dsn: process.env.SENTRY_DSN, release: process.env.npm_package_version});
    }
}
