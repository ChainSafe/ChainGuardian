import {Eth2HDWallet} from "../../src/renderer/services/wallet";
const entropy = Buffer.from("69248c25e98665aac3fe2fc05ee4a1d3", "hex");
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";
const publicKeyStr =
    "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18";

describe(".generate()", () => {
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
