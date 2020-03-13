import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {IpcDatabaseController} from "../controller/ipc";
import {BeaconNodeRepository} from "./repositories/beaconNode";
import {ValidatorAttestationsRepository} from "./repositories/validator/attestations";
import {ValidatorBlocksRepository} from "./repositories/validator/blocks";

interface IValidatorDB {
    attestations: ValidatorAttestationsRepository;
    blocks: ValidatorBlocksRepository;
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
            attestations: new ValidatorAttestationsRepository(this.db),
            blocks: new ValidatorBlocksRepository(this.db)
        };
    }

}

export default new CGDatabase({controller: new IpcDatabaseController()});
