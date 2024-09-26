import Select, { Option } from '@/components/Select/Select';
import getDecimalsScale from '@/helpers/getDecimalsScale';
import useMultilingual from '@/hooks/useMultilingual';
import { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { DotLoader } from 'react-spinners';
import { ChartPriceData, SelectedChartType } from '../Chart/Chart';
import ChartLine, { ChartTimeFrame } from '../ChartLine/ChartLine';
import style from './ChartContainer.module.css';

interface ChartContainerProps {
  options: Option[] | null;
  handlerSelected?: (a: SelectedChartType) => void;
  selectedOption?: string;
  data: ChartPriceData[];
  pastTitle: string;
  percentChange: number;
  isLoading: boolean;
  timeFrame: ChartTimeFrame;
  setTimeFrame: (timeFrame: ChartTimeFrame) => void;
  height: number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  options,
  handlerSelected,
  selectedOption,
  data,
  percentChange,
  pastTitle,
  isLoading,
  timeFrame,
  setTimeFrame,
  height,
}) => {
  const { t } = useMultilingual('chart');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (data?.length) {
      setPrice(data[data.length - 1]?.price);
    }
  }, [data]);

  return (
    <div className={style.wrapper}>
      <div className={`${style.container} boxStyle`}>
        <div className={style.header}>
          {options !== null && (
            <div className={style.select}>
              <Select options={options} handlerSelected={handlerSelected} selectedValue={selectedOption} />
            </div>
          )}
          {!!data?.length && (
            <div className={style.priceContainer}>
              <div className={`${style.price} `}>
                <NumberFormat
                  decimalScale={getDecimalsScale(price)}
                  thousandSeparator
                  displayType="text"
                  value={price}
                />
              </div>
              <div className={`${style.priceChange}  ${percentChange < 0 && style.negative}`}>
                <span>
                  <NumberFormat suffix="%" decimalScale={2} value={percentChange} displayType="text" />
                  {` `}
                  {pastTitle}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={style.chart}>
          {isLoading ? (
            <div className={style.loader}>
              <DotLoader size={80} color={'#38d9c0'} loading={true} />
            </div>
          ) : (
            <ChartLine
              height={height}
              lineColor={percentChange < 0 ? '#ff6666' : '#38d9c0'}
              setChartPrice={setPrice}
              data={data}
            />
          )}
        </div>
        <div className={style.dateContainer}>
          <div
            onClick={() => setTimeFrame(ChartTimeFrame.DAY)}
            className={`${style.date} ${isLoading && timeFrame !== ChartTimeFrame.DAY ? style.disabled : ''} ${
              timeFrame === ChartTimeFrame.DAY ? style.active : ''
            }`}
          >
            {t('day')}
          </div>
          <div
            onClick={() => setTimeFrame(ChartTimeFrame.WEEK)}
            className={`${style.date} ${isLoading && timeFrame !== ChartTimeFrame.WEEK ? style.disabled : ''} ${
              timeFrame === ChartTimeFrame.WEEK ? style.active : ''
            }`}
          >
            {t('week')}
          </div>
          <div
            onClick={() => setTimeFrame(ChartTimeFrame.MONTH)}
            className={`${style.date} ${isLoading && timeFrame !== ChartTimeFrame.MONTH ? style.disabled : ''} ${
              timeFrame === ChartTimeFrame.MONTH ? style.active : ''
            }`}
          >
            {t('month')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
