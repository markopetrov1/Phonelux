import axios from 'axios'
import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import './EditOfferComponent.css'

export class EditOfferComponent extends Component {

    constructor(props) {
      super(props)
      this.state = {
         offerId: window.location.href.split('/')[5],
         offer: {}
      }
    }

    componentDidMount(){
        var config = {
            method: 'get',
            url: '/phoneoffer/'+this.state.offerId,
            headers: { }
          };
          
          axios(config)
          .then(response => {
            this.setState({
                offer: response.data
            })
          })
          .catch(error => {
            console.log(error);
          });
          
    }
    
  render() {
    return (
      <div className='edit-offer-component-main'>
        <HeaderComponent/>
        <div className='edit-offer-table-wrapper'>
            <table className='edit-offer-table'>
                <thead>
                    <tr><th colSpan={2}>Измени детали за понудата</th></tr>
                </thead>
                <tbody>
                    <tr className='edit-offer-table-row'>
                        <td>Име на понуда</td>
                        <td><a href={this.state.offer == null || this.state.offer.offer_url == null ? 
              '#' : this.state.offer.offer_url}>{this.state.offer == null || this.state.offer.offer_name == null ? 
              '/' : this.state.offer.offer_name}</a></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Продавница</td>
                        <td>{this.state.offer == null || 
              this.state.offer.offer_shop == null ? '/' : this.state.offer.offer_shop}</td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Цена</td>
                        <td><input value={this.state.offer == null || 
              this.state.offer.price == null ? '/' : this.state.offer.price} className='edit-offer-price-input'/><span className='edit-offer-price-span'>ден.</span></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Предна камера</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Задна камера</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>РОМ меморија</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>РАМ меморија</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Оперативен систем</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Чипсет</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Процесор</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Батерија</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Боја</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td>Опис</td>
                        <td><textarea className='edit-offer-table-textarea'></textarea></td>
                    </tr>
                </tbody>
            </table>

        </div>


      </div>
      
    )
  }
}

export default EditOfferComponent
