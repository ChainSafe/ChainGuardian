import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {HttpMetricsRepository} from "./repositories/httpMetrics";

export class CGDatabase extends DatabaseService {

    public account: AccountRepository;
    public httpMetrics: HttpMetricsRepository;
    
    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.config, this.db);
        this.httpMetrics = new HttpMetricsRepository(this.config, this.db);
    }

}