import { functionSignatureFromABI } from '../../../../src/renderer/services/deposit';
import options from "../../../../src/renderer/services/deposit/options";

describe("deposit utils unit test", () => {
    it("should successfully extract deposit function signature.", async () => {
        expect(functionSignatureFromABI(options.abi, "deposit"))
            .toBe("deposit(bytes,bytes,bytes)");
    });

    it("should successfully extract get_hash_tree_root function signature.", async () => {
        expect(functionSignatureFromABI(options.abi, "get_hash_tree_root"))
            .toBe("get_hash_tree_root()");
    });

    it("should fail to extract signature from nonexistent function.", async () => {
        expect(functionSignatureFromABI(options.abi, "no_function"))
            .toBe("");
    });
});
