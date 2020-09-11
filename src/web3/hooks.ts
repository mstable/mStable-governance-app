import { useMemo } from 'react';

import { truncateAddress } from './strings';

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);
