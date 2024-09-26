import { Typography, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import MuiChip from '@mui/material/Chip';
import { getEllipsisString } from 'src/@core/utils/getEllipsisString';
import { ChainIcon } from 'src/@core/components/chain-icon/ChainIcon';
import { StyledTokenImage } from 'src/pagesComponents/payment/SelectTokenButton';
import { NumericFormat } from 'react-number-format';
import { CHAINS } from 'src/connection/chains';
import { ChainId } from 'src/connection/types';
import { ExtendedPayment } from 'src/hooks/usePayments';
import dayjs from 'dayjs';

export const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 40,
    headerName: 'Date',
    field: 'date',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Typography variant='body2' color={'text.primary'}>
        {dayjs(row.createdAt).format('DD/MM/YYYY')}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 40,
    headerName: 'Payment',
    field: 'payment',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Typography variant='body2' color={'text.primary'}>
        {getEllipsisString(row.metadata.orderId)}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Source',
    field: 'source',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Typography variant='body2' color={'text.primary'}>
        {row.metadata.source}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Wallet',
    field: 'wallet',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Typography variant='body2' color={'text.primary'}>
        {row?.transaction?.merchant ? getEllipsisString(row.transaction.merchant, 6, 6) : '---'}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 40,
    headerName: 'Price',
    field: 'price',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Typography variant='body2' color={'text.primary'}>
        {<NumericFormat value={row.price.fiatPrice} displayType={'text'} thousandSeparator={true} decimalScale={4} />}{' '}
        {row.price.fiatCurrency.toUpperCase()}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Chain',
    field: 'chainId',
    renderCell: ({ row }: { row: ExtendedPayment }) => {
      return (
        <Box display='flex' alignItems='center' gap={2}>
          {row.transaction && <ChainIcon chainId={row.transaction.chainId} />}
          <Typography variant='body2' color={'text.primary'}>
            {row?.transaction ? CHAINS[row?.transaction.chainId as ChainId].name : '---'}
          </Typography>
        </Box>
      );
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Pay In',
    field: 'payIn',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Box display='flex' alignItems='center' gap={2}>
        {row.transaction?.payInTokenParams && (
          <StyledTokenImage
            src={row.transaction?.payInTokenParams?.logoURI}
            alt={row.transaction?.payInTokenParams?.symbol}
          />
        )}
        <Typography variant='body2' color={'text.primary'}>
          {row.transaction?.payInHumanAmount ? (
            <NumericFormat
              value={row.transaction.payInHumanAmount}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={4}
            />
          ) : (
            '---'
          )}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Pay Out',
    field: 'payOut',
    renderCell: ({ row }: { row: ExtendedPayment }) => (
      <Box display='flex' alignItems='center' gap={2}>
        {row.transaction?.payInTokenParams && (
          <StyledTokenImage
            src={row.transaction?.payOutTokenParams?.logoURI}
            alt={row.transaction?.payOutTokenParams?.symbol}
          />
        )}
        <Typography variant='body2' color={'text.primary'}>
          {row.transaction?.payOutAmount ? (
            <NumericFormat
              value={row.transaction.payOutHumanAmount}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={4}
            />
          ) : (
            '---'
          )}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Status',
    field: 'status',
    renderCell: ({ row }: { row: ExtendedPayment }) => {
      const color = row.status === 'PENDING' ? 'warning' : 'success';
      const link = `${CHAINS[row.transaction?.chainId as ChainId]?.blockExplorerUrls}/tx/${row.transaction?.txHash}`;

      return (
        <MuiChip
          label={row.status}
          component='a'
          href={row.transaction ? link : '#'}
          variant='outlined'
          color={color}
          clickable
          disabled={!row.transaction}
          target='_blank'
        />
      );
    }
  }
];
