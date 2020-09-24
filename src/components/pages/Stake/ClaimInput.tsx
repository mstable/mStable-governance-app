import React, { FC } from 'react';
import styled from 'styled-components';
import { H3 } from '../../core/Typography';
import { useStakeState, useRewardsEarned } from './StakeProvider';
import { CountUp } from '../../core/CountUp';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

export const ClaimInput: FC = () => {
  const {
    data: { metaToken },
  } = useStakeState();
  const rewards = useRewardsEarned();

  return (
    <Row>
      <H3>Claim rewards</H3>
      <div>
        {metaToken && rewards?.rewards?.exact.gt(0) ? (
          <>
            Claim{' '}
            <CountUp
              end={rewards?.rewards.simpleRounded}
              decimals={6}
              suffix={` ${metaToken.symbol}`}
            />
              .
            </>
        ) : (
            'No rewards to claim.'
          )}
      </div>
    </Row>
  );
};
