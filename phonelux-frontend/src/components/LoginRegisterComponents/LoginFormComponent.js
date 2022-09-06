import React, { Component } from 'react'
import profileIcon from "../../images/profileicon.png";
import EmailIcon from '@mui/icons-material/Email';
import "./LoginFormComponent.css"
import InputFormComponent from './InputFormComponent';
import { Link } from 'react-router-dom';
import axios from 'axios';



export class LoginFormComponent extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      email: '',
      password: '',
    }
  }
  
  changeHandler = (e) =>{
      this.setState({[e.target.name] : e.target.value})
  }

  submitHandler = (e) => {
      e.preventDefault()
      var qs = require('qs');
      var dataToSend = qs.stringify({
        'email': this.state.email,
        'password': this.state.password
      });

      var config = {
        method: 'post',
        url: '/login',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : dataToSend
      };

      axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  setValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
 
  }
  

render() {

  const {email,password} = this.state

  return (
      <div className="loginform-main-div">
       <div className="loginform-sub-main-div">
         <div>

           <div className="loginform-imgs-div">
             <div className="loginform-image-container">
               <img src={profileIcon} alt="profile" className="loginform-profile-img"/>
             </div>
           </div>
  
           <form onSubmit={this.submitHandler}>
             <h1>Најава</h1>

             <div className='loginform-email-input'>
             <InputFormComponent type='text' placeholder='Е-маил адреса' name='email' required={true}
              setValue={this.setValue} errorMessage='Полето е задолжително!'/>
             </div>
  
             <div className="loginform-password-input">
              <InputFormComponent type='password' placeholder='Лозинка' name='password' 
               setValue={this.setValue} required={true}
                errorMessage='Полето е задолжително!'/>
             </div>

  
            <div className="loginform-button-wrapper">
            <button className='loginform-button' type="submit">Најави се</button>
            </div>  
           </form>
           <p className='register-link'><Link to={"/register"}><a>Регистрирај се</a></Link></p>
  
         </div>
         
       </div>
      </div>
    );
}
}

export default LoginFormComponent
