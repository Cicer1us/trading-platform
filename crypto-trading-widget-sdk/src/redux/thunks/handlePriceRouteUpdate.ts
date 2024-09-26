import { Chain } from '../../utils/chains';
import { AppThunk } from '../store';
import { CalculateSwapValueParams, fetchPriceRoute } from '../../utils/common';
import { setButtonError, setPay, setPriceRoute, setReceive } from '../appSlice';
import { InputAction } from '../app.interface';
import { Action, EmptyObject, ThunkDispatch } from '@reduxjs/toolkit';
import { formatUnits } from '@ethersproject/units';

export interface HandlePriceRouteUpdate {
  inputAction: InputAction;
  chain: Chain;
}

const handleError = (error: string, dispatch: ThunkDispatch<EmptyObject, unknown, Action<string>>) => {
  if (error === 'ESTIMATED_LOSS_GREATER_THAN_MAX_IMPACT') {
    dispatch(setButtonError('ESTIMATED LOSS GREATER THAN MAX IMPACT'));
  } else if (error.includes('too small to proceed')) {
    dispatch(setButtonError('TOO SMALL AMOUNT'));
  } else {
    dispatch(setButtonError('SOMETHING WENT WRONG'));
  }
};

export const handlePriceRouteUpdate =
  (params: HandlePriceRouteUpdate): AppThunk =>
  async (dispatch, getState) => {
    // Get most new token params. Needed for update function. If used external params these values could be outdated.
    const { app } = getState();
    const amount = params.inputAction === InputAction.ReceiveValuedChange ? app.youReceive.amount : app.youPay.amount;
    const pay = params.inputAction !== InputAction.ReceiveValuedChange;

    dispatch(pay ? setPay({ amount }) : setReceive({ amount }));

    if (!amount || Number(amount) === 0) {
      const newAmount = !amount ? '' : '0';
      dispatch(pay ? setReceive({ loading: false, amount: newAmount }) : setPay({ loading: false, amount: newAmount }));
      dispatch(setPriceRoute(null));
      return;
    }

    const loading = { loading: true };
    dispatch(pay ? setReceive(loading) : setPay(loading));
    // Fetch price route
    const tokensMap = getState().app.tokenListMap[params.chain].tokens;
    const youReceivedTokenAddress = getState().app.tokenListMap[params.chain].youReceiveToken;
    const youPayTokenAddress = getState().app.tokenListMap[params.chain].youPayToken;
    const fetchRouteParams: CalculateSwapValueParams = {
      tokenIn: tokensMap[youReceivedTokenAddress],
      tokenOut: tokensMap[youPayTokenAddress],
      chain: params.chain,
      amount,
      side: pay ? 'SELL' : 'BUY',
    };
    try {
      const { priceRoute, error } = await fetchPriceRoute(fetchRouteParams as CalculateSwapValueParams);

      const currentAmount =
        params.inputAction === InputAction.ReceiveValuedChange
          ? getState().app.youReceive.amount
          : getState().app.youPay.amount;

      if (error && amount === currentAmount) {
        handleError(error, dispatch);
        const newStateParams = { amount: '', loading: false };
        dispatch(pay ? setReceive(newStateParams) : setPay(newStateParams));
        return;
      }
      const { destAmount, destDecimals, srcAmount, srcDecimals } = priceRoute;

      // Currently, shown value in receive (InputAction.ReceiveValuedChange)
      // or pay input in any other case (in case of pay value change, switch tokens, change token, get newer route)

      // Check if input value equal to value requested in price route
      if (amount === currentAmount) {
        // Update price route
        dispatch(setPriceRoute(priceRoute));
        /**
         * Update counter value
         * In case InputAction.ReceiveValuedChange -> update pay amount
         * Any other case -> update received amount
         * **/
        const newAmount = pay ? formatUnits(destAmount, destDecimals) : formatUnits(srcAmount, srcDecimals);
        const newStateParams = { amount: newAmount.toString(), loading: false };
        dispatch(pay ? setReceive(newStateParams) : setPay(newStateParams));
      }
    } catch (e) {
      if (String(e).includes('too many decimal places')) {
        dispatch(setButtonError('too many decimal places'));
      } else {
        dispatch(setButtonError('something went wrong'));
      }
      console.error(e);
    }
  };
