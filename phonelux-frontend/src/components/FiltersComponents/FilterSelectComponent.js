
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import "./FilterSelectComponent.css"
import axios from 'axios';

export class FilterSelectComponent extends React.Component {

    constructor(props) {
      super(props)
        
      this.state = {
         pickedItems: [],
         items: [],
         type: '',
         ITEM_HEIGHT: 48,
         ITEM_PADDING_TOP: 8,
         MenuProps: {}
      }
 
    }

    componentDidMount(){
        this.state.MenuProps = {
            PaperProps: {
              style: {
                maxHeight: this.state.ITEM_HEIGHT * 5.5 + this.state.ITEM_PADDING_TOP,
                width: 250,
              },
            },
        }


        let endpoint 
        if(this.props.type == 'brands')
        {
          endpoint = '/brands'
          this.setState({
            type: 'Брендови'
          })
        }
        else{
          endpoint = '/shops'
          this.setState({
            type: 'Продавници'
          })
        }

        axios.get(endpoint)
        .then(response => this.setState({items: response.data}))
        .catch(error => console.log(error))
    }

    handleChange = (event) => {
       let value = event.target.value
        this.setState({
            pickedItems: typeof value === 'string' ? value.split(',') : value
        }, ()=>{
          if(this.props.type == 'brands')
          {
            this.props.changeHandler({brands: this.state.pickedItems.join(',')})
          }
          
          if(this.props.type == 'shops')
          {
            this.props.changeHandler({shops: this.state.pickedItems.join(',')})
          }
          
        })
      };


  render() {
    return (
        <div>
        <FormControl className="form-select-component" sx={{ m: 1, width: 200 }}>
          <InputLabel className="input-select-label">{this.state.type}</InputLabel>
          <Select
            size={"small"}
            labelId="input-label-id"
            className="input-select-option"
            multiple
            value={this.state.pickedItems}
            onChange={this.handleChange}
            input={<OutlinedInput className='inner-input-selectfilter' label={this.state.type} />} 
            renderValue={(selected) => selected.join(', ')}
            MenuProps={this.state.MenuProps}
  >
            {this.state.items.map((item) => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={this.state.pickedItems.indexOf(item) > -1} />
                <ListItemText primary={item} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

export default FilterSelectComponent
