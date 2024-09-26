import { Box, Button, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ViewMoreButtonProps {
  isExpanded: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ isExpanded, onClick }) => {
  const theme = useTheme();

  const styles = {
    display: 'block',
    width: 'fit-content',
    border: 'none',
    padding: 0,
    margin: 0,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondaryButton.light,
    fontSize: 12,
    fontWeight: 400,
    backgroundColor: 'transparent',
    '&:hover': {
      border: 'none',
    },
  };

  return (
    <>
      <Button variant="outlined" sx={styles} onClick={onClick}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isExpanded ? 'View less' : 'View more'}
          {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
      </Button>
    </>
  );
};
