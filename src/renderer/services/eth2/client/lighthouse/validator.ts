import {IValidatorApi} from "@chainsafe/lodestar-validator/lib/api/interface/validators";
import {HttpClient} from "../../../api";
import {IBeaconClientOptions} from "../interface";
import {ILighthouseDutiesRequest, ILighthouseDutiesResponse} from "./types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {
    AggregateAndProof,
    Attestation, AttestationData,
    AttesterDuty,
    BeaconBlock,
    BLSPubkey,
    BLSSignature,
    CommitteeIndex,
    Epoch,
    ProposerDuty, SignedAggregateAndProof,
    SignedBeaconBlock,
    Slot
} from "@chainsafe/lodestar-types";
import {parse as bigIntParse} from "json-bigint";
import {Json, toHexString} from "@chainsafe/ssz";
import {LighthouseRoutes} from "./routes";
import {IBeaconApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {ZERO_HASH} from "@chainsafe/lodestar-beacon-state-transition";
import {axiosConfig} from "./axios";

export class LighthouseValidatorApiClient implements IValidatorApi {

    private readonly client: HttpClient;
    private readonly config: IBeaconConfig;
    private readonly beaconApi: IBeaconApi;

    public constructor(options: IBeaconClientOptions, beaconApi: IBeaconApi) {
        this.client = new HttpClient(options.baseUrl, {
            axios: axiosConfig
        });
        this.config = options.config;
        this.beaconApi = beaconApi;
    }

    public async getAttesterDuties(epoch: Epoch, validatorPubKeys: BLSPubkey[]): Promise<AttesterDuty[]> {

        const response = await this.client.post<ILighthouseDutiesRequest, ILighthouseDutiesResponse[]>(
            LighthouseRoutes.GET_DUTIES,
            {
                epoch,
                pubkeys: validatorPubKeys.map(toHexString)
            });
        return validatorPubKeys.map((validatorPubKey) => {
            const lhDuty = response.find((value => value.validator_pubkey === toHexString(validatorPubKey)));
            if(lhDuty && lhDuty.attestation_slot !== null) {
                return {
                    validatorPubkey: validatorPubKey,
                    attestationSlot: lhDuty.attestation_slot,
                    committeeIndex: lhDuty.attestation_committee_index,
                    aggregatorModulo: lhDuty.aggregator_modulo
                };
            } else {
                return null;
            }
        }).filter((value) => !!value);
    }

    public async getProposerDuties(epoch: Epoch, validatorPubKeys: BLSPubkey[]): Promise<ProposerDuty[]> {
        const response = await this.client.post<ILighthouseDutiesRequest, ILighthouseDutiesResponse[]>(
            LighthouseRoutes.GET_DUTIES,
            {
                epoch,
                pubkeys: validatorPubKeys.map(toHexString)
            });
        return response.flatMap((lhDuty) => {
            return lhDuty.block_proposal_slots.map((proposalSlot) => {
                return {
                    proposerPubkey: this.config.types.BLSPubkey.fromJson(lhDuty.validator_pubkey, {case: "snake"}),
                    slot: proposalSlot
                } as ProposerDuty;
            });
        });
    }

    public async produceAttestation(
        validatorPubKey: BLSPubkey, index: CommitteeIndex, slot: Slot
    ): Promise<Attestation> {
        const response = await this.client.get<Json>(
            LighthouseRoutes.GET_ATTESTATION,
            {
                params:
                    {
                        slot,
                        "committee_index": index
                    }
            }
        );
        return this.config.types.Attestation.fromJson(response, {case: "snake"});
    }

    public async produceBlock(slot: Slot, proposerPubKey: BLSPubkey, randaoReveal: Uint8Array): Promise<BeaconBlock> {
        const response = await this.client.get<Json>(
            LighthouseRoutes.GET_BLOCK,
            {
                params:
                    {
                        slot,
                        "randao_reveal": toHexString(randaoReveal)
                    }
            }
        );
        return this.config.types.BeaconBlock.fromJson(response, {case: "snake"});
    }

    public async publishAttestation(attestation: Attestation): Promise<void> {
        await this.client.post(
            LighthouseRoutes.PUBLISH_ATTESTATION,
            [this.config.types.Attestation.toJson(attestation, {case: "snake"})]
        );
    }

    public async publishBlock(signedBlock: SignedBeaconBlock): Promise<void> {
        await this.client.post(
            LighthouseRoutes.PUBLISH_BLOCK,
            this.config.types.SignedBeaconBlock.toJson(signedBlock, {case: "snake"})
        );
    }

    public async subscribeCommitteeSubnet(
        slot: Slot, slotSignature: BLSSignature,
        committeeIndex: CommitteeIndex, aggregatorPubkey: BLSPubkey
    ): Promise<void> {
        const validator = await this.beaconApi.getValidator(aggregatorPubkey);
        await this.client.post(
            LighthouseRoutes.SUBSCRIBE_TO_COMMITTEE_SUBNET,
            [
                {
                    "validator_index": validator.index,
                    "attestation_committee_index": committeeIndex,
                    slot: slot,
                    "is_aggregator": true
                }
            ]
        );
    }

    public async getWireAttestations(): Promise<Attestation[]> {
        throw new Error("Method not implemented.");
    }

    public async publishAggregateAndProof(signedAggregateAndProof: SignedAggregateAndProof): Promise<void> {
        await this.client.post(LighthouseRoutes.PUBLISH_AGGREGATES_AND_PROOFS, [
            this.config.types.SignedAggregateAndProof.toJson(signedAggregateAndProof, {case: "snake"})
        ]);
    }

    public async produceAggregateAndProof(
        attestationData: AttestationData, aggregator: BLSPubkey): Promise<AggregateAndProof> {
        const response = await this.client.get<Json>(
            LighthouseRoutes.GET_AGGREGATED_ATTESTATION,
            {
                params: {
                    "attestation_data": toHexString(this.config.types.AttestationData.serialize(attestationData))
                }
            });
        const validator = await this.beaconApi.getValidator(aggregator);
        const aggregate = this.config.types.Attestation.fromJson(response, {case: "snake"});
        return {
            aggregate,
            aggregatorIndex: validator.index,
            selectionProof: ZERO_HASH
        };
    }

}
