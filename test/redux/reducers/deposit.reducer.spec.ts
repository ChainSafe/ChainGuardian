import {depositReducer as reducer, IDepositState} from "../../../src/renderer/reducers/deposit";
import {
    setDepositGenerated, 
    setDepositVisible, 
    setDepositTransactionData
} from "../../../src/renderer/actions";
import {Action} from "redux";
import {DepositActionTypes} from "../../../src/renderer/constants/action-types";

const initalState: IDepositState = {
    isDepositGenerated: false,
    isDepositVisible: false,
    txData: ""
};

describe("deposit reducer", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {} as Action<DepositActionTypes>)).toEqual(
            initalState
        );
    });
    
    it("should handle setDepositGenerated", () => {
        expect(
            reducer({} as IDepositState, setDepositGenerated(true))
        ).toEqual(
            {
                isDepositGenerated: true
            }
        );
    });

    it("should handle setDepositVisible", () => {
        expect(
            reducer({} as IDepositState, setDepositVisible(true))
        ).toEqual(
            {
                isDepositVisible: true
            }
        );
    });

    it("should handle setDepositTransactionData", () => {
        expect(
            reducer({} as IDepositState, setDepositTransactionData("mock"))
        ).toEqual(
            {
                txData: "mock"
            }
        );
    });
    
});