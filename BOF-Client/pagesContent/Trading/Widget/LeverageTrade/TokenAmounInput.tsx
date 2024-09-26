import React, { useState } from 'react';
import style from './LeverageTrade.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useDispatch } from 'react-redux';
import { MarketResponseObject } from '@dydxprotocol/v3-client';
import { setLeverageOrderError, setTokenAmount } from '@/redux/leverageSlice';
import { InputWithCoinIcon } from '@/components/Inputs/InputWithCoinIcon';
import LeverageWidgetClarification from './LeverageWidgetClarification';
import useMultilingual from '@/hooks/useMultilingual';

const TokenAmountInput: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('widget');
  const { c } = useMultilingual('leverageWidgetTooltip');

  const [onFocus, setOnFocus] = useState<boolean>(false);
  const usdAmount = useAppSelector(({ leverage }) => leverage?.usdAmount);
  const equity = useAppSelector(({ dydxData }) => Number(dydxData?.account?.equity));
  const markets = useAppSelector(({ dydxData }) => dydxData?.markets);
  const tokenAmount = useAppSelector(({ leverage }) => leverage?.tokenAmount);
  const selectedAsset = useAppSelector(({ leverage }) => leverage?.selectedMarket);

  const currentMarket: MarketResponseObject = markets && markets[`${selectedAsset}-USD`];
  const currentMarketPrice: number = markets && Number(currentMarket?.oraclePrice);
  const minOrderSize: number = markets && Number(currentMarket?.minOrderSize);

  const handleTokenAmountInput = value => {
    if (value && Number(value) < minOrderSize) {
      dispatch(setLeverageOrderError(`Your order size is below the minimum (${minOrderSize} ${selectedAsset})`));
    } else if (value && Number(value) > Number(currentMarket.maxPositionSize)) {
      dispatch(setLeverageOrderError(`Maximum position size for ${selectedAsset} is ${currentMarket.maxPositionSize}`));
    } else {
      dispatch(setLeverageOrderError(null));
    }
    if (onFocus) {
      dispatch(setTokenAmount({ tokenAmount: value, currentMarketPrice, equity }));
    }
  };

  return (
    <>
      <div className={style.cell}>
        <LeverageWidgetClarification label={t('amount')} helperText={c('amount')} />
        <div className={style.usdcAmountLabel}>{usdAmount ? Number(usdAmount).toFixed(2) : 0} USDC</div>
      </div>
      <div className={style.amountInputWrapper}>
        <InputWithCoinIcon
          value={tokenAmount ?? ''}
          decimalScale={
            currentMarket && currentMarket.stepSize?.indexOf('.') > 0 ? currentMarket.stepSize?.length - 2 : 0
          }
          onChange={handleTokenAmountInput}
          coinName={selectedAsset}
          placeholder="0"
          coinSymbol={selectedAsset}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
        />
      </div>
    </>
  );
};

export default React.memo(TokenAmountInput);
