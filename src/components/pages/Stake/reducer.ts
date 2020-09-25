import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { addDays } from 'date-fns';
import { BigNumber } from 'ethers/utils';
import { nowSimple } from '../../../web3/amounts';
import { Action, Actions, State, SimulatedData } from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../web3/BigDecimal';
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
        if (min) {
          const derived = min + 7 * 26;
          const unlockTime = Math.floor(
            addDays(Date.now(), derived).getTime() / 1000,
          );
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
    lockupPeriod.unlockTime > nowSimple()
  ) {
    const lockUpAmt =
      lockupAmount && lockupAmount.amount
        ? lockupAmount.amount
        : new BigDecimal(0, 18);
    // if (!lockUpAmt.amount) throw 'Error';
    const now = nowSimple();
    const length = lockupPeriod.unlockTime - now;
    const slope = lockUpAmt.exact.div(incentivisedVotingLockup.maxTime);
    const simulatedLockup: UserLockup = {
      value: lockUpAmt,
      lockTime: lockupPeriod.unlockTime,
      ts: now,
      slope,
      bias: new BigDecimal(slope.mul(new BigNumber(length)), 18),
      length,
    };
    const simulatedStakingBalance: BigDecimal = new BigDecimal(
      slope.mul(10000).mul(Math.floor(Math.sqrt(length))),
      18,
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
      amount: new BigDecimal(0, 18),
      amountPerTokenPaid: new BigDecimal(0, 18),
      rewardsPaid: new BigDecimal(0, 18),
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
