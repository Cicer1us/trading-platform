import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { SOutlinedInput, SSlipPageButtonGridItem, StyledErrorText, StyledSlipPageButton } from './styled';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { selectSlippage, setSelectedSlippage } from 'src/store/payment/slice';
import debounce from 'lodash.debounce';
import { slippageFromPercentage, slippageToPercentage, slippageValidationErrorMessage } from './utils';
import { slippageSchema } from 'src/common/yupSchemas';

export const SlippageContent = () => {
  const selectedSlippage = useAppSelector(selectSlippage);
  const dispatch = useAppDispatch();
  const selectedSlippageInPercentage = slippageToPercentage(selectedSlippage);

  const setCustomSlippage = useCallback(
    (value: number) => {
      dispatch(setSelectedSlippage(value));
    },
    [dispatch]
  );

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [slippageValidationError, setSlippageValidationError] = useState<null | string>(null);

  const setSlipPageFocusOutInput = (value: number) => {
    setIsInputFocused(false);
    setCustomSlippage(value);
  };

  const valuesChangeHandler = useCallback(
    async (values: NumberFormatValues) => {
      if (values.floatValue === undefined) return;
      const customSlippage = slippageFromPercentage(values.floatValue);

      try {
        await slippageSchema.validate({ slippage: customSlippage });
        setSlippageValidationError(null);
        setCustomSlippage(customSlippage);
      } catch (error) {
        setSlippageValidationError(slippageValidationErrorMessage);
      }
    },
    [setCustomSlippage]
  );

  const debouncedEventHandler = useMemo(() => debounce(valuesChangeHandler, 300), [valuesChangeHandler]);

  return (
    <Box display='grid' gridTemplateColumns={'repeat(3, 1fr)'} gap={2}>
      <StyledSlipPageButton onClick={() => setSlipPageFocusOutInput(10)}>{'0.1%'}</StyledSlipPageButton>
      <StyledSlipPageButton onClick={() => setSlipPageFocusOutInput(50)}>{'0.5%'}</StyledSlipPageButton>
      <StyledSlipPageButton onClick={() => setSlipPageFocusOutInput(100)}>{'1%'}</StyledSlipPageButton>
      {isInputFocused ? (
        <>
          <NumericFormat
            decimalScale={3}
            onKeyDown={e => {
              //we need stop propagation of the event because input looses focus if
              //user types 0 key and focuses the first element in ul li list
              e.stopPropagation();
            }}
            defaultValue={selectedSlippageInPercentage}
            onValueChange={debouncedEventHandler}
            error={!!slippageValidationError}
            customInput={SOutlinedInput}
            suffix='%'
          />

          {!!slippageValidationError && (
            <StyledErrorText gridColumn={'1 / 4'}>{slippageValidationError}</StyledErrorText>
          )}
        </>
      ) : (
        <SSlipPageButtonGridItem
          onClick={() => {
            setIsInputFocused(true);
          }}
          value='custom'
        >
          {'Custom'}
        </SSlipPageButtonGridItem>
      )}
    </Box>
  );
};
