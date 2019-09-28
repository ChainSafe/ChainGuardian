const EMPTY_URL: string = 'URL must not be empty';

export class EmptyUrlError extends Error {
    constructor() {
        super(EMPTY_URL); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
