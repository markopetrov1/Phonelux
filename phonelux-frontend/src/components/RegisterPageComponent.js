import React, { Component } from 'react'
import HeaderComponent from './HeaderComponent/HeaderComponent'
import RegisterFormComponent from './LoginRegisterComponents/RegisterFormComponent'

export class RegisterPageComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

 
  componentDidMount(){
    if(localStorage.getItem('token'))
    {
      window.location.href = "/"
    }
  }

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
