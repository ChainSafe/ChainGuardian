import {V4Keystore} from "../keystore";

export const processKeystore = (path: string): string => {
    try {
        return new V4Keystore(path).getPublicKey();
    } catch {
        throw new Error("File is incorrect, try again with different file");
    }
};
