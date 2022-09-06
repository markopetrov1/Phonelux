import React, { Component } from 'react'
import profileIcon from "../../images/profileicon.png";
import "./RegisterFormComponent.css"
import ErrorIcon from '@mui/icons-material/Error';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InputFormComponent from './InputFormComponent';
import { Input } from '@mui/material';
import axios from 'axios';


export class RegisterFormComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword:'',
      }
    }
  
    submitHandler = (e) => {
        e.preventDefault()

        let dataToSend = JSON.stringify({
          "firstName": this.state.firstName,
          "lastName": this.state.lastName,
          "email": this.state.email,
          "password": this.state.password
        });

        let config = {
          method: 'post',
          url: '/registration',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : dataToSend
        };

        axios(config)
        .then(function (response) {
          console.log(response);
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

    const {firstName,lastName,email,password,confirmPassword} = this.state

    return (
        <div className="registerform-main-div">
         <div className="registerform-sub-main-div">
           <div>

             <div className="registerform-imgs-div">
               <div className="registerform-image-container">
                 <img src={profileIcon} alt="profile" className="registerform-profile-img"/>
               </div>
             </div>
    
             <form onSubmit={this.submitHandler}>
               <h1>Регистрација</h1>

               <div className='registerform-name-lastname'>
                 <InputFormComponent type='text' placeholder='Име' name='firstName' required={true}
                 setValue={this.setValue} errorMessage='Името е задолжително!'/>

                 <InputFormComponent type='text' placeholder='Презиме' name='lastName' required={true}
                 setValue={this.setValue}  errorMessage='Презимето е задолжително!'/>
               </div>
               
               <div className='registerform-email-input'>
               <InputFormComponent type='email' placeholder='Е-маил адреса' name='email' required={true}
                setValue={this.setValue} errorMessage='Погрешен формат на е-маил адреса!'/>
               </div>
    
               <div className="registerform-password-input">
                <InputFormComponent type='password' placeholder='Лозинка' name='password' 
                 setValue={this.setValue} pattern='^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$' required={true}
                  errorMessage='Лозинката мора да има должина најмалку 8 карактери, 
                 да содржи најмалку една голема буква, еден број и еден посебен знак!'/>
               </div>

               <div className="registerform-confirm-password-input">
               <InputFormComponent type='password' placeholder='Потврди лозинка' name='confirmPassword' required={true} 
               pattern={this.state.password}
               setValue={this.setValue} errorMessage='Лозинките не се исти!'/>
               </div>
    
              <div className="registerform-button-wrapper">
              <button className='registerform-button' type="submit">Регистрирај се</button>
              </div>  
               
             </form>
    
           </div>
           
         </div>
        </div>
      );
  }
}

export default RegisterFormComponent
