import {entropyToMnemonic, mnemonicToSeedSync, generateMnemonic, validateMnemonic} from "bip39";
import {bytes} from "@chainsafe/eth2.0-types";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {fromPrivateKey} from "ethereumjs-wallet";
import {fromMasterSeed} from "ethereumjs-wallet/hdkey";
import { IInputValidity } from "./interfaces";

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

    public static checkValidity(input: string): IInputValidity {
        if(input.startsWith("0x")){
            const privateKey = input.split("0x")[1];
            if(!privateKey.match("^[a-z0-9 ]*$")){
                return this.generateReturnStatement(false, "Private key must contain alphanumerical characters only");
            }

            const privateKeyBuff = Buffer.from(privateKey, "hex");
            
            if(privateKeyBuff.length !== 32){
                return this.generateReturnStatement(false, "Private key have to be 32 bytes long");
            }
            
            try{
                fromPrivateKey(Buffer.from(input.split("0x")[1], "hex"));
                return this.generateReturnStatement(true, "");
            }catch (err){
                return this.generateReturnStatement(false, err.message);
            }
        }else {
            if(validateMnemonic(input)){
                return this.generateReturnStatement(true, "");
            }else{
                return this.generateReturnStatement(false, "Invalid mnemonic");
            }
        }
    }

    private static generateReturnStatement(isValid: boolean, message: string): IInputValidity{
        return {isValid, message};
    }
}
