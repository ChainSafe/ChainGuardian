import * as React from "react";
import {useState, useEffect} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {EmptyValidatorsList} from "../../components/EmptyValidatorsList/EmptyValidatorsListx";

import {Topbar} from "../../components/Topbar/Topbar";
import {Validator} from "../Validator/Validator";
import {Background} from "../../components/Background/Background";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {IRootState} from "../../reducers";
import {
    loadAccountAction,
    loadValidatorsAction, removeValidatorAction,
    storeNotificationAction
} from "../../actions";
import {Routes} from "../../constants/routes";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";

type IOwnProps = {
    network: string;
} & Pick<RouteComponentProps, "history" | "location">;

type DashBoardProps = IOwnProps & IInjectedProps & Pick<IRootState, "auth" | "validators">;
const Dashboard: React.FunctionComponent<DashBoardProps> = (props) => {
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [selectedValidatorIndex, setSelectedValidatorIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentValidatorsList, setCurrentValidatorsList] = useState([]);
    const validators = Object.values(props.validators);

    const onRemoveValidator = (index: number): void => {
        setSelectedValidatorIndex(index);
        setConfirmModal(true);
    };

    const onConfirmDelete = (): void => {
        const selectedValidatorPublicKey = validators[selectedValidatorIndex].publicKey;
        props.removeValidator(selectedValidatorPublicKey, selectedValidatorIndex);

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
    },[props.auth.account !== null]);

    useEffect(()=> {
        props.loadAccount();
    },[]);

    useEffect(() => {
        setLoading(true);
        setCurrentValidatorsList(validators.filter(validator =>
            // Filter validators by network or 'All
            validator.network === props.network || !props.network
        ));
        setLoading(false);
    }, [props.validators, props.network]);

    return (
        <Background
            topBar={<Topbar />}
            scrollable={true}
        >
            {currentValidatorsList.length > 0 ?
                <div className={"validators-display"}>
                    {currentValidatorsList.map((v, index) => {
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
                            />
                        </div>;
                    })}
                </div>
                : !loading ? <EmptyValidatorsList /> : null}

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
    notification: typeof storeNotificationAction;
    loadValidators: typeof loadValidatorsAction;
    loadAccount: typeof loadAccountAction;
    removeValidator: typeof removeValidatorAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "auth" & "network"> => ({
    auth: state.auth,
    network: state.network.selected,
    validators: state.validators,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            notification: storeNotificationAction,
            loadValidators: loadValidatorsAction,
            loadAccount: loadAccountAction,
            removeValidator: removeValidatorAction,
        },
        dispatch
    );

export const DashboardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
