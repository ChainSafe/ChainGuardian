import { BulkRepository, Id } from '../../repository';
import {IDatabaseController} from "../../../../../../main/db/controller";
import { Bucket, encodeKey } from '../../../schema';
import {JSONSerializer} from "../../../serializers/json";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";
import { Attestation, BLSPubkey } from '@chainsafe/eth2.0-types';

export class ValidatorAttestationsRepository extends BulkRepository<Attestation> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.validatorAttestations, mainnetTypes.Attestation);
    }

    public async set(pubKey: BLSPubkey, attestation: Attestation): Promise<void> {
        const key = Buffer.concat([pubKey, attestation.signature]);
        await super.set(key, attestation);
    }
}