import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { addDays } from 'date-fns';
import { BigNumber } from 'ethers/utils';

import {
  IncentivisedVotingLockup,
  UserLockup,
  UserStakingReward,
} from "../../../context/DataProvider/types";

import { nowUnix } from '../../../utils/time';
import { Action, Actions, State, SimulatedData, TransactionType } from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../utils/BigDecimal';

import { getShareAndAPY } from './helpers';

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      if (state.lockupPeriod.formValue === 0 && state.transactionType !== TransactionType.IncreaseLockTime) {
        const min = state.data.incentivisedVotingLockup?.lockTimes.min;
        const max = state.data.incentivisedVotingLockup?.lockTimes.max;
        if (min && max) {
          const derived = min + 7 * 26;
          const halfyear = Math.floor(
            addDays(Date.now(), derived).getTime() / 1000,
          );
          const unlockTime = halfyear > max ? max : halfyear;
          return {
            ...state,
            data: action.payload,
            lockupPeriod: { unlockTime, formValue: derived },
          };
        }
      }
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

    case Actions.ExtendLockupDays: {
      const formValue = action.payload || 6;
      if (!state.data) return state;
      if (!state.data.incentivisedVotingLockup) return state;
      if (!state.data.incentivisedVotingLockup.userLockup) return state;

      const { data } = state;
      const { incentivisedVotingLockup } = data;
      const { userLockup } = incentivisedVotingLockup as IncentivisedVotingLockup;
      if (!userLockup) return state;

      const unlockTime = Math.floor(
        addDays(userLockup.lockTime * 1000, formValue).getTime() / 1000,
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
          amount: BigDecimal.maybeParse(action.payload),
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
        },
        touched: true,
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

    case Actions.ToggleTransactionType: {

      return {
        ...state,
        transactionType:
          state.transactionType === TransactionType.IncreaseLockAmount
            ? TransactionType.IncreaseLockTime
            : TransactionType.IncreaseLockAmount,
        // // Reset the amounts when toggling type, and remove `touched`
        // amount: undefined,
        // amountInCredits: undefined,
        // formValue: null,
        // touched: false,
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const calculate = (state: State): State => {
  const { data, lockupAmount, lockupPeriod, transactionType } = state;
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

  // Calculate simthen when you enter an amount into the thing you can just set the lockupPeriod.unlockTime to the userLockup.locktimeulated data
  let simulatedData: SimulatedData = {
    totalStaticWeight,
    totalValue,
  };


  // Calculate current APY data
  let newStakingReward = userStakingReward;
  if (userLockup && userStakingReward && userStakingBalance && userStakingBalance.simple > 0) {
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
  if (
    incentivisedVotingLockup.maxTime &&
    incentivisedVotingLockup.totalStaticWeight &&
    (transactionType === TransactionType.IncreaseLockAmount && userLockup?.lockTime) ||
    (transactionType !== TransactionType.IncreaseLockAmount && lockupPeriod.unlockTime &&
      lockupPeriod.unlockTime > nowUnix())
  ) {
    const simulatedLockupAmount =
      transactionType === TransactionType.IncreaseLockAmount ? (
        lockupAmount && lockupAmount.amount
          ? userLockup?.value.add(lockupAmount.amount)
          : new BigDecimal(0)
      ) : (
          lockupAmount && lockupAmount.amount
            ? lockupAmount.amount
            : new BigDecimal(0)
        )
    const now = nowUnix();

    const length = transactionType === TransactionType.IncreaseLockAmount ? userLockup?.lockTime as number - now : lockupPeriod.unlockTime as number - now;

    const slope = (simulatedLockupAmount as BigDecimal).exact.div(
      incentivisedVotingLockup.maxTime,
    );
    const simulatedLockup: UserLockup = {
      value: simulatedLockupAmount as BigDecimal,
      lockTime: transactionType === TransactionType.IncreaseLockAmount ? userLockup?.lockTime as number : lockupPeriod.unlockTime as number,
      ts: now,
      slope,
      bias: new BigDecimal(slope.mul(new BigNumber(length))),
      length,
      ejected: false,
    };

    const simulatedStakingBalance: BigDecimal = new BigDecimal(
      slope.mul(10000).mul(Math.floor(Math.sqrt(length))),
    );

    const simulatedTotalStaticWeight = incentivisedVotingLockup.totalStaticWeight.add(
      simulatedStakingBalance,
    );

    const simulatedApy = getShareAndAPY(
      rewardRate,
      simulatedTotalStaticWeight,
      simulatedStakingBalance,
      simulatedLockup.value,
    );

    const simulatedStakingReward: UserStakingReward = {
      amount: new BigDecimal(0),
      amountPerTokenPaid: new BigDecimal(0),
      rewardsPaid: new BigDecimal(0),
      currentAPY: simulatedApy.apy,
      poolShare: simulatedApy.share,
    };

    simulatedData = {
      totalStaticWeight: simulatedTotalStaticWeight,
      totalValue: incentivisedVotingLockup.totalValue.add(
        simulatedLockup.value,
      ),
      userLockup: simulatedLockup,
      userStakingBalance: simulatedStakingBalance,
      userStakingReward: simulatedStakingReward,
    };
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
