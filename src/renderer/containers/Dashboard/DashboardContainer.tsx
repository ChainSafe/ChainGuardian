import * as React from "react";
import {useState, useEffect} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";
import {exportKeystore} from "./export";
import {Notification} from "../../components/Notification/Notification";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {connect} from "react-redux";
import {IRootState} from "../../reducers/index";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {storeNotificationAction} from "../../actions/notification";
import {Routes, OnBoardingRoutes} from "../../constants/routes";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {V4Keystore} from "../../services/keystore";
import * as path from "path";

type IOwnProps = Pick<RouteComponentProps, "history" | "location">;

interface INotificationState {
    title?: string;
    level: Level;
    visible: boolean;
}

export interface IValidator {
    name: string;
    status: string;
    publicKey: string;
    deposit: number;
    network: string;
    privateKey: string;
}

const Dashboard: React.FunctionComponent<IOwnProps & IInjectedProps &  Pick<IRootState, "auth">> = (props) => {
    
    // TODO - temporary object, import real network object
    const networksMock: {[id: number]: string} = {
        12: "NetworkA",
        13: "NetworkB",
        32: "NetworkC"
    };

    const networks: {[id: number]: string} = {...networksMock, 0: "All networks"};
    const HiddenNotification: INotificationState = {level: Level.INFO, visible: false};

    // Component State
    const [validators, setValidators] = useState<Array<IValidator>>([]);
    const [currentNetwork, setCurrentNetwork] = useState<number>(0);
    const [notification, setNotification] = useState<INotificationState>(HiddenNotification);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [selectedValidatorIndex, setSelectedValidatorIndex] = useState<number>(0);

    const onAddNewValidator = (): void => {
        
        props.history.push({
            pathname: Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING),
            state: {isRegisterFlow: true}
        });
    };

    const onRemoveValidator = (index: number): void => {
        setSelectedValidatorIndex(index);
        setConfirmModal(true);
    };

    const onConfirmDelete = async (): Promise<void> => {
        const validatorsData = props.auth.auth;
        if(validatorsData){
            const validators =validatorsData.getValidators();
            const selectedValidatorPublicKey = validators[selectedValidatorIndex].publicKey.toHexString();
            const selectedV4Keystore = new V4Keystore(
                path.join(validatorsData.directory,selectedValidatorPublicKey + ".json"));
            selectedV4Keystore.destroy();
        }
        setValidators(validators.splice(selectedValidatorIndex, 1));
        setConfirmModal(false);
        setNotification({
            title: "Validator deleted!",
            level: Level.ERROR,
            visible: true
        });
    };

    const onExportValidator = (index: number): void => {
        const result = exportKeystore(validators[index]);
        // show notification only if success or error, not on cancel
        if(result) {
            setNotification({
                title: result.message,
                level: result.level,
                visible: true
            });
        }
    };

    const getValidators =  (): void => {
        const validatorArray: Array<IValidator> = [];
        const validatorsData = props.auth.auth;
        
        if(validatorsData){
            const validators =validatorsData.getValidators();
            validators.map((v, index)=>{
                validatorArray.push({
                    name: validatorsData.name,
                    status: "TODO status",
                    publicKey: v.publicKey.toHexString(),
                    deposit: 30,
                    network: `${index%2===0 ? "NetworkA" : "NetworkB"}`,
                    privateKey: v.privateKey.toHexString(),
                });
            });
        }

        setValidators(validatorArray);
    };

    useEffect(()=>{
        if(!props.auth.auth) props.history.push(Routes.LOGIN_ROUTE);
        getValidators();
    },[]);

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
                            />
                        </div>;
                    })}
            </div>
            <Notification
                isVisible={notification.visible}
                level={notification.level}
                title={notification.title}
                horizontalPosition={Horizontal.RIGHT}
                verticalPosition={Vertical.BOTTOM}
                onClose={(): void => {
                    setNotification(HiddenNotification);
                }}
            />
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

interface IInjectedProps {
    notification: typeof storeNotificationAction
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "auth"> => ({
    auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            notification: storeNotificationAction,
        },
        dispatch
    );

export const DashboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);