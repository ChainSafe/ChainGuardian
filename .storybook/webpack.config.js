const path = require('path');

module.exports = ({ config, mode }) => {
    config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
    });
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [['react-app', { flow: false, typescript: true }]],
        },
    });
    config.resolve.extensions.push('.ts', '.tsx', ".scss");

    config.resolve.alias = {
        ...config.resolve.alias,
        // Mock required modules for some containers
        [path.resolve(__dirname, '../src/renderer/actions/index')]: path.resolve(__dirname, 'mockActions.ts'),
        [path.resolve(__dirname, '../src/renderer/services/utils/account')]: path.resolve(__dirname, 'mockFn.ts'),
    };
    return config;
};
