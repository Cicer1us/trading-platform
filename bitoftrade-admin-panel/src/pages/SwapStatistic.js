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
import PropTypes from 'prop-types';
import axios from '../utils/axiosInstance';
import Page from '../components/Page';
//
import { StatisticInfoCard } from '../sections/@dashboard/app';
import Scrollbar from '../components/Scrollbar';
import SwapListHeadEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapListHeadEthereum';
import { ChainId } from '../constants';
import SwapFilterSidebar from '../sections/@dashboard/swap-stats-filter-common/SwapFilterSidebar';
import ReferrerSelect from '../components/ReferrerSelect';
import { Referrer } from './DashboardApp';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'from', label: 'From', alignRight: false },
  { id: 'to', label: 'To', alignRight: false },
  { id: 'feesInUSD', label: 'Fee', alignRight: false },
  { id: 'volumeInUSD', label: 'Volume', alignRight: false },
  { id: 'swapCount', label: 'Swaps', alignRight: false }
];

SwapStatistic.propTypes = {
  title: PropTypes.string,
  chainId: PropTypes.oneOf([
    ChainId.Ethereum,
    ChainId.Binance,
    ChainId.Polygon,
    ChainId.Fantom,
    ChainId.Avalanche
  ])
};

export default function SwapStatistic({ title, chainId }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [swapStatistic, setSwapStatistic] = useState(null);
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
            chainId,
            referrer: referrer === Referrer.All ? undefined : referrer
          }
        });

        swapStatsResponse.data.volumes.sort((elem1, elem2) => elem2.feesInUSD - elem1.feesInUSD);
        setSwapStatistic(swapStatsResponse.data);
      } catch (err) {
        //
      }
      setOpenFilter(false);
    }
  });

  useEffect(() => {
    formik.handleSubmit();
  }, [chainId, referrer]);

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

  return (
    <Page title={`Dashboard: ${title}`}>
      <Container>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Typography variant="h4">{title}</Typography>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <SwapFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              chainId={chainId}
            />
          </Stack>
        </Stack>
        <Box mb={3}>
          <ReferrerSelect referrer={referrer} setReferrer={setReferrer} />
        </Box>

        {!swapStatistic ? (
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
                <StatisticInfoCard label="Total Swap Count" amount={swapStatistic.totalSwapCount} />
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
