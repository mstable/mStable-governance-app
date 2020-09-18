import { BigDecimal } from "../../../web3/BigDecimal";
import { SubscribedToken } from "../../../types";
import { IncentivisedVotingLockup } from "../../../context/DataProvider/types";

export enum TransactionType {
    Withdraw,
    Claim,
    Eject,
    CreateLock,
    IncreaseLockAmount,
    IncreaseLockTime
}

export interface State {
    amount?: BigDecimal;
    transactionType?: TransactionType;
    lockUpPeriod: number;
    error?: string;
    formValue: string | null;
    touched?: boolean;
    valid: boolean;
    data: {
        metaToken?: SubscribedToken,
        incentivisedVotingLockup?: IncentivisedVotingLockup
    }
}

export enum Reasons {
    FetchingData = 'Failed to fetch data',
    AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
    AmountMustBeSet = 'Amount must be set',
    PeriodMustBeSet = 'Lock up period must be set',
    AmountMustNotExceedBalance = 'Amount must not exceed balance',
}

export interface Dispatch {
    setVoteAmount(formValue: string): void;
    setLockUpPeriod(lockUpPeriod: number): void;
}

export enum Actions {
    Data,
    SetVoteAmount,
    SetLockUpPeriod
}

export type Action =
    {
        type: Actions.Data;
        payload: {
            metaToken: SubscribedToken | undefined;
            incentivisedVotingLockups: {};
        };
    }
    | { type: Actions.SetVoteAmount; payload: string }
    | { type: Actions.SetLockUpPeriod; payload: number }