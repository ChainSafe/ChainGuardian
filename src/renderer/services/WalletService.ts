const eth1WalletProvider = require('ethereumjs-wallet');

export class WalletService {
    walletInstance: IWallet = {} as IWallet;

    generate() {
        const eth1WalletInstance = eth1WalletProvider.generate();
        this.walletInstance = new Eth1Wallet(eth1WalletInstance);
        return this.walletInstance;
    }

    fromPrivateKey(privateKey: Buffer) {
        const eth1WalletInstance = eth1WalletProvider.fromPrivateKey(privateKey);
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
}
