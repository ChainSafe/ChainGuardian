import {DockerPort, IDockerRunParams} from "./type";
import {IConfigureBNSubmitOptions} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";

export const getClientParams = (
    ports: DockerPort[],
    {network, libp2pPort, discoveryPort, rpcPort, eth1Url, chainDataDir, client, memory}: IConfigureBNSubmitOptions,
): Partial<Exclude<IDockerRunParams, "name">> => {
    const eth1QueryLimit = 200;
    switch (client) {
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
                ports,
                cmd,
                memory,
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
                ports,
                cmd,
                memory,
                volume: `${chainDataDir}:/root/.lighthouse`,
            };
        }
        default:
            throw new Error(`Client ${client} not supported`);
    }
};
