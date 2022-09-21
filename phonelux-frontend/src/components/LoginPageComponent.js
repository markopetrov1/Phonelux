import React, { Component } from 'react'
import HeaderComponent from './HeaderComponent/HeaderComponent'
import LoginFormComponent from './LoginRegisterComponents/LoginFormComponent'

export class LoginPageComponent extends Component {

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
        <LoginFormComponent/>
      </>
    )
  }
}

export default LoginPageComponent
