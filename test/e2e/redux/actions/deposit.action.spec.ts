import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {generateDepositAction, setDepositDetected, setDepositTransactionData} from "../../../../src/renderer/actions";
import {IRootState} from "../../../../src/renderer/reducers";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {IDepositState} from "../../../../src/renderer/reducers/deposit";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {IValidatorState} from "../../../../src/renderer/reducers/validators";
import {DepositTx, generateDeposit} from "../../../../src/renderer/services/deposit";
import {INetworkConfig} from "../../../../src/renderer/services/interfaces";
import {ethers} from "ethers";
import {IAuthState} from "../../../../src/renderer/reducers/auth";
import {INotificationStateObject} from "../../../../src/renderer/reducers/notification";
import {initBLS} from "@chainsafe/bls";
import {INetworkState} from "../../../../src/renderer/reducers/network";
import {fromHex, toHex} from "@chainsafe/lodestar-utils";

const privateKeyStr = "0x6e4a0f1fabccb26b99fbac820be46c29ff5d294544282ad133c5463f2aa5f885";
const publicKeyStr =
    "0xb344b69e942792b305fe5e00ffa8f14ee171ac7c4e84b368b7df431f1afcafb7fb029ad7570245263d2d8f9d33aba50b";

const initialState: IRootState = {
    register: {
        signingKey: privateKeyStr,
        withdrawalKey: publicKeyStr
    } as IRegisterState,
    deposit: {} as IDepositState,
    auth: {} as IAuthState,
    notificationArray: {} as INotificationStateObject,
    network: {} as INetworkState,
    validators: {} as IValidatorState,
};


describe("deposit actions", () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const reduxStore = mockStore(initialState);

    beforeAll(async() => {
        await initBLS();
    });

    beforeEach(() => {
        reduxStore.clearActions();
    });


    it("should dispatch deposit tx data action", () => {
        const expectedActions = [
            setDepositTransactionData("mock")
        ];
        reduxStore.dispatch<any>(setDepositTransactionData("mock"));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

    it("should dispatch generate deposit action", () => {
        const networkConfig: INetworkConfig = {
            eth2Config: config,
            networkId: 0,
            networkName: "Test",
            eth1Provider: ethers.getDefaultProvider(),
            contract: {
                address: "0x0",
                bytecode: "",
                depositAmount: 32,
                deployedAtBlock: 0
            },
            dockerConfig: {
                name: "DepositActionTest",
                image: "not-important",
            }
        };

        const keyPair = new Keypair(PrivateKey.fromHexString(privateKeyStr));
        // Call deposit service and dispatch action
        const depositData = generateDeposit(
            keyPair,
            fromHex(publicKeyStr),
            networkConfig.contract.depositAmount,
            networkConfig.eth2Config,
        );
        const depositTx = DepositTx.generateDepositTx(
            depositData,
            networkConfig.contract.address,
            networkConfig.eth2Config,
            networkConfig.contract.depositAmount);
        const txData = toHex(depositTx.data as Buffer);

        const expectedActions = [
            setDepositTransactionData(txData)
        ];

        reduxStore.dispatch<any>(generateDepositAction(networkConfig));

        expect(reduxStore.getActions()).toEqual(expectedActions);
    });

    it("should dispatch visible action", () => {
        const expectedActions = [
            setDepositDetected()
        ];
        reduxStore.dispatch<any>(setDepositDetected());

        expect(reduxStore.getActions()).toEqual(expectedActions);

    });
});
