export interface IDefaultBeaconNodeConfig {
    rpcPort: number;
    libp2pPort: number;
    discoveryPort: number;
    memory: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDefaultValidatorConfig {}

export interface IDefaults {
    beacon: IDefaultBeaconNodeConfig;
    validator: IDefaultValidatorConfig;
}

export interface IAllDefaults {
    [clientName: string]: IDefaults;
}

export const getAllDefaults = (): IAllDefaults => {
    const context = require.context(".", true, /\/(.*)\/(.*)defaults.ts/);
    return context
        .keys()
        .map((path) => ({
            name: path.split("/")[1],
            beacon: context(path).beaconNode,
            validator: context(path).validator,
        }))
        .reduce(
            (prev, {name, beacon, validator}) => ({
                ...prev,
                [name]: {beacon, validator},
            }),
            {},
        );
};

const defaults = getAllDefaults();

export const getDefaultsForClient = (clientName: string): IDefaults =>
    defaults[clientName] || {
        beacon: {
            rpcPort: 5052,
            libp2pPort: 9000,
            discoveryPort: 9000,
            memory: "3500m",
        },
        validator: {},
    };
