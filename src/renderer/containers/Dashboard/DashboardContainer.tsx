import * as React from "react";
import {ReactNode} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";
import {exportKeystore} from "./export";
import {Notification} from "../../components/Notification/Notification";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";

interface IState {
    validators: Array<IValidator>;
    currentNetwork: number;
    notification: INotificationState;
}

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
}

export default class DashboardContainer extends React.Component {

    public HiddenNotification: INotificationState = {level: Level.INFO, visible: false};

    public state: IState = {
        validators: [],
        currentNetwork: 0,
        notification: this.HiddenNotification
    };

    private readonly networks: {[id: number]: string};

    public constructor(props: Readonly<{}>) {
        super(props);

        // TODO - temporary object, import real network object
        const networksMock: {[id: number]: string} = {
            12: "NetworkA",
            13: "NetworkB",
            32: "NetworkC"
        };

        this.state.validators = this.getValidators();
        this.networks = {...networksMock, 0: "All networks"};
    }

    public render(): ReactNode {
        const topBar =
            <div className={"validator-top-bar"}>
                <div className={"validator-dropdown"}>
                    <Dropdown
                        options={this.networks}
                        current={this.state.currentNetwork}
                        onChange={(selected): void => this.setState({currentNetwork: selected})}
                    />
                </div>
                <ButtonPrimary onClick={this.onAddNewValidator} buttonId={"add-validator"}>
                    ADD NEW VALIDATOR
                </ButtonPrimary>
            </div>;

        return (
            <>
                <Background topBar={topBar} scrollable={true}>
                    <div className={"validators-display"}>
                        {this.state.validators
                            .filter(validator =>
                                validator.network === this.networks[this.state.currentNetwork] ||
                                this.state.currentNetwork === 0 // if all networks
                            )
                            .map((v, index) => {
                                return <div key={index} className={"validator-wrapper"}>
                                    <ValidatorSimple
                                        name={v.name}
                                        status={v.status}
                                        publicKey={v.publicKey}
                                        deposit={v.deposit}
                                        onRemoveClick={(): void => {this.onRemoveValidator(index);}}
                                        onExportClick={(): void => {this.onExportValidator(index);}}
                                    />
                                </div>;
                            })}
                    </div>
                    <Notification
                        isVisible={this.state.notification.visible}
                        level={this.state.notification.level}
                        title={this.state.notification.title}
                        horizontalPosition={Horizontal.RIGHT}
                        verticalPosition={Vertical.BOTTOM}
                        onClose={(): void => {
                            this.setState({notification: this.HiddenNotification});
                        }}
                    />
                </Background>
            </>
        );
    }

    private onAddNewValidator = (): void => {
        // TODO - implement
        // eslint-disable-next-line no-console
        console.log("Add new validator");
    };

    private onRemoveValidator = (index: number): void => {
        // delete locally from array
        const v = [...this.state.validators];
        v.splice(index, 1);
        this.setState({validators: v});
        // TODO - implement deleting keystore itself
        // eslint-disable-next-line no-console
        console.log(`Remove validator ${index}`);
    };

    private onExportValidator = (index: number): void => {
        const result = exportKeystore(this.state.validators[index]);
        // show notification only if success or error, not on cancel
        if(result) {
            this.setState({
                notification: {
                    title: result.message,
                    level: result.level,
                    visible: true
                }});
        }
    };

    private getValidators(): Array<IValidator> {
        // TODO - call real validator fetch
        return [{
            name: "V1",
            status: "Working",
            publicKey: "0x1233567822345564",
            deposit: 30,
            network: "NetworkA"
        },{
            name: "V2",
            status: "Not Working",
            publicKey: "0x1233567822345564",
            deposit: 30,
            network: "NetworkA"
        },{
            name: "V3",
            status: "Not Working",
            publicKey: "0x1d32a7822345564",
            deposit: 30,
            network: "NetworkB"
        }];
    }
}