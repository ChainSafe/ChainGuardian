import {EventEmitter} from "events";
import axios from "axios";
import {IncomingMessage} from "http";

type Options<T, R> = {
    maxElements?: number;
    transformer?: (data: R) => T;
};

export class PrysmStreamReader<T, R = T> extends EventEmitter {
    private array: T[] = [];

    private readonly max: number;

    public constructor(
        url: URL,
        {maxElements = 25, transformer = (d: R): T => (d as unknown) as T}: Options<T, R> = {},
    ) {
        super();
        this.max = maxElements;

        try {
            axios
                .get(url.href, {
                    responseType: "stream",
                })
                .then((r) => {
                    const event = r.data as IncomingMessage;
                    event.on("data", (buffer) => {
                        const data: R = JSON.parse(buffer.toString());
                        this.push(transformer(data));
                    });
                });
        } catch (e) {
            this.emit("error", e);
        }
    }

    public push(item: T): void {
        this.array.push(item);
        if (this.array.length > this.max) {
            this.array.splice(0, this.array.length - this.max);
        }
        this.emit("data", item);
    }

    public getAll(): T[] {
        return this.array.slice();
    }
}
