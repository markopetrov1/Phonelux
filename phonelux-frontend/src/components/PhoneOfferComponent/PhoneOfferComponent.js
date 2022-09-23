import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './PhoneOfferComponent.css'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CompareIcon from '@mui/icons-material/Compare';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

export class PhoneOfferComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
      }
    }

    addToFavourite = () => {
      var config = {
        method: 'put',
        url: '/user/'+this.context.userId+'/addoffer/'+this.props.id,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };

      axios(config)
      .then(response => {
        this.props.getFavouriteOffersForLoggedUser()
      })
      .catch(error => {
        console.log(error)
      })
    }

    removeFromFavourite = () => {
      var config = {
        method: 'put',
        url: '/user/'+this.context.userId+'/removeoffer/'+this.props.id,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };

      axios(config)
      .then(response => {
        this.props.getFavouriteOffersForLoggedUser()
      })
      .catch(error => {
        console.log(error);
      });
    }


    getCheaperOffers = () =>{
      var config = {
        method: 'get',
        url: '/phoneoffer/'+this.props.id+'/cheaperoffers',
        headers: { }
      };
      
      axios(config)
      .then(response => {
        this.props.handleOpen(response.data,this.props.price)
      })
      .catch(error => {
        console.log(error);
      });
    }

    handleOfferCompare = () => {
      let offersToCompare = []
     if(localStorage.getItem('offersToCompare'))
     {
      offersToCompare = JSON.parse(localStorage.getItem('offersToCompare'))
     }

     if(!offersToCompare.includes(this.props.id) && offersToCompare.length<5)
     {
      offersToCompare.push(this.props.id)
     }
     else{
      offersToCompare = offersToCompare.filter(offer => offer != this.props.id)
     }
     localStorage.setItem('offersToCompare', JSON.stringify(offersToCompare))
     this.forceUpdate()
    }
    
    
  render() {
    return (
      <tr className='phone-with-offers-table-row'>
      <td>{this.props.offer_shop}</td>
      <td><a style={{ textDecoration: 'none' }} href={this.props.offer_url}>{this.props.offer_name}</a></td>
      <td>{this.props.price} ден.</td>
      <td>

        {/* if else jsx syntax here to add icon */}

        {(() => {
          if(!localStorage.getItem('token'))
          {
            return <></>
          }

          if(localStorage.getItem('offersToCompare') && localStorage.getItem('offersToCompare').includes(this.props.id))
          {
            return  <Tippy placement='bottom' content='Избриши понуда за споредба'>
                      <CompareIcon onClick={this.handleOfferCompare} className='phone-offer-compare-selected-icon' style={{fontSize: '40px', marginRight: '10px' }}/>
                    </Tippy>
          }
          else{
            return  <Tippy placement='bottom' content='Додади понуда за споредба'>
            <CompareIcon onClick={this.handleOfferCompare} className='phone-offer-compare-icon' style={{fontSize: '40px', marginRight: '10px' }}/>
          </Tippy>
          }
      })()}
        {
          window.location.href.split('/')[5] == 'favouriteoffers' ?   
          <Tippy placement='bottom' content='Прикажи поевтини понуди'>
            <VisibilityIcon onClick={this.getCheaperOffers} className='phone-offer-cheaperoffers-icon' style={{fontSize: '40px', marginRight: '10px' }}/>
          </Tippy> : <></>
        }
        {
          localStorage.getItem('token') && this.props.loggedUserFavouriteOffers.filter(offer => offer.id == this.props.id).length == 0? 
          <Tippy placement='bottom' content='Додади во омилени понуди'>
          <StarBorderIcon onClick={this.addToFavourite} className='phone-offer-favouriteoffer-icon' style={{fontSize: '40px', marginRight: '10px' }}/>
          </Tippy>
          : <></>
        }

        {
          localStorage.getItem('token') && this.props.loggedUserFavouriteOffers.filter(offer => offer.id == this.props.id).length != 0? 
          <Tippy placement='bottom' content='Избриши од омилени понуди'>
          <StarIcon onClick={this.removeFromFavourite} className='phone-offer-remove-favouriteoffer-icon' style={{fontSize: '40px', marginRight: '10px' }}/>
          </Tippy>
          : <></>
        }


        <Link style={{ textDecoration: 'none' }} to={"/phoneoffer/"+this.props.id}>
          <button className='phone-offer-specifications-button'><b>Спецификации</b></button>
        </Link>
        </td>
      </tr>
    )
  }
}

PhoneOfferComponent.contextType = UserContext
export default PhoneOfferComponent

