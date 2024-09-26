import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '@mui/material';
import { PaymentsTableSearch } from '../PaymentsTableSearch';
import { columns } from './columns';
import { usePayments } from 'src/hooks/usePayments';

export const PaymentsTable = () => {
  const [query, setQuery] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { data: payments, isLoading } = usePayments(
    paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize
  );

  return (
    <Card>
      <PaymentsTableSearch query={query} onQueryChange={setQuery} />

      <DataGrid
        rows={payments?.data ?? []}
        rowCount={payments?.total ?? 0}
        autoHeight
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        paginationMode={'server'}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        loading={isLoading}
      />
    </Card>
  );
};
