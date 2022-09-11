import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './PhoneOfferComponent.css'

export class PhoneOfferComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
       
      }
    }
    
    
  render() {
    // console.log(this.props)
    return (
      <tr className='phone-with-offers-table-row'>
      <td>{this.props.offer_shop}</td>
      <td><a style={{ textDecoration: 'none' }} href={this.props.offer_url}>{this.props.offer_name}</a></td>
      <td>{this.props.price} ден.</td>
      <td>
        <Link style={{ textDecoration: 'none' }} to={"/phoneoffer/"+this.props.id}>
          <button className='phone-offer-specifications-button'>Спецификации</button>
        </Link>
        </td>
      </tr>
    )
  }
}

export default PhoneOfferComponent

