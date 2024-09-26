import React from 'react';
import style from './LeverageTrade.module.css';
import { OrderType } from '@dydxprotocol/v3-client';
import useMultilingual from '@/hooks/useMultilingual';
import Tabs from '@/components/Tabs/Tabs';
import Tab from '@/components/Tabs/Tab/Tab';
// import Select from '@/components/Select/Select';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import { setOrderType } from '@/redux/leverageSlice';

const LeverageWidgetTabs: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');
  const tab = useAppSelector(({ leverage }) => leverage.orderType);

  return (
    <Tabs>
      {[OrderType.MARKET, OrderType.LIMIT, OrderType.STOP_LIMIT].map((item, index) => (
        <Tab
          className={style.tab}
          key={`${item}-${index}`}
          handlerSelect={() => dispatch(setOrderType(item))}
          isActive={tab === item}
        >
          {t(item.toLowerCase())}
        </Tab>
      ))}
      {/*DropDown to select order type*/}
      {/*<Select*/}
      {/*  menuPosition={'stopLimitCustom'}*/}
      {/*  size={'small'}*/}
      {/*  wrapperInputStyles={style.customSelect}*/}
      {/*  wrapperStyles={`${tab === OrderType.STOP_LIMIT || tab === OrderType.TAKE_PROFIT ? style.activeSelect : ''}`}*/}
      {/*  options={[*/}
      {/*    { value: OrderType.STOP_LIMIT, title: 'Stop Limit' },*/}
      {/*    { value: OrderType.TAKE_PROFIT, title: 'Take Profit Limit' },*/}
      {/*  ]}*/}
      {/*  staticTitle={'Stop'}*/}
      {/*  handlerSelected={value => dispatch(setOrderType(value as OrderType))}*/}
      {/*  selectedValue={OrderType.STOP_LIMIT}*/}
      {/*/>*/}
    </Tabs>
  );
};

export default React.memo(LeverageWidgetTabs);
