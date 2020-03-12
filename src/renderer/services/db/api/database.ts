import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {IpcDatabaseController} from "../controller/ipc";
import {BeaconNodeRepository} from "./repositories/beaconNode";
import {ValidatorAttestationsRepository} from "./repositories/validator/attestations";

interface IValidatorDB {
    attestations: ValidatorAttestationsRepository;
}

export class CGDatabase extends DatabaseService {
    public account: AccountRepository;
    public beaconNodes: BeaconNodeRepository;
    public validator: IValidatorDB;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.db);
        this.beaconNodes = new BeaconNodeRepository(this.db);
        this.validator = {
            attestations: new ValidatorAttestationsRepository(this.db)
        };
    }

}

export default new CGDatabase({controller: new IpcDatabaseController()});
