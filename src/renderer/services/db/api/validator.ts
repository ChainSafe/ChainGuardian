import {IAttestationSearchOptions, IValidatorDB} from "@chainsafe/lodestar-validator/lib/db/interface";
import {Attestation, BLSPubkey, SignedBeaconBlock} from "@chainsafe/lodestar-types";
import {CGDatabase} from "./database";
import {IpcDatabaseController} from "../controller/ipc";


export class ValidatorDB implements IValidatorDB {
    private db: CGDatabase;

    public constructor(database?: CGDatabase) {
        this.db = database || new CGDatabase({controller: new IpcDatabaseController()});
    }
    /**
     * Stores attestation proposed by validator with given index
     */
    public async setAttestation(pubKey: BLSPubkey, attestation: Attestation): Promise<void> {
        await this.db.validator.attestations.set(pubKey, attestation);
    }

    public async deleteAttestations(pubKey: BLSPubkey, attestations: Attestation[]): Promise<void> {
        await this.db.validator.attestations.deleteMany(pubKey, attestations);
    }

    /**
     * Searches proposed attestations based on target epoch and validator index
     * @param pubKey validator signing pubkey
     * @param options object contains lower and higher target epoch to search
     */
    public async getAttestations(pubKey: BLSPubkey, options?: IAttestationSearchOptions): Promise<Attestation[]> {
        return await this.db.validator.attestations.getAll(pubKey, options);
    }

    /**
     * Stores beacon block proposed by validator with given index
     */
    public async setBlock(pubKey: BLSPubkey, block: SignedBeaconBlock): Promise<void> {
        await this.db.validator.blocks.set(pubKey, block);
    }

    /**
     * Obtains last proposed beacon block by validator with given index
     */
    public async getBlock(pubKey: BLSPubkey): Promise<SignedBeaconBlock | null> {
        return await this.db.validator.blocks.get(pubKey);
    }
}
