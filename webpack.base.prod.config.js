const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
    plugins: [
        // Sentry CLI used for uploading releases
        new SentryWebpackPlugin({
            include: './dist',
            release: packageJson.version,
        }),
    ]
};
