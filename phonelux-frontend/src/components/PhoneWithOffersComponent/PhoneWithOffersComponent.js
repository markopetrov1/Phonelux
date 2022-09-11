import { Paper } from '@mui/material'
import axios from 'axios'
import React, { Component } from 'react'
import PhoneOfferComponent from '../PhoneOfferComponent/PhoneOfferComponent'
import './PhoneWithOffersComponent.css'
import phoneImg from '../../images/phone.png'

export class PhoneWithOffersComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         phone_offers: []
      }
    }

    componentDidMount(){
      axios.get('/phones/offers/'+this.props.phoneId)
      .then(response => {
          this.setState({
              phone_offers: response.data
          })
      }).catch(error => console.log(error))
    }

  render() {
    return ( 
      <div className='phone-with-offers-main'>

        <div className='phone-with-offers-sub-main'>
            <div className='phone-with-offers-totaloffers-div'>
                <h3 className='phone-with-offers-totaloffers-header'>Понуди: {this.props.total_offers}</h3>
            </div>

            <div className='phone-with-offers-image-wrapper'>
              <Paper className='phone-with-offers-paper' elevation={5}>
                <img className='phone-with-offers-image' src={this.props.image_url == null ? phoneImg : this.props.image_url}/>
                </Paper>
            </div>

            <div className='phone-with-offers-model-wrapper'>
            <h1 className='phone-with-offers-model-header'>{this.props.model}</h1>
            </div>
        </div>

        <div className='phone-with-offers-section'>

          <table cellPadding={20} className='phone-with-offers-table'>
            <thead className='phone-with-offers-table-head'>
              <tr>
              <th>Продавница</th>
              <th>Име на понуда</th>
              <th>Цена</th>
              <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.phone_offers.map((offer,idx) => <PhoneOfferComponent key={idx} id={offer.id}
                is_validated={offer.is_validated} offer_shop={offer.offer_shop} offer_name={offer.offer_name}
                price={offer.price} offer_url={offer.offer_url}
                />) 
              }
            </tbody>
          </table>

        </div>

      </div>
    )
  }
}

export default PhoneWithOffersComponent
