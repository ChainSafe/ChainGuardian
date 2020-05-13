import {IAttestationSearchOptions} from "@chainsafe/lodestar-validator/lib/db/interface";
import {BulkRepository} from "../../repository";
import {IDatabaseController, ISearchOptions} from "../../../../../../main/db/controller";
import {Bucket, encodeKey} from "../../../schema";
import {JSONSerializer} from "../../../serializers/json";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {Attestation, BLSPubkey} from "@chainsafe/lodestar-types";
import {intToBytes} from "@chainsafe/lodestar-utils";

export class ValidatorAttestationsRepository extends BulkRepository<Attestation> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorAttestations, mainnetConfig.types.Attestation);
    }

    public async set(pubKey: Uint8Array|Buffer, attestation: Attestation): Promise<void> {
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

    public async getAll(pubKey: Uint8Array|Buffer, options?: IAttestationSearchOptions): Promise<Attestation[]> {
        if (!options) {
            return await super.getAll(pubKey);
        }

        const searchFilters: ISearchOptions = {};
        if (options.lt) {
            const epoch = intToBytes(options.lt, 2);
            const search = Buffer.concat([pubKey, epoch]);
            searchFilters.lt = encodeKey(this.bucket, search);
        } else {
            searchFilters.lt = encodeKey(this.bucket, Buffer.concat([pubKey, this.fillBufferWithOnes(100)]));
        }
        if (options.gt) {
            const epoch = intToBytes(options.gt, 2);
            const search = Buffer.concat([pubKey, epoch, this.fillBufferWithOnes(32)]);
            searchFilters.gt = encodeKey(this.bucket, search);
        }

        return await super.getAll(pubKey, searchFilters);
    }

    private getAttestationKey(pubKey: BLSPubkey, attestation: Attestation): Buffer {
        const epoch = intToBytes(attestation.data.target.epoch, 2);
        return Buffer.concat([pubKey.valueOf() as Uint8Array, epoch, this.type.hashTreeRoot(attestation)]);
    }
}
