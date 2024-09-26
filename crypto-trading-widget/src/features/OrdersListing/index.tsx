import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { getNftMetadata, Nft } from '../../services/moralis/nft-api';
import { Chain, chainConfigs } from '../../utils/chains';
import { useTokenLists } from '../../hooks/useTokenLists';
import Web3 from 'web3';
import { decimalsToWeiUnit } from '../../utils/common';
import { WidgetNftProps } from '../../../pages/listing/[address]';
import { useNftOrders } from '../../hooks/useNftOrders';
import { useNftNormalizedMetadata } from 'features/NftPortfolio/hooks/useNftNormalizedMetadata';
import NftPicture from 'components/NftPicture';

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
    label: 'Price',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Created',
  },
  {
    id: 'expiry',
    numeric: true,
    disablePadding: false,
    label: 'Expiry',
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'Status',
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

interface OrderRowProps {
  order: NFTOrderFromAPI;
  chain: Chain;
  handleNftModalOpen: (props: WidgetNftProps) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, chain, handleNftModalOpen }) => {
  const [nft, setNft] = useState<Nft>();

  const { data: tokenList } = useTokenLists(chain);
  const takerToken = tokenList?.[order.takerAsset.toLowerCase()];

  useEffect(() => {
    getNftMetadata(order.makerAsset, order.makerAssetId, chainConfigs[chain].moralisName).then(res => {
      setNft(res.data);
    });
  }, []);

  const { data: metadata } = useNftNormalizedMetadata(nft);

  return (
    <TableRow hover role="checkbox">
      <TableCell
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        component="th"
        id={order.orderHash}
        scope="row"
        padding="none"
      >
        <NftPicture url={metadata?.imageUrl || metadata?.animationUrl} width={100} height={70} />
      </TableCell>
      <TableCell align="left">{metadata?.name}</TableCell>
      <TableCell align="left">
        {takerToken
          ? `${Web3.utils.fromWei(order.takerAmount, decimalsToWeiUnit[takerToken.decimals])} ${takerToken.symbol}`
          : 'unknown'}
      </TableCell>
      <TableCell align="left">{dayjs(order.createdAt * 1000).format('YYYY-MM-DD HH:mm')}</TableCell>
      <TableCell align="left">{dayjs().to(order.expiry * 1000, true)}</TableCell>
      <TableCell align="left">{order.state}</TableCell>
      <TableCell align="left" onClick={() => handleNftModalOpen({ chain, order })}>
        <Typography
          color={'primary.main'}
          style={{ textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer', width: 'fitContent' }}
        >
          {'BUY'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface OrdersListingProps {
  account: string;
  chain: Chain;
  handleNftModalOpen: (props: WidgetNftProps) => void;
}

export const OrdersListing: React.FC<OrdersListingProps> = ({ account, chain, handleNftModalOpen }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { data: orders } = useNftOrders({ maker: account, chainId: chainConfigs[chain].chainIdDecimal });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = orders && page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;
  return (
    <Box sx={{ width: '100%', marginBottom: 4 }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          paddingLeft: 3,
          paddingRight: 3,
          '.MuiToolbar-root': {
            paddingLeft: 0,
          },
        }}
      >
        <TableContainer>
          <Typography variant={'h5'} paddingTop={3} fontWeight={700} marginBottom={1}>
            {'Orders'}
          </Typography>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead />
            <TableBody>
              {orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                <OrderRow order={order} chain={chain} key={order.orderHash} handleNftModalOpen={handleNftModalOpen} />
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={orders?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
