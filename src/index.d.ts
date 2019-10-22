declare module "*.jpg";

declare module "ethereumjs-wallet" {
  
    class Wallet {
        public static fromPrivateKey(key: Buffer): Wallet
        public static fromV3(json: string, password: string): Wallet
        public getPrivateKey(): Buffer
        public getPrivateKeyString(): string
        public getAddressString(): string
        public toV3(password: string, options?: Record<string, any>): any
    }
  
    namespace Wallet {}
  
    export = Wallet;
}
  
declare module "ethereumjs-wallet/hdkey" {
  
    class Wallet {
        public static fromPrivateKey(key: Buffer): Wallet
        public static fromV3(json: string, password: string): Wallet
        public getPrivateKey(): Buffer
        public getAddressString(): string
    }
  
    class EthereumHDKey {
        public privateExtendedKey (): string
        public publicExtendedKey (): string
        public derivePath (path: string): EthereumHDKey
        public deriveChild (index: number): EthereumHDKey
        public getWallet (): Wallet
    }
  
    export function fromMasterSeed(seed: Buffer): EthereumHDKey;
    export function fromExtendedKey(base58key: string): EthereumHDKey;
}