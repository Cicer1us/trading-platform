import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { usePaymentsVolume } from 'src/hooks/usePaymentsVolume';
import { StyledSecurityContentWrapper } from 'src/pagesComponents/merchant/security/styled';

const StyledVolumeValue = styled(Typography, {
  name: 'StyledVolumeValue'
})(({ theme }) => ({
  fontVariant: 'body1',
  fontSize: '3rem',
  lineHeight: '3rem',
  color: theme.palette.success.main
}));

const StyledVolumesContainer = styled(Box, {
  name: 'StyledVolumesContainer'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row'
  }
}));

type VolumeData = {
  title: string;
  description: string;
  volume?: number;
};

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoader'
})(({ theme }) => ({
  color: theme.palette.success.main
}));

const Volumes = () => {
  const { data: dataAllTime, isLoading: isAllTimePaymentsVolumeLoading } = usePaymentsVolume('allTime');

  const { data: dataLastMonth, isLoading: isLastTimePaymentsVolumeLoading } = usePaymentsVolume('lastMonth');

  const { data: dataLastDay, isLoading: isLastDayPaymentsVolumeLoading } = usePaymentsVolume('lastDay');

  return (
    <StyledVolumesContainer>
      <Volume
        title='Total Volume'
        description='The sum of all transactions linked to the users wallet and shop.'
        volume={dataAllTime?.data?.volume}
        isLoading={isAllTimePaymentsVolumeLoading}
      />
      <Volume
        title='1 Month Volume'
        description='Volume for all transactions within a one-month period.'
        volume={dataLastMonth?.data?.volume}
        isLoading={isLastTimePaymentsVolumeLoading}
      />
      <Volume
        title='1 Day Volume'
        description='Total volume for all transactions within a single day.'
        volume={dataLastDay?.data?.volume}
        isLoading={isLastDayPaymentsVolumeLoading}
      />
    </StyledVolumesContainer>
  );
};

function Volume(props: VolumeData & { isLoading: boolean }) {
  return (
    <StyledSecurityContentWrapper>
      <Box
        padding={'2.5rem 0.5rem'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
        minWidth={'280px'}
      >
        {props.isLoading ? (
          <StyledLoader />
        ) : (
          <>
            <Typography variant='h5' textAlign={'center'}>
              {props.title}
            </Typography>
            <Typography variant='body2' textAlign={'center'} mt={2} maxWidth={'280px'}>
              {props.description}
            </Typography>
            <Box display={'flex'} justifyContent={'center'} alignItems={'end'} mt={6}>
              <StyledVolumeValue>{props?.volume ?? 0}</StyledVolumeValue>
              <Typography textTransform={'uppercase'} variant='body2' lineHeight={'2rem'}>
                {'/usdc'}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </StyledSecurityContentWrapper>
  );
}

export default Volumes;
