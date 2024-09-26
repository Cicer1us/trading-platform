import { Box, Card, CardHeader } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const CHART_DATA = {
  series: [44, 55, 13],
  options: {
    chart: {
      height: 380,
      type: 'pie'
    },
    labels: [
      'Leverage',
      'Swap & Limit (Ethereum)',
      'Swap (Polygon)',
      'Swap (Binance)',
      'Swap (Avalanche)',
      'Swap (Fantom)'
    ],
    legend: {
      labels: {
        colors: ['#fff', '#fff']
      },
      markers: {
        fillColors: ['#FF6666', '#DDBE6D', '#9D61FF', '#309089', '#C5C5C9', '#6FC0E2']
      }
    },
    fill: {
      opacity: 1,
      colors: ['#FF6666', '#DDBE6D', '#9D61FF', '#309089', '#C5C5C9', '#6FC0E2']
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }
};

PieChart.propTypes = {
  title: PropTypes.string,
  series: PropTypes.array
};

export default function PieChart({ title, series }) {
  const pieSeries = [];
  series.forEach((elem) => {
    pieSeries.push(elem.data.reduce((prev, cur) => prev + cur));
  });
  CHART_DATA.options.labels = series.map((elem) => elem.name);

  return (
    <Card>
      <CardHeader title={title} subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart options={CHART_DATA.options} series={pieSeries} type="pie" />
      </Box>
    </Card>
  );
}
