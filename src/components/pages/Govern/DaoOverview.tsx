import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { ViewportWidth } from '../../../theme';
import { CountUp } from '../../core/CountUp';
import DiagonalArrow from '../../icons/diagonal-arrow.svg';
import LeftArrow from '../../icons/left-arrow.svg';
import MTAIcon from '../../icons/tokens/MTA.svg';
import EtherIcon from '../../icons/tokens/Ether.svg';
import { getEtherscanLink, truncateAddress } from '../../../utils/strings';
import { Tooltip } from '../../core/ReactTooltip';
import { UnstyledButton } from '../../core/Button';

enum DaoItemType {
  MSTABLE = 'MSTABLE',
  COMMUNITY = 'COMMUNITY',
  PROTOCOL = 'PROTOCOL',
  DEVELOPMENT = 'DEVELOPMENT',
}

interface Item {
  title: string;
  tooltip?: string;
  address?: string;
  accent?: string;
}

const { MSTABLE, COMMUNITY, PROTOCOL, DEVELOPMENT } = DaoItemType;

// replace with data
type TokenProps = { amount?: BigNumber; image?: string; key?: string };
//

const DAO_ITEMS = new Map<DaoItemType | undefined, Item>([
  [
    MSTABLE,
    {
      title: 'mStable',
      tooltip: 'Manages all public MTA treasury.',
      address: '0xb8541e73aa47a847fa39e803d19a3f9b1bbc5a6c',
      accent: '#000',
    },
  ],
  [
    COMMUNITY,
    {
      title: 'Community',
      tooltip: 'Distributes grants for community building initiatives.',
      address: undefined,
      accent: '#4C4FA8',
    },
  ],
  [
    PROTOCOL,
    {
      title: 'Protocol',
      tooltip: 'Executes and manages changes to the core mStable protocol.',
      address: '0x4186C5AEd424876f7EBe52f9148552A45E17f287',
      accent: '#CC1010',
    },
  ],
  [
    DEVELOPMENT,
    {
      title: 'Development',
      tooltip: 'Distributes grants to fund independent software development.',
      address: undefined,
      accent: '#109255',
    },
  ],
]);

const mockTokens: TokenProps[] = [
  {
    image: MTAIcon,
    amount: new BigNumber(12010),
    key: `token-0`,
  },
  {
    image: EtherIcon,
    amount: new BigNumber(1231),
    key: `token-1`,
  },
  {
    image: MTAIcon,
    amount: new BigNumber(23043),
    key: `token-2`,
  },
];

const Container = styled.div`
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;
  min-height: 8rem;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-basis: calc(40% - 0.5rem);
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 1rem;
  align-items: flex-start;

  h3 {
    font-size: 1.5rem;
    line-height: 1em;
    font-weight: 600;
    margin-right: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #808080;

    > span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  div {
    display: flex;
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;
    align-items: center;

    div {
      margin: 0;
    }
  }
`;

const Items = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;

  > * {
    margin-bottom: 0.5rem;
    margin-right: 1.25rem;
  }
`;

const StyledDaoItem = styled.button`
  display: flex;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  background: #f7f8f9;
  border-radius: 1.25rem;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;

  &:focus,
  :active,
  :hover {
    outline: none;
    span {
      text-decoration: underline;
    }
  }
`;

const StyledToken = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.5rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
  }

  @media (min-width: ${ViewportWidth.s}) {
    margin-top: 0;
  }
`;

const Circle = styled.div<{ color: string }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.625rem;
  margin-right: 0.5rem;
  background: ${({ color }) => color};
  overflow: hidden;

  > * {
    width: 100%;
    height: 100%;
  }
`;

const Address = styled.a`
  ${({ theme }) => theme.mixins.numeric};

  background: url(${DiagonalArrow}) #f7f8f9 no-repeat;
  background-position-x: 95%;
  background-position-y: 50%;
  background-size: 1.25rem;
  padding: 0.25rem 2.25rem 0.25rem 0.75rem;
  border: none;
  border-radius: 0.75rem;

  &:hover {
    cursor: pointer;

    span {
      border-bottom: 1px solid #000;
    }
  }
`;

const NavigateButton = styled(UnstyledButton)`
  background: url(${LeftArrow}) no-repeat;
  background-position-x: 50%;
  background-position-y: 50%;
  width: 1.25rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
`;

const DAOItem: FC<{
  daoType: DaoItemType;
  onClick: (type: DaoItemType) => void;
}> = ({ daoType, onClick }) => {
  const daoItem = DAO_ITEMS.get(daoType);
  if (!daoItem) return null;
  const { title, accent } = daoItem;
  return (
    <StyledDaoItem onClick={() => onClick(daoType)}>
      <Circle color={accent ?? '#000'} />
      <span>{title}</span>
    </StyledDaoItem>
  );
};

const TokenItem: FC<TokenProps> = ({ image, amount, key }) => {
  const valueRounded = amount && Math.floor(amount.toNumber());
  return (
    <StyledToken key={key}>
      <Circle color="#eee">
        <img src={image} alt="mta" />
      </Circle>
      <CountUp end={valueRounded} decimals={0} />
    </StyledToken>
  );
};

export const DaoOverview: FC = () => {
  const [selectedDao, setSelectedDao] = useState<DaoItemType | undefined>(
    undefined,
  );

  const handleNavigateBack = useCallback(() => setSelectedDao(undefined), []);
  const handleDAOItemSelect = useCallback(
    (dao: DaoItemType) => setSelectedDao(dao),
    [],
  );

  const { title, address, tooltip }: Item = DAO_ITEMS.get(selectedDao) ?? {
    title: 'DAOs',
  };

  // mocked
  const tokens = new Map<DaoItemType | undefined, TokenProps[]>([
    [MSTABLE, mockTokens],
    [COMMUNITY, mockTokens],
    [PROTOCOL, []],
    [DEVELOPMENT, []],
  ]).get(selectedDao);
  //

  const items = [MSTABLE, COMMUNITY, PROTOCOL, DEVELOPMENT];
  const hasTokens = tokens?.length !== 0;
  const isDefault = selectedDao === undefined;

  return (
    <Container>
      <Header>
        <div>
          {!isDefault && (
            <NavigateButton type="button" onClick={handleNavigateBack} />
          )}
          <h3>{title}</h3>
          {tooltip && <Tooltip tip={tooltip} />}
        </div>
        {address && (
          <Address
            target="_blank"
            rel="noopener noreferrer"
            href={getEtherscanLink(address, 'address')}
          >
            <span>{truncateAddress(address)}</span>
          </Address>
        )}
      </Header>
      <Items>
        {isDefault ? (
          items.map(dao => (
            <DAOItem key={dao} daoType={dao} onClick={handleDAOItemSelect} />
          ))
        ) : hasTokens ? (
          tokens?.map(({ image, amount, key }) => (
            <TokenItem image={image} amount={amount} key={key} />
          ))
        ) : (
          <p>This DAO currently manages no funds.</p>
        )}
      </Items>
    </Container>
  );
};
