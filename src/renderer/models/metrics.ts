export interface IMetrics {
    date: string;
    method: string;
    metric: number;
}

export class Metrics implements IMetrics {

    public date: string;
    public method: string;
    public metric: number;

    public constructor(metrics: IMetrics){
        this.date = metrics.date;
        this.method = metrics.method;
        this.metric = metrics.metric;
    }
}