import React from 'react';
import style from './LeverageTrade.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import LeverageInput from './LeverageInput/LeverageInput';
import LeverageWidgetClarification from './LeverageWidgetClarification';
import useMultilingual from '@/hooks/useMultilingual';
import Select from '@/components/Select/Select';
import { setTimeRange, setTimeRangeUnit, setTriggerPrice, TimeRangeUnit } from '@/redux/leverageSlice';
import { OrderType } from '@dydxprotocol/v3-client';

const TimeRageAndTriggerPriceInput: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');
  const { c } = useMultilingual('leverageWidgetTooltip');

  const orderType = useAppSelector(({ leverage }) => leverage.orderType);
  const timeRange = useAppSelector(({ leverage }) => leverage.timeRage);
  const timeRangeUnit = useAppSelector(({ leverage }) => leverage.timeRangeUnit);
  const triggerPrice = useAppSelector(({ leverage }) => leverage.triggerPrice);

  const handleTimeRangeInput = value => {
    dispatch(setTimeRange(value));
  };

  return (
    <div className={`${style.limitPriceSectionWrapper} ${style.amountInputWrapper}`}>
      <div>
        <LeverageWidgetClarification label={t('timeRange')} helperText={c('timeRange')} />
        <div className={style.timeRangeWrapper}>
          <LeverageInput
            value={timeRange}
            decimalScale={0}
            onChange={value => handleTimeRangeInput(value)}
            placeholder="0"
            maxLength={2}
          />
          <Select
            size={'small'}
            wrapperInputStyles={style.timeRangeSelectWrapper}
            wrapperStyles={style.wrapperStyles}
            menuStyles={''}
            options={[
              { value: TimeRangeUnit.Min, title: 'Mins' },
              { value: TimeRangeUnit.Hour, title: 'Hours' },
              { value: TimeRangeUnit.Day, title: 'Days' },
              { value: TimeRangeUnit.Week, title: 'Weeks' },
            ]}
            handlerSelected={value => dispatch(setTimeRangeUnit(value as TimeRangeUnit))}
            selectedValue={timeRangeUnit}
          />
        </div>
      </div>
      {(orderType === OrderType.TAKE_PROFIT || orderType === OrderType.STOP_LIMIT) && (
        <div>
          <LeverageWidgetClarification label={t('triggerPrice')} helperText={c('triggerPrice')} />
          <div>
            <LeverageInput
              value={triggerPrice.toString()}
              decimalScale={2}
              onChange={value => dispatch(setTriggerPrice(Number(value)))}
              placeholder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TimeRageAndTriggerPriceInput);
