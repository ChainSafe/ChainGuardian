export interface ISettings {
    dockerPath?: string;
    reporting?: boolean;
}

export class Settings implements ISettings {
    public dockerPath?: string;
    public reporting?: boolean;

    public constructor(path: string, reporting = true) {
        this.dockerPath = path;
        this.reporting = reporting;
    }
}
