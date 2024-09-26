import { Chain } from '../../../utils/chains';
import { setPay, setReceive } from '../../../redux/appSlice';
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { handlePriceRouteUpdate } from '../../../redux/thunks/handlePriceRouteUpdate';
import { InputAction } from '../../../redux/app.interface';
import { useAppSelector } from '../../../redux/hooks/reduxHooks';

export const useCalculatePrice = () => {
  const selectedChain = useAppSelector(({ app }) => app.selectedChain);
  const dispatch = useDispatch();

  const handlePayAmountChange = (amount: string) => {
    dispatch(setPay({ amount }));
    dispatch(
      handlePriceRouteUpdate({
        inputAction: InputAction.PayValueChange,
        chain: selectedChain as Chain,
      }) as unknown as AnyAction
    );
  };

  const handleReceiveAmountChange = (amount: string) => {
    dispatch(setReceive({ amount }));
    dispatch(
      handlePriceRouteUpdate({
        inputAction: InputAction.ReceiveValuedChange,
        chain: selectedChain as Chain,
      }) as unknown as AnyAction
    );
  };

  const updatePriceRoute = () => {
    dispatch(
      handlePriceRouteUpdate({
        inputAction: InputAction.SwitchInputs,
        chain: selectedChain as Chain,
      }) as unknown as AnyAction
    );
  };

  return {
    handlePayAmountChange,
    handleReceiveAmountChange,
    updatePriceRoute,
  };
};
