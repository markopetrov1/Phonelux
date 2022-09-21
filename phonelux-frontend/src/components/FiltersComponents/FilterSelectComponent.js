
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
        const {type} = this.props
        console.log(type)
      this.state = {
         pickedItems: localStorage.getItem(type) ? localStorage.getItem(type).split(',') : [],
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
        switch (this.props.type) {

          case 'brands':
            endpoint = '/brands'
          this.setState({
            type: 'Брендови'
          })
            break;
          case 'shops':
            endpoint = '/shops'
          this.setState({
            type: 'Продавници'
          })
            break;

          case 'ram':
            endpoint = '/specifications/ram'
          this.setState({
            type: 'РАМ меморија'
          })
            break;

          case 'rom':
            endpoint = '/specifications/rom'
          this.setState({
            type: 'РОМ меморија'
          })
            break;

           case 'frontcamera':
            endpoint = '/specifications/frontcamera'
          this.setState({
            type: 'Предна камера'
          })
            break;

           case 'backcamera':
            endpoint = '/specifications/backcamera'
          this.setState({
            type: 'Задна камера'
          })
            break;

             case 'chipset':
            endpoint = '/specifications/chipset'
          this.setState({
            type: 'Чипсет'
          })
            break;

           case 'cpu':
            endpoint = '/specifications/cpu'
          this.setState({
            type: 'Процесор'
          })
            break;


         case 'operatingsystem':
            endpoint = '/specifications/operatingsystem'
          this.setState({
            type: 'Оперативен систем'
          })
            break;


         case 'color':
            endpoint = '/specifications/color'
          this.setState({
            type: 'Боја'
          })
            break;

            case 'battery':
              endpoint = '/specifications/battery'
            this.setState({
              type: 'Батерија'
            })
              break;

          default:
            break;
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

          switch (this.props.type) {
            case 'brands':
              this.props.changeHandler({brands: this.state.pickedItems.join(',')})
              localStorage.setItem('brands', this.state.pickedItems.join(','))
              break;

            case 'shops':
              this.props.changeHandler({shops: this.state.pickedItems.join(',')})
              localStorage.setItem('shops', this.state.pickedItems.join(','))
              break;

            case 'ram':
              this.props.changeHandler({ram: this.state.pickedItems.join(',')})
              localStorage.setItem('ram', this.state.pickedItems.join(','))
              break;
            case 'rom':
              this.props.changeHandler({rom: this.state.pickedItems.join(',')})
              localStorage.setItem('rom', this.state.pickedItems.join(','))
              break;
            case 'frontcamera':
              this.props.changeHandler({frontcamera: this.state.pickedItems.join(',')})
              localStorage.setItem('frontcamera', this.state.pickedItems.join(','))
              break;

            case 'backcamera':
              this.props.changeHandler({backcamera: this.state.pickedItems.join(',')})
              localStorage.setItem('backcamera', this.state.pickedItems.join(','))
              break;

            case 'chipset':
              this.props.changeHandler({chipset: this.state.pickedItems.join(',')})
              localStorage.setItem('chipset', this.state.pickedItems.join(','))
              break;

            case 'cpu':
              this.props.changeHandler({cpu: this.state.pickedItems.join(',')})
              localStorage.setItem('cpu', this.state.pickedItems.join(','))
              break;

            case 'operatingsystem':
              this.props.changeHandler({operatingsystem: this.state.pickedItems.join(',')})
              localStorage.setItem('operatingsystem', this.state.pickedItems.join(','))
              break;

            case 'color':
              this.props.changeHandler({color: this.state.pickedItems.join(',')})
              localStorage.setItem('color', this.state.pickedItems.join(','))
              break;

            case 'battery':
              this.props.changeHandler({battery: this.state.pickedItems.join(',')})
              localStorage.setItem('battery', this.state.pickedItems.join(','))
              break;

            default:
              break;
          }
          // if(this.props.type == 'brands')
          // {
          //   this.props.changeHandler({brands: this.state.pickedItems.join(',')})
          // }
          
          // if(this.props.type == 'shops')
          // {
          //   this.props.changeHandler({shops: this.state.pickedItems.join(',')})
          // }
          
        })


      };
    // sx={{ m: 1, width: 250 }} kaj formcontrol

  render() {
    return (
        <div>
        <FormControl className="form-select-component" sx={{ m: 1, width: this.props.width}}>
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
              <MenuItem key={item} value={item} > 
                <Checkbox checked={this.state.pickedItems.indexOf(item) > -1} />
                <ListItemText className='list-item-text-filters' primary={item} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

export default FilterSelectComponent
