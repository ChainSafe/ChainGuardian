import * as React from "react";
import {ReactNode, useState, useEffect} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";
import {Background} from "../../components/Background/Background";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";
import {exportKeystore} from "./export";
import {Notification} from "../../components/Notification/Notification";
import {Horizontal, Level, Vertical} from "../../components/Notification/NotificationEnums";
import {CGAccount} from "../../models/account";
import database from "../../services/db/api/database";
import { DEFAULT_ACCOUNT } from "../../constants/account";
import {Loading} from "../../components/Loading/Loading";
import {connect} from "react-redux";
import {IRootState} from "../../reducers/index";
import {RouteComponentProps} from "react-router";
import {Routes} from "../../constants/routes";

// interface IDashboardProps {
//     validators: Array<IValidator>;
//     currentNetwork: number;
//     notification: INotificationState;
// }

type IOwnProps = Pick<RouteComponentProps, "history">;

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
    password: string;
}

const Dashboard: React.FunctionComponent<IOwnProps &  Pick<IRootState, "auth">> = (props) => {
    
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


    const onAddNewValidator = (): void => {
        // TODO - implement
        // eslint-disable-next-line no-console
        console.log("Add new validator");
    };

    const onRemoveValidator = (index: number): void => {
        // delete locally from array
        const v = [...validators];
        v.splice(index, 1);
        setValidators(v);
        // TODO - implement deleting keystore itself
        // eslint-disable-next-line no-console
        console.log(`Remove validator ${index}`);
    };

    const onExportValidator = (index: number): void => {
        const result = exportKeystore(validators[index]);
        // show notification only if success or error, not on cancel
        if(result) {
            setNotification({
                title: result.message,
                level: result.level,
                visible: true
            })
        }
    };

    const getValidators = async (): Promise<void> => {
        const validatorArray = [];

        const validatorsData = await database.account.get(DEFAULT_ACCOUNT);
        if(validatorsData){
            await validatorsData.unlock("!Q1q1q") /** TEMP */
            const x =validatorsData.getValidators();
            const y =validatorsData.getValidatorsAddresses();
            console.log("validators: ");
            console.log(x);
            console.log("validators addresses: ");
            console.log(y);
            console.log("hex string x[0]: " + x[0].privateKey.toHexString());
            
            for (let i = 0; i < x.length; i++) {
                validatorArray.push({
                    name: "TODO name",
                    status: "TODO status",
                    publicKey: x[i].publicKey.toHexString(),
                    deposit: 30,
                    network: `${i%2===0 ? "NetworkA" : "NetworkB"}`, /** TEMP */
                    privateKey: x[i].privateKey.toHexString(),
                    password: "!Q1q1q" /** TEMP */
                })
            }
            console.log(validatorArray)
        }
        setValidators(validatorArray);
    }

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
                                    password={v.password}
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
            </Background>
    );
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "auth"> => ({
    auth: state.auth
});


export const DashboardContainer = connect(
    mapStateToProps,
    null
)(Dashboard);

// export default class DashboardContainer extends React.Component {

//     public HiddenNotification: INotificationState = {level: Level.INFO, visible: false};

//     public state: IState = {
//         validators: [],
//         currentNetwork: 0,
//         notification: this.HiddenNotification
//     };

//     private readonly networks: {[id: number]: string};

//     public constructor(props: Readonly<{}>) {
//         super(props);

//         // TODO - temporary object, import real network object
//         const networksMock: {[id: number]: string} = {
//             12: "NetworkA",
//             13: "NetworkB",
//             32: "NetworkC"
//         };
//         // this.state.validators = this.getValidators();
//         this.networks = {...networksMock, 0: "All networks"};

//         this.getValidatorsData();
        
//     }
    
//     public render(): ReactNode {
//         const topBar =
//             <div className={"validator-top-bar"}>
//                 <div className={"validator-dropdown"}>
//                     <Dropdown
//                         options={this.networks}
//                         current={this.state.currentNetwork}
//                         onChange={(selected): void => this.setState({currentNetwork: selected})}
//                     />
//                 </div>
//                 <ButtonPrimary onClick={this.onAddNewValidator} buttonId={"add-validator"}>
//                     ADD NEW VALIDATOR
//                 </ButtonPrimary>
//             </div>;

//         return (
//             <>
//                 <Background topBar={topBar} scrollable={true}>
//                     <div className={"validators-display"}>
//                         {this.state.validators
//                             .filter(validator =>
//                                 validator.network === this.networks[this.state.currentNetwork] ||
//                                 this.state.currentNetwork === 0 // if all networks
//                             )
//                             .map((v, index) => {
//                                 return <div key={index} className={"validator-wrapper"}>
//                                     <ValidatorSimple
//                                         name={v.name}
//                                         status={v.status}
//                                         publicKey={v.publicKey}
//                                         deposit={v.deposit}
//                                         onRemoveClick={(): void => {this.onRemoveValidator(index);}}
//                                         onExportClick={(): void => {this.onExportValidator(index);}}
//                                         privateKey={v.privateKey}
//                                         password={v.password}
//                                     />
//                                 </div>;
//                             })}
//                     </div>
//                     <Notification
//                         isVisible={this.state.notification.visible}
//                         level={this.state.notification.level}
//                         title={this.state.notification.title}
//                         horizontalPosition={Horizontal.RIGHT}
//                         verticalPosition={Vertical.BOTTOM}
//                         onClose={(): void => {
//                             this.setState({notification: this.HiddenNotification});
//                         }}
//                     />
//                 </Background>
//             </>
//         );
//     }

//     private getValidatorsData = async (): Promise<Array<object>> => {
//         const validatorArray = [];

//         const validatorsData = await database.account.get(DEFAULT_ACCOUNT);
//         if(validatorsData){
//             await validatorsData.unlock("!Q1q1q") /** TEMP */
//             const x =validatorsData.getValidators();
//             const y =validatorsData.getValidatorsAddresses();
//             console.log("validators: ");
//             console.log(x);
//             console.log("validators addresses: ");
//             console.log(y);
//             console.log("hex string x[0]: " + x[0].privateKey.toHexString());
            
//             for (let i = 0; i < x.length; i++) {
//                 validatorArray.push({
//                     name: "TODO name",
//                     status: "TODO status",
//                     publicKey: x[i].publicKey.toHexString(),
//                     deposit: 30,
//                     network: `${i%2===0 ? "NetworkA" : "NetworkB"}`, /** TEMP */
//                     privateKey: x[i].privateKey.toHexString(),
//                     password: "!Q1q1q" /** TEMP */
//                 })
//             }
//             console.log(validatorArray)
//         }
//         this.state.validators = validatorArray;
//         return validatorArray;
//     }

//     private onAddNewValidator = (): void => {
//         // TODO - implement
//         // eslint-disable-next-line no-console
//         console.log("Add new validator");
//     };

//     private onRemoveValidator = (index: number): void => {
//         // delete locally from array
//         const v = [...this.state.validators];
//         v.splice(index, 1);
//         this.setState({validators: v});
//         // TODO - implement deleting keystore itself
//         // eslint-disable-next-line no-console
//         console.log(`Remove validator ${index}`);
//     };

//     private onExportValidator = (index: number): void => {
//         const result = exportKeystore(this.state.validators[index]);
//         // show notification only if success or error, not on cancel
//         if(result) {
//             this.setState({
//                 notification: {
//                     title: result.message,
//                     level: result.level,
//                     visible: true
//                 }});
//         }
//     };

//     private getValidators(): Array<IValidator> {
//         // TODO - call real validator fetch

//         return [{
//             name: "V1",
//             status: "Working",
//             publicKey: "0x32rzhcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff499",
//             deposit: 30,
//             network: "NetworkA",
//             privateKey: "0xe68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259",
//             password: "mock"
//         },{
//             name: "V2",
//             status: "Not Working",
//             publicKey: "0x22rrrcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff499",
//             deposit: 30,
//             network: "NetworkA",
//             privateKey: "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff499",
//             password: "mock"
//         },{
//             name: "V3",
//             status: "Not Working",
//             publicKey: "0x1d32a7822345564",
//             deposit: 30,
//             network: "NetworkB",
//             privateKey: "0x62dddcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff499s",
//             password: "mock"
//         }];
//     }
// }