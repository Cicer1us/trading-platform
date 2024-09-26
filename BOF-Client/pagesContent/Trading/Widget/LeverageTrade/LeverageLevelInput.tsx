import React, { useState } from 'react';
import style from './LeverageTrade.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import LeverageInput from './LeverageInput/LeverageInput';
import { setLeverageLevel } from '@/redux/leverageSlice';
import { MarketResponseObject } from '@dydxprotocol/v3-client';
import useMultilingual from '@/hooks/useMultilingual';
import LeverageWidgetClarification from './LeverageWidgetClarification';

const LeverageLevelInput: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');
  const { c } = useMultilingual('leverageWidgetTooltip');

  const [onFocus, setOnFocus] = useState<boolean>(false);
  const leverageLevel = useAppSelector(({ leverage }) => leverage?.leverageLevel);
  const selectedAsset = useAppSelector(({ leverage }) => leverage?.selectedMarket);
  const markets = useAppSelector(({ dydxData }) => dydxData?.markets);
  const currentMarket: MarketResponseObject = markets && markets[`${selectedAsset}-USD`];
  const currentMarketPrice: number = markets && Number(currentMarket?.oraclePrice);
  const equity = useAppSelector(({ dydxData }) => Number(dydxData?.account?.equity));

  const leverageButtons = (leverageArray: number[]) => {
    return leverageArray.map(leverage => (
      <button
        key={leverage}
        onClick={() => {
          handleLeverageLevelInput(leverage, true);
        }}
        className={`${style.buttonPower} ${leverageLevel === leverage ? style.active : ''}`}
        type="button"
      >
        {leverage}x
      </button>
    ));
  };

  const handleLeverageLevelInput = (value, noFocusCheck = false) => {
    if (onFocus || noFocusCheck) {
      dispatch(setLeverageLevel({ leverageLevel: value, currentMarketPrice, equity }));
    }
  };

  return (
    <>
      <LeverageWidgetClarification label={t('leverageLevel')} helperText={c('leverageLevel')} />
      <div className={style.sectionPower}>
        <LeverageInput
          decimalScale={2}
          inputSuffix="x"
          onChange={value => handleLeverageLevelInput(value)}
          placeholder="0x"
          value={leverageLevel ?? ''}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
        />
        <div className={style.selectPower}>
          {selectedAsset === 'ETH' || selectedAsset === 'BTC'
            ? leverageButtons([5, 10, 20])
            : leverageButtons([2, 5, 10])}
        </div>
      </div>
    </>
  );
};

export default React.memo(LeverageLevelInput);
