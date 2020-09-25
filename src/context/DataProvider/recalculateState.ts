import { DataState } from './types';

export const recalculateState = ({
  tokens,
  incentivisedVotingLockup,
}: DataState): DataState => {
  return { tokens, incentivisedVotingLockup };
};
