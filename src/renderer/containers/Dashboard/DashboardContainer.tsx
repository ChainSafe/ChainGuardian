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
import {Routes} from "../../constants/routes";
import {ConfirmModal} from "../../components/ConfirmModal/ConfirmModal";
import {IRootState} from "../../ducks/reducers";
import {createNotification} from "../../ducks/notification/actions";
import {requireAuthorization} from "../../ducks/auth/actions";
import {loadValidatorsAction, removeActiveValidator} from "../../ducks/validator/actions";
import {getAuthAccount} from "../../ducks/auth/selectors";
import {getNetworkValidators} from "../../ducks/validator/selectors";
import {getHasBeacons} from "../../ducks/beacon/selectors";

type IOwnProps = {
    network: string;
    validatorsList: string[];
} & Pick<RouteComponentProps, "history" | "location">;

type DashBoardProps = IOwnProps & IInjectedProps & IStateProps;
const Dashboard: React.FunctionComponent<DashBoardProps> = ({
    validatorsList,
    removeValidator,
    notification,
    history,
    loadValidators,
    loadAccount,
    account,
    hasBeacons,
}) => {
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [selectedValidatorIndex, setSelectedValidatorIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const onRemoveValidator = (index: number): void => {
        setSelectedValidatorIndex(index);
        setConfirmModal(true);
    };

    const onConfirmDelete = (): void => {
        const selectedValidatorPublicKey = validatorsList[selectedValidatorIndex];
        removeValidator(selectedValidatorPublicKey, selectedValidatorIndex);

        setConfirmModal(false);
        notification({
            source: history.location.pathname,
            title: "Validator removed.",
            horizontalPosition: Horizontal.RIGHT,
            verticalPosition: Vertical.BOTTOM,
            level: Level.ERROR,
        });
    };

    useEffect(() => {
        loadValidators();
        setLoading(false);
    }, [account !== null]);

    useEffect(() => {
        loadAccount();
    }, []);

    return (
        <Background topBar={<Topbar canAddValidator={hasBeacons} />} scrollable={true}>
            {validatorsList.length > 0 ? (
                <div className={"validators-display"}>
                    {validatorsList.map((publicKey, index) => {
                        return (
                            <div key={index} className={"validator-wrapper"}>
                                <Validator
                                    publicKey={publicKey}
                                    onBeaconNodeClick={() => (): void => {
                                        history.push(Routes.VALIDATOR_DETAILS.replace(":publicKey", publicKey), {
                                            tab: "BN",
                                        });
                                    }}
                                    onRemoveClick={(): void => {
                                        onRemoveValidator(index);
                                    }}
                                    onDetailsClick={(): void =>
                                        history.push(Routes.VALIDATOR_DETAILS.replace(":publicKey", publicKey))
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            ) : !loading ? (
                <EmptyValidatorsList hasBeacons={hasBeacons} />
            ) : null}

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

interface IStateProps {
    account: ReturnType<typeof getAuthAccount>;
    validatorsList: ReturnType<typeof getNetworkValidators>;
    hasBeacons: boolean;
}

interface IInjectedProps {
    notification: typeof createNotification;
    loadValidators: typeof loadValidatorsAction;
    loadAccount: typeof requireAuthorization;
    removeValidator: typeof removeActiveValidator;
}

const mapStateToProps = (state: IRootState): IStateProps => ({
    account: getAuthAccount(state),
    validatorsList: getNetworkValidators(state),
    hasBeacons: getHasBeacons(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            notification: createNotification,
            loadValidators: loadValidatorsAction,
            loadAccount: requireAuthorization,
            removeValidator: removeActiveValidator,
        },
        dispatch,
    );

export const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
