import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {IBeaconClientOptions} from "../interface";
import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {
    Attestation, AttestationData,
    BeaconBlock,
    BLSPubkey,
    BLSSignature,
    CommitteeIndex,
    Epoch,
    SignedBeaconBlock,
    Slot,
    ValidatorDuty
} from "@chainsafe/eth2.0-types";
import {PrysmAttestationData, PrysmValidatorDutiesResponse} from "./types";
import {base64Decode, base64Encode} from "../../../utils/bytes";
import {bytesToInt, intDiv} from "@chainsafe/eth2.0-utils";
// @ts-ignore
import SHA256 from "bcrypto/lib/sha256";
import {BitList} from "@chainsafe/bit-utils";
import {fromPrysmaticJson, toPrysmaticJson} from "./converter";

export enum PrysmValidatorRoutes {
    DUTIES = "/validator/duties",
    ATTESTATION = "/validator/attestation",
    VALIDATOR_INDEX = "/validator/index",
    BLOCK = "/validator/block",
    AGGREGATE_ATTESTATIONS = "/validator/aggregate"
}

export class PrysmValidatorApiClient implements IValidatorApi {

    private client: HttpClient;
    private config: IBeaconConfig;

    private trackedValidators: Set<BLSPubkey> = new Set();
    /**
     * key is "<slot>,<committeeIndex>"
     */
    private committees: Map<string, number[]> = new Map();

    public constructor(options: IBeaconClientOptions, validators: BLSPubkey[] = []) {
        this.client = new HttpClient(options.baseUrl);
        this.config = options.config;
        validators.forEach((validator) => this.trackedValidators.add(validator));
    }

    public async getAttesterDuties(epoch: Epoch, validatorPubKeys: BLSPubkey[]): Promise<ValidatorDuty[]> {
        validatorPubKeys.forEach((key) => this.trackedValidators.add(key));
        const duties: ValidatorDuty[] = [];
        const combinedDuties = await this.getDuties(epoch, validatorPubKeys);
        combinedDuties.duties.forEach((prysmDuty) => {
            const validatorPubkey = base64Decode(prysmDuty.publicKey);
            if(prysmDuty.attesterSlot && validatorPubKeys.findIndex((key) => key.equals(validatorPubkey)) !== -1) {
                duties.push({
                    validatorPubkey,
                    attestationSlot: Number(prysmDuty.attesterSlot),
                    committeeIndex: Number(prysmDuty.committeeIndex) 
                });
                this.committees.set(
                    `${prysmDuty.attesterSlot},${prysmDuty.committeeIndex}`,
                    prysmDuty.committee.map(Number)
                );
            }
        });
        return duties;
    }

    public async getProposerDuties(epoch: number): Promise<Map<Slot, BLSPubkey>> {
        const proposers: Map<Slot, BLSPubkey> = new Map();
        const validators = Array.from(this.trackedValidators);
        const combinedDuties = await this.getDuties(epoch, validators);
        combinedDuties.duties.forEach((prysmDuty) => {
            const validatorPubkey = base64Decode(prysmDuty.publicKey);
            if(prysmDuty.proposerSlot && validators.findIndex((key) => key.equals(validatorPubkey)) !== -1) {
                proposers.set(Number(prysmDuty.proposerSlot), validatorPubkey);
            }
        });
        return proposers;
    }

    public async getWireAttestations(): Promise<Attestation[]> {
        return [];
    }

    public async isAggregator(
        slot: Slot, committeeIndex: CommitteeIndex, slotSignature: BLSSignature
    ): Promise<boolean> {
        const committee = this.committees.get(`${slot},${committeeIndex}`);
        if(!committee) {
            return false;
        }
        const modulo = Math.max(1, intDiv(committee.length, this.config.params.TARGET_COMMITTEE_SIZE));
        return (bytesToInt(SHA256.digest(slotSignature).slice(0, 8)) % modulo) === 0;
    }

    public async produceAttestation(
        validatorPubKey: BLSPubkey, pocBit: boolean, index: CommitteeIndex, slot: Slot
    ): Promise<Attestation> {
        const attestationDataResponse = await this.client.get<PrysmAttestationData>(
            PrysmValidatorRoutes.ATTESTATION,
            {params: {
                slot,
                committeeIndex: index
            }}
        );
        const committee = this.committees.get(`${slot},${index}`);
        if(!committee) {
            throw new Error("Missing committee");
        }
        const validatorIndex = await this.getValidatorIndex(validatorPubKey);
        const indexInCommittee = committee.indexOf(validatorIndex);
        const aggregationBits = BitList.fromBitfield(
            Buffer.alloc(intDiv(committee.length + 7, 8)),
            committee.length
        );
        aggregationBits.setBit(indexInCommittee, true);
        const attestationData = fromPrysmaticJson<AttestationData>(
            this.config.types.AttestationData,
            attestationDataResponse
        );
        attestationData.index = index;
        return {
            aggregationBits,
            data: attestationData
        } as Attestation;
    }

    public async produceBlock(slot: number, randaoReveal: Buffer): Promise<BeaconBlock> {
        return fromPrysmaticJson<BeaconBlock>(
            this.config.types.BeaconBlock,
            await this.client.get<object>(
                PrysmValidatorRoutes.BLOCK,
                {params: {slot, randaoReveal: base64Encode(randaoReveal)}}
            )
        );
    }

    public async publishAggregatedAttestation(
        aggregated: Attestation, validatorPubKey: BLSPubkey, slotSignature: BLSSignature
    ): Promise<void> {
        return await this.client.post(
            PrysmValidatorRoutes.AGGREGATE_ATTESTATIONS,
            toPrysmaticJson(
                {
                    slot: aggregated.data.slot,
                    committeeIndex: aggregated.data.index,
                    publicKey: validatorPubKey,
                    slotSignature: slotSignature
                }
            )
        );
    }

    public async publishAttestation(attestation: Attestation): Promise<void> {
        return await this.client.post(
            PrysmValidatorRoutes.ATTESTATION,
            toPrysmaticJson(attestation)
        );
    }

    public async publishBlock(signedBlock: SignedBeaconBlock): Promise<void> {
        return await this.client.post(
            PrysmValidatorRoutes.BLOCK,
            toPrysmaticJson(signedBlock)
        );
    }

    public trackValidator(validator: BLSPubkey): void {
        this.trackedValidators.add(validator);
    }

    private async getValidatorIndex(pubKey: BLSPubkey): Promise<number> {
        const response = (await this.client.get<{index: string}>(
            PrysmValidatorRoutes.VALIDATOR_INDEX,
            {params: {publicKey: base64Encode(pubKey)}}
        ));
        return Number(
            response.index
        );
    }

    private async getDuties(epoch: Epoch, publicKeys: BLSPubkey[]): Promise<PrysmValidatorDutiesResponse> {
        return await this.client.get<PrysmValidatorDutiesResponse>(
            PrysmValidatorRoutes.DUTIES,
            {
                params: {
                    epoch,
                    publicKeys: publicKeys.map(base64Encode)
                }
            });
    }
}