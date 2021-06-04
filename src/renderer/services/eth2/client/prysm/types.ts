/* eslint-disable camelcase */

export type Assignments = {
    epoch: string;
    assignments: {
        beacon_committees: string[];
        committee_index: string;
        attester_slot: string;
        proposer_slots: string[];
        public_key: string;
        validator_index: string;
    }[];
    next_page_token: string;
    total_size: number;
};

export type Duty = {
    committee: string[];
    committee_index: string;
    attester_slot: string;
    proposer_slots: string[];
    public_key: string;
    validator_index: string;
    status: string;
};

export type DutiesResponse = {
    current_epoch_duties: Duty[];
    next_epoch_duties: Duty[];
};

export type ValidatorStatusResponse = {
    public_key: string;
    withdrawal_credentials: string;
    effective_balance: string;
    slashed: boolean;
    activation_eligibility_epoch: string;
    activation_epoch: string;
    exit_epoch: string;
    withdrawable_epoch: string;
};

export type ValidatorStateResponse = {
    status: string;
    eth1_deposit_block_number: string;
    deposit_inclusion_slot: string;
    activation_epoch: string;
    position_in_activation_queue: string;
};
