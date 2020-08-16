import {depositReducer as reducer, IDepositState} from "../../../../src/renderer/reducers/deposit";
import {DepositAction, setDepositDetected, setDepositTransactionData} from "../../../../src/renderer/actions";

const initalState: IDepositState = {
    isDepositDetected: false,
    depositTxData: "",
    waitingForDeposit: false
};

describe("deposit reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as DepositAction)).toEqual(
            initalState
        );
    });


    it("should handle setDepositVisible", () => {
        expect(
            reducer({} as IDepositState, setDepositDetected())
        ).toEqual(
            {
                isDepositDetected: true,
                waitingForDeposit: false
            }
        );
    });

    it("should handle setDepositTransactionData", () => {
        expect(
            reducer({} as IDepositState, setDepositTransactionData("mock"))
        ).toEqual(
            {
                depositTxData: "mock"
            }
        );
    });

});
