import {Eth2HDWallet} from "../../src/renderer/services/wallet";
import { initBLS } from '@chainsafe/bls';
const entropy = Buffer.from("69248c25e98665aac3fe2fc05ee4a1d3", "hex");
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const privateKeyStr = "0x49a23a24f575a7e6b712c4edd819126861783e76dca230ef2e3cc6c7e40d3c3b";
const publicKeyStr =
    "0x95c259ecefa8e60edb099a6568887dd9ba35afa75062d01a12fcc5a40d402eca57afcdc1cff7e34fbcd84dfea0848bb9";

describe(".generate()", () => {
    beforeAll(async () => {
        await initBLS();
    });

    it("should work", () => {
        const mnemonic = Eth2HDWallet.generate(entropy);
        expect(mnemonic).toEqual(expectedMnemonic);
    });

    it("should fail", () => {
        expect(() => Eth2HDWallet.generate(Buffer.from("0", "hex"))).toThrow(new TypeError("Invalid entropy"));
    });
});

describe(".getKeypair()", () => {
    it("should work", () => {
        const keypair = Eth2HDWallet.getKeypair(expectedMnemonic);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
        expect(keypair.publicKey.toHexString()).toEqual(publicKeyStr);
    });

    it("should fail because wrong child", () => {
        const keypair = Eth2HDWallet.getKeypair(expectedMnemonic, 1);
        expect(keypair.privateKey.toHexString()).not.toEqual(privateKeyStr);
        expect(keypair.publicKey.toHexString()).not.toEqual(publicKeyStr);
    });
});
