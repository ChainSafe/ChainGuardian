import {IBeaconPoolApi} from "@chainsafe/lodestar-validator/lib/api/interface/beacon";
import {HttpClient} from "../../../api";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Attestation, SignedVoluntaryExit} from "@chainsafe/lodestar-types";
import {signedNewAttestation} from "../../../../ducks/validator/actions";
import {toHex} from "@chainsafe/lodestar-utils";
import {Dispatch} from "redux";

export class CgEth2BeaconPoolApi implements IBeaconPoolApi {
    protected readonly httpClient: HttpClient;
    protected readonly config: IBeaconConfig;
    protected readonly publicKey?: string;
    protected readonly dispatch?: Dispatch;

    public constructor(config: IBeaconConfig, httpClient: HttpClient, publicKey?: string, dispatch?: Dispatch) {
        this.config = config;
        this.httpClient = httpClient;
        this.publicKey = publicKey;
        this.dispatch = dispatch;
    }

    public submitAttestation = async (attestation: Attestation): Promise<void> => {
        if (this.publicKey && this.dispatch) {
            const validatorIndexInCommittee = attestation.aggregationBits.findIndex((bit) => bit);
            if (validatorIndexInCommittee !== -1)
                this.dispatch(
                    signedNewAttestation(
                        this.publicKey,
                        toHex(attestation.data.beaconBlockRoot),
                        attestation.data.index,
                        attestation.data.slot,
                        validatorIndexInCommittee,
                    ),
                );
        }
        await this.httpClient.post("/eth/v1/beacon/pool/attestations", [
            this.config.types.Attestation.toJson(attestation, {case: "snake"}),
        ]);
    };

    public async submitVoluntaryExit(signedVoluntaryExit: SignedVoluntaryExit): Promise<void> {
        await this.httpClient.post(
            "/pool/voluntary_exits",
            this.config.types.SignedVoluntaryExit.toJson(signedVoluntaryExit, {case: "snake"}),
        );
    }
}
