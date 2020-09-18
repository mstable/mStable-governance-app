import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { Action, Actions, State } from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../web3/BigDecimal';

const reduce: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case Actions.Data:
            return {
                ...state,
                data: action.payload
            };
        case Actions.SetVoteAmount:
            return { ...state, amount: BigDecimal.maybeParse(action.payload, 18), formValue: action.payload, touched: true, };

        case Actions.SetLockUpPeriod: {
            return { ...state, lockUpPeriod: action.payload, touched: true };
        }

        default:
            throw new Error('Unhandled action type');
    }
};

export const reducer: Reducer<State, Action> = pipeline(reduce, validate);
