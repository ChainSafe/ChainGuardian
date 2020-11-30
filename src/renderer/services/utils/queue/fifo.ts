import {EventEmitter} from "events";

export class FifoQueue<T> extends EventEmitter {
    private array: T[] = [];

    private readonly max: number;

    public constructor(maxElements: number) {
        super();
        this.max = maxElements;
    }

    public push(...items: T[]): void {
        this.array.push(...items);
        if (this.array.length > this.max) {
            this.array.splice(0, this.array.length - this.max);
        }
        this.emit("data", items);
    }

    public getAll(): T[] {
        return this.array.slice();
    }
}
