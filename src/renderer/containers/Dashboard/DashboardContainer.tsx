import * as React from "react";
import {ReactNode} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";

interface IState {
    validators: Array<IValidator>;
    currentNetwork: number;
}

interface IValidator {
    name: string;
    status: string;
    publicKey: string;
    deposit: number;
}

export default class DashboardContainer extends React.Component {

    public state: IState = {
        validators: [],
        currentNetwork: 0
    };

    private readonly networks: Array<string>;

    public constructor(props: Readonly<{}>) {
        super(props);
        this.state.validators = this.getValidators();
        this.networks = this.getNetworks();
    }

    public render(): ReactNode {
        const topBar =
            <div className={"validator-top-bar"}>
                <div className={"validator-dropdown"}>
                    <Dropdown
                        options={this.networks}
                        current={this.state.currentNetwork}
                        onChange={this.onChangeNetwork}
                    />
                </div>
                <ButtonPrimary onClick={this.onAddNewValidator} buttonId={"add-validator"}>
                    ADD NEW VALIDATOR
                </ButtonPrimary>
            </div>;

        return (
            <>
                <Background topBar={topBar}>
                    <div className={"validators-display"}>
                        {this.state.validators.map((v, index) => {
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
                </Background>
            </>
        );
    }

    private onChangeNetwork = (selected: number): void => {
        this.setState({currentNetwork: selected});
        // TODO - set new network
        // eslint-disable-next-line no-console
        console.log(`New network selected: ${this.networks[selected]}`);
    };

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
        // TODO - implement
        // eslint-disable-next-line no-console
        console.log(`Export validator ${index}`);
    };

    private getValidators(): Array<IValidator> {
        // TODO - call real validator fetch
        return [{
            name: "V1",
            status: "Working",
            publicKey: "0x1233567822345564",
            deposit: 30
        },{
            name: "V2",
            status: "Not Working",
            publicKey: "0x1233567822345564",
            deposit: 30
        },{
            name: "V3",
            status: "Not Working",
            publicKey: "0x1d32a7822345564",
            deposit: 30
        }];
    }

    private getNetworks(): Array<string> {
        // TODO - call real networks fetch
        return ["All networks", "NetworkA", "NetworkB", "NetworkC"];
    }
}