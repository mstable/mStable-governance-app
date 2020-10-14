import { AllUserLockupsQueryResult } from '../../../graphql/mstable';

export interface RawData {
  userLockups: NonNullable<AllUserLockupsQueryResult['data']>['current'];
}

export interface UserLockupSimple {
  account: string;
  value: number;
  lockTime: number;
  ts: number;
  slope: number;
  bias: number;
  length: number;
}

export interface UserLockupDatum {
  account: string;
  lockStart: string;
  mtaLocked: string;
  unlockTime: string;
  vMTA: string;
  votingPowerPercentage: string;
  votingPowerSimple: number;
}
