import {IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Attestation} from "@chainsafe/lodestar-types";

export class BeaconPool implements IBeaconPoolApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    public constructor(config: IBeaconConfig, httpClient: HttpClient) {
        this.config = config;
        this.httpClient = httpClient;
    }

    public submitAttestation = async (attestation: Attestation): Promise<void> => {
        await this.httpClient.post(
            "/eth/v1/beacon/pool/attestations",
            this.config.types.Attestation.toJson(attestation, {case: "snake"}),
        );
    };
}
