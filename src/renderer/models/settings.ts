export interface ISettings {
    dockerPath?: string;
    reporting?: boolean;
    lastTrack?: number;
}

export class Settings implements ISettings {
    public dockerPath?: string;
    public reporting?: boolean;
    public lastTrack?: number;

    public constructor(path: string, reporting = true, lastTrack = 0) {
        this.dockerPath = path;
        this.reporting = reporting;
        this.lastTrack = lastTrack;
    }
}
