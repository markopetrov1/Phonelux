import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import "./FilterPriceComponent.css"
import axios from 'axios';

export class FilterPriceComponent extends React.Component {

  constructor(props) {
    super(props)
  
    this.state = {
      value: [1000,150000],
      minValue: 0,
      maxValue: 0
    }
  }

  componentDidMount(){


  axios.get('/lowestPrice')
    .then(response => this.setState({minValue: response.data}))
    .catch(error => console.log(error)) 

    axios.get('/highestPrice')
    .then(response => this.setState({
      maxValue: response.data,
    }))
    .catch(error => console.log(error))

  }

  changeValue = (event, newValue) => {
    this.setState({
      value: newValue
    });
  };

  handleChange = () => {
    this.props.changeHandler({priceRange: this.state.value.join('-')})
  }


  render() {
    return (
      <div className="sliderPriceContainer">
      <label className="sliderPriceLabel">Цена:</label>
    <Box className="sliderBox" sx={{ width: 280 }}>
      <Slider
      id="priceSlider"
        getAriaLabel={() => 'Price range'}
        value={this.state.value}
        onChange={this.changeValue}
        onChangeCommitted={this.handleChange}
        valueLabelDisplay="auto"
        min={this.state.minValue}
        max={this.state.maxValue}
      />
    </Box>
    </div>
  );
  }
}

export default FilterPriceComponent

