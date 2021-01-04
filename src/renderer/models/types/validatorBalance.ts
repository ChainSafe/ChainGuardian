import {ContainerType, BigIntUintType, ListType} from "@chainsafe/ssz";
import {IValidatorBalance, ValidatorBalances} from "../validatorBalances";

const MILLION = 1000000;

export const ValidatorBalanceType = new ContainerType<IValidatorBalance>({
    fields: {
        balance: new BigIntUintType({byteLength: 8}),
        epoch: new BigIntUintType({byteLength: 8}),
    },
});

export const ValidatorBalancesType = new ContainerType<ValidatorBalances>({
    fields: {
        records: new ListType({elementType: ValidatorBalanceType, limit: MILLION}),
    },
});
