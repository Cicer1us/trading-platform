import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider, Link } from '@mui/material';
import theme from 'theme/theme';
import { CROSS_CHAIN_MSG, TRADING } from 'urls';

export const ProductsAccordionMenu: React.FC = () => {
  return (
    <div>
      <Accordion disableGutters elevation={0} sx={{ pl: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ fill: theme.palette.text.secondary }} />}
          sx={{ p: 0, color: theme.palette.text.secondary }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Products</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
          <Typography sx={{ fontSize: '12px', color: theme.palette.primary.main, fontWeight: 700 }}>
            For developers
          </Typography>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={CROSS_CHAIN_MSG}
            underline="none"
            color={theme.palette.text.secondary}
            fontSize={'14px'}
          >
            Cross-chain Messaging
          </Link>
          <Divider sx={{ my: 0.5, borderBottomWidth: 0 }} />
          <Typography sx={{ fontSize: '12px', color: theme.palette.primary.main, fontWeight: 700 }}>
            For business
          </Typography>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="/"
            underline="none"
            color={theme.palette.text.secondary}
            fontSize={'14px'}
          >
            AllPay Widget
          </Link>
          <Divider sx={{ my: 0.5, borderBottomWidth: 0 }} />
          <Typography sx={{ fontSize: '12px', color: theme.palette.primary.main, fontWeight: 700 }}>
            For traders
          </Typography>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={TRADING}
            underline="none"
            color={theme.palette.text.secondary}
            fontSize={'14px'}
          >
            Trading platform
          </Link>
          <Divider sx={{ mt: 2, bgcolor: theme.palette.action.disabled }} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
