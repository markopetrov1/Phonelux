import React, { Component } from 'react'
import "./GroupedFiltersComponent.css"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterSelectComponent from "../FiltersComponents/FilterSelectComponent"
import FilterPriceComponent from "../FiltersComponents/FilterPriceComponent"
import SearchFieldComponent from '../FiltersComponents/SearchFieldComponent';

export default class GroupedFiltersComponent extends Component {
  render() {
    return (
      <div id="filtersDiv">
       <FilterSelectComponent/>
       <FilterSelectComponent/>
       <FilterPriceComponent/>
       <SearchFieldComponent/>
      </div>
    )
  }
}
