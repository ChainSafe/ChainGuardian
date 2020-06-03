import * as React from "react";
import {useState, useEffect} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";

import {NetworkDropdown} from "../../components/NetworkDropdown/NetworkDropdown";
import {Validator} from "../Validator/Validator";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {deleteKeystore} from "../../services/utils/account";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {IRootState} from "../../reducers";
import {loadAccountAction, loadValidatorsAction, storeNotificationAction} from "../../actions";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {startAddingNewValidator as startAddingNewValidatorAction} from "../../actions";

type IOwnProps = {
    network: string;
} & Pick<RouteComponentProps, "history" | "location">;

type DashBoardProps = IOwnProps & IInjectedProps & Pick<IRootState, "auth" | "validators">;
const Dashboard: React.FunctionComponent<DashBoardProps> = (props) => {
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [selectedValidatorIndex, setSelectedValidatorIndex] = useState<number>(0);
    const validators = Object.values(props.validators);

    const onAddNewValidator = (): void => {
        props.startAddingNewValidator();
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    const onRemoveValidator = (index: number): void => {
        setSelectedValidatorIndex(index);
        setConfirmModal(true);
    };

    const onConfirmDelete = (): void => {
        if(props.auth.account){
            const selectedValidatorPublicKey = validators[selectedValidatorIndex].publicKey;
            deleteKeystore(props.auth.account.directory, selectedValidatorPublicKey);
            props.auth.account.removeValidator(selectedValidatorIndex);
            // props.storeAuth(props.auth.account);
            props.loadValidators();
        }
        setConfirmModal(false);
        props.notification({
            source: props.history.location.pathname,
            title: "Validator removed.",
            horizontalPosition: Horizontal.RIGHT,
            verticalPosition: Vertical.BOTTOM,
            level: Level.ERROR,
        });
    };

    useEffect(()=> {
        props.loadValidators();
    },[props.auth.account && props.auth.account.getValidators().length]);

    useEffect(()=> {
        props.loadAccount();
    },[]);

    const topBar =
            <div className={"validator-top-bar"}>
                <NetworkDropdown />
                <ButtonPrimary onClick={onAddNewValidator} buttonId={"add-validator"}>
                    ADD NEW VALIDATOR
                </ButtonPrimary>
            </div>;

    return (
        <Background topBar={topBar} scrollable={true}>
            <div className={"validators-display"}>
                {validators
                    .filter(validator =>
                        validator.network === props.network || !props.network // if all networks
                    )
                    .map((v, index) => {
                        return <div key={index} className={"validator-wrapper"}>
                            <Validator
                                name={v.name}
                                status={v.status}
                                publicKey={v.publicKey}
                                onBeaconNodeClick={(() => (): void => {
                                    props.history.push(
                                        Routes.VALIDATOR_DETAILS.replace(":id", index.toString()),
                                        {tab: "BN"}
                                    );
                                })}
                                onRemoveClick={(): void => {onRemoveValidator(index);}}
                                onDetailsClick={(): void =>
                                    props.history.push(Routes.VALIDATOR_DETAILS.replace(":id", index.toString()))}
                                privateKey={v.privateKey}
                            />
                        </div>;
                    })}
            </div>
            <ConfirmModal
                showModal={confirmModal}
                question={"Are you sure?"}
                description={"Validator could still be active"}
                onOKClick={onConfirmDelete}
                onCancelClick={(): void => setConfirmModal(false)}
            />
        </Background>
    );
};


interface IInjectedProps{
    // storeAuth: typeof storeAuthAction;
    notification: typeof storeNotificationAction;
    startAddingNewValidator: typeof startAddingNewValidatorAction;
    loadValidators: typeof loadValidatorsAction;
    loadAccount: typeof loadAccountAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "auth" & "network"> => ({
    auth: state.auth,
    network: state.network.selected,
    validators: state.validators,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            // storeAuth: storeAuthAction,
            notification: storeNotificationAction,
            startAddingNewValidator: startAddingNewValidatorAction,
            loadValidators: loadValidatorsAction,
            loadAccount: loadAccountAction,
        },
        dispatch
    );

export const DashboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
