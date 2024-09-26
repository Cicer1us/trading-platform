import React from 'react';
import FormControl from '@mui/material/FormControl';
import Icon from '@mui/material/Icon';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DropDownIcon } from './Icons/DropDownIcon';
import { Box, styled } from '@mui/material';

interface SelectItem {
  name: string;
  image: string;
  value: any;
}

interface SelectWithIconProps {
  items: SelectItem[];
  onSelect: (value: any) => void;
  selectedValue: any;
}

const SSelectWithIcon = styled(Select, {
  name: 'SSelectWithIcon',
})(({ theme }) => ({
  height: 40,
  backgroundColor: theme.palette.secondary.main,
  fontWeight: 700,
  fontSize: 14,
  stroke: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    width: 72,
  },
}));

const SSelectMenuItem = styled(MenuItem, {
  name: 'SSelectMenuItem',
})(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.secondaryButton.main,
  },
}));

const SSelectNameWrapper = styled('div', {
  name: 'SSelectNameWrapper',
})(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SSelectImage = styled('img', {
  name: 'SSelectImage',
})({
  marginRight: 7,
  height: 20,
  width: 20,
});

export const SelectWithIcon: React.FC<SelectWithIconProps> = ({ items, onSelect, selectedValue }) => {
  return (
    <FormControl>
      <SSelectWithIcon
        value={selectedValue}
        onChange={e => onSelect(e.target.value)}
        IconComponent={props => (
          <Icon {...props}>
            <DropDownIcon />
          </Icon>
        )}
      >
        {items.map(({ name, image, value }) => (
          <SSelectMenuItem value={value} key={value + name}>
            <Box display={'flex'} alignItems={'center'}>
              <SSelectImage src={image} loading={'lazy'} alt={'chain image'} />

              <SSelectNameWrapper>{name}</SSelectNameWrapper>
            </Box>
          </SSelectMenuItem>
        ))}
      </SSelectWithIcon>
    </FormControl>
  );
};
