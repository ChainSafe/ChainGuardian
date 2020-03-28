import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconClientOptions} from "../interface";
import {Attestation, BeaconBlock, BLSPubkey, SignedBeaconBlock, Slot, ValidatorDuty} from "@chainsafe/eth2.0-types";

export class LighthouseValidatorApiClient implements IValidatorApi {

    private client: HttpClient;
    private config: IBeaconConfig;

    public constructor(options: IBeaconClientOptions) {
        this.client = new HttpClient(options.urlPrefix);
        this.config = options.config;
    }
    
    public getAttesterDuties(epoch: number, validatorPubKey: BLSPubkey[]): Promise<ValidatorDuty[]> {
        throw "not implemented";
    }

    public getProposerDuties(epoch: number): Promise<Map<Slot, BLSPubkey>> {
        throw "not implemented";
    }

    public getWireAttestations(epoch: number, committeeIndex: number): Promise<Attestation[]> {
        throw "not implemented";
    }

    public isAggregator(slot: number, committeeIndex: number, slotSignature: Buffer): Promise<boolean> {
        throw "not implemented";
    }

    public produceAttestation(validatorPubKey: Buffer, pocBit: boolean, index: number, slot: number): Promise<Attestation> {
        throw "not implemented";
    }

    public produceBlock(slot: number, randaoReveal: Buffer): Promise<BeaconBlock> {
        throw "not implemented";
    }

    public publishAggregatedAttestation(
        aggregated: Attestation, validatorPubKey: Buffer, slotSignature: Buffer
    ): Promise<void> {
        throw "not implemented";
    }

    public publishAttestation(attestation: Attestation): Promise<void> {
        throw "not implemented";
    }

    public publishBlock(signedBlock: SignedBeaconBlock): Promise<void> {
        throw "not implemented";
    }

}