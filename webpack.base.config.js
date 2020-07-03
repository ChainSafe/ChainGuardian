'use strict';

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: "[name].js.map",
    },
    externals: {
        'level':"require('level')",
        'bcrypto':"require('bcrypto')",
        'leveldown':"require('leveldown')",
    },
    devtool: 'source-map',
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    plugins: [
        new Dotenv(),
    ]
};
