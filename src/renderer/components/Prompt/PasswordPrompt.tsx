import * as React from "react";
import {Keypair} from "@chainsafe/bls";

import {DEFAULT_ACCOUNT} from "../../constants/account";
import database from "../../services/db/api/database";
import {ICGKeystore} from "../../services/keystore";
import {InputPrompt, ISubmitStatus} from "./InputPrompt";

export interface IPasswordPromptProps {
    /**
     * Called on submit password confirmation.
     *
     * @param password - that is entered in password prompt dialog
     */
    onSubmit: (keypair: Keypair) => Promise<void>;
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
    /**
     * Called on cancel password prompt.
     */
    onCancel: () => void;
    /**
     * Boolean controlling is prompt displaying.
     */
    display: boolean;
    keystore: ICGKeystore;
}

export const PasswordPrompt: React.FunctionComponent<IPasswordPromptProps> = (props: IPasswordPromptProps) => {
    const onSubmit = async(promptPassword: string): Promise<ISubmitStatus> => {
        const account = await database.account.get(DEFAULT_ACCOUNT);
        if (account != null) {
            const keyPair = await account.unlockKeystore(promptPassword, props.keystore);
            if(keyPair){
                await props.onSubmit(keyPair);
                return {valid: true};
            } else {
                return {
                    valid: false,
                    errorMessage: "Invalid password"
                };
            }
        } else {
            return {
                valid: false,
                errorMessage: "Error, account not found"
            };
        }
    };

    return(
        <InputPrompt
            onSubmit={onSubmit}
            onCancel={props.onCancel}
            onChange={props.onChange}
            display={props.display}
            title={"Confirm password"}
            placeholder={"Please reenter your password..."}
            inputType={"password"}
        />
    );
};
