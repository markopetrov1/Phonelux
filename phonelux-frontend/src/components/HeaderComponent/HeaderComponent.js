import React, { Component } from 'react'
import logo from '../../logo_phonelux.png'
import './HeaderComponent.css'

export default class HeaderComponent extends Component {
  render() {
    return (
      <div id='header'>
        <img src={logo}></img>
      </div>
    )
  }
}
