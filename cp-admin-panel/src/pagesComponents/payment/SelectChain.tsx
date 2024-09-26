import { SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { CHAINS_TO_DISPLAY, CHAINS } from 'src/connection/chains';
import { ChainId } from 'src/connection/types';
import { setSelectedChainId } from 'src/store/payment/slice';
import { useWeb3React } from '@web3-react/core';
import { switchChain } from 'src/connection/switchChain';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { ChainIcon } from 'src/@core/components/chain-icon/ChainIcon';

export const SelectChain: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedChainId } = useAppSelector(({ payment }) => payment);
  const { connector } = useWeb3React();

  const handleChange = useCallback(
    async (event: SelectChangeEvent<ChainId>) => {
      const chainId = event.target.value as ChainId;

      try {
        dispatch(setSelectedChainId(chainId));
        await switchChain(connector, chainId);
      } catch (error) {
        console.error(error);
        toast.error('Failed to switch chain');
      }
    },
    [dispatch, connector]
  );

  return (
    <FormControl fullWidth>
      <InputLabel>{'Chain'}</InputLabel>
      <Select label='Chain' value={selectedChainId} onChange={handleChange}>
        {CHAINS_TO_DISPLAY.map(chain => (
          <MenuItem value={chain} key={chain}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <ChainIcon chainId={chain as ChainId} />
              {CHAINS[chain as ChainId].name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
