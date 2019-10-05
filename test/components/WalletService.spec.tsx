import { WalletService } from '../../src/renderer/services/WalletService';

const walletService = new WalletService();
const fixturePrivateKey = 'efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378';
const fixturePrivateKeyStr = `0x${fixturePrivateKey}`;
const fixturePrivateKeyBuffer = Buffer.from(fixturePrivateKey, 'hex');

const fixturePublicKey =
    '5d4392f450262b276652c1fc037606abac500f3160830ce9df53aa70d95ce7cfb8b06010b2f3691c78c65c21eb4cf3dfdbfc0745d89b664ee10435bb3a0f906c';
const fixturePublicKeyStr = `0x${fixturePublicKey}`;
const fixturePublicKeyBuffer = Buffer.from(fixturePublicKey, 'hex');

const fixtureWallet = walletService.fromPrivateKey(fixturePrivateKeyBuffer);

describe('.generate()', () => {
    const wallet = walletService.generate();

    it('should generate an account', () => {
        expect(wallet.getPrivateKey().length).toEqual(32);
    });
});

describe('.getPrivateKey()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPrivateKey().toString('hex')).toEqual(fixturePrivateKey);
    });

    it('should fail', () => {
        expect(() => walletService.fromPrivateKey(Buffer.from('001122', 'hex'))).toThrow(
            new Error('Private key does not satisfy the curve requirements (ie. it is invalid)')
        );
    });
});

describe('.getPrivateKeyString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPrivateKeyString()).toEqual(fixturePrivateKeyStr);
    });
});

describe('.getPublicKey()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPublicKey().toString('hex')).toEqual(fixturePublicKey);
    });
});

describe('.getPublicKeyString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getPublicKeyString()).toEqual(fixturePublicKeyStr);
    });
});

describe('.getAddress()', () => {
    it('should work', () => {
        expect(fixtureWallet.getAddress().toString('hex')).toEqual('b14ab53e38da1c172f877dbc6d65e4a1b0474c3c');
    });
});

describe('.getAddressString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getAddressString()).toEqual('0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c');
    });
});

describe('.getCheckSumAddressString()', () => {
    it('should work', () => {
        expect(fixtureWallet.getChecksumAddressString()).toEqual('0xB14Ab53E38DA1C172f877DBC6d65e4a1B0474C3c');
    });
});

// Certain methods will not be available
describe('public key only wallet', () => {
    it('', () => {});
});
