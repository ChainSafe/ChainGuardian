export type NetworkLog = {
    url: string;
    code: number;
    latency: number;
    time: number;
};

export interface INetworkLogs {
    records: NetworkLog[];
}

export class NetworkLogs implements INetworkLogs {
    public records: NetworkLog[] = [];

    public constructor(networkLogs: INetworkLogs | null) {
        if (networkLogs !== null) this.records = networkLogs.records;
    }

    public getRecordsFromRange(from: Date | number, to: Date | number = Date.now()): NetworkLog[] {
        // eslint-disable-next-line no-param-reassign
        if (typeof from !== "number") from = from.getTime();
        // eslint-disable-next-line no-param-reassign
        if (typeof to !== "number") to = to.getTime();
        return this.records.filter(({time}) => time > from && time < to);
    }

    public addRecord(record: NetworkLog): void {
        this.records.push(record);
        this.prune();
    }

    // remove logs older that 1 day
    private prune(): void {
        const dayBefore = Date.now() - 25 * 60 * 60 * 1000;
        this.records = this.records.filter(({time}) => time > dayBefore);
    }
}
