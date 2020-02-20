import {Keypair as KeyPair} from "@chainsafe/bls/lib/keypair";
import {BLSPubkey as BLSPubKey, DepositData} from "@chainsafe/eth2.0-types";
import {createHash} from "crypto";
import {hashTreeRoot} from "@chainsafe/ssz";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {DEPOSIT_DOMAIN} from "./constants";
import {ethers, utils} from "ethers";
import {DepositMessage} from "@chainsafe/eth2.0-types/lib/types/misc";

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

export function etherToGwei(ether: string|number|bigint): bigint {
    return BigInt(ether) * (BigInt(ethers.utils.parseUnits("1", "gwei").toString()));
}

/**
 * Generate deposit params as instance of @{DepositData}.
 *
 * @param signingKey - signing @{KeyPair}.
 * @param withdrawalPubKey - withdrawal public key.
 *
 * @param depositAmount
 * @return instance of ${DepositData} defining deposit transaction.
 */
export function generateDeposit(
    signingKey: KeyPair, withdrawalPubKey: BLSPubKey, depositAmount: string|number
): DepositData {
    // signing public key
    const publicKey: Buffer = signingKey.publicKey.toBytesCompressed();
    // BLS_WITHDRAWAL_PREFIX + hash(withdrawal_pubkey)[1:]
    const withdrawalCredentials: Buffer = Buffer.concat([
        Buffer.alloc(1),
        createHash("sha256").update(withdrawalPubKey).digest().subarray(1)
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const amount = BigInt(
        // remove decimal zeroes
        utils.formatUnits(utils.parseEther(depositAmount.toString()), "gwei").split(".")[0]
    );
    // define DepositData
    const depositMsg: DepositMessage = {
        pubkey: publicKey,
        withdrawalCredentials: withdrawalCredentials,
        amount: amount,
    };
    // calculate root
    const root = hashTreeRoot(config.types.DepositMessage, depositMsg);
    // sign calculated root
    const signature = signingKey.privateKey.signMessage(
        root,
        DEPOSIT_DOMAIN
    ).toBytesCompressed();
    return {
        ...depositMsg,
        signature,
    } as DepositData;
}
