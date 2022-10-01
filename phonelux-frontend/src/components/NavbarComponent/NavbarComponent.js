import React, { Component } from 'react'
import './NavbarComponent.css'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { style } from '@mui/system';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import StarsIcon from '@mui/icons-material/Stars';
import UserContext from '../../context/UserContext';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CompareIcon from '@mui/icons-material/Compare';

export class NavbarComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        
      }
    }

    logOut = () => {
      localStorage.clear()
      window.location.href = "/"
    }
    
  render() {
    return (
      <div className='phonelux-navbar'>
         {
          localStorage.getItem('token') && this.context.role == 'SUPERADMIN' ? 
          <Tippy placement='bottom' content='Менаџмент со корисници'>
            <Link style={{color: 'black'}} to={"/management/users"}>
              <SupervisorAccountIcon style={{fontSize: '40px', marginTop: '10px', marginRight: '10px' }} className='navbar-superadmin-icon'/>
            </Link>
          </Tippy> : <></>
        }
        {
          localStorage.getItem('token')  ? 
          <Tippy placement='bottom' content='Споредба на мобилни телефони'>
            <Link style={{color: 'black'}} to={"/compareoffers"}>
              <CompareIcon style={{fontSize: '40px', marginTop: '10px', marginRight: '10px' }} className='navbar-comparephone-icon'/>
            </Link>
          </Tippy> : <></>
        }
        {
          localStorage.getItem('token') ? 
          <Tippy placement='bottom' content='Омилени понуди'>
            <Link style={{color: 'black'}} to={"/user/"+this.context.userId+"/favouriteoffers"}>
              <StarsIcon style={{fontSize: '40px', marginTop: '10px', marginRight: '10px' }} className='navbar-favouriteoffers-icon'/>
            </Link>
          </Tippy> : <></>
        }

        { localStorage.getItem('token') ?
        <Tippy placement='bottom' content='Одјави се'>
        <LogoutIcon onClick={this.logOut} style={{fontSize: '40px', marginTop: '10px' }} className='navbar-logout-box-icon'/>
        </Tippy> 
        : 
        <Tippy placement='bottom' content='Најави се'>
        <Link style={{color: 'black'}} to={"/login"}> <PersonIcon  style={{fontSize: '50px', marginTop: '10px' }} className='navbar-account-box-icon'/></Link>
        </Tippy>
        }


      </div>
    )
  }
}

NavbarComponent.contextType = UserContext

export default NavbarComponent
