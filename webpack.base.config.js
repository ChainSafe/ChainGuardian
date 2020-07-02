'use strict';

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    externals: {
        'level':"require('level')",
        'bcrypto':"require('bcrypto')",
        'leveldown':"require('leveldown')",
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map',
    plugins: [
        new Dotenv(),
    ]
};
