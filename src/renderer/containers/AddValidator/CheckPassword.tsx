import * as React from "react";
import {useState, useEffect} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {Routes} from "../../constants/routes";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {storeSigningKeyAction, storeAddValidatorAction} from "../../actions";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonDestructive} from "../../components/Button/ButtonStandard";
import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {getConfig} from "../../../config/config";
import * as path from "path";
import {remote} from "electron";
import {V4Keystore} from "../../services/keystore";
import {PublicKey} from "@chainsafe/bls/lib/publicKey";

type IOwnProps = Pick<RouteComponentProps, "history">;

const CheckPassword: React.FunctionComponent<
IOwnProps & 
IInjectedProps & 
Pick<IRootState, "register" | "addValidator" | "auth">> = (props) => {
    const [input, setInput] = useState<string>("");
    const [inputStatus, setInputStatus] = useState<boolean | undefined>();

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setInput(e.currentTarget.value);
    };
    
    const handleSubmit = async (): Promise<void> => {
        const accounts = await database.account.get(DEFAULT_ACCOUNT);
        if(accounts!=null){
            const isCorrectValue = await accounts.isCorrectPassword(input);
            if(isCorrectValue) {
                
                const signingKey = PrivateKey.fromBytes(
                    Buffer.from(props.register.signingKey.slice(2), "hex")
                );
                
                if(props.auth.auth !== null) {
                    props.auth.auth.addValidator(new Keypair(signingKey));
                    const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);
                    await V4Keystore.create(
                        path.join(accountDirectory, PublicKey.fromPrivateKey(signingKey).toHexString() + ".json"),
                        input, new Keypair(signingKey)
                    );
                    
                    await database.account.set(
                        DEFAULT_ACCOUNT, 
                        props.auth.auth
                    );
                }
                setInputStatus(true);
                props.storeAddValidator(false);
                setTimeout(props.history.replace,500,Routes.DASHBOARD_ROUTE);
            }
            else {
                setInputStatus(false);
            }
        
        }
    };

    const handleCancel = (): void => {
        props.storeAddValidator(false);
        props.history.replace(Routes.DASHBOARD_ROUTE);
    };
    useEffect(()=>{
        setInputStatus(undefined);
    },[input]);
        
    return (
        <Background>
            <Modal>
                <h1 id="checkpassword-heading" >Confirm password</h1>
                <InputForm
                    onChange={handleChange}
                    type="password"
                    valid={inputStatus}
                    errorMessage={"Incorrect password"}
                />
                <div className="checkpassword-buttons">
                    <ButtonPrimary onClick={handleSubmit}>Submit</ButtonPrimary>
                    <ButtonDestructive onClick={handleCancel}>Cancel</ButtonDestructive>
                </div>
            </Modal>
        </Background>
    );
};

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
    storeAddValidator: typeof storeAddValidatorAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register" | "addValidator" | "auth"> => ({
    addValidator: state.addValidator,
    auth: state.auth,
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeSigningKey: storeSigningKeyAction,
        storeAddValidator: storeAddValidatorAction
    }, dispatch);

export const CheckPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckPassword);
