import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import fs from "fs";
import sinon from "sinon";
import {Eth1Keystore, ICGKeystore} from "../../../src/renderer/services/keystore";


const example = import("./example.json");
const privateKey = "0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18";
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `${getV3Filename()}.json`;
const password = "test";
const newPassword = "newTest";

function getV3Filename(timestamp?: number): string {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ["UTC--", ts.toJSON().replace(/:/g, "-"), "--", "uuid"].join("");
}

describe("Eth1ICGKeystore", () => {
    let eth1Keystore: ICGKeystore = {} as ICGKeystore;
    let sandbox: sinon.SinonSandbox;

    beforeAll(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "existsSync").withArgs(keyStoreFilePath).returns(true);
    });

    afterAll(() => {
        sandbox.restore();
    });

    it("should create keystore", async () => {
        const priv = PrivateKey.fromHexString(privateKeyStr);
        const keypair = new Keypair(priv);

        const writeStub = sandbox.stub(fs, "writeFileSync");
        const readStub = sandbox
            .stub(fs, "readFileSync")
            .withArgs(keyStoreFilePath)
            .returns(
                JSON.stringify(await example)
            );

        eth1Keystore = await Eth1Keystore.create(keyStoreFilePath, password, keypair);
        expect(writeStub.calledOnce).toEqual(true);
        expect(readStub.calledOnce).toEqual(true);
    });

    it("should decrypt", async () => {
        const keypair = await eth1Keystore.decrypt(password);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });

    it("should fail on decrypt with wrong password", async () => {
        await expect(eth1Keystore.decrypt("wrongPassword"))
            .rejects
            .toThrow("invalid password");
    });

    it("should get private key with changed password", async () => {
        await eth1Keystore.changePassword(password, newPassword);
        const keypair = await eth1Keystore.decrypt(newPassword);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });

    it("should fail to encrypt private key with old password", async () => {
        await eth1Keystore.changePassword(newPassword, password);
        await expect(eth1Keystore.decrypt("oldPassword"))
            .rejects
            .toThrow("invalid password");
    }, 10000);

    it("should destroy file", () => {
        const unlinkStub = sandbox
            .stub(fs, "unlinkSync")
            .withArgs(keyStoreFilePath)
            .returns();
        eth1Keystore.destroy();
        expect(unlinkStub.calledOnce).toEqual(true);
    });
});
