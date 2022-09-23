import axios from 'axios'
import React, { Component } from 'react'
import UserContext from '../context/UserContext'
import HeaderComponent from './HeaderComponent/HeaderComponent'
import PhoneWithOffersComponent from './PhoneWithOffersComponent/PhoneWithOffersComponent'

export class PhonePageComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        phoneId: window.location.href.split('/')[4],
        phone: null
      }
    }

    componentDidMount(){
        axios.get('/phones/'+this.state.phoneId)
        .then(response => {
          console.log(response.data)
            this.setState({
                phone: response.data
            })
        }).catch(error => console.log(error))
    }

  render() {
    return (
      <>
      <HeaderComponent/>
      <PhoneWithOffersComponent phoneId={this.state.phoneId} {...this.state.phone}/>   
      </>
    )
  }
}
export default PhonePageComponent
