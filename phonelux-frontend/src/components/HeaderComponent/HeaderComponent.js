import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo_phonelux.png'
import './HeaderComponent.css'

export default class HeaderComponent extends Component {
  render() {
    return (
      <div className='header-component'>
          <Link style={{ textDecoration: 'none' }} to={"/"}>
        <img src={logo}></img>
        </Link>
      </div>
    )
  }
}
