const merge = require("webpack-merge");

const baseConfig = require("./webpack.main.config");
const baseProdConfig = require("./webpack.base.prod.config");

module.exports = merge.smart(baseConfig, baseProdConfig, {
    module: {
        rules: [
            {
                // used for menu "about"
                test: /\.(png)$/,
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
        ],
    },
}, {
    mode: "production",
});
