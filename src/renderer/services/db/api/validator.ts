import { IAttestationSearchOptions, IValidatorDB } from '@chainsafe/lodestar-validator/lib/db/interface';
import { Attestation, BLSPubkey, SignedBeaconBlock } from '@chainsafe/eth2.0-types';
import database from "./database";


export class ValidatorDB implements IValidatorDB {
    /**
     * Stores attestation proposed by validator with given index
     */
    async setAttestation(pubKey: BLSPubkey, attestation: Attestation): Promise<void> {
        await database.attestations.set(pubKey, attestation);
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
        return await database.attestations.getAll(pubKey);
    }

    /**
     * Obtains last proposed beacon block
     * by validator with given index
     */
    async getBlock(pubKey: BLSPubkey): Promise<SignedBeaconBlock | null> {
        return null;
    }

    /**
     * Stores beacon block proposed by validator with given index
     */
    async setBlock(pubKey: BLSPubkey, block: SignedBeaconBlock): Promise<void> {
    }

}
