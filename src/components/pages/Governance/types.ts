import { BigDecimal } from "../../../web3/BigDecimal";
import { SubscribedToken } from "../../../types";

export interface State {
    amount?: BigDecimal;
    lockUpPeriod: number;
    error?: string;
    formValue?: string | null;
    touched?: boolean;
    valid?: boolean;
    data?: {
        metaToken: SubscribedToken
    }
}

export enum Reasons {
    FetchingData = 'Failed to fetch data',
    AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
    AmountMustBeSet = 'Amount must be set',
    PeriodMustBeMoreThanDay = 'Lock period must be more than a day',
    AmountMustNotExceedBalance = 'Amount must not exceed balance'
}

export interface Dispatch {
    setVoteAmount(formValue: string): void;
    setLockUpPeriod(inputValue: number): void;
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
        };
    }
    | { type: Actions.SetVoteAmount; payload: string }
    | { type: Actions.SetLockUpPeriod; payload: number }