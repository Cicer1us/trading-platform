import React, { useCallback, useContext } from 'react';
import { Icon, SelectChangeEvent, MenuItem } from '@mui/material';
import { DropDownIcon } from '../../../../components/Icons/DropDownIcon';
import { AVAILABLE_CHAINS, Chain, getChainConfigs } from '../../../../utils/chains';
import { WalletCtx, WalletCtxInterface } from '../../../../context/WalletContext';
import { SFormControl, SSelectChain, STypography, SMenuItemContent } from './styled';
import Image from 'next/image';

export const SelectChain: React.FC = () => {
  const { walletChain, selectChain } = useContext(WalletCtx) as WalletCtxInterface;
  const chains = getChainConfigs(AVAILABLE_CHAINS);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    const chain = event.target.value;
    selectChain(chain as Chain);
  }, []);

  return (
    <SFormControl fullWidth>
      <SSelectChain
        value={walletChain}
        onChange={handleChange}
        IconComponent={props => (
          <Icon {...props}>
            <DropDownIcon />
          </Icon>
        )}
      >
        {chains.map(({ name, image, chainIdHex }) => (
          <MenuItem value={chainIdHex} key={chainIdHex}>
            <SMenuItemContent>
              <Image loader={({ src }) => src} src={image} alt={'chain image'} width={20} height={20} unoptimized />
              <STypography variant={'body1'} fontWeight={700} fontSize={14}>
                {name}
              </STypography>
            </SMenuItemContent>
          </MenuItem>
        ))}
      </SSelectChain>
    </SFormControl>
  );
};
