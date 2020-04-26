import {Eth2HDWallet} from "../../src/renderer/services/wallet";
import {initBLS} from "@chainsafe/bls";
const entropy = Buffer.from("69248c25e98665aac3fe2fc05ee4a1d3", "hex");
const expectedMnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";

const privateKeyStr = "0x49ee17f0fdfb6269db16a465da2ebda84f1a6ff15976f66a762353c874dc30ee";
const publicKeyStr =
    "0xb28a2cce086a4606b7089b3469357b1e5ae813f7b4cd7c6d5609e329aeb1cc585db9ace4922ce18af9a892ddf85cafc7";

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
