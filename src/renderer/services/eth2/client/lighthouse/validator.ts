import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconClientOptions} from "../interface";
import {Attestation, BeaconBlock, BLSPubkey, SignedBeaconBlock, Slot, ValidatorDuty} from "@chainsafe/eth2.0-types";
import {ILighthouseDutiesRequest, ILighthouseDutiesResponse} from "./types";
import {toHexString} from "../../../utils/crypto";
import {fromHex} from "../../../utils/bytes";

export enum LighthouseValidatorRoutes {

    DUTIES = "/validator/duties"

}

export class LighthouseValidatorApiClient implements IValidatorApi {

    private client: HttpClient;
    private config: IBeaconConfig;
    private trackedValidators: Set<BLSPubkey> = new Set();

    public constructor(options: IBeaconClientOptions, validators: BLSPubkey[] = []) {
        this.client = new HttpClient(options.urlPrefix);
        this.config = options.config;
        validators.forEach((validator) => this.trackedValidators.add(validator));
    }
    
    public async getAttesterDuties(epoch: number, validatorPubKeys: BLSPubkey[]): Promise<ValidatorDuty[]> {
        validatorPubKeys.forEach((key) => this.trackedValidators.add(key));
        const response = await this.client.post<ILighthouseDutiesRequest, ILighthouseDutiesResponse[]>(
            LighthouseValidatorRoutes.DUTIES,
            {
                epoch,
                pubkeys: validatorPubKeys.map(toHexString)
            });
        return validatorPubKeys.map((validatorPubKey) => {
            const lhDuty = response.find((value => fromHex(value.validator_pubkey).equals(validatorPubKey)));
            if(lhDuty) {
                return {
                    validatorPubkey: validatorPubKey,
                    attestationSlot: lhDuty.attestation_slot,
                    committeeIndex: lhDuty.attestation_committee_index
                } as ValidatorDuty;
            } else {
                return null;
            }
        }).filter((value) => !!value) as ValidatorDuty[];
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