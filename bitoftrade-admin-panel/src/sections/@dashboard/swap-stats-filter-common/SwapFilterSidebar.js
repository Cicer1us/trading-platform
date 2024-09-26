import PropTypes from 'prop-types';
import { Form, FormikProvider } from 'formik';
import dayjs from 'dayjs';
// material
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  styled
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
//
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { ChainId } from '../../../constants';

// ----------------------------------------------------------------------

SwapFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
  chainId: PropTypes.oneOf([
    ChainId.Ethereum,
    ChainId.Binance,
    ChainId.Polygon,
    ChainId.Fantom,
    ChainId.Avalanche
  ])
};

const StyledSelect = styled(Select)`
  & .MuiSelect-select {
    display: flex;
  }
`;

export default function SwapFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  formik,
  chainId
}) {
  const { values, setFieldValue, handleSubmit } = formik;

  const [tokens, setTokens] = useState([]);

  const getTokens = async (params = {}) => {
    try {
      const swapResponse = await axios.request({
        method: 'get',
        url: `/swap/traded-tokens`,
        baseURL: process.env.REACT_APP_SERVER_URL,
        params: { ...params, chainId }
      });

      const arrayUniqueByKey = [
        ...new Map(swapResponse.data.map((item) => [item.symbol, item])).values()
      ];
      setTokens(arrayUniqueByKey);
    } catch (err) {
      //
    }
  };

  useEffect(() => {
    getTokens().then();
  }, [chainId]);

  const handleDateFromChange = (newDate) => {
    const formattedDate = dayjs(newDate).hour(0).minute(0).second(0).toDate();
    setFieldValue('dateFrom', formattedDate);
    handleSubmit();
    getTokens({
      dateFrom: formattedDate,
      dateTo: values.date
    }).then();
  };

  const handleDateToChange = (newDate) => {
    const formattedDate = dayjs(newDate).hour(23).minute(59).second(59).toDate();
    setFieldValue('dateTo', formattedDate);
    handleSubmit();
    getTokens({
      dateFrom: values.dateFrom,
      dateTo: formattedDate
    }).then();
  };

  const handleSrcTokenChange = (event) => {
    setFieldValue('srcToken', event.target.value);
    handleSubmit();
  };

  const handleDestTokenChange = (event) => {
    setFieldValue('destToken', event.target.value);
    handleSubmit();
  };

  const handleInitiatorChange = (event) => {
    setFieldValue('initiator', event.target.value);
    handleSubmit();
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Iconify icon="eva:close-fill" width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div>
                    <DatePicker
                      disableFuture
                      label="From date"
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={values.dateFrom}
                      onChange={handleDateFromChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div>
                    <DatePicker
                      disableFuture
                      label="To date"
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={values.dateTo}
                      onChange={handleDateToChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </LocalizationProvider>

                <div>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="token-from-label">Token From</InputLabel>
                    <StyledSelect
                      labelId="token-from-label"
                      id="token-from-helper"
                      value={values.srcToken}
                      label="Token From"
                      onChange={handleSrcTokenChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {tokens.map((elem) => (
                        <MenuItem value={elem.address} key={`src${elem.symbol}`}>
                          <img
                            src={elem.logoURI}
                            alt=""
                            width={20}
                            height={20}
                            style={{ marginRight: '10px' }}
                          />
                          {elem.symbol}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </div>

                <div>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="token-to-label">Token To</InputLabel>
                    <StyledSelect
                      labelId="token-to-label"
                      id="token-to-helper"
                      value={values.destToken}
                      label="Token To"
                      onChange={handleDestTokenChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {tokens.map((elem) => (
                        <MenuItem value={elem.address} key={`dest${elem.symbol}`}>
                          <img
                            src={elem.logoURI}
                            alt=""
                            width={20}
                            height={20}
                            style={{ marginRight: '10px' }}
                          />
                          {elem.symbol}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </div>

                <div>
                  <TextField
                    value={values.initiator}
                    onChange={handleInitiatorChange}
                    id="user-address"
                    label="User Address"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Iconify icon="ic:round-clear-all" />}
              >
                Clear All
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}
