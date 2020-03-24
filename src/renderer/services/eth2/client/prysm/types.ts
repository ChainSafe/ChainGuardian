/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface PrysmValidatorDutiesResponse {
    duties: PrysmValidatorDuty[];
}

export interface PrysmValidatorDuty {
    committee: string[];
    committeeIndex: string;
    attesterSlot: string;
    proposerSlot: string;
    publicKey: string;
    status: PrysmValidatorStatus,
    validatorIndex: string;
}

export interface PrysmValidator {
    publicKey: string;
    withdrawalCredentials: string,
    effectiveBalance: string,
    slashed: boolean,
    activationEligibilityEpoch: string,
    activationEpoch: string,
    exitEpoch: string,
    withdrawableEpoch: string
}

export interface PrysmAttestationData {
    "slot": "string";
    "committeeIndex": "string";
    "beaconBlockRoot": "string";
    "source": {
        "epoch": "string";
        "root": "string";
    };
    "target": {
        "epoch": "string";
        "root": "string"
    }
}

export enum PrysmValidatorStatus {
    UNKNOWN_STATUS = "UNKNOWN_STATUS",
    DEPOSITED = "DEPOSITED",
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    EXITING = "EXITING",
    SLASHING = "SLASHING",
    EXITED = "EXITED"
}

export type PrysmChainHeadResponse = {
    headSlot: string,
    headEpoch: string,
    headBlockRoot: string,
    finalizedSlot: string,
    finalizedEpoch: string,
    finalizedBlockRoot: string,
    justifiedSlot: string,
    justifiedEpoch: string,
    justifiedBlockRoot: string,
    previousJustifiedSlot: string,
    previousJustifiedEpoch: string,
    previousJustifiedBlockRoot: string
};

export type PrysmChainHeadStreamResponse = {
    result: PrysmChainHeadResponse,
    error: {
        httpStatus: string;
        message: string;
    }
};
