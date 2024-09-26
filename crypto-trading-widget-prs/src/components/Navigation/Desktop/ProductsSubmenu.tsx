import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { FIAT, LEVERAGE, MARKETS, SWAP } from 'urls';
import theme from 'theme/theme';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const ProductsSubmenu: React.FC = () => {
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
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: '400',
    padding: 0,
    '&:hover': { backgroundColor: 'transparent', color: theme.palette.text.primary },
  };
  const linkXs = {
    color: theme.palette.text.secondary,
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
          Trading Platform
          <Box sx={{ marginLeft: '32px' }} />
          <ArrowForwardIosIcon fontSize="small" />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="right-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'right-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper sx={{ marginLeft: 5 }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    sx={{ padding: 3 }}
                  >
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 1 }}>
                      <Link
                        href={SWAP}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        Swap
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 1 }}>
                      <Link
                        href={LEVERAGE}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        Leverage
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 1 }}>
                      <Link
                        href={FIAT}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        Fiat
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{ paddingLeft: 0, paddingBottom: 1 }}>
                      <Link
                        href={MARKETS}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={'14px'}
                        sx={linkXs}
                      >
                        Markets
                      </Link>
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
