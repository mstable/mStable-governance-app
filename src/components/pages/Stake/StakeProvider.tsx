import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import useInterval from 'react-use/lib/useInterval';

import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { useIncentivisedVotingLockup } from '../../../context/DataProvider/DataProvider';
import {
  Actions,
  Dispatch,
  State,
  TransactionType,
  RewardsEarned,
} from './types';
import { SCALE } from '../../../utils/constants';
import { BigDecimal } from '../../../utils/BigDecimal';
import { reducer } from './reducer';
import { IIncentivisedVotingLockupFactory } from '../../../typechain/IIncentivisedVotingLockupFactory';
import { useSignerContext } from '../../../context/SignerProvider';
import { IIncentivisedVotingLockup } from '../../../typechain/IIncentivisedVotingLockup.d';

const initialState: State = {
  data: {},
  lockupAmount: {
    formValue: null,
  },
  lockupPeriod: {
    formValue: 0,
  },
  touched: false,
  transactionType: TransactionType.CreateLock,
  valid: false,
};

const dispatchCtx = createContext<Dispatch>({} as never);

const stateCtx = createContext<State>({} as never);

const contractCtx = createContext<IIncentivisedVotingLockup | undefined>(
  undefined,
);
const rewardsEarnedCtx = createContext<RewardsEarned>({});

export const useStakeState = (): State => useContext(stateCtx);

export const useStakeData = (): State['data'] => {
  const { data } = useStakeState();
  return data;
};

export const useStakeDispatch = (): Dispatch => useContext(dispatchCtx);

export const useStakeContract = (): IIncentivisedVotingLockup | undefined =>
  useContext(contractCtx);

export const useRewardsEarned = (): RewardsEarned =>
  useContext(rewardsEarnedCtx);

const StakeContractProvider: FC = ({ children }) => {
  const { address } = useIncentivisedVotingLockup() ?? {};
  const signer = useSignerContext();

  const contract = useMemo(
    () =>
      address && signer
        ? IIncentivisedVotingLockupFactory.connect(address, signer)
        : undefined,
    [address, signer],
  );

  return (
    <contractCtx.Provider value={contract}>{children}</contractCtx.Provider>
  );
};

const useRewardsEarnedInterval = (): RewardsEarned => {
  const [value, setValue] = useState<
    ReturnType<typeof useRewardsEarnedInterval>
  >({});
  const incentivisedVotingLockup = useIncentivisedVotingLockup();
  // const rewardsToken = useToken(incentivisedVotingLockup?.stakingToken.address);
  // const platformToken = useCurrentPlatformToken();

  useInterval(() => {
    if (!incentivisedVotingLockup) {
      return setValue({});
    }

    const {
      lastUpdateTime,
      periodFinish,
      rewardPerTokenStored,
      rewardRate,
      userStakingBalance,
      userStakingReward,
      totalStaticWeight: { exact: totalTokens },
    } = incentivisedVotingLockup;

    if (totalTokens.eq(0) || !userStakingReward || !userStakingBalance) {
      // If there is no StakingToken liquidity, avoid div(0)
      return { rewardPerTokenStored };
    }

    const lastTimeRewardApplicable = Math.min(
      periodFinish,
      Math.floor(Date.now() / 1e3),
    );

    const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime;

    // New reward units to distribute = rewardRate * timeSinceLastUpdate
    const rewardUnitsToDistribute = rewardRate.exact.mul(timeSinceLastUpdate);

    // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
    const unitsToDistributePerToken = new BigDecimal(
      rewardUnitsToDistribute.mul(SCALE).div(totalTokens),
      18,
    );

    const rewardPerTokenStoredNow = rewardPerTokenStored.add(
      unitsToDistributePerToken,
    );

    // Current rate per token - rate user previously received
    const userRewardDelta = rewardPerTokenStoredNow.sub(
      userStakingReward.amountPerTokenPaid,
    );

    // New reward = staked tokens * difference in rate
    const userNewReward = userStakingBalance.mulTruncate(userRewardDelta.exact);

    // Add to previous rewards
    const summedRewards = userStakingReward.amount.add(userNewReward);

    return setValue({
      rewards: summedRewards,
    });
  }, 1e3);

  return value;
};

const RewardsEarnedProvider: FC<{}> = ({ children }) => {
  const rewardsEarned = useRewardsEarnedInterval();
  return (
    <rewardsEarnedCtx.Provider value={rewardsEarned}>
      {children}
    </rewardsEarnedCtx.Provider>
  );
};

export const StakeProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const metaToken = useMetaToken();
  const incentivisedVotingLockup = useIncentivisedVotingLockup();

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { metaToken, incentivisedVotingLockup },
    });
  }, [metaToken, incentivisedVotingLockup, dispatch]);

  const setLockupAmount = useCallback<Dispatch['setLockupAmount']>(
    amount => {
      dispatch({ type: Actions.SetLockupAmount, payload: amount });
    },
    [dispatch],
  );

  const setLockupDays = useCallback<Dispatch['setLockupDays']>(
    days => {
      dispatch({ type: Actions.SetLockupDays, payload: days });
    },
    [dispatch],
  );

  const setTransactionType = useCallback<Dispatch['setTransactionType']>(
    type => {
      dispatch({ type: Actions.SetTransactionType, payload: type });
    },
    [dispatch],
  );

  const setMaxLockupAmount = useCallback<Dispatch['setMaxLockupAmount']>(() => {
    dispatch({ type: Actions.SetMaxLockupAmount });
  }, [dispatch]);

  const setMaxLockupDays = useCallback<Dispatch['setMaxLockupDays']>(
    days => {
      dispatch({ type: Actions.SetMaxLockupDays, payload: days });
    },
    [dispatch],
  );

  const extendLockupDays = useCallback<Dispatch['extendLockupDays']>(
    days => {
      dispatch({ type: Actions.ExtendLockupDays, payload: days });
    },
    [dispatch],
  );

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          setLockupAmount,
          setLockupDays,
          setTransactionType,
          setMaxLockupAmount,
          setMaxLockupDays,
          extendLockupDays,
        }),
        [
          setLockupAmount,
          setLockupDays,
          setTransactionType,
          setMaxLockupAmount,
          setMaxLockupDays,
          extendLockupDays,
        ],
      )}
    >
      <stateCtx.Provider value={state}>
        <StakeContractProvider>
          <RewardsEarnedProvider>{children}</RewardsEarnedProvider>
        </StakeContractProvider>
      </stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};
