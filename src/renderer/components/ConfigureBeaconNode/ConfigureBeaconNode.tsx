import React, {FormEvent, useEffect, useRef, useState} from "react";
import path from "path";
import {networksList} from "../../services/eth2/networks";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";
import {Dropdown} from "../Dropdown/Dropdown";
import {remote} from "electron";
import {getConfig} from "../../../config/config";
import {getDefaultsForClient} from "../../services/eth2/client/defaults";
import {Accordion} from "../Accordion/Accordion";
import {getAvailableClientReleases} from "../../services/utils/githubReleases";

export enum WeakSubjectivityCheckpoint {
    none = "None",
    beaconScan = "BeaconScan",
    infura = "Infura",
    beaconChain = "BeaconChain",
    custom = "Custom",
}

export interface IConfigureBNSubmitOptions {
    network: string;
    client: string;
    chainDataDir: string;
    eth1Url: string;
    discoveryPort: string;
    libp2pPort: string;
    rpcPort: string;
    memory: string;
    image: string;
    weakSubjectivityCheckpoint: WeakSubjectivityCheckpoint;
    weakSubjectivityCheckpointMeta: string;
}

interface IConfigureBNProps {
    onSubmit: (values: IConfigureBNSubmitOptions) => void;
    clientName: string;
}

const wscOptions: WeakSubjectivityCheckpoint[] = [
    WeakSubjectivityCheckpoint.none,
    WeakSubjectivityCheckpoint.beaconScan,
    WeakSubjectivityCheckpoint.beaconChain,
    WeakSubjectivityCheckpoint.infura,
    WeakSubjectivityCheckpoint.custom,
];

export const ConfigureBeaconNode: React.FunctionComponent<IConfigureBNProps> = (props: IConfigureBNProps) => {
    // TODO: refactor to use list from src/renderer/services/eth2/networks/index.ts
    const [networkIndex, setNetworkIndex] = useState(0);
    const defaults = getDefaultsForClient(props.clientName);

    const [images, setImages] = useState([]);
    useEffect(() => {
        getAvailableClientReleases(props.clientName, defaults.beacon.versionPrefix).then((imageList) => {
            setImages(imageList);
            setImageIndex(imageList.length - 1);
        });
    }, [props.clientName]);
    const [imageIndex, setImageIndex] = useState(0);

    const defaultChainDataDir = path.join(getConfig(remote.app).storage.beaconDir, props.clientName);
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

    const [wscIndex, setWscIndex] = useState(0);

    const [infuraBeaconNodeUrl, setInfuraBeaconNodeUrl] = useState("");
    const [finalizedBlockRoot, setFinalizedBlockRoot] = useState("");
    const [finalizedEpoch, setFinalizedEpoch] = useState("");

    const onSubmit = (): void => {
        props.onSubmit({
            chainDataDir,
            eth1Url,
            discoveryPort,
            libp2pPort,
            rpcPort,
            memory,
            network: networksList[networkIndex],
            client: props.clientName,
            image: images[imageIndex],
            weakSubjectivityCheckpoint: wscOptions[wscIndex],
            weakSubjectivityCheckpointMeta: ((): string => {
                switch (wscOptions[wscIndex]) {
                    case WeakSubjectivityCheckpoint.infura:
                        return infuraBeaconNodeUrl;
                    case WeakSubjectivityCheckpoint.custom:
                        return `${finalizedBlockRoot}:${finalizedEpoch}`;
                    default:
                        return "";
                }
            })(),
        });
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
                    <h3>Network</h3>
                </div>
                <Dropdown current={networkIndex} onChange={setNetworkIndex} options={networksList} />
            </div>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Weak Subjectivity Checkpoint</h3>
                    <p>(reduces sync time)</p>
                </div>
                <Dropdown current={wscIndex} onChange={setWscIndex} options={wscOptions} />
            </div>

            {/* Weak subjectivity additionally options based on selection */}
            {wscOptions[wscIndex] === WeakSubjectivityCheckpoint.infura && (
                <div className='configure-port'>
                    <div className='row'>
                        <h3>Infura Beacon Node</h3>
                        <p>(beacon node url provided by infura)</p>
                    </div>
                    <InputForm
                        onChange={(e): void => setInfuraBeaconNodeUrl(e.currentTarget.value)}
                        inputValue={infuraBeaconNodeUrl}
                        onSubmit={onInputSubmit}
                    />
                </div>
            )}
            {wscOptions[wscIndex] === WeakSubjectivityCheckpoint.custom && (
                <div className='row' style={{width: "100%"}}>
                    <div className='configure-port' style={{width: "75%"}}>
                        <div className='row'>
                            <h3>Finalized Block Root</h3>
                            <p>(needs to be Hexadecimal value)</p>
                        </div>
                        <InputForm
                            onChange={(e): void => setFinalizedBlockRoot(e.currentTarget.value)}
                            inputValue={finalizedBlockRoot}
                            onSubmit={onInputSubmit}
                        />
                    </div>
                    <div className='configure-port' style={{width: "25%"}}>
                        <div className='row'>
                            <h3>Finalized Epoch</h3>
                        </div>
                        <InputForm
                            onChange={(e): void => setFinalizedEpoch(e.currentTarget.value)}
                            inputValue={finalizedEpoch}
                            onSubmit={onInputSubmit}
                        />
                    </div>
                </div>
            )}

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
                        <h3>Image</h3>
                        <p>(recommended: {images[images.length - 1]})</p>
                    </div>
                    <Dropdown
                        current={imageIndex}
                        onChange={setImageIndex}
                        options={images}
                        verifiedIndex={images.length - 1}
                        className='beacon-config'
                    />
                </div>

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
