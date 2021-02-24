const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const packageJson = require("./package.json");
const webpack = require("webpack");

const plugins = [
    new webpack.DefinePlugin({
        "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN || ""),
        "process.env.SENTRY_ORG": JSON.stringify(process.env.SENTRY_ORG || "nodefactory"),
        "process.env.SENTRY_PROJECT": JSON.stringify(process.env.SENTRY_PROJECT || "chainguardian"),
        "process.env.SENTRY_AUTH_TOKEN": JSON.stringify(process.env.SENTRY_AUTH_TOKEN || ""),
        "process.env.npm_package_version": JSON.stringify(packageJson.version),
    }),
];

if(process.env.SENTRY_AUTH_TOKEN) {
    // Sentry CLI used for uploading releases
    plugins.push(new SentryWebpackPlugin({

        // sentry-cli configuration
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,

        errorHandler: () => null,
        include: ["dist", "src"],
        release: packageJson.version,
    }));
} else {
    console.warn("Sentry source map not uploaded");
}


module.exports = {
    devtool: "source-map",
    plugins
};
