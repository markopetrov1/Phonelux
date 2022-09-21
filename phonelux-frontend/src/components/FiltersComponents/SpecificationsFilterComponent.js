import React, { Component } from 'react'
import './SpecificationsFilterComponent.css'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tippy from '@tippyjs/react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterSelectComponent from './FilterSelectComponent';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
export class SpecificationsFilterComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        anchorEl: null
      }
    }

    handleClick = (event) => {
      this.setState({
        anchorEl: event.currentTarget
      })
    };

    handleClose = () => {
      this.setState({
        anchorEl: null
      })
    };

  render() {

    const open = Boolean(this.state.anchorEl);
    const id = open ? 'specifications-popover' : undefined;

    return (
      <div className='specifications-filter-main'>
        <h4 aria-describedby={id} className='specifications-filter-header' onClick={this.handleClick}>Спецификации
        <ArrowDropDownIcon style={{marginTop:'-2px'}}/>
        </h4>
      <Popover
        className='specifications-filter-popover'
        id={id}
        open={open}
        anchorEl={this.state.anchorEl}
        onClose={this.handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <div className='popover-specification-container'>
        <h2 className='popover-specification-container-header'>Филтер за спецификации</h2>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='ram'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='rom'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='frontcamera'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='backcamera'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='chipset'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='cpu'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='operatingsystem'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='color'></FilterSelectComponent>
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='battery'></FilterSelectComponent>
        </div>
      </Popover>
      </div>
    )
  }
}

export default SpecificationsFilterComponent

