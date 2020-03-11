import {BulkRepository} from "../repository";
import {IDatabaseController} from "../../../../../main/db/controller";
import {Bucket} from "../../schema";
import {JSONSerializer} from "../../serializers/json";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";
import {Attestation} from "@chainsafe/eth2.0-types";

export class AttestationsRepository extends BulkRepository<Attestation> {
    public constructor(db: IDatabaseController) {
        super(db, JSONSerializer, Bucket.attestations, mainnetTypes.Attestation);
    }
}