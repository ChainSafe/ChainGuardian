import React, {useRef, useState} from "react";
import path from "path";
import {DockerPort} from "../../services/docker/type";
import {getNetworkConfig, networksList} from "../../services/eth2/networks";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";
import {Dropdown} from "../Dropdown/Dropdown";
import {remote} from "electron";
import {getConfig} from "../../../config/config";

export interface IConfigureBNPSubmitOptions {
    ports: DockerPort[];
    network: string;
    folderPath: string;
    eth1Url: string;
    discoveryPort: string;
    libp2pPort: string;
    rpcPort: string;
}

interface IConfigureBNProps {
    onSubmit: (values: IConfigureBNPSubmitOptions) => void;
}

export const ConfigureBeaconNode: React.FunctionComponent<IConfigureBNProps> = (props: IConfigureBNProps) => {
    // TODO: refactor to use list from src/renderer/services/eth2/networks/index.ts
    const [networkIndex, setNetworkIndex] = useState(0);
    const ports = getNetworkConfig(networksList[networkIndex]).dockerConfig.ports;

    const defaultPath = path.join(getConfig(remote.app).storage.dataDir);
    const [folderPath, setPath] = useState(defaultPath);

    const defaultEth1URL = "http://127.0.0.1:8545";
    const [eth1Url, setEth1URL] = useState(defaultEth1URL);

    const defaultRpcPort = "5052";
    const [rpcPort, setRpcPort] = useState(defaultRpcPort);

    const defaultLibp2pPort = "9000";
    const [libp2pPort, setLibp2pPort] = useState(defaultLibp2pPort);

    const defaultDiscoveryPort = "9000";
    const [discoveryPort, setDiscoveryPort] = useState(defaultLibp2pPort);

    const onSubmit = (): void => {
        props.onSubmit({
            ports,
            folderPath,
            eth1Url,
            discoveryPort,
            libp2pPort,
            rpcPort,
            network: networksList[networkIndex],
        });
    };

    const focused = useRef(false);
    const onFocus = async (): Promise<void> => {
        if (!focused.current) {
            focused.current = true;
            const result = await remote.dialog.showOpenDialog({defaultPath: folderPath, properties: ["openDirectory"]});
            if (result.canceled) return;
            setPath(result.filePaths[0]);
        }
        focused.current = false;
    };

    return (
        <>
            <h1>Configure Beacon node settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Network</h3>
                </div>
                <Dropdown current={networkIndex} onChange={setNetworkIndex} options={networksList} />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Chain data location</h3>
                </div>
                <InputForm
                    onChange={(e): void => setPath(e.currentTarget.value)}
                    inputValue={folderPath}
                    onFocus={onFocus}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>ETH1 endpoint</h3>
                    <p>(default: http://127.0.0.1:8545/)</p>
                </div>
                <InputForm
                    onChange={(e): void => setEth1URL(e.currentTarget.value)}
                    inputValue={eth1Url}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Local RPC port</h3>
                    <p>(default: {defaultRpcPort})</p>
                </div>
                <InputForm
                    onChange={(e): void => setRpcPort(e.currentTarget.value)}
                    inputValue={rpcPort}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Local libp2p port</h3>
                    <p>(default: {defaultLibp2pPort})</p>
                </div>
                <InputForm
                    onChange={(e): void => setLibp2pPort(e.currentTarget.value)}
                    inputValue={libp2pPort}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Local discovery port</h3>
                    <p>(default: {defaultDiscoveryPort})</p>
                </div>
                <InputForm
                    onChange={(e): void => setDiscoveryPort(e.currentTarget.value)}
                    inputValue={discoveryPort}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                />
            </div>

            <ButtonPrimary onClick={onSubmit} buttonId='next'>
                NEXT
            </ButtonPrimary>
        </>
    );
};
