import {IDockerRunParams} from "./type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export const getClientParams = ({
    network,
    libp2pPort,
    discoveryPort,
    rpcPort,
    eth1Url,
    chainDataDir,
    client,
    wsc,
}: Omit<
    IConfigureBNSubmitOptions,
    "memory" | "image" | "weakSubjectivityCheckpoint" | "weakSubjectivityCheckpointMeta"
> & {wsc: string}): Partial<Omit<IDockerRunParams, "name">> => {
    const eth1QueryLimit = 200;
    switch (client) {
        case "nimbus": {
            const cmd = [
                `--network=${network}`,
                `--data-dir=/data`,
                `--tcp-port=${libp2pPort}`,
                `--udp-port=${discoveryPort}`,
                `--rest`,
                `--rest-address=0.0.0.0`,
                `--rest-port=${rpcPort}`,
                `--web3-url=${eth1Url}`,
            ];
            // TODO: add CORS for dev
            if (wsc) cmd.push(`--weak-subjectivity-checkpoint ${wsc}`);
            return {
                cmd: cmd.join(" "),
                volume: `${chainDataDir}:/data`,
            };
        }
        case "prysm": {
            const cmd = [
                `--accept-terms-of-use`,
                `--datadir=/data`,
                `--p2p-tcp-port=${libp2pPort}`,
                `--p2p-udp-port=${discoveryPort}`,
                `--grpc-gateway-host=0.0.0.0`,
                `--grpc-gateway-port=${rpcPort}`,
                `--http-web3provider=${eth1Url}`,
            ];
            // --fallback-web3provider=<PROVIDER 1> --fallback-web3provider=<PROVIDER 2>
            // TODO: add CORS for dev
            if (network !== "mainet") cmd.push(`--${network}`);
            if (wsc) cmd.push(`--weak-subjectivity-checkpoint=${wsc}`);
            return {
                cmd: cmd.join(" "),
                volume: `${chainDataDir}:/data`,
            };
        }
        case "teku": {
            const cmd = [
                `--network=${network}`,
                `--p2p-port=${libp2pPort}`,
                `--p2p-advertised-port=${discoveryPort}`,
                `--rest-api-enabled=true`,
                `--rest-api-interface=0.0.0.0`,
                `--rest-api-port=${rpcPort}`,
                `--eth1-endpoint=${eth1Url}`,
                `--eth1-deposit-contract-max-request-size=${eth1QueryLimit}`,
                `--log-destination=CONSOLE`,
                `--validators-external-signer-slashing-protection-enabled=false`,
                `--data-base-path=/home/teku`,
            ];
            if (process.env.NODE_ENV !== "production") cmd.push("--rest-api-cors-origins=http://localhost:2003");
            if (wsc) cmd.push(`--ws-checkpoint=${wsc}`);
            return {
                cmd: cmd.join(" "),
                volume: `${chainDataDir}:/home/teku`,
            };
        }
        case "lighthouse": {
            const cmd = [
                `lighthouse beacon_node`,
                `--network ${network}`,
                `--port ${libp2pPort}`,
                `--discovery-port ${discoveryPort}`,
                `--http --http-address 0.0.0.0`,
                `--http-port ${rpcPort}`,
                `--eth1-endpoints ${eth1Url}`,
                `--eth1-blocks-per-log-query ${eth1QueryLimit}`,
            ];
            if (process.env.NODE_ENV !== "production") cmd.push("--http-allow-origin http://localhost:2003");
            if (wsc) cmd.push(`--wss-checkpoint ${wsc}`);
            return {
                cmd: cmd.join(" "),
                volume: `${chainDataDir}:/root/.lighthouse`,
            };
        }
        default:
            throw new Error(`Client ${client} not supported`);
    }
};
