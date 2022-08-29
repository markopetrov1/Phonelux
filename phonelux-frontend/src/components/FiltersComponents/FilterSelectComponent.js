import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import "./FilterSelectComponent.css"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const categories = [
  'Category1',
  'Category2',
  'Category3',
  'Category4',
  'Category5',
  'Category6',
  'Category7',
  'Category8',
  'Category9',
  'Category10',
];

export default function MultipleSelectCheckmarks() {
  const [category, setCategory] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl id="form" sx={{ m: 1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
        <Select
          size={"small"}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={category}
          onChange={handleChange}
          input={<OutlinedInput label="Category" />}  // tuka odi soodvetno imeto na filter
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              <Checkbox checked={category.indexOf(cat) > -1} />
              <ListItemText primary={cat} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
