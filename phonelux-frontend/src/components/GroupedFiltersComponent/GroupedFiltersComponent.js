import React, { Component } from 'react'
import "./GroupedFiltersComponent.css"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterSelectComponent from "../FiltersComponents/FilterSelectComponent"
import FilterPriceComponent from "../FiltersComponents/FilterPriceComponent"
import SearchFieldComponent from '../FiltersComponents/SearchFieldComponent';
import { Grid } from '@mui/material';
import SortByComponent from '../FiltersComponents/SortByComponent';

export default class GroupedFiltersComponent extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      
    }
  }
  

  componentDidMount(){
  
  }

  render() {
    return (
      <>
      <div className="grouped-filters-component">
        <Grid container spacing={5}>

          <Grid className='filterscomponent-grid-item' item xs={6} sm={4} md={3}>
            <FilterSelectComponent changeHandler={this.props.passFilters} type='shops'/>
          </Grid>

          <Grid className='filterscomponent-grid-item' item xs={6} sm={4} md={3}>
            <FilterSelectComponent changeHandler={this.props.passFilters} type='brands'/>
          </Grid>

          <Grid className='filterscomponent-grid-item' item xs={6} sm={4} md={3}>
            <FilterPriceComponent changeHandler={this.props.passFilters}/>
          </Grid> 
       
          <Grid className='filterscomponent-grid-item' item xs={6} sm={4} md={3}>
            <SearchFieldComponent changeHandler={this.props.passFilters} />
          </Grid>
       </Grid>
      </div>
      <SortByComponent changeHandler={this.props.passFilters}/>
      </>
    )
  }

}
