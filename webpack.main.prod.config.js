const merge = require('webpack-merge');

const baseConfig = require('./webpack.main.config');
const baseProdConfig = require('./webpack.main.prod.config');

module.exports = merge.smart(baseConfig, baseProdConfig, {
    mode: 'production'
});
