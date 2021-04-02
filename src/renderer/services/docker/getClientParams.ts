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
}: Exclude<IConfigureBNSubmitOptions, "memory">): Partial<Exclude<IDockerRunParams, "name">> => {
    const eth1QueryLimit = 200;
    switch (client) {
        case "prysm": {
            const networkEnvironment = network !== "mainet" ? " --" + network : "";
            const cmd = [
                `--accept-terms-of-use`,
                `--datadir=/data${networkEnvironment}`,
                `--p2p-tcp-port=${libp2pPort}`,
                `--p2p-udp-port=${discoveryPort}`,
                `--grpc-gateway-host=0.0.0.0`,
                `--grpc-gateway-port=${rpcPort}`,
                `--http-web3provider=${eth1Url}`,
                // --fallback-web3provider=<PROVIDER 1> --fallback-web3provider=<PROVIDER 2>
            ].join(" ");
            return {
                cmd,
                volume: `${chainDataDir}:/data`,
            };
        }
        case "teku": {
            const cors =
                process.env.NODE_ENV !== "production" ? " --rest-api-cors-origins=http://localhost:2003 " : " ";
            const cmd = [
                `--network=${network}`,
                `--p2p-port=${libp2pPort}`,
                `--p2p-advertised-port=${discoveryPort}`,
                `--rest-api-enabled=true`,
                `--rest-api-interface=0.0.0.0`,
                `--rest-api-port=${rpcPort}${cors}--eth1-endpoint=${eth1Url}`,
                `--eth1-deposit-contract-max-request-size=${eth1QueryLimit}`,
                `--log-destination=CONSOLE`,
            ].join(" ");
            return {
                cmd,
                volume: `${chainDataDir}:/opt/teku/.local/share/teku/beacon`,
            };
        }
        case "lighthouse": {
            const cors = process.env.NODE_ENV !== "production" ? " --http-allow-origin http://localhost:2003 " : " ";
            const cmd = [
                `lighthouse beacon_node`,
                `--network ${network}`,
                `--port ${libp2pPort}`,
                `--discovery-port ${discoveryPort}`,
                `--http --http-address 0.0.0.0`,
                `--http-port ${rpcPort}${cors}--eth1-endpoints ${eth1Url}`,
                `--eth1-blocks-per-log-query ${eth1QueryLimit}`,
            ].join(" ");
            return {
                cmd,
                volume: `${chainDataDir}:/root/.lighthouse`,
            };
        }
        default:
            throw new Error(`Client ${client} not supported`);
    }
};
