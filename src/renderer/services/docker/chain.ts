import { Container } from './container';

type LogType = 'info' | 'error'
type LogCallbackFunc = (type: LogType, message: string) => void;

export class BeaconChain extends Container {
    public static async startPrysmBeaconChain(): Promise<BeaconChain> {
        const bc = new BeaconChain({
            image: "gcr.io/prysmaticlabs/prysm/beacon-chain:latest",
            name: "Prysm-beacon-node",
            restart: "unless-stopped",
            ports: ["4000:4000", "13000:13000"],
            // volume?
        });
        await bc.run();
        return bc;
    }

    public listenToLogs(callback: LogCallbackFunc): void {
        const logs = this.getLogs();
        if (!logs) {
            throw new Error('Logs not found');
        }

        logs.stderr.on('data', function(message: string) {
            const isInfo = message.substr(0, 40).includes('level=info');
            const type = isInfo ? "info" : "error";
            callback(type, message);
        });
    }
}
