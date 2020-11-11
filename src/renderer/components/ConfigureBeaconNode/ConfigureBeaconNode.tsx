import React, {useState} from "react";
import {DockerPort} from "../../services/docker/type";
import {getNetworkConfig} from "../../services/eth2/networks";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";

interface IConfigureBNProps {
    network: string;
    onSubmit: (ports: DockerPort[], libp2pPort: string, rpcPort: string) => void;
}

export const ConfigureBeaconNode: React.FunctionComponent<IConfigureBNProps> = (props: IConfigureBNProps) => {
    const ports = getNetworkConfig(props.network).dockerConfig.ports;
    const defaultRpcPort = ports[1].local;
    const [rpcPort, setRpcPort] = useState(defaultRpcPort);
    const defaultLibp2pPort = ports[0].local;
    const [libp2pPort, setLibp2pPort] = useState(defaultLibp2pPort);

    const onSubmit = (): void => {
        props.onSubmit(ports, libp2pPort, rpcPort);
    };

    return (
        <>
            <h1>Configure Beacon node settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

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

            <ButtonPrimary onClick={onSubmit} buttonId='next'>
                NEXT
            </ButtonPrimary>
        </>
    );
};
