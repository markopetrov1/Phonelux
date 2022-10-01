import React, { Component } from 'react'
import './SpecificationsFilterComponent.css'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tippy from '@tippyjs/react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterSelectComponent from './FilterSelectComponent';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PickSpecificationComponent from '../PickSpecificationComponent/PickSpecificationComponent';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import SettingsIcon from '@mui/icons-material/Settings';
export class SpecificationsFilterComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        anchorEl: null,
        openModal: false,
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

    handleModalClose = () =>{
      this.setState({
        openModal: false
      })
    }

    handleModalOpen = () =>{
        this.setState({
            openModal: true
        })
    }

  render() {

    const open = Boolean(this.state.anchorEl);
    const id = open ? 'specifications-popover' : undefined;

    return (
      <div className='specifications-filter-main'>
        <h4 aria-describedby={id} className='specifications-filter-header' onClick={this.handleClick}>
          <FilterAltIcon className='specifications-filter-icon-header'/>Филтер за спецификации
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
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("РАМ меморија") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='ram'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("РОМ меморија") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='rom'></FilterSelectComponent> : <></>
        } 
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Предна камера") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='frontcamera'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Задна камера") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='backcamera'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Чипсет") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='chipset'></FilterSelectComponent> : <></>
        }
         { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Процесор") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='cpu'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Оперативен систем") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='operatingsystem'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Боја") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='color'></FilterSelectComponent> : <></>
        }
        { !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Батерија") ?
        <FilterSelectComponent changeHandler={this.props.changeHandler} width={400} type='battery'></FilterSelectComponent> : <></>
        }
        </div>
      </Popover>
        <h4 aria-describedby={id} className='pick-specifications-header' onClick={this.handleModalOpen}>
          <SettingsIcon className='specifications-filter-icon-header'/>Спецификации за приказ
        </h4>
        { this.context.userId != '' && <PickSpecificationComponent
        openModal={this.state.openModal} 
        handleClose={this.handleModalClose}/> }
      </div>
    )
  }
}

SpecificationsFilterComponent.contextType = UserContext

export default SpecificationsFilterComponent

