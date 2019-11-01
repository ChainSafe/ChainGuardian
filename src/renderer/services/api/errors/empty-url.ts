const EMPTY_URL = "URL must not be empty";

export class EmptyUrl extends Error {
    public constructor() {
        super(EMPTY_URL); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
