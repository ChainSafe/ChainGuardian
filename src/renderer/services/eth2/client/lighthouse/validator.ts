import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconClientOptions} from "../interface";
import {Attestation, BeaconBlock, BLSPubkey, SignedBeaconBlock, Slot, ValidatorDuty} from "@chainsafe/eth2.0-types";
import {ILighthouseDutiesRequest, ILighthouseDutiesResponse} from "./types";
import {toHexString} from "../../../utils/crypto";
import {fromHex} from "../../../utils/bytes";
import {computeEpochAtSlot} from "@chainsafe/eth2.0-state-transition";
import {fromJson, toJson} from "@chainsafe/eth2.0-utils";

export enum LighthouseValidatorRoutes {

    DUTIES = "/validator/duties",
    ATTESTATION = "/validator/attestation",
    BLOCK = "/validator/block"

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

    public async getProposerDuties(epoch: number): Promise<Map<Slot, BLSPubkey>> {
        const response = await this.client.post<ILighthouseDutiesRequest, ILighthouseDutiesResponse[]>(
            LighthouseValidatorRoutes.DUTIES,
            {
                epoch,
                pubkeys: Array.from(this.trackedValidators.values()).map(toHexString)
            });
        const proposers = new Map<Slot, BLSPubkey>();
        response.forEach((lhDuty) => {
            lhDuty.block_proposal_slots.forEach((proposerSlot) => {
                if(computeEpochAtSlot(this.config, proposerSlot) === epoch) {
                    proposers.set(proposerSlot, fromHex(lhDuty.validator_pubkey));
                } 
            });
        });
        return proposers;
    }

    public async getWireAttestations(): Promise<Attestation[]> {
        return [];
    }

    public async  isAggregator(): Promise<boolean> {
        //current api doesn't support aggregation
        return false;
    }

    public async produceAttestation(
        validatorPubKey: Buffer, pocBit: boolean, index: number, slot: number
    ): Promise<Attestation> {
        const response = await this.client.get<object>(
            LighthouseValidatorRoutes.ATTESTATION,
            {
                params: 
                    {
                        slot,
                        "committee_index": index
                    }
            }
        );
        return fromJson<Attestation>(this.config.types.Attestation, response);
    }

    public async produceBlock(slot: number, randaoReveal: Buffer): Promise<BeaconBlock> {
        const response = await this.client.get<object>(
            LighthouseValidatorRoutes.BLOCK,
            {
                params:
                    {
                        slot,
                        "randao_reveal": toHexString(randaoReveal)
                    }
            }
        );
        return fromJson<BeaconBlock>(this.config.types.BeaconBlock, response);
    }

    public async publishAggregatedAttestation(): Promise<void> {
        return;
    }

    public async publishAttestation(attestation: Attestation): Promise<void> {
        await this.client.post(LighthouseValidatorRoutes.ATTESTATION, {message: toJson(attestation)});
    }

    public async publishBlock(signedBlock: SignedBeaconBlock): Promise<void> {
        await this.client.post(LighthouseValidatorRoutes.BLOCK, toJson(signedBlock));
    }

}