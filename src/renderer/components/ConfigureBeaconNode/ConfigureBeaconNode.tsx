import React, {FormEvent, useRef, useState} from "react";
import path from "path";
import {networksList} from "../../services/eth2/networks";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";
import {Dropdown} from "../Dropdown/Dropdown";
import {remote} from "electron";
import {getConfig} from "../../../config/config";
import {getDefaultsForClient} from "../../services/eth2/client/defaults";
import {Accordion} from "../Accordion/Accordion";

export interface IConfigureBNSubmitOptions {
    network: string;
    client: string;
    chainDataDir: string;
    eth1Url: string;
    discoveryPort: string;
    libp2pPort: string;
    rpcPort: string;
    memory: string;
}

interface IConfigureBNProps {
    onSubmit: (values: IConfigureBNSubmitOptions) => void;
    clientName?: string;
}

const clients = ["teku", "lighthouse"];

export const ConfigureBeaconNode: React.FunctionComponent<IConfigureBNProps> = (props: IConfigureBNProps) => {
    // TODO: refactor to use list from src/renderer/services/eth2/networks/index.ts
    const [networkIndex, setNetworkIndex] = useState(0);
    const [clientIndex, setClientIndex] = useState(0);
    const defaults = getDefaultsForClient(props.clientName);

    const defaultChainDataDir = path.join(getConfig(remote.app).storage.dataDir, "beacon");
    const [chainDataDir, setChainDataDir] = useState(defaultChainDataDir);

    const defaultEth1URL = "https://goerli.infura.io/v3/73d4045fe98a406faa2334ad7306b313";
    const [eth1Url, setEth1URL] = useState(defaultEth1URL);

    const defaultRpcPort = String(defaults.beacon.rpcPort);
    const [rpcPort, setRpcPort] = useState(defaultRpcPort);

    const defaultLibp2pPort = String(defaults.beacon.libp2pPort);
    const [libp2pPort, setLibp2pPort] = useState(defaultLibp2pPort);

    const defaultDiscoveryPort = String(defaults.beacon.discoveryPort);
    const [discoveryPort, setDiscoveryPort] = useState(defaultDiscoveryPort);

    const defaultMemory = defaults.beacon.memory;
    const [memory, setMemory] = useState(defaultMemory);

    const onSubmit = (): void => {
        props.onSubmit({
            chainDataDir,
            eth1Url,
            discoveryPort,
            libp2pPort,
            rpcPort,
            network: networksList[networkIndex],
            client: clients[clientIndex],
        } as IConfigureBNSubmitOptions);
    };

    const onInputSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        onSubmit();
    };

    const focused = useRef(false);
    const onFocus = async (): Promise<void> => {
        if (!focused.current) {
            focused.current = true;
            const result = await remote.dialog.showOpenDialog({
                defaultPath: chainDataDir,
                properties: ["openDirectory"],
            });
            if (result.canceled) return;
            setChainDataDir(result.filePaths[0]);
        }
        focused.current = false;
    };

    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <>
            <h1>Configure Beacon node settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Client</h3>
                </div>
                <Dropdown current={clientIndex} onChange={setClientIndex} options={clients} />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Network</h3>
                </div>
                <Dropdown current={networkIndex} onChange={setNetworkIndex} options={networksList} />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>ETH1 endpoint</h3>
                    <p>(strongly suggest getting own Infura access key)</p>
                </div>
                <InputForm
                    onChange={(e): void => setEth1URL(e.currentTarget.value)}
                    inputValue={eth1Url}
                    onSubmit={onInputSubmit}
                />
            </div>

            <Accordion label='Advanced' isOpen={showAdvanced} onClick={(): void => setShowAdvanced(!showAdvanced)}>
                <div className='configure-port'>
                    <div className='row'>
                        <h3>Chain data location</h3>
                    </div>
                    <InputForm
                        onChange={(e): void => setChainDataDir(e.currentTarget.value)}
                        inputValue={chainDataDir}
                        onFocus={onFocus}
                        onSubmit={onInputSubmit}
                    />
                </div>

                <div className='configure-port'>
                    <div className='row'>
                        <h3>Local RPC port</h3>
                        <p>(default: {defaultRpcPort})</p>
                    </div>
                    <InputForm
                        inputLabel='TCP'
                        onChange={(e): void => setRpcPort(e.currentTarget.value)}
                        inputValue={rpcPort}
                        onSubmit={onInputSubmit}
                    />
                </div>

                <div className='configure-port'>
                    <div className='row'>
                        <h3>Local libp2p port</h3>
                        <p>(default: {defaultLibp2pPort})</p>
                    </div>
                    <InputForm
                        inputLabel='TCP'
                        onChange={(e): void => setLibp2pPort(e.currentTarget.value)}
                        inputValue={libp2pPort}
                        onSubmit={onInputSubmit}
                    />
                </div>

                <div className='configure-port'>
                    <div className='row'>
                        <h3>Local discovery port</h3>
                        <p>(default: {defaultDiscoveryPort})</p>
                    </div>
                    <InputForm
                        inputLabel='UDP'
                        onChange={(e): void => setDiscoveryPort(e.currentTarget.value)}
                        inputValue={discoveryPort}
                        onSubmit={onInputSubmit}
                    />
                </div>

                <div className='configure-port'>
                    <div className='row'>
                        <h3>Container max Ram Limit</h3>
                        <p>(default: {defaultMemory})</p>
                    </div>
                    <InputForm
                        onChange={(e): void => setMemory(e.currentTarget.value)}
                        inputValue={memory}
                        onSubmit={onInputSubmit}
                    />
                </div>
            </Accordion>

            <ButtonPrimary onClick={onSubmit} buttonId='next'>
                NEXT
            </ButtonPrimary>
        </>
    );
};
