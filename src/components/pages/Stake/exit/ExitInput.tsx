import React, { FC } from 'react';
import styled from 'styled-components';
import { H3 } from '../../../core/Typography';
import { useStakeState } from '../StakeProvider';
import { CountUp } from '../../../core/CountUp';
import { ExternalLink } from '../../../core/ExternalLink';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

export const ExitInput: FC = () => {
  const {
    data: { incentivisedVotingLockup, metaToken },
  } = useStakeState();
  const balance = incentivisedVotingLockup?.userLockup?.value;
  return (
    <Row>
      <H3>Withdraw</H3>
      <br />
      <p>
        The staking contract is now expired. You can withdraw your stake and
        deposit on{' '}
        <ExternalLink href="https://staking.mstable.org">
          the new mStable Staking.
        </ExternalLink>
      </p>
      <p>
        Deposit 90% of your stake within four weeks to earn a permanent rewards
        boost.
      </p>
      <br />
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
