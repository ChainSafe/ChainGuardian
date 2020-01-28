import * as React from "react";
import {useState, useEffect} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {Routes} from "../../constants/routes";
import {bindActionCreators, Dispatch} from "redux";
import {IRootState} from "../../reducers";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {InputForm} from "../../components/Input/InputForm";
import {ButtonPrimary, ButtonDestructive} from "../../components/Button/ButtonStandard";
import database from "../../services/db/api/database";
import {DEFAULT_ACCOUNT} from "../../constants/account";
import {afterPasswordAction} from "../../actions";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";


type IOwnProps = Pick<RouteComponentProps, "history">;

const CheckPassword: React.FunctionComponent<
IOwnProps & 
IInjectedProps & 
Pick<IRootState, "register" | "auth">> = (props) => {
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
                    Buffer.from(props.register.signingKey.slice(2), "hex"));

                if(props.auth.auth !== null)
                    props.auth.auth.addValidator(new Keypair(signingKey));
                
                props.afterPassword(input);
                
                setInputStatus(true);
                setTimeout(props.history.push,500,{
                    pathname: Routes.DASHBOARD_ROUTE,
                    state: {}
                });
            }
            else {
                setInputStatus(false);
            }
        
        }
    };

    const handleCancel = (): void => {
        props.history.push({
            pathname: Routes.DASHBOARD_ROUTE,
            state: {}
        });
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
    afterPassword: typeof afterPasswordAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register" | "auth"> => ({
    auth: state.auth,
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        afterPassword: afterPasswordAction
    }, dispatch);

export const CheckPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckPassword);
