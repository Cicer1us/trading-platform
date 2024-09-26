import { FormControl, Icon, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import { DropDownIcon } from './Icons/DropDownIcon';
import React, { ReactNode } from 'react';

interface CustomSelectProps {
  items: string[];
  selected: string;
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ selected, items, onChange }) => {
  const theme = useTheme();

  const style = {
    backgroundColor: theme.palette.secondary.main,
    fontWeight: 700,
    stroke: theme.palette.text.primary,
  };

  const itemStyle = {
    '&.MuiMenuItem-root:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&.Mui-selected': {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      backgroundColor: `rgba(${theme.palette.primary.mainChannel} / 0.2)`,
    },
  };

  return (
    <FormControl fullWidth>
      <Select
        id="demo-simple-select-autowidth"
        value={selected}
        onChange={onChange}
        inputProps={{ 'aria-label': 'Without label' }}
        style={style}
        IconComponent={props => (
          <Icon {...props}>
            <DropDownIcon />
          </Icon>
        )}
      >
        {items.map(value => {
          return (
            <MenuItem value={value} key={value} sx={itemStyle}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
