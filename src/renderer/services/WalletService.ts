import { bool } from '@chainsafe/eth2.0-types';

const eth1WalletProvider = require('ethereumjs-wallet');

export class WalletService {
    walletInstance: IWallet = {} as IWallet;
    /**
     * Create an instance based on a new random key
     */
    generate() {
        const eth1WalletInstance = eth1WalletProvider.generate();
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    /**
     * Create an instance based on a raw private key
     *
     * @param privateKey
     */
    fromPrivateKey(privateKey: Buffer) {
        const eth1WalletInstance = eth1WalletProvider.fromPrivateKey(privateKey);
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    /**
     * Create an instance based on a public key (certain methods will not be available)
     * @param publicKey
     * @param nonStrict
     */
    fromPublicKey(publicKey: Buffer, nonStrict: bool = false) {
        const eth1WalletInstance = eth1WalletProvider.fromPublicKey(publicKey, nonStrict);
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    /**
     * Create an instance based on a BIP32 extended private key (xprv)
     * @param xPrivateKey extender private key
     */
    fromExtendedPrivateKey(xPrivateKey: String) {
        const eth1WalletInstance = eth1WalletProvider.fromExtendedPrivateKey(xPrivateKey);
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    /**
     * Create an instance based on a BIP32 extended public key (xpub)
     * @param xPublicKey
     */
    fromExtendedPublicKey(xPublicKey: String) {
        const eth1WalletInstance = eth1WalletProvider.fromExtendedPublicKey(xPublicKey);
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    fromV3(input: String, password: String, nonStrict: bool = false) {
        const eth1WalletInstance = eth1WalletProvider.fromV3(input, password, nonStrict);
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }
}

interface IWallet {
    getPrivateKey(): Buffer;
    getPrivateKeyString(): String;
    getPublicKey(): Buffer;
    getPublicKeyString(): String;
    getAddress(): Buffer;
    getAddressString(): String;
    getChecksumAddressString(): String;
    toV3(password: String, options?: Object): any;
    toV3String(password: String, options?: Object): String;
    getV3Filename(timeStamp: Number): String;
}

class Eth1Wallet implements IWallet {
    wallet: any;

    constructor(wallet: any) {
        this.wallet = wallet;
    }

    getPrivateKey(): Buffer {
        return this.wallet.getPrivateKey();
    }

    getPrivateKeyString(): String {
        return this.wallet.getPrivateKeyString();
    }

    getPublicKey(): Buffer {
        return this.wallet.getPublicKey();
    }

    getPublicKeyString(): String {
        return this.wallet.getPublicKeyString();
    }

    getAddress(): Buffer {
        return this.wallet.getAddress();
    }

    getAddressString(): String {
        return this.wallet.getAddressString();
    }

    getChecksumAddressString(): String {
        return this.wallet.getChecksumAddressString();
    }

    toV3(password: String, options?: Object): any {
        return this.wallet.toV3(password, options);
    }

    toV3String(password: String, options?: Object): String {
        return this.wallet.toV3String(password, options);
    }

    getV3Filename(timeStamp: Number): String {
        return this.wallet.getV3Filename(timeStamp);
    }
}
