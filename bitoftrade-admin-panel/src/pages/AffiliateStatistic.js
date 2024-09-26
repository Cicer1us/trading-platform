import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import {
  Card,
  Container,
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
import Scrollbar from '../components/Scrollbar';
import SwapListHeadEthereum from '../sections/@dashboard/swap-stats-ethereum/SwapListHeadEthereum';
import AffiliateFilterSidebar from '../sections/@dashboard/affiiate-stats/AffiliateFilterSidebar';
import { ChainId } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'company', label: 'Company Name', alignRight: false },
  { id: 'swap-ethereum', label: 'Swap & Limit (Ethereum)', alignRight: false },
  { id: 'swap-binance', label: 'Swap (Binance)', alignRight: false },
  { id: 'swap-polygon', label: 'Swap (Polygon)', alignRight: false },
  { id: 'swap-polygon', label: 'Swap (Fantom)', alignRight: false },
  { id: 'swap-polygon', label: 'Swap (Avalanche)', alignRight: false },
  { id: 'leverage', label: 'Leverage', alignRight: false },
  { id: 'users', label: 'Users', alignRight: false }
];

export default function AffiliateStatistic() {
  const [openFilter, setOpenFilter] = useState(false);
  const [affiliateStatistic, setAffiliateStatistic] = useState(null);

  const formik = useFormik({
    initialValues: {
      dateFrom: null,
      dateTo: null,
      clientAddress: ''
    },
    onSubmit: async () => {
      try {
        const swapStatsResponse = await axios.request({
          method: 'get',
          url: `/affiliate/stats`,
          baseURL: process.env.REACT_APP_SERVER_URL,
          params: formik.values
        });
        console.log(swapStatsResponse.data);
        setAffiliateStatistic(swapStatsResponse.data);
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
    <Page title="Dashboard: Affiliate Statistic">
      <Container>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Typography variant="h4">Affiliate Statistic</Typography>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <AffiliateFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              markets={[]}
            />
          </Stack>
        </Stack>

        {!affiliateStatistic ? (
          <LinearProgress />
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <SwapListHeadEthereum
                    headLabel={TABLE_HEAD}
                    rowCount={affiliateStatistic.length}
                  />
                  <TableBody>
                    {affiliateStatistic.map((row, id) => (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell align="left">{row.companyName}</TableCell>
                        {row.swapStat.map((elem) => (
                          <TableCell align="left" key={elem.chainId}>
                            <p>
                              Trades:{' '}
                              {elem.chainId === ChainId.Ethereum
                                ? elem.count + row.limitOrdersStat.count
                                : elem.count}
                            </p>
                            <p>
                              {'Fee: '}
                              {Number(
                                elem.chainId === ChainId.Ethereum
                                  ? elem.feesUSD + row.limitOrdersStat.feesUSD
                                  : elem.feesUSD
                              ).toFixed(2)}
                            </p>
                            <p>
                              {'Volume: '}
                              {Number(
                                elem.chainId === ChainId.Ethereum
                                  ? elem.volumeUSD + row.limitOrdersStat.volumeUSD
                                  : elem.volumeUSD
                              ).toFixed(2)}
                            </p>
                          </TableCell>
                        ))}
                        {/* <TableCell align="left"> */}
                        {/* <p>Trades: {row.swapStat.count + row.limitOrdersStat.count}</p> */}
                        {/* <p> */}
                        {/*  {'Fee: '} */}
                        {/*  {Number(row.swapStat.feesUSD + row.limitOrdersStat.feesUSD).toFixed(2)} */}
                        {/* </p> */}
                        {/* <p> */}
                        {/*  {'Volume: '} */}
                        {/*  {Number(row.swapStat.volumeUSD + row.limitOrdersStat.volumeUSD).toFixed( */}
                        {/*    2 */}
                        {/*  )} */}
                        {/* </p> */}
                        {/* </TableCell> */}
                        <TableCell align="left">
                          <p>Trades: {row.leverageStat.count}</p>
                          <p>Fee: {Number(row.leverageStat.feesUSD).toFixed(2)}</p>
                          <p>Volume: {Number(row.leverageStat.volumeUSD).toFixed(2)}</p>
                        </TableCell>
                        <TableCell align="left">{row.userAddresses.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        )}
      </Container>
    </Page>
  );
}
