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
import {addNewValidatorAction} from "../../actions";


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
        if (accounts != null){
            const isCorrectValue = await accounts.isCorrectPassword(input);
            if (isCorrectValue) {
                props.addNewValidator(input);

                setInputStatus(true);
                setTimeout(props.history.push,500, Routes.DASHBOARD_ROUTE);
            }
            else {
                setInputStatus(false);
            }
        }
    };

    const handleCancel = (): void => {
        props.history.push(Routes.DASHBOARD_ROUTE);
    };

    useEffect(()=>{
        setInputStatus(undefined);
    },[input]);

    return (
        <Background>
            <Modal>
                <h1 id="checkpassword-heading">Confirm password</h1>
                <InputForm
                    focused
                    onChange={handleChange}
                    type="password"
                    valid={inputStatus}
                    errorMessage={"Incorrect password"}
                    onSubmit={(e): Promise<void> => {e.preventDefault(); return handleSubmit();}}
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
    addNewValidator: typeof addNewValidatorAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register" | "auth"> => ({
    auth: state.auth,
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        addNewValidator: addNewValidatorAction,
    }, dispatch);

export const CheckPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckPassword);
