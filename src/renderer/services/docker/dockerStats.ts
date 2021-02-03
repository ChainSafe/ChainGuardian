import {EventEmitter} from "events";
import {runCmd} from "../utils/cmd";
import {Command} from "./command";
import {EventIterator} from "event-iterator";

export type Stats = {
    container: string;
    name: string;
    cpu: number;
    memory: {
        usage: number;
        usageRaw: string;
        limit: number;
        limitRaw: string;
        percentage: number;
    };
    network: {
        input: number;
        inputRaw: string;
        output: number;
        outputRaw: string;
    };
    block: {
        input: number;
        inputRaw: string;
        output: number;
        outputRaw: string;
    };
    pid: number;
};

export class DockerStats {
    private readonly stats = new (class extends EventEmitter {
        private stats: Stats[] = [];

        public push(items: Stats[]): void {
            this.stats = items;
            this.emit("stats", items);
        }

        public getAll(): Stats[] {
            return this.stats;
        }
    })();

    public constructor() {
        this.watchDockerStats();
    }

    public getAllStatsIterator(): AsyncGenerator<Stats[]> {
        const stats = this.stats.getAll();
        const statsSource = this.stats;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return (async function* () {
            yield stats;
            yield* new EventIterator<Stats[]>(({push}) => {
                const statsHandler = (newStats: Stats[]): void => {
                    push(newStats);
                };
                statsSource.on("stats", statsHandler);
                return (): void => {
                    statsSource.removeListener("stats", statsHandler);
                };
            });
        })();
    }

    private async watchDockerStats(): Promise<void> {
        const {stdout} = runCmd(await Command.stats());
        stdout.on("data", (data: string) => {
            if (data.length > 10) {
                this.stats.push(this.transformDataToStats(data));
            }
        });
    }

    private transformDataToStats(data: string): Stats[] {
        return data
            .replace(/^(.*?)PIDS/, "")
            .split("\n")
            .map((c) => regex.exec(c))
            .filter((r) => !!r)
            .map(
                (r): Stats => ({
                    container: r[1],
                    name: r[2],
                    cpu: Number(r[3]),
                    memory: {
                        usage: Number(r[4]),
                        usageRaw: r[4] + r[5],
                        limit: Number(r[6]),
                        limitRaw: r[6] + r[7],
                        percentage: Number(r[8]),
                    },
                    network: {
                        input: Number(r[9]),
                        inputRaw: r[9] + r[10],
                        output: Number(r[11]),
                        outputRaw: r[11] + r[12],
                    },
                    block: {
                        input: Number(r[13]),
                        inputRaw: r[13] + r[14],
                        output: Number(r[15]),
                        outputRaw: r[15] + r[16],
                    },
                    pid: Number(r[17]),
                }),
            );
    }
}

// regex builder for parsing stats lines
const space = "\\s*";
const container = "(\\w{12})";
const name = "([a-z\\-]+)";
const prec = "(\\d+\\.?\\d*)\\%";
const data = "(\\d+\\.?\\d*)(\\w*)";
const resources = data + "\\s*\\/\\s*" + data;
const pid = "(\\d+)";

// CONTAINER ID | NAME | CPU % | MEM USAGE / LIMIT | MEM % | NET I/O | BLOCK I/O | PIDS
const regexString = [container, name, prec, resources, prec, resources, resources, pid].join(space);
const regex = new RegExp(regexString, "g");
