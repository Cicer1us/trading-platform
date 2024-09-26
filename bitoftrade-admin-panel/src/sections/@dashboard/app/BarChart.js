import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const CHART_DATA = {
  series: [],
  options: {
    chart: {
      type: 'bar',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      labels: {
        colors: ['#fff', '#fff']
      },
      markers: {
        fillColors: ['#FF6666', '#DDBE6D', '#9D61FF', '#309089', '#C5C5C9', '#6FC0E2']
      }
    },
    xaxis: {
      title: {
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
        }
      },
      decimalsInFloat: 2
    },
    fill: {
      opacity: 1,
      colors: ['#FF6666', '#DDBE6D', '#9D61FF', '#309089', '#C5C5C9', '#6FC0E2']
    },
    tooltip: {
      y: {
        formatter(val) {
          return `$ ${val}`;
        }
      }
    },
    toolbar: {
      style: {
        background: '#000'
      },
      show: false,
      tools: {
        download: false
      }
    },
    theme: {
      mode: 'dark'
    }
  }
};

BarChart.propTypes = {
  title: PropTypes.string,
  categories: PropTypes.array,
  series: PropTypes.array
};

export default function BarChart({ categories, series, title }) {
  CHART_DATA.options.xaxis.categories = categories;
  return (
    <Card>
      <CardHeader title={title} subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart options={CHART_DATA.options} series={series} type="bar" />
      </Box>
    </Card>
  );
}
