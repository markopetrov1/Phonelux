import React, { Component } from 'react'
import axios from 'axios'
import './PhoneOfferDetailsComponent.css'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import UserContext from '../../context/UserContext'
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom'
import Tippy from '@tippyjs/react'


export class PhoneOfferDetailsComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        offerId: window.location.href.split('/')[4],
        offer: null
      }
    }

    componentDidMount(){
        this.getPhoneOffer()
    }

    getPhoneOffer = () => {
      axios.get('/phoneoffer/'+this.state.offerId)
        .then(response => {
            this.setState({
                offer: response.data
            })
        }).catch(error => console.log(error))
    }

    validateOffer = () => {
      var config = {
        method: 'put',
        url: '/admin/validateoffer/'+this.state.offerId,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };
      
      axios(config)
      .then(response => {
        this.getPhoneOffer();
      })
      .catch(error => {
        console.log(error);
      });
    }

  render() {
    console.log(this.state)
    return (
      <div className='phone-offer-details-main'>
        <HeaderComponent/>
        <div className='phone-offer-details-last-updated-wrapper'>
          <h3 className='phone-offer-details-last-updated-header'>Последно ажурирана: {this.state.offer == null || 
          this.state.offer.last_updated == null ? '#' : this.state.offer.last_updated.split('T')[0]}</h3>
          {
            localStorage.getItem('token') && (this.context.role == 'ADMIN' || this.context.role == 'SUPERADMIN') ?
            <Link className='link-offer-edit' style={{color:'black'}} to={'/admin/editoffer/'+this.state.offerId}>
              <h3 className='phone-offer-details-edit-header'>Измени понуда</h3>
              </Link> : <></>
          }
       

          {(() => {
            if(this.state.offer != null && this.state.offer.is_validated)
            {
              return <Tippy placement='bottom'  content='Понудата е валидна'>
                      <CheckIcon className='offer-valid-check-icon' style={{'fontSize': '60px'}}></CheckIcon>
                     </Tippy>
            }

            if(this.state.offer != null && !this.state.offer.is_validated && 
              (this.context.role == 'ADMIN' || this.context.role == 'SUPERADMIN'))
            {
              return <button onClick={this.validateOffer} className='validate-offer-button'>Валидирај понуда</button>
            }

          })()}
        </div>
        <div className='phone-offer-details-last-updated-wrapper'></div>
        <div className='phone-offer-details-table-wrapper'>
        <div className='phone-offer-details-table-section'>
        <table className='phone-offer-details-table'>
          <thead>
          <tr><th colSpan={2}>Детали за понудата</th></tr>
          </thead>
          <tbody>
            <tr className='phone-offer-details-table-row'>
              <td>Понуда</td><td><a href={this.state.offer == null || this.state.offer.offer_url == null ? 
              '#' : this.state.offer.offer_url}>{this.state.offer == null || this.state.offer.offer_name == null ? 
              '/' : this.state.offer.offer_name}</a></td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Продавница</td><td>{this.state.offer == null || 
              this.state.offer.offer_shop == null ? '/' : this.state.offer.offer_shop}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Цена</td><td>{this.state.offer == null || 
              this.state.offer.price == null ? '/' : this.state.offer.price+' ден.'}</td>
            </tr>
            <tr className='phone-offer-details-table-row'>
              <td>Предна камера</td><td>{this.state.offer == null || 
              this.state.offer.front_camera == null ? '/' : this.state.offer.front_camera}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Задна камера</td><td>{this.state.offer == null || 
              this.state.offer.back_camera == null ? '/' : this.state.offer.back_camera}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>РОМ меморија</td><td>{this.state.offer == null || 
              this.state.offer.rom_memory == null ? '/' : this.state.offer.rom_memory}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>РАМ меморија</td><td>{this.state.offer == null || 
              this.state.offer.ram_memory == null ? '/' : this.state.offer.ram_memory}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Оперативен систем</td><td>{this.state.offer == null || 
              this.state.offer.operating_system == null ? '/' : this.state.offer.operating_system}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Чипсет</td><td>{this.state.offer == null || 
              this.state.offer.chipset == null ? '/' : this.state.offer.chipset}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Процесор</td><td>{this.state.offer == null || 
              this.state.offer.cpu == null ? '/' : this.state.offer.cpu}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Батерија</td><td>{this.state.offer == null || 
              this.state.offer.battery == null ? '/' : this.state.offer.battery}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Боја</td><td>{this.state.offer == null || 
              this.state.offer.color == null ? '/' : this.state.offer.color}</td>
            </tr>

            <tr className='phone-offer-details-table-row'>
              <td>Опис</td><td>{this.state.offer == null || 
              this.state.offer.offer_description == null ? '/' : this.state.offer.offer_description}</td>
            </tr>
            
          </tbody>
        </table>
        </div>
        </div>

      </div>
    )
  }
}

PhoneOfferDetailsComponent.contextType = UserContext

export default PhoneOfferDetailsComponent
