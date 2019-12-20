import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {IpcDatabaseController} from "../controller/ipc";

export class CGDatabase extends DatabaseService {

    public account: AccountRepository;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.db);
    }

}

export default new CGDatabase({controller: new IpcDatabaseController()});
