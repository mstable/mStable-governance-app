import React, { FC } from 'react';
import styled from 'styled-components';
import { H3 } from '../../../core/Typography';
import { useStakeState } from '../StakeProvider';
import { CountUp } from '../../../core/CountUp';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

export const ExitInput: FC = () => {
  const {
    data: { incentivisedVotingLockup, metaToken },
  } = useStakeState();
  const balance = incentivisedVotingLockup?.userStakingBalance;
  return (
    <Row>
      <H3>Withdraw</H3>
      <div>
        {metaToken && balance?.exact.gt(0) ? (
          <>
            Withdraw{' '}
            <CountUp
              end={balance?.simpleRounded}
              decimals={6}
              suffix={` ${metaToken.symbol}`}
            />
              .
            </>
        ) : (
            'Nothing to withdraw.'
          )}
      </div>
    </Row>
  );
};
