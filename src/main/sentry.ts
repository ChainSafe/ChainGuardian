export function initSentry() {
    const { init } = (process.type === 'browser'
        ? require('@sentry/electron/dist/main')
        : require('@sentry/electron/dist/renderer'));

    init({ dsn: process.env.SENTRY_DSN });
}
