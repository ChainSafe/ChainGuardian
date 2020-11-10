import fs from "fs";
import sinon from "sinon";
import {V4Keystore} from "../../../../src/renderer/services/keystore";
import example from "./example.v4.json";

const importingKeystoreFilePath = "imagination.json";
const keyStoreFilePath = `keystore-${Math.random() * 1000}.json`;
const password = "test";
const wrongPassword = "wrongOne";

describe("V4Keystore", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(async () => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "readFileSync").returns(await JSON.stringify(example));
        sandbox.stub(fs, "existsSync").returns(true);
        sandbox.stub(fs, "writeFileSync");

        fs.writeFileSync(importingKeystoreFilePath, "a");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should fail to import file with wrong password", async () => {
        await expect(V4Keystore.import(importingKeystoreFilePath, keyStoreFilePath, wrongPassword)).rejects.toThrow(
            "Invalid password",
        );
    }, 10000);

    it("should import file", async () => {
        await expect(() => {
            V4Keystore.import(importingKeystoreFilePath, keyStoreFilePath, password);
        }).not.toThrow();
    });
});
