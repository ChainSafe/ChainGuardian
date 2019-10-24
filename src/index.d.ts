declare module "*.jpg";

declare module "ethereumjs-wallet" {
  
    class Wallet {
        static fromPrivateKey(key: Buffer): Wallet
        static fromV3(json: string, password: string): Wallet
        getPrivateKey(): Buffer
        getPrivateKeyString(): string
        getAddressString(): string
        toV3(password: string, options?: Record<string, any>): any
    }
  
    namespace Wallet {}
  
    export = Wallet;
}
  
declare module "ethereumjs-wallet/hdkey" {
  
    class Wallet {
        static fromPrivateKey(key: Buffer): Wallet
        static fromV3(json: string, password: string): Wallet
        getPrivateKey(): Buffer
        getAddressString(): string
    }
  
    class EthereumHDKey {
        privateExtendedKey (): string
        publicExtendedKey (): string
        derivePath (path: string): EthereumHDKey
        deriveChild (index: number): EthereumHDKey
        getWallet (): Wallet
    }
  
    export function fromMasterSeed(seed: Buffer): EthereumHDKey;
    export function fromExtendedKey(base58key: string): EthereumHDKey;
}