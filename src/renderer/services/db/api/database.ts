import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {IpcDatabaseController} from "../controller/ipc";
import {BeaconNodeRepository} from "./repositories/beaconNode";
import {SettingsRepository} from "./repositories/settings";
import {ValidatorAttestationsRepository} from "./repositories/validator/attestations";
import {ValidatorBlocksRepository} from "./repositories/validator/blocks";
import {ValidatorNetworkRepository} from "./repositories/validator/network";

interface IValidatorDB {
    attestations: ValidatorAttestationsRepository;
    blocks: ValidatorBlocksRepository;
    network: ValidatorNetworkRepository;
}

export class CGDatabase extends DatabaseService {
    public account: AccountRepository;
    public beaconNodes: BeaconNodeRepository;
    public validator: IValidatorDB;
    public settings: SettingsRepository;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.db);
        this.beaconNodes = new BeaconNodeRepository(this.db);
        this.validator = {
            attestations: new ValidatorAttestationsRepository(this.db),
            blocks: new ValidatorBlocksRepository(this.db),
            network: new ValidatorNetworkRepository(this.db),
        };
        this.settings = new SettingsRepository(this.db);
    }
}

export default new CGDatabase({controller: new IpcDatabaseController()});
