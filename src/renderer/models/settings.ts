export interface ISettings {
    dockerPath: string;
}

export class Settings implements ISettings {
    public dockerPath: string;

    public constructor(path: string) {
        this.dockerPath = path;
    }
}
