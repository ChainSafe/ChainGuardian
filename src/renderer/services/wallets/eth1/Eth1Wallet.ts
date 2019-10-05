import { IWallet } from '../../interface';

export class Eth1Wallet implements IWallet {
    walletProviderUtils: any;

    constructor(walletProviderUtils: any) {
        this.walletProviderUtils = walletProviderUtils;
    }

    /**
     * Return the private key as Buffer
     */
    getPrivateKey(): Buffer {
        return this.walletProviderUtils.getPrivateKey();
    }

    /**
     * Return the private key as String
     */
    getPrivateKeyString(): String {
        return this.walletProviderUtils.getPrivateKeyString();
    }

    /**
     * Return the public key as Buffer
     */
    getPublicKey(): Buffer {
        return this.walletProviderUtils.getPublicKey();
    }

    /**
     * Return the public key as String
     */
    getPublicKeyString(): String {
        return this.walletProviderUtils.getPublicKeyString();
    }

    /**
     * Return the address as Buffer
     */
    getAddress(): Buffer {
        return this.walletProviderUtils.getAddress();
    }

    /**
     * Return the address as String
     */
    getAddressString(): String {
        return this.walletProviderUtils.getAddressString();
    }

    /**
     * Return the address with checksum
     */
    getChecksumAddressString(): String {
        return this.walletProviderUtils.getChecksumAddressString();
    }

    /**
     * Return the wallet as Object
     * @param password passphrase for keystore
     * @param options options for Key Derivation Function (KDF)
     */
    toV3(password: String, options?: Object): any {
        return this.walletProviderUtils.toV3(password, options);
    }

    /**
     * Return the wallet as JSON String
     * @param password passphrase for keystore
     * @param options options for Key Derivation Function (KDF)
     */
    toV3String(password: String, options?: Object): String {
        return this.walletProviderUtils.toV3String(password, options);
    }

    /**
     * Return the suggested filename for V3 keystores
     * @param timeStamp
     */
    getV3Filename(timeStamp?: Number): String {
        return this.walletProviderUtils.getV3Filename(timeStamp);
    }
}
