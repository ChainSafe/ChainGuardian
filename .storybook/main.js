const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      // Mock required modules for some containers
      [path.resolve(__dirname, '../src/renderer/actions/index')]: path.resolve(__dirname, 'mocks/actions.ts'),
      [path.resolve(__dirname, '../src/renderer/services/utils/account')]: path.resolve(__dirname, 'mocks/account.ts'),
      "electron": path.resolve(__dirname, 'mocks/electron.ts'),
    };

    // Return the altered config
    return config;
  },
}