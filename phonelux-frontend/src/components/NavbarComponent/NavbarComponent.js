import React, { Component } from 'react'
import './NavbarComponent.css'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { style } from '@mui/system';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export class NavbarComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         profileSectionOpen: false
      }
    }
    
  render() {
    return (
      <div className='phonelux-navbar'>
        <Tippy placement='bottom' content='Најави се'>
        <Link style={{color: 'black'}} to={"/login"}> <PersonIcon  style={{fontSize: '50px', marginTop: '10px' }} className='navbar-account-box-icon'/></Link>
        </Tippy>

        {/* favourite offers icon goes here */}

      </div>
    )
  }
}

export default NavbarComponent
