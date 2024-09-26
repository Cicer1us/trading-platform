// material
import {
  Grid,
  Container,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
// components
import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import Page from '../components/Page';
import { ChainId } from '../constants';
import BarChart from '../sections/@dashboard/app/BarChart';
import PieChart from '../sections/@dashboard/app/PieChart';
import DashboardApp, { Referrer } from './DashboardApp';

// ----------------------------------------------------------------------

const PeriodEnum = {
  Day: 'day',
  Week: 'week'
};

const Category = {
  Fee: 'Fee',
  Volume: 'Volume'
};

export default function Dashboard() {
  const [period, setPeriod] = useState(PeriodEnum.Day);
  const [referrer, setReferrer] = useState('all');
  const [category, setCategory] = useState(Category.Fee);

  const [series, setSeries] = useState(null);
  const [pieSeries, setPieSeries] = useState(null);
  const [categories, setCategories] = useState(null);

  const collectData = async (period, swapProperty, leverageProperty) => {
    const params = {
      method: 'get',
      baseURL: process.env.REACT_APP_SERVER_URL,
      params: {
        stepSize: period,
        numberOfSteps: 7,
        referrer: referrer === 'all' ? undefined : referrer
      }
    };
    const leverageResponse = await axios.request({
      ...params,
      url: `/leverage-trade/dynamic-stats`
    });
    const swapEthereumResponse = await axios.request({
      ...params,
      url: `/swap/dynamic-stats`,
      params: {
        ...params.params,
        chainId: ChainId.Ethereum
      }
    });
    const limitResponse = await axios.request({
      ...params,
      url: `/limit-order/dynamic-stats`,
      params: {
        ...params.params
      }
    });
    const swapPolygonResponse = await axios.request({
      ...params,
      url: `/swap/dynamic-stats`,
      params: {
        ...params.params,
        chainId: ChainId.Polygon
      }
    });
    const swapBinanceResponse = await axios.request({
      ...params,
      url: `/swap/dynamic-stats`,
      params: {
        ...params.params,
        chainId: ChainId.Binance
      }
    });
    const swapAvalancheResponse = await axios.request({
      ...params,
      url: `/swap/dynamic-stats`,
      params: {
        ...params.params,
        chainId: ChainId.Avalanche
      }
    });
    const swapFantomResponse = await axios.request({
      ...params,
      url: `/swap/dynamic-stats`,
      params: {
        ...params.params,
        chainId: ChainId.Fantom
      }
    });

    const swapAndLimitData = [];
    for (let i = 0; i < leverageResponse.data.length; i++) {
      swapAndLimitData.push(
        swapEthereumResponse.data[i][swapProperty] + limitResponse.data[i][swapProperty]
      );
    }

    const series = [];
    if (referrer === Referrer.AllpayWidget) {
      series.push({
        name: 'Swap (Ethereum)',
        data: swapAndLimitData
      });
    } else {
      series.push(
        {
          name: 'Leverage',
          data: leverageResponse.data.map((elem) => elem[leverageProperty])
        },
        {
          name: 'Swap & Limit (Ethereum)',
          data: swapAndLimitData
        }
      );
    }
    series.push(
      { name: 'Swap (Polygon)', data: swapPolygonResponse.data.map((elem) => elem[swapProperty]) },
      { name: 'Swap (Binance)', data: swapBinanceResponse.data.map((elem) => elem[swapProperty]) },
      {
        name: 'Swap (Avalanche)',
        data: swapAvalancheResponse.data.map((elem) => elem[swapProperty])
      },
      { name: 'Swap (Fantom)', data: swapFantomResponse.data.map((elem) => elem[swapProperty]) }
    );

    const categories = leverageResponse.data.map((elem) => elem.dateFrom);

    const pieSeries = [];
    series.forEach((elem) => {
      pieSeries.push(elem.data.reduce((prev, cur) => prev + cur));
    });

    setPieSeries(pieSeries);
    setSeries(series);
    setCategories(categories);
  };

  useEffect(() => {
    setSeries(null);
    setCategories(null);
    if (category === Category.Fee) {
      collectData(period, 'totalFeesInUSD', 'totalFee').then();
    } else if (category === Category.Volume) {
      collectData(period, 'totalVolumeInUSD', 'totalVolume').then();
    }
  }, [period, category, referrer]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Page title="Dashboard | bitoftrade">
      <Container maxWidth="xl">
        <DashboardApp referrer={referrer} setReferrer={setReferrer} />

        <Grid container spacing={3} marginTop={2}>
          <Grid item xs={12} md={4} />

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value={Category.Fee}>Fee</MenuItem>
                <MenuItem value={Category.Volume}>Volume</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="period-select-label">Period</InputLabel>
              <Select
                labelId="period-select-label"
                id="period-select"
                value={period}
                label="Time range"
                onChange={handlePeriodChange}
              >
                <MenuItem value={PeriodEnum.Day}>Day</MenuItem>
                <MenuItem value={PeriodEnum.Week}>Week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {!series || !categories || !pieSeries ? (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={8}>
                <BarChart
                  series={series}
                  categories={categories}
                  title={`${category} (${period})`}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PieChart title={`${category} proportion`} series={series} />
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
