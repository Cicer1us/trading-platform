import { useState, SyntheticEvent, Fragment, useContext } from 'react';

import { useRouter } from 'next/router';

import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

import Icon from 'src/@core/components/icon';

import { Settings } from 'src/@core/context/settingsContext';
import { AuthContext } from 'src/providers/AuthProvider';

const StyledBadgeContentSpan = styled('span', {
  name: 'StyledBadgeContentSpan'
})(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}));

const StyledBadge = styled(Badge, {
  name: 'StyledBadge'
})({ marginLeft: 2, cursor: 'pointer' });

const StyledAvatar = styled(Avatar, {
  name: 'StyledAvatar'
})({ width: 40, height: 40 });

const StyledMenu = styled(Menu, {
  name: 'StyledMenu'
})({ '& .MuiMenu-paper': { width: 230, marginTop: 4 } });

const StyledMenuItem = styled(MenuItem, {
  name: 'StyledMenuItem'
})(({ theme }) => ({
  '& svg': { mr: 2, fontSize: '1.375rem', color: theme.palette.text.primary }
}));

interface UserDropdownProps {
  settings: Settings;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ settings }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
  };

  return (
    <Fragment>
      <StyledBadge
        overlap='circular'
        onClick={handleDropdownOpen}
        badgeContent={<StyledBadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <StyledAvatar alt='user' onClick={handleDropdownOpen} src='/images/avatars/1.png' />
      </StyledBadge>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        anchorOrigin={{ vertical: 'bottom', horizontal: settings.direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: settings.direction === 'ltr' ? 'right' : 'left' }}
      >
        <StyledMenuItem onClick={handleLogout}>
          <Icon icon='mdi:logout-variant' />
          {'Logout'}
        </StyledMenuItem>
      </StyledMenu>
    </Fragment>
  );
};

export default UserDropdown;
