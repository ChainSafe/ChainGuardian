import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {BLSPubkey as BLSPubKey, DepositData} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {signingRoot} from "@chainsafe/ssz";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {DEPOSIT_AMOUNT, DEPOSIT_DOMAIN} from "./constants";
import {utils} from "ethers";
import BN from "bn.js";

/**
 * Generate function signature from ABI object.
 *
 * If function is not defined in ABI, empty string will be returned.
 *
 * @param rawAbi - array of objects or string defining contract ABI.
 * @param functionName - name of function for which signature is generated.
 * @return signature of function in format: functionName(arg1_type,arg2_type)
 */
export function functionSignatureFromABI(rawAbi: (string | any)[] | string, functionName: string): string {
    let hasFunction = false;
    const inputs: string[] = [];
    const abi = (typeof rawAbi == "string") ? JSON.parse(rawAbi) : rawAbi;
    for (const field of abi) {
        if (field["type"] === "function") {
            if (field["name"] === functionName) {
                hasFunction = true;
                for (const input of field["inputs"]) {
                    inputs.push(input["type"]);
                }
            }
        }
    }
    return hasFunction ? `${functionName}(${inputs.join(",")})` : "";
}

/**
 * Generate deposit params as instance of @{DepositData}.
 *
 * @param signingKey - signing @{KeyPair}.
 * @param withdrawalPubKey - withdrawal public key.
 *
 * @return instance of ${DepositData} defining deposit transaction.
 */
export function generateDeposit(signingKey: KeyPair, withdrawalPubKey: BLSPubKey): DepositData {
    // signing public key
    const publicKey: Buffer = signingKey.publicKey.toBytesCompressed();
    // BLS_WITHDRAWAL_PREFIX + hash(withdrawal_pubkey)[1:]
    const withdrawalCredentials: Buffer = Buffer.concat([
        Buffer.alloc(1),
        createHash("sha256").update(withdrawalPubKey).digest().subarray(1)
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const amount: BN = new BN(
        // remove decimal zeroes
        utils.formatUnits(utils.parseEther(DEPOSIT_AMOUNT), "gwei").split(".")[0]
    );
    // define DepositData
    const depositData: DepositData = {
        pubkey: publicKey,
        withdrawalCredentials: withdrawalCredentials,
        amount: amount,
        signature: Buffer.alloc(0)
    };
    // calculate root
    const root = signingRoot(depositData, config.types.DepositData);
    // sign calculated root
    depositData.signature = signingKey.privateKey.signMessage(
        root,
        DEPOSIT_DOMAIN
    ).toBytesCompressed();
    return depositData;
}
