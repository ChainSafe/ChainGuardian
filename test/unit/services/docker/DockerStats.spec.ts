import {Readable} from "stream";
import {DockerStats, Stats} from "../../../../src/renderer/services/docker/stats";

const createLog = (lines: string[][]): string =>
    "CONTAINER ID  NAME   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O    BLOCK I/O     PIDS\n" +
    lines.map((r) => r.join("   ")).join("\n");

const logCreatorFactory = (container: string, name: string, mem: string, net: string, block: string, pid: string) => (
    cpu: string,
    memPrec: string,
): string[] => [container, name, cpu, mem, memPrec, net, block, pid];

// "p" represents process
const p1 = logCreatorFactory(
    "345deda143b9",
    "localhost-beacon-node",
    "3.64GiB / 15.3GiB",
    "2.5GB / 2.3GB",
    "29.7GB / 63.2GB",
    "48",
);
const p2 = logCreatorFactory(
    "b9d3c10c86d7",
    "pyrmont-beacon-node",
    "2.43GiB / 15.3GiB",
    "4.5GB / 5.3GB",
    "10.2GB / 18.6GB",
    "16",
);

describe("docker stats", function () {
    let stdout: Readable;
    let stats: DockerStats;

    const createAndCollectStream = <T>(iterator: AsyncIterator<T>): Promise<T[]> => {
        const collected = collect(iterator, 3);
        stdout.push(createLog([p1("23.18%", "33.13%"), p2("13.68%", "25.53%")]));
        stdout.push("some message what should not be here");
        stdout.push(createLog([p1("142.18%", "31.73%"), p2("2.18%", "10.63%")]));
        return collected;
    };

    beforeEach(() => {
        stdout = new Readable({
            read(): void {
                this.push(null);
            },
        });
        stats = new DockerStats(stdout);
        // initialize data
        stdout.emit("data", createLog([p1("1.18%", "23.83%"), p2("43.98%", "15.83%")]));
    });

    it("should normally read read all streams", async function () {
        const result = await createAndCollectStream(stats.getAllStatsIterator());
        // initial
        const init = result[0];
        expect(init[0].cpu).toBe(1.18);
        expect(init[0].memory.percentage).toBe(23.83);
        expect(init[1].cpu).toBe(43.98);
        expect(init[1].memory.percentage).toBe(15.83);
        // first emit
        const first = result[1];
        expect(first[0].cpu).toBe(23.18);
        expect(first[0].memory.percentage).toBe(33.13);
        expect(first[1].cpu).toBe(13.68);
        expect(first[1].memory.percentage).toBe(25.53);
        // second emit
        const second = result[2];
        expect(second[0].cpu).toBe(142.18);
        expect(second[0].memory.percentage).toBe(31.73);
        expect(second[1].cpu).toBe(2.18);
        expect(second[1].memory.percentage).toBe(10.63);
    });

    describe("should normally read read specific streams", function () {
        const specificStreamTester = async (iterator: AsyncIterator<Stats>): Promise<void> => {
            const result = await createAndCollectStream(iterator);
            // initial
            const init = result[0];
            expect(init.cpu).toBe(1.18);
            expect(init.memory.percentage).toBe(23.83);
            // first emit
            const first = result[1];
            expect(first.cpu).toBe(23.18);
            expect(first.memory.percentage).toBe(33.13);
            // second emit
            const second = result[2];
            expect(second.cpu).toBe(142.18);
            expect(second.memory.percentage).toBe(31.73);
        };

        it("with container as id ", async function () {
            await specificStreamTester(stats.getStatsIterator("345deda143b9"));
        });

        it("with name as id ", async function () {
            await specificStreamTester(stats.getStatsIterator("localhost-beacon-node"));
        });

        it("with pid as id ", async function () {
            await specificStreamTester(stats.getStatsIterator(48));
        });
    });
});

async function collect<T>(it: AsyncIterator<T>, times = 0): Promise<T[]> {
    const result = [];
    let count = 0;
    while (times > 0 && count < times) {
        const chunk = await it.next();
        if (chunk.done) break;
        result.push(chunk.value);
        count++;
    }
    return result;
}
