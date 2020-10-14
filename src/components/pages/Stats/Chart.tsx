import React, { FC, useMemo } from 'react';
import Highcharts from 'highcharts/highstock';
import PieChart from 'highcharts-react-official';
import styled from 'styled-components';
import useWindowSize from 'react-use/lib/useWindowSize';

import { getEtherscanLink, truncateAddress } from '../../../utils/strings';
import { useStatsData } from './StatsDataProvider';
import { Color } from '../../../theme';
import { H3 } from '../../core/Typography';
import { Protip } from '../../core/Protip';

const StyledProtip = styled(Protip)`
  display: inline-block;
`;

const ChartContainer = styled.div`
  width: 100%;
  margin-bottom: 32px;

  // Override the Highcharts styles to use a responsive container
  > div > div {
    height: auto !important;
    width: auto !important;
    > svg {
      width: 100% !important;
      height: auto !important;
    }
  }
`;

const Container = styled.div`
  width: 100%;
`;

const MIN_POWER = 1;

const COLOURS = [Color.blue, Color.coolMint, Color.gold, Color.green];

export const Chart: FC = () => {
  const data = useStatsData();
  const windowSize = useWindowSize(320);
  const isMobile = windowSize.width < 640;

  const options = useMemo<Highcharts.Options>(() => {
    const sorted = [...data].sort(
      (a, b) => b.votingPowerSimple - a.votingPowerSimple,
    );

    const dataOverMinPower = sorted
      .filter(datum => datum.votingPowerSimple > MIN_POWER)
      .map(datum => ({
        y: datum.votingPowerSimple,
        name: truncateAddress(datum.account),
        account: datum.account,
      }));

    const others = sorted
      .filter(datum => datum.votingPowerSimple < MIN_POWER)
      .slice(MIN_POWER);

    if (others.length > 0) {
      dataOverMinPower.push({
        color: 'rgb(200, 200, 200)',
        name: 'Others',
        y: others.reduce((prev, datum) => prev + datum.votingPowerSimple, 0),
        account: '',
      } as typeof dataOverMinPower[0]);
    }

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        reflow: false,
        style: {
          fontFamily: `'Poppins', sans-serif`,
        },
      },
      title: {
        text: undefined,
      },
      tooltip: {
        pointFormat: '{point.y:.1f}%',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: COLOURS,
          dataLabels: {
            enabled: true,
            format: isMobile ? '{y:.1f} %' : '{point.name}: {y:.1f}%',
            distance: isMobile ? 8 : 16,
          },
          events: {
            click: e => {
              const { account } = ((e as unknown) as {
                point: { account: string };
              }).point;
              if (account.length) {
                window.open(getEtherscanLink(account));
              }
            },
          },
        },
      },
      series: [
        {
          name: 'vMTA distribution',
          data: dataOverMinPower,
          type: 'pie',
        },
      ],
    };
  }, [data, isMobile]);

  return (
    <Container>
      <H3 borderTop>vMTA distribution</H3>
      <StyledProtip title="Click a segment to see on Etherscan" />
      <ChartContainer>
        <PieChart highcharts={Highcharts} options={options} />
      </ChartContainer>
    </Container>
  );
};
