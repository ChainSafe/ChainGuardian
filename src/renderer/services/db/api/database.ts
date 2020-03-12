import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {IpcDatabaseController} from "../controller/ipc";
import {BeaconNodeRepository} from "./repositories/beaconNode";
import {ValidatorAttestationsRepository} from "./repositories/validatorAttestations";

export class CGDatabase extends DatabaseService {

    public account: AccountRepository;
    public beaconNodes: BeaconNodeRepository;
    public validatorAttestations: ValidatorAttestationsRepository;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.db);
        this.beaconNodes = new BeaconNodeRepository(this.db);
        this.validatorAttestations = new ValidatorAttestationsRepository(this.db);
    }

}

export default new CGDatabase({controller: new IpcDatabaseController()});
