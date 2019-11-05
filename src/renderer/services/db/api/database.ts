import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository, MetricsRepository} from "./repositories";

let database: CGDatabase;
export class CGDatabase extends DatabaseService {

    public account: AccountRepository;
    public metrics: MetricsRepository;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.config, this.db);
        this.metrics = new MetricsRepository(this.config, this.db);
    }

}

export function initDB(opts: IDatabaseApiOptions): void{
    database = new CGDatabase(opts);
}

export function getDB(): CGDatabase{
    return database;
}