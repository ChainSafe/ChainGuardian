import {IAttestationSearchOptions} from "@chainsafe/lodestar-validator/lib/db/interface";
import {BulkRepository} from "../../repository";
import {IDatabaseController, ISearchOptions} from "../../../../../../main/db/controller";
import {Bucket, encodeKey} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";
import {Attestation, BLSPubkey} from "@chainsafe/eth2.0-types";

export class ValidatorAttestationsRepository extends BulkRepository<Attestation> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorAttestations, mainnetTypes.Attestation);
    }

    public async set(pubKey: BLSPubkey, attestation: Attestation): Promise<void> {
        const key = this.getAttestationKey(pubKey, attestation);
        await super.set(key, attestation);
    }

    public async deleteMany(pubKey: BLSPubkey, attestations: Attestation[]): Promise<void> {
        const promises = [];
        for (let i = 0; i < attestations.length; i++) {
            const key = this.getAttestationKey(pubKey, attestations[i]);
            promises.push(super.delete(key));
        }
        await Promise.all(promises);
    }

    public async getAll(pubKey: BLSPubkey, options?: IAttestationSearchOptions): Promise<Attestation[]> {
        if (!options) {
            return await super.getAll(pubKey);
        }

        const searchFilters: ISearchOptions = {};
        if (options.lt) {
            const search = Buffer.concat([pubKey, this.getEpochBuffer(options.lt)]);
            searchFilters.lt = encodeKey(this.bucket, search);
        }
        if (options.gt) {
            const search = Buffer.concat([pubKey, this.getEpochBuffer(options.gt), this.getFilledFilter(96)]);
            searchFilters.gt = encodeKey(this.bucket, search);
        }

        return await super.getAll(pubKey, searchFilters);
    }

    private getAttestationKey(pubKey: BLSPubkey, attestation: Attestation): Buffer {
        const epoch = this.getEpochBuffer(attestation.data.target.epoch);
        return Buffer.concat([pubKey, epoch, attestation.signature]);
    }

    private getEpochBuffer(epoch: number): Buffer {
        const epochBuffer = Buffer.alloc(2);
        epochBuffer.writeUInt16LE(epoch, 0);
        return epochBuffer;
    }
}