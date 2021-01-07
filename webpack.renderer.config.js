const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = require("./webpack.base.config");

module.exports = merge.smart(baseConfig, {
    target: "electron-renderer",
    entry: {
        app: ["@babel/polyfill","./src/renderer/app.tsx"]
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
                            {targets: {electron: "7.1.5"}}
                        ],
                        "@babel/preset-typescript",
                        "@babel/preset-react"
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-class-properties", {loose: true}],
                        "@babel/plugin-syntax-bigint"
                    ]
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                use: [
                    "file-loader",
                    {
                        loader: "image-webpack-loader",
                        options: {
                            disable: true
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // Should be good for dependencies
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: [
                    /@ethersproject/,
                    /ethers/,
                    /ethereumjs-util/,
                    /rlp/,
                    /fecha/,
                ],
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
        }),
        new webpack.DefinePlugin({
            "process.type": "\"renderer\""
        }),
    ]
});
