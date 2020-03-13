import * as React from "react";
import {useState, useEffect} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";
import {exportKeystore} from "./export";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {IRootState} from "../../reducers";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {storeNotificationAction} from "../../actions";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {V4Keystore} from "../../services/keystore";
import * as path from "path";
import {storeAuthAction, startAddingNewValidator as startAddingNewValidatorAction} from "../../actions";

type IOwnProps = Pick<RouteComponentProps, "history" | "location">;

export interface IValidator {
    name: string;
    status: string;
    publicKey: string;
    deposit: number;
    network: string;
    privateKey: string;
}


const Dashboard: React.FunctionComponent<IOwnProps & IInjectedProps & Pick<IRootState, "auth">> = (props) => {
    // TODO - temporary object, import real network object
    const networksMock: {[id: number]: string} = {
        12: "NetworkA",
        13: "NetworkB",
        32: "NetworkC"
    };

    const networks: {[id: number]: string} = {...networksMock, 0: "All networks"};

    // Component State
    const [validators, setValidators] = useState<Array<IValidator>>([]);
    const [currentNetwork, setCurrentNetwork] = useState<number>(0);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [selectedValidatorIndex, setSelectedValidatorIndex] = useState<number>(0);

    const onAddNewValidator = (): void => {
        props.startAddingNewValidator();
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    const onRemoveValidator = (index: number): void => {
        setSelectedValidatorIndex(index);
        setConfirmModal(true);
    };

    const onConfirmDelete = (): void => {
        const validatorsData = props.auth.account;
        if(validatorsData && props.auth.account){
            const validators =validatorsData.getValidators();
            const selectedValidatorPublicKey = validators[selectedValidatorIndex].publicKey.toHexString();
            const selectedV4Keystore = new V4Keystore(
                path.join(validatorsData.directory,selectedValidatorPublicKey + ".json"));
            selectedV4Keystore.destroy();
            props.auth.account.removeValidator(selectedValidatorIndex);
            props.storeAuth(props.auth.account);
        }
        loadValidators();
        setConfirmModal(false);
        props.notification({
            source: props.history.location.pathname,
            isVisible: true,
            title: "Validator removed.",
            horizontalPosition: Horizontal.RIGHT,
            verticalPosition: Vertical.BOTTOM,
            level: Level.ERROR,
            expireTime: 10
        });
    };

    const onExportValidator = (index: number): void => {
        const result = exportKeystore(validators[index]);
        // show notification only if success or error, not on cancel
        if(result) {
            props.notification({
                source: props.history.location.pathname,
                isVisible: true,
                title: result.message,
                horizontalPosition: Horizontal.RIGHT,
                verticalPosition: Vertical.BOTTOM,
                level: result.level,
                expireTime: 10
            });
        }
    };

    const loadValidators =  (): void => {
        if(props.auth && props.auth.account){
            const validators = props.auth.account.getValidators();
            const validatorArray = validators.map((v, index) => ({
                name: props.auth.account!.name,
                status: "TODO status",
                publicKey: v.publicKey.toHexString(),
                deposit: 30,
                network: `${index%2===0 ? "NetworkA" : "NetworkB"}`,
                privateKey: v.privateKey.toHexString()
            }));
            setValidators(validatorArray);
        }
    };

    useEffect(()=> {
        if (!props.auth.account) {
            return props.history.push(Routes.LOGIN_ROUTE);
        }

        loadValidators();
    },[props.auth.account && props.auth.account.numberOfValidators]);

    const topBar =
            <div className={"validator-top-bar"}>
                <div className={"validator-dropdown"}>
                    <Dropdown
                        options={networks}
                        current={currentNetwork}
                        onChange={(selected): void => setCurrentNetwork(selected)}
                    />
                </div>
                <ButtonPrimary onClick={onAddNewValidator} buttonId={"add-validator"}>
                    ADD NEW VALIDATOR
                </ButtonPrimary>
            </div>;

    return (
        <Background topBar={topBar} scrollable={true}>
            <div className={"validators-display"}>
                {validators
                    .filter(validator =>
                        validator.network === networks[currentNetwork] ||
                            currentNetwork === 0 // if all networks
                    )
                    .map((v, index) => {
                        return <div key={index} className={"validator-wrapper"}>
                            <ValidatorSimple
                                name={v.name}
                                status={v.status}
                                publicKey={v.publicKey}
                                deposit={v.deposit}
                                onRemoveClick={(): void => {onRemoveValidator(index);}}
                                onExportClick={(): void => {onExportValidator(index);}}
                                privateKey={v.privateKey}
                                nodes={props.auth.account!.getValidatorBeaconNodes(v.publicKey)}
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
    storeAuth: typeof storeAuthAction;
    notification: typeof storeNotificationAction;
    startAddingNewValidator: typeof startAddingNewValidatorAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "auth"> => ({
    auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeAuth: storeAuthAction,
            notification: storeNotificationAction,
            startAddingNewValidator: startAddingNewValidatorAction,
        },
        dispatch
    );

export const DashboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);