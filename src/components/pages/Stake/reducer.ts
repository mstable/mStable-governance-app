import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { addDays } from 'date-fns';
import { nowSimple } from '../../../web3/amounts';
import { Action, Actions, State, SimulatedData } from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../web3/BigDecimal';
import { getShareAndAPY } from './helpers';

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return {
        ...state,
        data: action.payload,
      };

    case Actions.SetLockupDays: {
      const formValue = action.payload;
      const unlockTime = Math.floor(
        addDays(Date.now(), formValue).getTime() / 1000,
      );
      return {
        ...state,
        lockupPeriod: { unlockTime, formValue },
        touched: true,
      };
    }

    case Actions.SetLockupAmount:
      return {
        ...state,
        lockupAmount: {
          amount: BigDecimal.maybeParse(action.payload, 18),
          formValue: action.payload,
        },
        touched: true,
      };

    case Actions.SetTransactionType: {
      return {
        ...state,
        transactionType: action.payload,
        lockupAmount: { formValue: null, amount: undefined },
        lockupPeriod: { formValue: 0, unlockTime: undefined },
        touched: false,
      };
    }

    case Actions.SetMaxLockupAmount: {
      if (!state.data) return state;

      const { data } = state;

      if (!data.metaToken) return state;

      return {
        ...state,
        lockupAmount: {
          amount: data.metaToken?.balance,
          formValue: data.metaToken?.balance.format(
            data.metaToken?.balance.decimals,
            false,
          ),
          touched: true,
        },
      };
    }

    case Actions.SetMaxLockupDays: {
      const formValue = action.payload;
      const unlockTime = Math.floor(
        addDays(Date.now(), formValue).getTime() / 1000,
      );
      return {
        ...state,
        lockupPeriod: { unlockTime, formValue },
        touched: true,
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const calculate = (state: State): State => {
  const { data, lockupAmount, lockupPeriod, touched } = state;
  const { incentivisedVotingLockup } = data;
  if (!incentivisedVotingLockup) {
    return state;
  }
  const {
    userStakingBalance,
    userStakingReward,
    userLockup,
    rewardRate,
    totalStaticWeight,
    totalValue,
  } = incentivisedVotingLockup;

  if (!rewardRate || !totalStaticWeight) {
    return state;
  }

  // Calculate current APY data
  let newStakingReward = userStakingReward;
  if (userLockup && userStakingReward && userStakingBalance) {
    const apy = getShareAndAPY(
      rewardRate,
      totalStaticWeight,
      userStakingBalance,
      userLockup.value,
    );
    newStakingReward = {
      ...userStakingReward,
      currentAPY: apy.apy,
      poolShare: apy.share,
    };
  }

  // Calculate simulated data
  const simulatedData: SimulatedData = {
    totalStaticWeight,
    totalValue,
  };
  if (
    touched &&
    lockupAmount.amount &&
    lockupAmount.amount.simple > 0 &&
    lockupPeriod.unlockTime &&
    lockupPeriod.unlockTime > nowSimple()
  ) {
    // totalStaticWeight: BigDecimal;
    // totalValue: BigDecimal;
    // userLockup?: UserLockup;
    // userStakingBalance?: BigDecimal;
    // userStakingReward?: UserStakingReward;
    // const staticWeight =
  }
  return {
    ...state,
    data: {
      ...data,
      simulatedData,
      incentivisedVotingLockup: {
        ...incentivisedVotingLockup,
        userStakingReward: newStakingReward,
      },
    },
  };
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  validate,
  calculate,
);
