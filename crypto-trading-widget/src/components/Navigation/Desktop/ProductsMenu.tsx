import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { CROSS_CHAIN_MSG, WIDGET_DOCS } from 'urls';
import theme from 'theme/theme';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ArrowDropdownIcon from 'components/Icons/ArrowDropdownIcon';
import Box from '@mui/material/Box';
import { ProductsSubmenu } from './ProductsSubmenu';

export const ProductsMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const mainLink = {
    alignSelf: 'center',
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: '400',
    paddingTop: 1,
    paddingRight: 4,
    '&:hover': { backgroundColor: 'transparent', color: theme.palette.text.primary },
  };
  const linkXs = {
    color: theme.palette.text.secondary,
    padding: 0,
    '&:hover': { color: theme.palette.text.primary },
  };

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={mainLink}
          disableRipple
        >
          Products
          <Box sx={{ marginLeft: '10px' }} />
          <ArrowDropdownIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    sx={{ padding: 3 }}
                  >
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>For developers</Typography>
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 2 }}>
                      <Link
                        href={CROSS_CHAIN_MSG}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        Cross-Chain Messaging
                      </Link>
                    </MenuItem>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>For business</Typography>
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 2 }}>
                      <Link
                        href={WIDGET_DOCS}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        AllPay Widget
                      </Link>
                    </MenuItem>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>For traders</Typography>
                    <MenuItem sx={{ paddingLeft: 0, paddingBottom: 2 }}>
                      <ProductsSubmenu />
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
};
