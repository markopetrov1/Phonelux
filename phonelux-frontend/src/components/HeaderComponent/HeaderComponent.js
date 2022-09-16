import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo_phonelux.png'
import NavbarComponent from '../NavbarComponent/NavbarComponent'
import './HeaderComponent.css'

export default class HeaderComponent extends Component {


  redirectToHomepage = () =>{
    window.location.href = "/"
  }
  render() {
    return (
      <>
      <div className='homepage-navbar-component'>
        <NavbarComponent/>
      </div>
      <div className='header-component'>
          {/* <Link style={{ textDecoration: 'none' }} to={"/"}> */}
        <img className='phonelux-logo' onClick={this.redirectToHomepage} src={logo}></img>
        {/* </Link> */}
      </div>
      </>
    )
  }
}
