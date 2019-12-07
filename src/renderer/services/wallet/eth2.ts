import {entropyToMnemonic, generateMnemonic} from "bip39";
import {bytes} from "@chainsafe/eth2.0-types";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {mnemonicToSecretKey} from "@chainsafe/bls-keygen";

export class Eth2HDWallet {
    /**
     * If entropy is not provided bip39 uses crypto.randomBytes() as entropy source
     * @param entropy entropy to generate mnemonic
     */
    public static generate(entropy?: bytes): string {
        return entropy ? entropyToMnemonic(entropy) : generateMnemonic();
    }

    /**
     * Creates new keypair based on seed derived from mnemonic and child index
     * @param mnemonic
     * @param walletIndex derive a node based on a child index
     */
    public static getKeypair(mnemonic: string, walletIndex = 0): Keypair {
        const secretKeyBuf = mnemonicToSecretKey(mnemonic, `m/12381/3600/${walletIndex}/0`);
        const privateKey = PrivateKey.fromHexString(secretKeyBuf.toString("hex"));

        return new Keypair(privateKey);
    }
}