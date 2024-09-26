import React, { useCallback, useMemo, useState, useLayoutEffect } from 'react';
import { Grid, Box, Modal } from '@mui/material';
import { OrdersTable } from './components/OrderTable/OrdersTable';
import { NftWidget } from './NftWidget/NftWidget';
import { NoNftsPage } from './components/NoNftsPage';
import { NftSearchBar } from './NftWidget/NftSearchBar';
import { NftCard } from './components/NftCard';
import { useBreakpoints } from 'utils/hooks/useBreakpoints';
import { SCardListWrapper, SModalCloseIcon, SModalContent, SPagination, SSelectedNftCard } from './styled';
import { Nft } from 'services/moralis/nft-api';
import { useAllNfts } from 'hooks/useNftList';
import { useWalletContext } from 'context/WalletContext';
import { useNftSearchFilters } from './hooks/useNftSearchFilters';

export const NftPortfolio = () => {
  const { account, walletChain } = useWalletContext();
  const manageNftSearchFilters = useNftSearchFilters();
  const { allNfts, noNfts } = useAllNfts(manageNftSearchFilters.nftsSearchFilters);
  const [page, setPage] = React.useState(1);
  const { isMobile } = useBreakpoints();
  const itemsPerPage = useMemo(() => (isMobile ? 4 : 8), [isMobile]);

  const currentPageNfts = useMemo(() => {
    return allNfts.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage);
  }, [page, itemsPerPage, allNfts]);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [selectedNft, setSelectedNft] = useState<Nft>();
  useLayoutEffect(() => {
    // Reset selected nft when account or chain changes
    setSelectedNft(undefined);
  }, [account, walletChain]);

  const resetSelectedNft = useCallback(() => setSelectedNft(undefined), []);

  const SellOrUnlockNftContent = !!selectedNft && (
    <Grid item xs={12} md={12} lg={5} xl={4} flex="1 1 100%">
      <SSelectedNftCard>
        {walletChain && <NftWidget selectedNft={selectedNft} currentPageNfts={currentPageNfts} />}
      </SSelectedNftCard>
    </Grid>
  );

  return (
    <Grid container spacing={2} flexGrow={1}>
      <Grid
        item
        xs={12}
        md={12}
        lg={selectedNft ? 7 : 12}
        xl={selectedNft ? 8 : 12}
        display={'flex'}
        flexDirection={'column'}
      >
        <SCardListWrapper>
          <Box display={'flex'} flexDirection={'column'} flexGrow={1}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <NftSearchBar manageNftSearchFilters={manageNftSearchFilters} />

              {noNfts ? (
                <NoNftsPage />
              ) : (
                <>
                  <Grid container flexGrow={1}>
                    {currentPageNfts.map(nft => {
                      return nft ? (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={nft.token_address + nft.token_id}>
                          <NftCard
                            nft={nft}
                            selected={
                              nft.token_address === selectedNft?.token_address && selectedNft?.token_id === nft.token_id
                            }
                            onClick={setSelectedNft}
                          />
                        </Grid>
                      ) : (
                        <></>
                      );
                    })}
                  </Grid>
                </>
              )}
            </Box>
            <Box display="flex" justifyContent="end">
              <SPagination
                count={Math.ceil(allNfts.length / 8)}
                page={page}
                siblingCount={0}
                boundaryCount={1}
                onChange={handleChange}
                color={'secondary'}
              />
            </Box>
          </Box>
        </SCardListWrapper>
      </Grid>
      {isMobile ? (
        <>
          <Modal
            open={!!selectedNft}
            onClose={resetSelectedNft}
            aria-labelledby="sell-or-unlock-nft-modal-title"
            aria-describedby="sell-or-unlock-nft-modal-description"
          >
            <SModalContent>
              <Grid container spacing={2}>
                <SModalCloseIcon onClick={resetSelectedNft} />
                <>{SellOrUnlockNftContent}</>
              </Grid>
            </SModalContent>
          </Modal>
        </>
      ) : (
        <>{SellOrUnlockNftContent}</>
      )}

      <Grid item xs={12} display="flex" flexDirection={'column'}>
        {account && walletChain ? (
          <OrdersTable manageNftSearchFilters={manageNftSearchFilters} account={account} chain={walletChain} />
        ) : null}
      </Grid>
    </Grid>
  );
};
