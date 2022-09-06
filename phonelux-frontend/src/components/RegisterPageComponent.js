import React, { Component } from 'react'
import HeaderComponent from './HeaderComponent/HeaderComponent'
import RegisterFormComponent from './LoginRegisterComponents/RegisterFormComponent'

export class RegisterPageComponent extends Component {
  render() {
    return (
      <>
        <HeaderComponent/>
        <RegisterFormComponent/>
      </>
    )
  }
}

export default RegisterPageComponent
