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
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

LeverageFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
  markets: PropTypes.array
};

const StyledSelect = styled(Select)`
  & .MuiSelect-select {
    display: flex;
  }
`;

export default function LeverageFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  formik,
  markets
}) {
  const { values, setFieldValue, handleSubmit } = formik;

  const handleDateFromChange = (newDate) => {
    const formattedDate = dayjs(newDate).hour(0).minute(0).second(0).toDate();
    setFieldValue('dateFrom', formattedDate);
    handleSubmit();
  };

  const handleDateToChange = (newDate) => {
    const formattedDate = dayjs(newDate).hour(23).minute(59).second(59).toDate();
    setFieldValue('dateTo', formattedDate);
    handleSubmit();
  };

  const handleMarketTokenChange = (event) => {
    setFieldValue('market', event.target.value);
    handleSubmit();
  };

  const handleUserAddressChange = (event) => {
    setFieldValue('userAddress', event.target.value);
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
                    <InputLabel id="markets-label">Markets</InputLabel>
                    <StyledSelect
                      labelId="markets-label"
                      id="markets-helper"
                      value={values.market}
                      label="Markets"
                      onChange={handleMarketTokenChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {markets &&
                        markets.map((elem) => (
                          <MenuItem value={elem} key={`src${elem}`}>
                            {elem}
                          </MenuItem>
                        ))}
                    </StyledSelect>
                  </FormControl>
                </div>

                <div>
                  <TextField
                    value={values.userAddress}
                    onChange={handleUserAddressChange}
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
