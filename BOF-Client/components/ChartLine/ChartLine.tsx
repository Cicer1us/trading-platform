import React, { useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import style from './ChartLine.module.css';
import useMultilingual from '@/hooks/useMultilingual';
import { ChartPriceData } from '@/components/Chart/Chart';

export enum ChartTimeFrame {
  DAY = 'D',
  WEEK = 'W',
  MONTH = 'M',
}

interface ChartLineProps {
  data: ChartPriceData[];
  setChartPrice: (price: number) => void;
  lineColor: string;
  height: number;
}

const CustomTooltip = ({ active, payload, setChartPrice, data }: any) => {
  useEffect(() => {
    if (payload && payload.length) {
      setChartPrice(payload[0].payload.price);
    } else {
      setChartPrice(data[data.length - 1]?.price);
    }
  }, [payload]);

  if (active && payload && payload.length) {
    return (
      <div className={style.customTooltip}>
        <div className={style.tooltipDate}>{payload[0].payload.date}</div>
      </div>
    );
  }

  return null;
};

const ChartLine: React.FC<ChartLineProps> = ({
  data,
  setChartPrice,
  lineColor,
  height,
}: ChartLineProps): JSX.Element => {
  const { t } = useMultilingual('chart');
  const lowest = data ? Math.min(...data.map(d => Number(d.price))) : 0;

  return (
    <>
      {data?.length === 0 && <div className={style.message}>{t('notAvailable')}</div>}
      {!!data?.length && (
        <ResponsiveContainer width="99%" height={height}>
          <LineChart data={data} margin={{ right: 30, left: 20 }}>
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              content={<CustomTooltip setChartPrice={setChartPrice} data={data ?? []} />}
            />
            <Line
              style={{
                filter: `drop-shadow(0px 0px 5px ${lineColor}`,
              }}
              strokeWidth={4}
              type="linear"
              dataKey="price"
              dot={false}
              stroke={lineColor}
              activeDot={{ r: 6 }}
            />
            <YAxis hide={true} type="number" domain={[lowest, 'auto']} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default ChartLine;
