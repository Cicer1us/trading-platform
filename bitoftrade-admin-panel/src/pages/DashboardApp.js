// material
import {
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress
} from '@mui/material';
// components
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import axios from '../utils/axiosInstance';
import { ChainId } from '../constants';
import Scrollbar from '../components/Scrollbar';
import SwapListHeadEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapListHeadEthereum';
import { fShortenNumber } from '../utils/formatNumber';
import {
  getLeverageStatsConfig,
  getLeverageUniqueUsersConfig,
  getLimitStatsConfig,
  getLimitUniqueUsersConfig,
  getSwapStatsConfig,
  getSwapUniqueUsersConfig
} from '../api/statisRequests';
import ReferrerSelect from '../components/ReferrerSelect';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'feature', label: 'Feature', alignRight: false },
  { id: 'volume', label: 'Volume USD', alignRight: false },
  { id: 'fee', label: 'Fee USD', alignRight: false },
  { id: 'operations', label: 'Swap & Trades', alignRight: false },
  { id: 'userCount', label: 'Unique Users', alignRight: false }
];

const PeriodEnum = {
  AllTime: 'allTime',
  Month: 'month',
  Week: 'week'
};

export const Referrer = {
  All: 'all',
  AllpayWidget: '0xdb0e82d476bbb946130bbb0a3aed7124793109d5',
  Bitoftrade: '0xb18a6bf7e677ad4bd3ca86222f21972d8f7d558a'
};

DashboardApp.propTypes = {
  referrer: PropTypes.string,
  setReferrer: PropTypes.func
};

const chains = [
  ChainId.Polygon,
  ChainId.Binance,
  ChainId.Avalanche,
  ChainId.Fantom,
  ChainId.Ethereum
];

export default function DashboardApp({ referrer, setReferrer }) {
  const [period, setPeriod] = useState(PeriodEnum.AllTime);
  const [dateFrom, setDateFrom] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(async () => {
    const statsPromises = [];
    const usersPromises = [];

    // Swap (by chain)
    chains.forEach((chainId) => {
      statsPromises.push(axios.request(getSwapStatsConfig(chainId, dateFrom, referrer)));
    });
    statsPromises.push(axios.request(getLimitStatsConfig(dateFrom)));
    statsPromises.push(axios.request(getLeverageStatsConfig(dateFrom)));

    // Unique users
    chains.forEach((chainId) => {
      usersPromises.push(axios.request(getSwapUniqueUsersConfig(chainId, dateFrom, referrer)));
    });
    usersPromises.push(axios.request(getLimitUniqueUsersConfig(dateFrom)));
    usersPromises.push(axios.request(getLeverageUniqueUsersConfig(dateFrom)));

    const statsRes = await Promise.all(statsPromises);
    const usersRes = await Promise.all(usersPromises);
    const swapFeatures = ['Swap (Polygon)', 'Swap (Binance)', 'Swap (Avalanche)', 'Swap (Fantom)'];

    const newTableData = [];
    swapFeatures.forEach((feature, i) =>
      newTableData.push({
        feature,
        volume: statsRes[i].data.totalVolumeInUSD,
        fee: statsRes[i].data.totalFeesInUSD,
        operations: statsRes[i].data.totalSwapCount,
        userCount: usersRes[i].data.uniqueUsersCount
      })
    );

    const isAllpayStats = referrer === Referrer.AllpayWidget;

    newTableData.push({
      feature: !isAllpayStats ? 'Swap & Limit (Ethereum)' : 'Swap (Ethereum)',
      volume:
        statsRes[newTableData.length].data.totalVolumeInUSD + !isAllpayStats
          ? statsRes[newTableData.length + 1].data.totalVolumeInUSD
          : 0,
      fee:
        statsRes[newTableData.length].data.totalFeesInUSD + !isAllpayStats
          ? statsRes[newTableData.length + 1].data.totalFeesInUSD
          : 0,
      operations:
        statsRes[newTableData.length].data.totalSwapCount + !isAllpayStats
          ? statsRes[newTableData.length + 1].data.totalLimitOrderCount
          : 0,
      userCount:
        usersRes[newTableData.length].data.uniqueUsersCount + !isAllpayStats
          ? usersRes[newTableData.length + 1].data.uniqueUsersCount
          : 0
    });

    if (!isAllpayStats) {
      newTableData.push({
        feature: 'Leverage',
        volume: statsRes[newTableData.length + 1].data.totalVolume,
        fee: statsRes[newTableData.length + 1].data.totalFee,
        operations: statsRes[newTableData.length + 1].data.tradesCount,
        userCount: usersRes[newTableData.length + 1].data.uniqueUsersCount
      });
    }

    newTableData.push({
      feature: 'Total',
      volume: newTableData.reduce((a, b) => a + b.volume, 0),
      fee: newTableData.reduce((a, b) => a + b.fee, 0),
      operations: newTableData.reduce((a, b) => a + b.operations, 0),
      userCount: newTableData.reduce((a, b) => a + b.userCount, 0)
    });

    newTableData.sort((elem1, elem2) => elem2.volume - elem1.volume);

    setTableData(newTableData);
  }, [dateFrom, referrer]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    switch (event.target.value) {
      case PeriodEnum.AllTime:
        setDateFrom(null);
        break;
      case PeriodEnum.Month:
        setDateFrom(dayjs().subtract(1, 'month').toISOString());
        break;
      case PeriodEnum.Week:
        setDateFrom(dayjs().subtract(1, 'week').toISOString());
        break;
      default:
        setDateFrom(null);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Typography variant="h4">Trading Statistics</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <ReferrerSelect referrer={referrer} setReferrer={setReferrer} />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Period</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={period}
            label="Time range"
            onChange={handlePeriodChange}
          >
            <MenuItem value={PeriodEnum.AllTime}>All time</MenuItem>
            <MenuItem value={PeriodEnum.Month}>Month</MenuItem>
            <MenuItem value={PeriodEnum.Week}>Week</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        {!tableData ? (
          <LinearProgress />
        ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SwapListHeadEthereum headLabel={TABLE_HEAD} rowCount={tableData?.length} />
                <TableBody>
                  {tableData.map((row, id) => {
                    const { feature, fee, volume, operations, userCount } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell align="left">{feature}</TableCell>
                        <TableCell align="left">{fShortenNumber(volume)}</TableCell>
                        <TableCell align="left">{fShortenNumber(fee)}</TableCell>
                        <TableCell align="left">{fShortenNumber(operations)}</TableCell>
                        <TableCell align="left">{userCount}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </Grid>
    </Grid>
  );
}
