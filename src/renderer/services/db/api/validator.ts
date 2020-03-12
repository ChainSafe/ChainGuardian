import {IAttestationSearchOptions, IValidatorDB} from "@chainsafe/lodestar-validator/lib/db/interface";
import {Attestation, BLSPubkey, SignedBeaconBlock} from "@chainsafe/eth2.0-types";
import {CGDatabase} from "./database";
import {IpcDatabaseController} from "../controller/ipc";


export class ValidatorDB implements IValidatorDB {
    private db: CGDatabase;

    constructor(database?: CGDatabase) {
        this.db = database || new CGDatabase({controller: new IpcDatabaseController()});
    }
    /**
     * Stores attestation proposed by validator with given index
     */
    async setAttestation(pubKey: BLSPubkey, attestation: Attestation): Promise<void> {
        await this.db.validator.attestations.set(pubKey, attestation);
    }

    async deleteAttestations(pubKey: BLSPubkey, attestation: Attestation[]): Promise<void> {
    }

    /**
     * Searches proposed attestations based on target epoch and validator index
     * @param pubKey validator signing pubkey
     * @param options object contains lower and higher target epoch to search
     */
    async getAttestations(pubKey: BLSPubkey, options?: IAttestationSearchOptions): Promise<Attestation[]> {
        // TODO: consider options
        return await this.db.validator.attestations.getAll(pubKey);
    }

    /**
     * Stores beacon block proposed by validator with given index
     */
    async setBlock(pubKey: BLSPubkey, block: SignedBeaconBlock): Promise<void> {
        await this.db.validator.blocks.set(pubKey, block);
    }

    /**
     * Obtains last proposed beacon block by validator with given index
     */
    async getBlock(pubKey: BLSPubkey): Promise<SignedBeaconBlock | null> {
        return await this.db.validator.blocks.get(pubKey);
    }
}
