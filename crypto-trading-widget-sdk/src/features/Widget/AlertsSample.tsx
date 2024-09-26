import * as React from 'react';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert';
import Box from '@mui/material/Box';

export const AlertsSample: React.FC = () => {
  return (
    <>
      <Box marginBottom={1}>
        <CustomAlert title={'Done'} message={'Congrats, you transaction was successful.'} severity={'success'} />
      </Box>

      <Box marginBottom={1}>
        <CustomAlert title={'Error'} message={'Unfortunately, your transaction was canceled.'} severity={'error'} />
      </Box>
      <Box marginBottom={1}>
        <CustomAlert title={'Warning'} message={'Your transaction is pending.'} severity={'warning'} />
      </Box>
    </>
  );
};
