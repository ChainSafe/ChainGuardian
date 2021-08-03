import {EventEmitter} from "events";
import EventSource from "eventsource";

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
            const eventSource = new EventSource(url.href);
            eventSource.addEventListener("message", (event: Event) => {
                const data: R & {"@type": string} = JSON.parse((event as MessageEvent).data);
                delete data["@type"];
                this.push(transformer(data));
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
