import {IpcDatabaseController} from "../controller/ipc";
import {DatabaseService, IDatabaseApiOptions} from "./abstract";
import {AccountRepository} from "./repositories/account";
import {BeaconNodeRepository} from "./repositories/beaconNode";
import {BeaconsRepository} from "./repositories/beacons";
import {SettingsRepository} from "./repositories/settings";
import {ValidatorNetworkRepository} from "./repositories/validator/network";
import {ValidatorBeaconNodesRepository} from "./repositories/validatorBeaconNodes";
import {NetworkMetricsRepository} from "./repositories/networkMetrics";
import {ValidatorBalanceRepository} from "./repositories/validator/balance";

interface IValidatorDB {
    network: ValidatorNetworkRepository;
    balance: ValidatorBalanceRepository;
}
export class CGDatabase extends DatabaseService {
    public account: AccountRepository;
    public beaconNodes: BeaconNodeRepository;
    public validator: IValidatorDB;
    public settings: SettingsRepository;
    public beacons: BeaconsRepository;
    public validatorBeaconNodes: ValidatorBeaconNodesRepository;
    public networkMetrics: NetworkMetricsRepository;

    public constructor(opts: IDatabaseApiOptions) {
        super(opts);
        this.account = new AccountRepository(this.db);
        this.beaconNodes = new BeaconNodeRepository(this.db);
        this.validator = {
            network: new ValidatorNetworkRepository(this.db),
            balance: new ValidatorBalanceRepository(this.db),
        };
        this.settings = new SettingsRepository(this.db);
        this.beacons = new BeaconsRepository(this.db);
        this.validatorBeaconNodes = new ValidatorBeaconNodesRepository(this.db);
        this.networkMetrics = new NetworkMetricsRepository(this.db);
    }
}

export const cgDbController = new IpcDatabaseController();

export const cgDatabase = new CGDatabase({controller: cgDbController});

export default cgDatabase;
