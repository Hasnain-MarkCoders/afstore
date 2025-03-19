import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export default function MultipleSelectCheckmarks({label , checkValue , setCheckValue , names}) {
    
    const handleChange = (event) => {
    const { target: { value }} = event;
    setCheckValue(
    // On autofill we get a stringified value.
    typeof value === 'string' ? checkValue?.split(',') : value,
    );
    };

  return (
      <FormControl>
        <InputLabel id="demo-multiple-checkbox-label">{!!label ? label : ""}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={checkValue}
          onChange={handleChange}
          input={<OutlinedInput label={!!label ? label : ""} />}
          renderValue={(selected) => selected?.join(', ')}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name} className="multipleSelect">
              <Checkbox checked={checkValue?.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}