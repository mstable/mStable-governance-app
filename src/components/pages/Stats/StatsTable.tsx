/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import {
  useTable,
  useExpanded,
  usePagination,
  useSortBy,
  TableHeaderProps,
} from 'react-table';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { Button } from '../../core/Button';
import { EtherscanLink } from '../../core/EtherscanLink';
import { COLUMNS } from './columns';
import { useStatsData } from './StatsDataProvider';
import { H3 } from '../../core/Typography';

const TableHeader = styled.th<TableHeaderProps & { isSorted?: boolean }>`
  text-decoration: ${({ isSorted }) => (isSorted ? 'underline' : 'none')};
  border-bottom: 1px rgba(0, 0, 0, 0.2) solid;
  padding-right: 8px;
  padding-left: 8px;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  text-align: right;

  // ETH account
  :first-child {
    text-align: center;
  }
`;

const TableData = styled.td`
  margin: 0;
  padding: 8px;
  border-bottom: 1px rgba(0, 0, 0, 0.2) solid;
  text-align: right;
  font-family: 'DM Mono', monospace;
  font-size: 12px;

  // ETH account
  :first-child {
    text-align: center;
  }
`;

const TableRow = styled.tr`
  :last-child {
    td {
      border-bottom: 0;
    }
  }
`;

const Header = styled.thead``;

const TableBody = styled.tbody``;

const Table = styled.table`
  width: 100%;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  margin-bottom: 16px;

  ${TableHeader}, ${TableData} {
    white-space: nowrap;
    word-break: keep-all;
  }
`;

const Pagination = styled.div`
  > * {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const PAGE_SIZE = 20;

export const StatsTable: FC = () => {
  const data = useStatsData();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns: COLUMNS,
      data,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        pageIndex: 0,
        pageSize: PAGE_SIZE,
        sortBy: [
          {
            id: 'votingPowerPercentage',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    useExpanded,
    usePagination,
  );

  return (
    <Container>
      <H3 borderTop>Stakers</H3>
      <Table {...getTableProps()}>
        <Header>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableHeader
                  isSorted={column.isSorted}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
                  </span>
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </Header>
        <TableBody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <TableRow>
              {COLUMNS.map(col => (
                <TableData key={col.accessor as string}>
                  <Skeleton />
                </TableData>
              ))}
            </TableRow>
          ) : (
            page.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableData {...cell.getCellProps()}>
                        {cell.column.id === 'account' ? (
                          <EtherscanLink
                            data={cell.value as string}
                            type="address"
                            showData
                            truncate
                          />
                        ) : (
                          cell.render('Cell')
                        )}
                      </TableData>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <Pagination>
        <Button
          onClick={() => setPageSize(pageSize + PAGE_SIZE)}
          disabled={!canNextPage}
        >
          See More
        </Button>
      </Pagination>
    </Container>
  );
};
