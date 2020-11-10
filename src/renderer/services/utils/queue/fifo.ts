import {EventEmitter} from "events";

export class FifoQueue<T> extends EventEmitter {
    private array: T[] = [];

    private readonly max: number;

    public constructor(maxElements: number) {
        super();
        this.max = maxElements;
    }

    public push(item: T): void {
        this.array.push(item);
        if (this.array.length > this.max) {
            this.array.shift();
        }
        this.emit("data", item);
    }

    public getAll(): T[] {
        return this.array.slice();
    }
}
