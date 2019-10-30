import {entropyToMnemonic, mnemonicToSeedSync, generateMnemonic} from "bip39";
import {bytes} from "@chainsafe/eth2.0-types";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {fromMasterSeed} from "ethereumjs-wallet/hdkey";

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
        const fixturehd = fromMasterSeed(mnemonicToSeedSync(mnemonic));
        const hdnode = fixturehd.deriveChild(walletIndex);
        const privateKey = PrivateKey.fromBytes(hdnode.getWallet().getPrivateKey());

        return new Keypair(privateKey);
    }
}
