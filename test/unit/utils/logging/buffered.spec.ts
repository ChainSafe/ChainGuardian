import {BufferedLogger} from "../../../../src/renderer/services/utils/logging/buffered";
import {PassThrough} from "stream";

describe("buffered logger", function() {

    it("should be able to push logs and get logs", function() {
        const logger = new BufferedLogger({maxCache: 10});
        logger.push("test", "stdout");
        logger.push("test1\ntest2");
        expect(logger.getLogs())
            .toEqual([
                {log: "test", source: "stdout"},
                {log: "test1", source: "unknown"},
                {log: "test2", source: "unknown"},
            ]);
    });

    it("should be able to iterate logs", async function() {
        const logger = new BufferedLogger({maxCache: 5});
        logger.push("test", "stdout");
        const iterable = logger.getLogIterator();
        expect((await take(iterable, 1))[0][0].log).toEqual("test");
        const  log = take(iterable, 1);
        logger.push("test1");
        expect((await log)[0][0].log).toEqual("test1");
    });

    it("should be able to take log stream", async function() {
        const logger = new BufferedLogger({maxCache: 5});
        const stream = new PassThrough();
        logger.addStreamSource(stream);
        stream.write("log1\nlog2");
        stream.end();
        const logs = await take(logger.getLogIterator(), 1);
        expect(logs[0].length).toEqual(2);
    });

});


async function take<T>(it: AsyncIterator<T>, n = 0): Promise<T[]> {
    const result = [];
    let count = 0;
    while(n > 0 && count < n) {
        const chunk = await it.next();
        if(chunk.done) break;
        result.push(chunk.value);
        count++;
    }
    return result;
}
