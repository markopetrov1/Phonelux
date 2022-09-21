import axios from 'axios'
import React, { Component } from 'react'
import UserContext from '../../context/UserContext'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import "./UserFavouriteOffersComponent.css"
import StarIcon from '@mui/icons-material/Star';
import PhoneOfferComponent from '../PhoneOfferComponent/PhoneOfferComponent'
import CheaperOffersComponent from '../CheaperOffersComponent/CheaperOffersComponent'
import { wait } from '@testing-library/user-event/dist/utils'

export class UserFavouriteOffersComponent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         userFavouriteOffers: [],
         openModal : false,
         cheaperOffers: [],
         openedOfferPrice: 0,
      }
    }

    componentDidMount(){
      if(!localStorage.getItem('token')){
        window.location.href = "/"
      }

      this.getFavouriteOffersForLoggedUser()
    }

    getFavouriteOffersForLoggedUser = () => {
      var config = {
        method: 'get',
        url: '/user/'+window.location.href.split('/')[4]+'/favouriteoffers',
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };

      axios(config)
      .then(response => {
        this.setState({
          userFavouriteOffers: response.data
        })
      })
      .catch(error => {
        console.log(error)
      })
    }

    handleClose = () =>{
      this.setState({
        openModal: false
      })
    }

    handleOpen = (cheaperOffersToShow,offer_price) =>{
      this.setState({
        openModal: true,
        cheaperOffers: cheaperOffersToShow,
        openedOfferPrice: offer_price
      })
    }
    
  render() {
  // console.log(this.context)

    return (
      <div className='user-favourite-offers-main'>
        <HeaderComponent/>
        <div className='user-favourite-offers-header'>
          <StarIcon style={{fontSize: '50px', marginTop: '20px', marginRight: '10px'}}/>
          <h1 className='user-favourite-offers-header-text'>
            Омилени понуди
          </h1>
          <StarIcon style={{fontSize: '50px', marginTop: '20px', marginLeft: '10px'}}/>
          </div>

          {(() => {
            if(this.state.userFavouriteOffers.length != 0){
              return <table cellPadding={20} className='phone-with-offers-table'>
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
                  this.state.userFavouriteOffers.map((offer,idx) => <PhoneOfferComponent key={idx} id={offer.id}
                  is_validated={offer.is_validated} offer_shop={offer.offer_shop} offer_name={offer.offer_name}
                  price={offer.price} offer_url={offer.offer_url} handleOpen={this.handleOpen} 
                  loggedUserFavouriteOffers={this.state.userFavouriteOffers}
                  getFavouriteOffersForLoggedUser={this.getFavouriteOffersForLoggedUser}
                  />) 
                }
              </tbody>
            </table>
            }
            else{
              return <h1 className='no-offers-saved-message'>Нема зачувано понуди</h1>
            }
        
          })()}
          
          <CheaperOffersComponent
           cheaperOffers={this.state.cheaperOffers} 
          openModal={this.state.openModal} 
          handleClose={this.handleClose}
          openedOfferPrice={this.state.openedOfferPrice}/>
      </div>

    )
  }
}

UserFavouriteOffersComponent.contextType = UserContext
export default UserFavouriteOffersComponent
