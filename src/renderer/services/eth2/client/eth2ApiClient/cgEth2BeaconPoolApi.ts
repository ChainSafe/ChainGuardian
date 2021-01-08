import {IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Attestation} from "@chainsafe/lodestar-types";
import store from "../../../../ducks/store";
import {signedNewAttestation} from "../../../../ducks/validator/actions";
import {Json} from "@chainsafe/ssz";

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
        const data = this.config.types.Attestation.toJson(attestation, {case: "snake"}) as Json & {
            // eslint-disable-next-line camelcase
            data: {beacon_block_root: string; index: string; slot: string};
        };
        if (this.publicKey) {
            store.dispatch(
                signedNewAttestation(
                    this.publicKey,
                    data.data.beacon_block_root,
                    Number(data.data.index),
                    Number(data.data.slot),
                ),
            );
        }
        await this.httpClient.post("/eth/v1/beacon/pool/attestations", [data]);
    };
}
