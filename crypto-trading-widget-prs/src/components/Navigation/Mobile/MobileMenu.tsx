import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, ButtonBase, Link } from '@mui/material';
import { ProductsAccordionMenu } from './ProductsAccordionMenu';
import { BITOFTRADE_DOCS, BLOG, DISCORD, LINKEDIN, TELEGRAM, TWITTER } from 'urls';
import { TwitterIcon } from 'components/Icons/SocialMedia/TwitterIcon';
import { DiscordIcon } from 'components/Icons/SocialMedia/DiscordIcon';
import { LinkedInIcon } from 'components/Icons/SocialMedia/LinkedInIcon';
import { TelegramIcon } from 'components/Icons/SocialMedia/TelegramIcon';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: theme.spacing(2),
    minWidth: '209px',
    color: theme.palette.text.primary,
    border: '2px solid #38D9C0',
    '& .MuiMenu-list': {
      padding: '16px',
    },
    '& .MuiPaper-rounded': {
      border: 'none',
    },
  },
}));

const SMobileMenuWrapper = styled(Box, {
  name: 'StyledMobileMenuWrapper',
})(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

export const MobileMenu: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <SMobileMenuWrapper>
      <ButtonBase
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{ marginLeft: 0.5 }}
      >
        <MenuIcon
          sx={{
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 1,
            p: '4px',
            height: 32,
            width: 32,
          }}
        />
      </ButtonBase>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <ProductsAccordionMenu />

        <MenuItem onClick={handleClose}>
          <Link
            href={BLOG}
            underline="none"
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 700, fontSize: 14 }}
          >
            Blog
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            href={BITOFTRADE_DOCS}
            underline="none"
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 700, fontSize: 14 }}
          >
            Docs
          </Link>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleClose}
          disableRipple
          sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}
        >
          <ButtonBase target="_blank" rel="noopener noreferrer" href={TELEGRAM}>
            <TelegramIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={LINKEDIN}>
            <LinkedInIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={TWITTER}>
            <TwitterIcon />
          </ButtonBase>

          <ButtonBase target="_blank" rel="noopener noreferrer" href={DISCORD}>
            <DiscordIcon />
          </ButtonBase>
        </MenuItem>
      </StyledMenu>
    </SMobileMenuWrapper>
  );
};
