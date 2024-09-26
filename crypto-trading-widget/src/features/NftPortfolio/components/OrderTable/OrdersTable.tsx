import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Chain, chainConfigs } from '../../../../utils/chains';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Typography } from '@mui/material';
import { CancelNftOrderModal } from '../CancelNftOrderModal';
import Web3 from 'web3';
import { decimalsToWeiUnit } from '../../../../utils/common';
import { useTokenLists } from '../../../../hooks/useTokenLists';
import { useNftOrders } from '../../../../hooks/useNftOrders';
import Skeleton from '@mui/material/Skeleton';
import { toByTokenAddressAndTokenId, getShortedAddress } from '../../utils/common';
import { useNftNormalizedMetadata } from '../../hooks/useNftNormalizedMetadata';
import NftPicture from 'components/NftPicture';
import { CopyContentButton } from '../CopyContentButton';
import { useAllNfts } from 'hooks/useNftList';
import { Nft } from 'services/moralis/nft-api';
import { ManageNftSearchFilters } from '../../hooks/useNftSearchFilters';
import { STableContainer, STablePagination, STablePaper } from './styled';

dayjs.extend(relativeTime);

interface HeadCell {
  disablePadding: boolean;
  id: keyof NFTOrderFromAPI | string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'orderHash',
    numeric: false,
    disablePadding: true,
    label: 'Nft',
  },
  {
    id: 'makerAsset',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'takerAsset',
    numeric: false,
    disablePadding: false,
    label: 'Listing ID',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'expiry',
    numeric: true,
    disablePadding: false,
    label: 'Created',
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'End',
  },
  {
    id: 'close',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const OrderRow: React.FC<{
  order: NFTOrderFromAPI;
  chain: Chain;
  nftsListMap: Record<string, Record<string, Nft>>;
}> = ({ order, chain, nftsListMap }) => {
  const { data: tokenList } = useTokenLists(chain);

  // @TODO: IMPORTANT: find out why ts doesn't complain if I remove optional chaining below
  const nft = nftsListMap[order.makerAsset.toLowerCase()]?.[order.makerAssetId.toLowerCase()];

  const { data: metadata } = useNftNormalizedMetadata(nft);

  const [modalIsOpened, setModalIsOpened] = useState(false);
  const takerToken = tokenList?.[order.takerAsset.toLowerCase()];

  const handleModalClose = () => {
    setModalIsOpened(false);
  };

  return (
    nft && (
      <TableRow hover role="checkbox" sx={{ borderStyle: 'hidden' }}>
        <TableCell align="left" sx={{ paddingLeft: 0, maxWidth: '100px' }}>
          <NftPicture url={metadata?.imageUrl || metadata?.animationUrl} width={100} height={70} />
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: '200px' }}>
          {metadata?.name}
        </TableCell>
        <TableCell align="left">
          <Box display={'flex'} alignItems={'center'}>
            {getShortedAddress(order.orderHash)}
            <CopyContentButton content={order.orderHash} sx={{ maxWidth: 20, minWidth: 20, height: 20 }} />
          </Box>
        </TableCell>
        <TableCell align="left">
          {takerToken
            ? `${Web3.utils.fromWei(order.takerAmount, decimalsToWeiUnit[takerToken.decimals])} ${takerToken.symbol}`
            : 'unknown'}
        </TableCell>
        <TableCell align="left">{dayjs(order.createdAt * 1000).format('YYYY-MM-DD HH:mm')}</TableCell>
        <TableCell align="left">{dayjs(order.expiry * 1000).format('YYYY-MM-DD HH:mm')}</TableCell>
        <TableCell align="left">
          <Typography
            color={'error'}
            onClick={() => setModalIsOpened(true)}
            style={{
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              cursor: 'pointer',
              width: 'fitContent',
            }}
          >
            {'Cancel'}
          </Typography>
        </TableCell>
        <CancelNftOrderModal open={modalIsOpened} handleClose={handleModalClose} nft={nft} order={order} />
      </TableRow>
    )
  );
};

interface OrdersTableProps {
  account: string;
  chain: Chain;
  manageNftSearchFilters: ManageNftSearchFilters;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ account, chain, manageNftSearchFilters }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { data: orders, isLoading } = useNftOrders({ maker: account, chainId: chainConfigs[chain].chainIdDecimal });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { allNfts } = useAllNfts(manageNftSearchFilters.nftsSearchFilters);
  const nftsListMap = useMemo(() => toByTokenAddressAndTokenId(allNfts), [allNfts]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (orders?.length ?? 0)) : 0;

  if (isLoading) {
    return <Skeleton variant="rounded" sx={{ borderRadius: 3 }} height={400} />;
  } else {
    return (
      <Box display="flex" flexGrow={1}>
        <STablePaper>
          <STableContainer>
            <Typography variant={'h5'} paddingTop={3} fontWeight={700} marginBottom={1}>
              {'Orders'}
            </Typography>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <EnhancedTableHead />
              <TableBody>
                {orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                  <OrderRow order={order} chain={chain} key={order.orderHash} nftsListMap={nftsListMap} />
                ))}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 108 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </STableContainer>
          <STablePagination
            component="div"
            labelRowsPerPage={'Items'}
            rowsPerPageOptions={[5, 10, 15]}
            count={orders?.length ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </STablePaper>
      </Box>
    );
  }
};
