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
import { Chain, chainConfigs } from '../../utils/chains';
import { getNftOrders } from './getNftOrders';
import { useTokenList } from '../../hooks/useTokenList';
import { useGetNftMetadata, useNftNormalizedMetadata } from '../../hooks/useGetNftMetadata';
import { NftPicture } from '../WidgetNft/components/NftPicture';
import { formatUnits } from '@ethersproject/units';

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

const OrderRow: React.FC<{ order: NFTOrderFromAPI }> = ({ order }) => {
  const { data: tokenList } = useTokenList(order.chainId);
  const takerToken = tokenList?.[order.takerAsset.toLowerCase()];

  const { data: nft } = useGetNftMetadata(order.makerAsset, order.makerAssetId, order.chainId);
  const { data: metadata } = useNftNormalizedMetadata(nft);

  const showImage = () => {
    if (!metadata?.imageUrl) {
      return <Box component="img" style={{ borderRadius: '8px' }} src={'/images/no_image.png'} height={70} alt={''} />;
    }

    return (
      <NftPicture
        sx={{ borderRadius: '8px', height: 70, width: 100 }}
        url={metadata.imageUrl ?? metadata.animationUrl}
        alt={'nft picture'}
      />
    );
  };

  const openOrder = () => {
    window.CryptoTradingWidget.openOrder(order.orderHash);
  };

  return (
    <TableRow hover role="checkbox">
      <TableCell
        sx={{ paddingTop: 2, paddingBottom: 2 }}
        component="th"
        id={order.orderHash}
        scope="row"
        padding="none"
      >
        {showImage()}
      </TableCell>
      <TableCell align="left">{metadata?.name}</TableCell>
      <TableCell align="left">
        {takerToken ? `${formatUnits(order.takerAmount, takerToken.decimals)} ${takerToken.symbol}` : 'unknown'}
      </TableCell>
      <TableCell align="left">{dayjs(order.createdAt * 1000).format('YYYY-MM-DD HH:mm')}</TableCell>
      <TableCell align="left">{dayjs().to(order.expiry * 1000, true)}</TableCell>
      <TableCell align="left">{order.state}</TableCell>
      <TableCell align="left" onClick={() => openOrder()}>
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
}

export const OrdersListing: React.FC<OrdersListingProps> = ({ account, chain }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [orders, setOrders] = useState<NFTOrderFromAPI[]>([]);

  useEffect(() => {
    getNftOrders({ maker: account, chainId: chainConfigs[chain].chainIdDecimal }).then(res => {
      setOrders(res.orders);
    });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;
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
              {orders.map(order => {
                if (order.state === 'PENDING') {
                  return <OrderRow order={order} key={order.orderHash} />;
                }
              })}
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
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
