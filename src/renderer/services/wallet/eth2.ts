import {entropyToMnemonic, generateMnemonic} from "bip39";
import { Keypair, PrivateKey } from '@chainsafe/bls';
import {mnemonicToSecretKey} from "@chainsafe/bls-keygen";

export class Eth2HDWallet {
    /**
     * If entropy is not provided bip39 uses crypto.randomBytes() as entropy source
     * @param entropy entropy to generate mnemonic
     */
    public static generate(entropy?: Buffer): string {
        return entropy ? entropyToMnemonic(entropy) : generateMnemonic();
    }

    /**
     * Creates new keypair based on seed derived from mnemonic and child index
     * @param mnemonic
     * @param walletIndex derive a node based on a child index
     */
    public static getKeypair(mnemonic: string, walletIndex = 0): Keypair {
        const secretKeyBuf = mnemonicToSecretKey(mnemonic, `m/12381/3600/${walletIndex}/0`);
        const privateKey = PrivateKey.fromBytes(secretKeyBuf);

        return new Keypair(privateKey);
    }
}