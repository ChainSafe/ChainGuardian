import {CustomHelpers, ExtensionRule, SchemaInternals} from "@hapi/joi";
import {validateMnemonic} from "bip39";

export const ERR_CODE_MNEMONIC = "crypto.mnemonic.invalid";

const joiMnemonicKey: ExtensionRule & ThisType<SchemaInternals> = {
    alias: "mnemonic",
    method(): any {
        return this.$_addRule("mnemonic");
    },
    validate(value: string, helpers: CustomHelpers): any {
        if (validateMnemonic(value)) {
            return value;
        }
        return helpers.error(ERR_CODE_MNEMONIC);
    },
};

export const mnemonicRule = {
    mnemonic: joiMnemonicKey,
};
