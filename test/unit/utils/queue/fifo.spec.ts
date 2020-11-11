import {FifoQueue} from "../../../../src/renderer/services/utils/queue/fifo";

describe("fifo queue", function () {
    it("should work", function () {
        const queue = new FifoQueue(2);
        queue.push("1");
        const spy = jest.fn();
        queue.on("data", spy);
        queue.push("2");
        queue.push("3");
        expect(queue.getAll()).toEqual(["2", "3"]);
        expect(spy.mock.calls.length).toEqual(2);
    });
});
