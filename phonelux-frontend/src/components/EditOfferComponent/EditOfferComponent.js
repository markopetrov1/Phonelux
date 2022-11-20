import { CollectionsOutlined } from '@mui/icons-material'
import axios from 'axios'
import React, { Component } from 'react'
import UserContext from '../../context/UserContext'
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

    setInputValue = (e) => {
        let editedOffer = Object.assign(this.state.offer,{[e.target.name]: e.target.value})
        this.setState({
            offer: editedOffer
        })
    }

    handleSubmit = () =>{
        var dataToSend = JSON.stringify(this.state.offer)
        var config = {
            method: 'put',
            url: '/admin/editoffer/'+this.state.offerId,
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            data: {
                "id" : this.state.offer.id,
                "offer_shop" : this.state.offer.offer_shop,
                "offer_name" : this.state.offer.offer_name,
                "price" : this.state.offer.price,
                "ram_memory" : this.state.offer.ram_memory,
                "rom_memory" : this.state.offer.rom_memory,
                "color" : this.state.offer.color,
                "front_camera" : this.state.offer.front_camera,
                "back_camera" : this.state.offer.back_camera,
                "chipset" : this.state.offer.chipset,
                "battery" : this.state.offer.battery,
                "operating_system" : this.state.offer.operating_system,
                "cpu" : this.state.offer.cpu,
                "image_url" : this.state.offer.image_url,
                "offer_url" : this.state.offer.offer_url,
                "last_updated" : this.state.offer.last_updated,
                "is_validated" : this.state.offer.is_validated,
                "offer_description" : this.state.offer.offer_description,
                "offer_shop_code" : this.state.offer.offer_shop_code
            }
          };
          
          axios(config)
          .then(response => {
            window.location.href="/phoneoffer/"+this.state.offerId
          })
          .catch(error => {
            console.log(error);
          });

          

    }
    
  render() {
    console.log(this.state)
    return (
      <div className='edit-offer-component-main'>
        <HeaderComponent/>
        <div className='edit-offer-table-wrapper'>

            <table className='edit-offer-table'>
                <thead>
                    <tr><th colSpan={2}>Понуда</th></tr>
                </thead>

                <tbody>
                    <tr className='edit-offer-table-row'>
                        <td><b>Име на понуда</b></td>
                        <td><a href={this.state.offer == null || this.state.offer.offer_url == null ? 
                                '#' : this.state.offer.offer_url}>{this.state.offer == null || this.state.offer.offer_name == null ? 
                                '/' : this.state.offer.offer_name}</a>
                        </td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Продавница</b></td>
                        <td>{this.state.offer == null || 
                                this.state.offer.offer_shop == null ? '/' : this.state.offer.offer_shop}
                        </td>
                    </tr>


                    <tr className='edit-offer-table-row'>
                        <td><b>Опис за понудата</b></td>
                        <td>{this.state.offer == null || 
                                this.state.offer.offer_description == null ? '/' : this.state.offer.offer_description}
                        </td>
                    </tr>
                </tbody>

                <thead>
                    <tr><th colSpan={2}>Спецификации за понудата</th></tr>
                </thead>

                <tbody>

                    <tr className='edit-offer-table-row'>
                        <td><b>Цена</b></td>
                        <td><input value={this.state.offer == null || 
              this.state.offer.price == null ? '/' : this.state.offer.price} 
              className='edit-offer-price-input' name='price' 
              onChange={(e) => this.setInputValue(e)}/><span className='edit-offer-price-span'>ден.</span></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Предна камера</b></td>
                        <td><textarea className='edit-offer-table-textarea' name='front_camera' value={this.state.offer == null || 
              this.state.offer.front_camera == null ? '/' : this.state.offer.front_camera}
              onChange={(e) => this.setInputValue(e)}></textarea></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Задна камера</b></td>
                        <td><textarea className='edit-offer-table-textarea' value={this.state.offer == null || 
              this.state.offer.back_camera == null ? '/' : this.state.offer.back_camera} 
              onChange={(e) => this.setInputValue(e)} name='back_camera'></textarea></td>
                    </tr>
                    <tr className='edit-offer-table-row'>
                        <td><b>РОМ меморија</b></td>
                        <td><textarea className='edit-offer-table-textarea' onChange={(e) => this.setInputValue(e)}
                         name='rom_memory' value={this.state.offer == null || 
                            this.state.offer.rom_memory == null ? '/' : this.state.offer.rom_memory}></textarea></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>РАМ меморија</b></td>
                        <td><textarea className='edit-offer-table-textarea' onChange={(e) => this.setInputValue(e)}
                         name='ram_memory' value={this.state.offer == null || 
                            this.state.offer.ram_memory == null ? '/' : this.state.offer.ram_memory}></textarea></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Оперативен систем</b></td>
                        <td><textarea className='edit-offer-table-textarea' value={this.state.offer == null || 
                            this.state.offer.operating_system == null ? '/' : this.state.offer.operating_system} name='operating_system'
                            onChange={(e) => this.setInputValue(e)}></textarea>
                        </td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Чипсет</b></td>
                        <td><textarea className='edit-offer-table-textarea' value={this.state.offer == null || 
                            this.state.offer.chipset == null ? '/' : this.state.offer.chipset} name='chipset'
                            onChange={(e) => this.setInputValue(e)}></textarea>
                        </td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Процесор</b></td>
                        <td><textarea className='edit-offer-table-textarea' value={this.state.offer == null || 
                            this.state.offer.cpu == null ? '/' : this.state.offer.cpu} name='cpu'
                            onChange={(e) => this.setInputValue(e)}></textarea>
                        </td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Батерија</b></td>
                        <td><textarea className='edit-offer-table-textarea' value={this.state.offer == null || 
                            this.state.offer.battery == null ? '/' : this.state.offer.battery} name='battery'
                            onChange={(e) => this.setInputValue(e)}></textarea></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Боја</b></td>
                        <td><textarea className='edit-offer-table-textarea' name='color' value={this.state.offer == null || 
                            this.state.offer.color == null ? '/' : this.state.offer.color}
                            onChange={(e) => this.setInputValue(e)}></textarea></td>
                    </tr>

                    <tr className='edit-offer-table-row'>
                        <td><b>Линк од слика на мобилниот телефон од понудата</b></td>
                        <td>
                            <div className='edit-offer-offerimage-wrapper'>
                            <img className='edit-offer-offerimage' src={this.state.offer == null || 
                                this.state.offer.image_url == null ? '#' : this.state.offer.image_url}/>
                            </div>
                            <input value={this.state.offer == null || 
                                this.state.offer.image_url == null ? '/' : this.state.offer.image_url} 
                                className='edit-offer-imageurl-input' name='image_url' 
                                onChange={(e) => this.setInputValue(e)}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className='edit-offer-button-wrapper'>
        <button className='edit-offer-submit-button' onClick={this.handleSubmit}><b>Измени</b></button>
        </div>
      </div>
      
    )
  }
}

EditOfferComponent.contextType = UserContext

export default EditOfferComponent
