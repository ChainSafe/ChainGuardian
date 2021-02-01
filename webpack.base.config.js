"use strict";

const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    externals: {
        "level": "require('level')",
        "bcrypto": "require('bcrypto')",
        "leveldown": "require('leveldown')",
        "bufferutil": "require('bufferutil')",
        "utf-8-validate": "require('utf-8-validate')",
    },
    devtool: "cheap-source-map",
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        mainFields: ["main", "module"],
        extensions: [".tsx", ".ts", ".js", ".json"],
    },
    plugins: [
        new Dotenv(),
        new webpack.IgnorePlugin({
            resourceRegExp: /\@chainsafe\/blst/,
          }),
          new webpack.DefinePlugin({
            "process.env.DOCKER_LIGHTHOUSE_IMAGE": JSON.stringify(process.env.DOCKER_LIGHTHOUSE_IMAGE || "sigp/lighthouse:v1.0.6"),
        }),
    ]
};
