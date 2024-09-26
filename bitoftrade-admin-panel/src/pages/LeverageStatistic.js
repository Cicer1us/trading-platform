import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import {
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
import { StatisticInfoCard } from '../sections/@dashboard/app';
import Scrollbar from '../components/Scrollbar';
import SwapListHeadEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapListHeadEthereum';
import LeverageFilterSidebar from '../sections/@dashboard/leverage-stats/LeverageFilterSidebar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'market', label: 'Market', alignRight: false },
  { id: 'fee', label: 'Fee', alignRight: false },
  { id: 'volume', label: 'Volume', alignRight: false },
  { id: 'tradesCount', label: 'Trades', alignRight: false }
];

export default function LeverageStatistic() {
  const [openFilter, setOpenFilter] = useState(false);
  const [leverageStatistic, setLeverageStatistic] = useState(null);
  const [markets, setMarkets] = useState(null);

  const formik = useFormik({
    initialValues: {
      dateFrom: null,
      dateTo: null,
      market: '',
      userAddress: ''
    },
    onSubmit: async () => {
      try {
        const swapStatsResponse = await axios.request({
          method: 'get',
          url: `/leverage-trade/stats`,
          baseURL: process.env.REACT_APP_SERVER_URL,
          params: formik.values
        });
        swapStatsResponse.data.volumes.sort((elem1, elem2) => elem2.fee - elem1.fee);
        const markets = swapStatsResponse.data.volumes.map((volume) => volume.market);
        setLeverageStatistic(swapStatsResponse.data);
        setMarkets(markets);
      } catch (err) {
        //
      }
      setOpenFilter(false);
    }
  });

  useEffect(() => {
    formik.handleSubmit();
  }, []);

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
    <Page title="Dashboard: Leverage Statistic">
      <Container>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Typography variant="h4">Leverage Statistic</Typography>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <LeverageFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              markets={markets}
            />
          </Stack>
        </Stack>

        {!leverageStatistic ? (
          <LinearProgress />
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: 10 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard label="Total Volume" amount={leverageStatistic.totalVolume} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard label="Total Fee" amount={leverageStatistic.totalFee} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatisticInfoCard label="Total Trades" amount={leverageStatistic.tradesCount} />
              </Grid>
            </Grid>

            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <SwapListHeadEthereum
                      headLabel={TABLE_HEAD}
                      rowCount={leverageStatistic?.volumes?.length}
                    />
                    <TableBody>
                      {leverageStatistic.volumes.map((row, id) => {
                        const { market, fee, volume, tradesCount } = row;
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell align="left">{market}</TableCell>
                            <TableCell align="left">{Number(fee).toFixed(2)}</TableCell>
                            <TableCell align="left">{Number(volume).toFixed(2)}</TableCell>
                            <TableCell align="left">{tradesCount}</TableCell>
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
