# ChainGuardian

[![Build Status](https://travis-ci.org/chainsafe/ChainGuardian.svg?branch=master)](https://travis-ci.org/chainsafe/ChainGuardian)
[![codecov](https://codecov.io/gh/chainsafe/ChainGuardian/branch/master/graph/badge.svg)](https://codecov.io/gh/chainsafe/ChainGuardian)
[![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)](https://discord.gg/7Kd4FZq)
[![GitHub](https://img.shields.io/github/license/chainsafe/ChainGuardian)](./LICENSE)

Eth2.0 desktop validator client.

## Install
Clone the repository with Git:

```bash
git clone git@github.com:chainsafe/ChainGuardian.git
```

And then install the dependencies:

```bash
cd ChainGuardian
yarn install
```

## Usage
Both processes have to be started **simultaneously** in different console tabs:

```bash
yarn run start-renderer-dev
yarn run start-main-dev
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
yarn run start-dev
```

### UI development
For building components in isolation you can use [Storybook](https://storybook.js.org/).

Just run `yarn storybook` 

Design is based on: https://www.figma.com/file/dt1Z45BJkDGOg63IdNYwbR

### Development

It's best to use local network. Local network is configured using `docker-compose` (currently available lighthouse-testnet.yml).
For the first time you need to run setup script (`setup.sh`) on path `./testnet/lighthouse`
then type `docker-compose -f lighthouse-testnet.yml up` in terminal,  
you will get:
- 2 working lighthouse beacon nodes (port: 5052 and 6052)
- lighthouse validator with 15 dummy account

To start using local network just add beacon node with address `http://localhost:5052`.  
You can use this account to validate using ChainGuardian (or create new via launchpad):
- private key: `0x51d0b65185db6989ab0b560d6deed19c7ead0e24b9b6372cbecb1f26bdfad000`
- public key: `0xb89bebc699769726a318c8e9971bd3171297c61aea4a6578a7a4f94b547dcba5bac16a89108b6b6a1fe3695d1a874a0b`  

In case of longer break it is recommended to update genesis time before starting local tesnet with `reset_genesis_time.sh` script


## Packaging
We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```

## License
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Built with:

[![React](docs/img/react.png)](https://reactjs.org/)
[![Webpack](docs/img/webpack.png)](https://webpack.js.org/)
[![TypeScript](docs/img/ts.png)](https://www.typescriptlang.org/)
[![Electron](docs/img/electron.png)](https://electronjs.org/)
[![Redux](docs/img/redux.png)](https://redux.js.org/)
[![Jest](docs/img/jest.png)](https://facebook.github.io/jest/)
