import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import {
  Box,
  Card,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
// components
import axios from '../utils/axiosInstance';
import Page from '../components/Page';
//
import SwapFilterSidebarEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapFilterSidebarEthereum';
import { StatisticInfoCard } from '../sections/@dashboard/app';
import Scrollbar from '../components/Scrollbar';
import SwapListHeadEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapListHeadEthereum';
import { ChainId } from '../constants';
import ReferrerSelect from '../components/ReferrerSelect';
import { Referrer } from './DashboardApp';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'from', label: 'From', alignRight: false },
  { id: 'to', label: 'To', alignRight: false },
  { id: 'feesInUSD', label: 'Fee', alignRight: false },
  { id: 'volumeInUSD', label: 'Volume', alignRight: false },
  { id: 'swapCount', label: 'Swaps', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false }
];

export default function SwapAndLimitStatisticEthereum() {
  const [openFilter, setOpenFilter] = useState(false);
  const [swapStatistic, setSwapStatistic] = useState(null);
  const [limitStatistic, setLimitStatistic] = useState(null);
  const [referrer, setReferrer] = useState('all');

  const formik = useFormik({
    initialValues: {
      dateFrom: null,
      dateTo: null,
      srcToken: '',
      destToken: '',
      initiator: ''
    },
    onSubmit: async () => {
      try {
        const swapStatsResponse = await axios.request({
          method: 'get',
          url: `/swap/stats`,
          baseURL: process.env.REACT_APP_SERVER_URL,
          params: {
            ...formik.values,
            chainId: ChainId.Ethereum,
            referrer: referrer === Referrer.All ? undefined : referrer
          }
        });
        const limitStatsResponse =
          referrer === Referrer.AllpayWidget
            ? { data: { volumes: [] } }
            : await axios.request({
                method: 'get',
                url: `/limit-order/stats`,
                baseURL: process.env.REACT_APP_SERVER_URL,
                params: {
                  maker: formik.values.initiator,
                  makerToken: formik.values.destToken,
                  takerToken: formik.values.srcToken,
                  dateFrom: formik.values.dateFrom,
                  dateTo: formik.values.dateTo,
                  status: 'Filled'
                }
              });
        swapStatsResponse.data.volumes.sort((elem1, elem2) => elem2.feesInUSD - elem1.feesInUSD);
        limitStatsResponse.data.volumes.sort((elem1, elem2) => elem2.feesInUSD - elem1.feesInUSD);
        setSwapStatistic(swapStatsResponse.data);
        setLimitStatistic(limitStatsResponse.data);
      } catch (err) {
        //
      }
      setOpenFilter(false);
    }
  });

  useEffect(() => {
    formik.handleSubmit();
  }, [referrer]);

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  const title =
    referrer === Referrer.AllpayWidget
      ? 'Swap Statistics (Ethereum)'
      : 'Swap & Limit Statistic (Ethereum)';

  const limitCount = limitStatistic?.totalLimitOrderCount ?? 0;
  const swapCount = swapStatistic?.totalSwapCount ?? 0;
  const totalSwapCount = referrer === Referrer.AllpayWidget ? swapCount : limitCount + swapCount;

  return (
    <Page title={`Dashboard: ${title}`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h4">{title}</Typography>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <SwapFilterSidebarEthereum
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
          </Stack>
        </Stack>
        <Box mb={3}>
          <ReferrerSelect referrer={referrer} setReferrer={setReferrer} />
        </Box>

        {swapStatistic === null || limitStatistic === null ? (
          <LinearProgress />
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: 10 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard
                  label="Total Volume USD"
                  amount={swapStatistic.totalVolumeInUSD}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard label="Total Fee USD" amount={swapStatistic.totalFeesInUSD} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard label="Total Swap Count" amount={totalSwapCount} />
              </Grid>
            </Grid>

            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <SwapListHeadEthereum
                      headLabel={TABLE_HEAD}
                      rowCount={swapStatistic?.volumes?.length}
                    />

                    <TableBody>
                      {swapStatistic.volumes.map((row, id) => {
                        const {
                          swapCount,
                          destTokenSymbol,
                          destTokenLogoURI,
                          srcTokenSymbol,
                          srcTokenLogoURI,
                          feesInUSD,
                          volumeInUSD
                        } = row;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell align="left">
                              <img src={srcTokenLogoURI} width={20} height={20} alt="n/a" />
                              {srcTokenSymbol}
                            </TableCell>
                            <TableCell align="left">
                              <img src={destTokenLogoURI} width={20} height={20} alt="" />
                              {destTokenSymbol}
                            </TableCell>
                            <TableCell align="left">{Number(feesInUSD).toFixed(2)}</TableCell>
                            <TableCell align="left">{Number(volumeInUSD).toFixed(2)}</TableCell>
                            <TableCell align="left">{swapCount}</TableCell>
                            <TableCell align="left">Swap</TableCell>
                          </TableRow>
                        );
                      })}

                      {limitStatistic.volumes.map((row, id) => {
                        const {
                          makerTokenSymbol,
                          makerTokenLogoURI,
                          takerTokenSymbol,
                          takerTokenLogoURI,
                          feesInUSD,
                          volumeInUSD,
                          orderCount
                        } = row;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell align="left">
                              <img src={makerTokenLogoURI} width={20} height={20} alt="n/a" />
                              {makerTokenSymbol}
                            </TableCell>
                            <TableCell align="left">
                              <img src={takerTokenLogoURI} width={20} height={20} alt="" />
                              {takerTokenSymbol}
                            </TableCell>
                            <TableCell align="left">{Number(feesInUSD).toFixed(2)}</TableCell>
                            <TableCell align="left">{Number(volumeInUSD).toFixed(2)}</TableCell>
                            <TableCell align="left">{orderCount}</TableCell>
                            <TableCell align="left">Limit</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </>
        )}
      </Container>
    </Page>
  );
}
