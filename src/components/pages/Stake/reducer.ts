import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { addDays } from 'date-fns';
import { BigNumber } from 'ethers/utils';
import { nowUnix } from '../../../utils/time';
import { Action, Actions, State, SimulatedData, TransactionType } from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../utils/BigDecimal';
import {
  UserLockup,
  UserStakingReward,
} from '../../../context/DataProvider/types';
import { getShareAndAPY } from './helpers';

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      if (state.lockupPeriod.formValue === 0) {
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
  const { data, lockupAmount, lockupPeriod } = state;
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

  // Calculate simulated data
  let simulatedData: SimulatedData = {
    totalStaticWeight,
    totalValue,
  };

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
  } else if (
    incentivisedVotingLockup.maxTime &&
    incentivisedVotingLockup.totalStaticWeight &&
    lockupPeriod.unlockTime &&
    lockupPeriod.unlockTime > nowUnix()
  ) {
    const simulatedLockupAmount =
      lockupAmount && lockupAmount.amount
        ? lockupAmount.amount
        : new BigDecimal(0);

    const now = nowUnix();

    const length = lockupPeriod.unlockTime - now;

    const slope = simulatedLockupAmount.exact.div(
      incentivisedVotingLockup.maxTime,
    );

    const simulatedLockup: UserLockup = {
      value: simulatedLockupAmount,
      lockTime: lockupPeriod.unlockTime,
      ts: now,
      slope,
      bias: new BigDecimal(slope.mul(new BigNumber(length))),
      length,
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
