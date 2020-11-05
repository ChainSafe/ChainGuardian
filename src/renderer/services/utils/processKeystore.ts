import {readFile} from "fs";
import {deriveEth2ValidatorKeys, deriveKeyFromEntropy} from "@chainsafe/bls-keygen";
import {PrivateKey} from "@chainsafe/bls";
import {V4Keystore} from "../keystore";

interface IProcessKeystoreResponse {
    signingKey: string;
    withdrawalKey: string;
    signingKeyPath: string;
}

export const processKeystore = (path: string): Promise<IProcessKeystoreResponse> => new Promise((resolve) => {
    try {
        new V4Keystore(path);
    } catch {
        throw new Error("File is incorrect, try again whit different file");
    }

    readFile(path, (error, data) => {
        if (error) {
            throw error;
        }
        const parsedData = JSON.parse(data.toString());

        const validatorIndex = parseInt(parsedData.path.split("/")[3]);
        const validatorKeys = deriveEth2ValidatorKeys(deriveKeyFromEntropy(data), validatorIndex);

        resolve({
            signingKey: PrivateKey.fromBytes(validatorKeys.signing).toHexString(),
            withdrawalKey: PrivateKey.fromBytes(validatorKeys.withdrawal).toPublicKey().toHexString(),
            signingKeyPath: parsedData.path,
        });
    });
});
