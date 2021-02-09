import {IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Attestation} from "@chainsafe/lodestar-types";
import store from "../../../../ducks/store";
import {signedNewAttestation} from "../../../../ducks/validator/actions";
import {toHex} from "@chainsafe/lodestar-utils";

export class CgEth2BeaconPoolApi implements IBeaconPoolApi {
    private readonly httpClient: HttpClient;
    private readonly config: IBeaconConfig;
    private readonly publicKey?: string;
    public constructor(config: IBeaconConfig, httpClient: HttpClient, publicKey?: string) {
        this.config = config;
        this.httpClient = httpClient;
        this.publicKey = publicKey;
    }

    public submitAttestation = async (attestation: Attestation): Promise<void> => {
        if (this.publicKey) {
            store.dispatch(
                signedNewAttestation(
                    this.publicKey,
                    toHex(attestation.data.beaconBlockRoot),
                    attestation.data.index,
                    attestation.data.slot,
                    JSON.stringify(attestation.aggregationBits),
                ),
            );
        }
        await this.httpClient.post("/eth/v1/beacon/pool/attestations", [
            this.config.types.Attestation.toJson(attestation, {case: "snake"}),
        ]);
    };
}
