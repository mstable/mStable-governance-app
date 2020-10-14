import React, { createContext, FC, useContext, useMemo } from 'react';

import { formatUnix, nowUnix } from '../../../utils/time';
import { useAllUserLockupsQuery } from '../../../graphql/mstable';
import { RawData, UserLockupDatum, UserLockupSimple } from './types';
import { useIncentivisedVotingLockupAtBlock } from './IncentivisedVotingLockupAtBlockProvider';
import { IncentivisedVotingLockup } from '../../../context/DataProvider/types';

const transformAllUserLockups = (
  userLockups: RawData['userLockups'] = [],
): UserLockupSimple[] => {
  return userLockups.map(userLockup => {
    const { value, bias, slope, account } = userLockup;
    const ts = parseInt(userLockup.ts, 10);
    const lockTime = parseInt(userLockup.lockTime, 10);
    return {
      account,
      // Precision is lost here, but it shouldn't matter for the purpose of stats
      value: parseInt(value, 10) / 1e18,
      bias: parseInt(bias, 10) / 1e18,
      slope: parseInt(slope, 10) / 1e18,
      ts,
      lockTime,
      length: lockTime - ts,
    };
  });
};

const now = nowUnix();

const statsDataCtx = createContext<UserLockupDatum[]>([]);

export const useStatsData = (): UserLockupDatum[] => useContext(statsDataCtx);

export const StatsDataProvider: FC = ({ children }) => {
  const {
    incentivisedVotingLockup,
    block,
  } = useIncentivisedVotingLockupAtBlock();

  const totalSupply = incentivisedVotingLockup?.votingToken.totalSupply;

  const isHistoric = !!(block && incentivisedVotingLockup);
  const currentTime = isHistoric
    ? (incentivisedVotingLockup as IncentivisedVotingLockup).lastUpdateTime
    : now;

  const allUserLockupsQuery = useAllUserLockupsQuery({
    variables: {
      minLockTime: currentTime.toString(),
      block: { number: block || 0 },
      hasBlock: !!block,
    },
    fetchPolicy: 'cache-first',
  });

  const userLockupsData =
    allUserLockupsQuery.data?.current ?? allUserLockupsQuery.data?.historic;

  const totalSupplyRounded = totalSupply?.simpleRounded;

  const data = useMemo<UserLockupDatum[]>(() => {
    const userLockups = transformAllUserLockups(userLockupsData);

    return totalSupplyRounded && totalSupplyRounded > 0
      ? userLockups.map<UserLockupDatum>(userLockup => {
          const { account, value, lockTime, ts, bias, slope } = userLockup;

          // See `IncentivisedVotingLockup.balanceOf`
          const vMTA = bias - slope * (currentTime - ts);

          const votingPowerSimple = (vMTA / totalSupplyRounded) * 100;

          return {
            account,
            lockStart: formatUnix(ts),
            mtaLocked: value.toFixed(2),
            unlockTime: formatUnix(lockTime),
            vMTA: vMTA.toFixed(2),
            votingPowerPercentage: votingPowerSimple.toFixed(3).concat('%'),
            votingPowerSimple,
          };
        })
      : [];
  }, [userLockupsData, totalSupplyRounded, currentTime]);

  return <statsDataCtx.Provider value={data}>{children}</statsDataCtx.Provider>;
};
