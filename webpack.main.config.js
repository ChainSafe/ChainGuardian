const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const baseConfig = require("./webpack.base.config");

module.exports = merge.smart(baseConfig, {
    target: "electron-main",
    entry: {
        main: "./src/main/main.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [
                    /node_modules/,
                    "/src/**/*.stories.tsx"
                ],
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            "@babel/preset-env",
                            {targets: "node 12"}
                        ],
                        "@babel/preset-typescript"
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-class-properties", {loose: true}]
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/bcrypto/build', to: 'build' },
            ]
        })
    ]
});
