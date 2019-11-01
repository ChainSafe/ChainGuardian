export interface IMetrics {
    date: string;
    metric: number;
}

export class Metrics implements IMetrics {

    public date: string;
    public metric: number;

    public constructor(metrics: IMetrics){
        this.date = metrics.date;
        this.metric = metrics.metric;
    }
}