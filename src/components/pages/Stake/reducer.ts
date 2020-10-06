import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { addDays, getDayOfYear } from 'date-fns';
import { BigNumber } from 'ethers/utils';
import { ONE_DAY } from '../../../utils/constants';

import {
  UserLockup,
  UserStakingReward,
} from '../../../context/DataProvider/types';

import { nowUnix, toUnix } from '../../../utils/time';
import {
  Action,
  Actions,
  SimulatedData,
  State,
  TransactionType,
} from './types';
import { validate } from './validation';
import { BigDecimal } from '../../../utils/BigDecimal';
import { getShareAndAPY } from './helpers';

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data: {
      // Set a default value for `lockupPeriod`
      if (
        !state.touched &&
        state.transactionType !== TransactionType.IncreaseLockTime &&
        action.payload.incentivisedVotingLockup
      ) {
        const { lockTimes, end } = action.payload.incentivisedVotingLockup;
        const medianDays = lockTimes.min + 7 * 26;
        const medianTime = toUnix(addDays(Date.now(), medianDays));
        const unlockTime = Math.min(medianTime, end.toNumber());
        const formValue = getDayOfYear(unlockTime);
        return {
          ...state,
          data: action.payload,
          lockupPeriod: {
            unlockTime,
            formValue,
          },
        };
      }

      return {
        ...state,
        data: action.payload,
      };
    }

    case Actions.SetLockupDays: {
      const formValue = action.payload;
      const unlockTime = toUnix(addDays(Date.now(), formValue));
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
      const transactionType = action.payload;
      const userLockup = state.data.incentivisedVotingLockup?.userLockup;

      let lockupAmount: State['lockupAmount'] = {
        formValue: null,
        amount: undefined,
      };

      const userLockupPeriod = parseFloat(
        (
          (state.data.incentivisedVotingLockup?.userLockup?.length as number) /
          ONE_DAY.toNumber()
        ).toFixed(1),
      );

      if (transactionType === TransactionType.IncreaseLockTime) {
        if (!userLockup) return state;

        lockupAmount = {
          formValue: userLockup.value.format(2, false),
          amount: userLockup.value,
        };
      }

      return {
        ...state,
        transactionType,
        lockupAmount,
        lockupPeriod: {
          formValue: userLockupPeriod,
          unlockTime: state.data.incentivisedVotingLockup?.userLockup?.lockTime,
        },
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
      const { data } = state;
      if (!data.incentivisedVotingLockup) return state;

      const maxDays = data.incentivisedVotingLockup.lockTimes.max;
      const unlockTime = toUnix(addDays(new Date(), maxDays));

      return {
        ...state,
        lockupPeriod: { unlockTime, formValue: maxDays },
        touched: true,
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

  // Calculate simulated data
  let simulatedData: SimulatedData = {
    totalStaticWeight,
    totalValue,
  };

  // Calculate current APY data
  let newStakingReward = userStakingReward;
  if (
    userLockup &&
    userStakingReward &&
    userStakingBalance &&
    userStakingBalance.simple > 0
  ) {
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

  const simulatedLockTime =
    transactionType === TransactionType.IncreaseLockAmount
      ? userLockup?.lockTime
      : lockupPeriod.unlockTime;

  if (
    incentivisedVotingLockup.maxTime &&
    incentivisedVotingLockup.totalStaticWeight &&
    simulatedLockTime &&
    simulatedLockTime > 60 * 60 * 24 // Sanity check because of division
  ) {
    const lockupAmountBase = lockupAmount?.amount ?? new BigDecimal(0);

    // The simulated amount should be in addition to the base amount when
    // increasing the lock amount
    const simulatedLockupAmount =
      transactionType === TransactionType.IncreaseLockAmount
        ? lockupAmountBase.add(userLockup?.value ?? new BigDecimal(0))
        : lockupAmountBase;

    const now = nowUnix();

    const length = simulatedLockTime - now;

    const slope = simulatedLockupAmount.exact.div(
      incentivisedVotingLockup.maxTime,
    );

    const simulatedLockup: UserLockup = {
      value: simulatedLockupAmount,
      lockTime: simulatedLockTime,
      ts: now,
      slope,
      bias: new BigDecimal(slope.mul(new BigNumber(length))),
      length,
      ejected: false,
    };

    const simulatedStakingBalance = new BigDecimal(
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
