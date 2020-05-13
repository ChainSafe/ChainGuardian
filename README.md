# ChainGuardian

[![Build Status](https://travis-ci.org/NodeFactoryIo/ChainGuardian.svg?branch=master)](https://travis-ci.org/NodeFactoryIo/ChainGuardian)
[![codecov](https://codecov.io/gh/NodeFactoryIo/ChainGuardian/branch/master/graph/badge.svg)](https://codecov.io/gh/NodeFactoryIo/ChainGuardian)
![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)
![GitHub](https://img.shields.io/github/license/NodeFactoryIo/ChainGuardian)

Eth2.0 desktop validator client.

## Install
Clone the repository with Git:

```bash
git clone git@github.com:nodefactoryio/ChainGuardian.git
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

It's best to use local network. Local network is configured using `docker-compose.yml`.
By typing `docker-compose up` in terminal, you will get:
- geth eth1 node with private POA network
- deposit contract deployed on that private eth1 network
    - contract is always deployed on address `0x2F1598e74b146F5687174C13f8EDCF490B2492e3`
- lighthouse eth2 private network

Local testnet is started with 16 validators but only 15 are active (run using lighthouse docker validator).
Url of local testnet beacon node is: `http://localhost:5052`;
You can use this account to validate using ChainGuardian (skip withdrawal key):
- private key: `0x03cffafa1cbaa7e585eaee07a9d35ae57f6dfe19a9ea53af9c37e9f3dfac617c`
- public key: `0x872c61b4a7f8510ec809e5b023f5fdda2105d024c470ddbbeca4bc74e8280af0d178d749853e8f6a841083ac1b4db98f`

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

## Donations

We are blockchain development agency from Croatia, our open source work is funded by grants.
This project is funded by MolochDAO. If you like our work and find this project useful, you can donate to 
this address: 
[0xbD9f96663E07a83ff18915c9074d9dc04d8E64c9](https://etherscan.io/address/0xbD9f96663E07a83ff18915c9074d9dc04d8E64c9)


[![NodeFactory](docs/img/nodefactory.png)](https://nodefactory.io)
