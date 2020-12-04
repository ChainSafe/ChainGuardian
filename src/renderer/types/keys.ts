import {SecretKey, PublicKey} from "@chainsafe/bls";

export type BlsKeypair = {
    privateKey: SecretKey;
    publicKey: PublicKey;
};
