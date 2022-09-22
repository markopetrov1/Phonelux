import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import './CompareOffersComponent.css'
import CompareIcon from '@mui/icons-material/Compare';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import Tippy from '@tippyjs/react';

export class CompareOffersComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         offersToCompare: []
      }
    }
    componentDidMount() {
        if(localStorage.getItem('offersToCompare') && JSON.parse(localStorage.getItem('offersToCompare')).length >0)
        {
            let offersToCompareString = JSON.parse(localStorage.getItem('offersToCompare')).join(',')

            var config = {
                method: 'get',
                url: '/multipleoffers?offerIds='+offersToCompareString,
                headers: { }
            };
            
            axios(config)
            .then(response => {
                this.setState({
                    offersToCompare: response.data
                })
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    handleRemove = (event) => {
        let offerToRemove = event.target.getAttribute('offerid')
        let offers = JSON.parse(localStorage.getItem('offersToCompare'))
        localStorage.setItem('offersToCompare',JSON.stringify(offers.filter(offer => offer!=offerToRemove)))
        this.setState({
            offersToCompare: this.state.offersToCompare.filter(offer => offer.id != offerToRemove)
        })
    }

    
  render() {
    console.log(this.state)
    return (
      <div className='compare-offers-main'>
        <HeaderComponent/>
        <div className='compare-offers-header'>
            <h1 className='compare-offers-header-text'>
                Спореди понуди
            </h1>
        </div>
        {(() => {
            if(localStorage.getItem('offersToCompare') && JSON.parse(localStorage.getItem('offersToCompare')).length >0)
            {
                return  <table cellPadding={20} className='compare-offers-table'>
                <tbody>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'></th>
                        {
                            this.state.offersToCompare.map((offer,idx) => 
                            <Tippy placement='bottom' content='Отстранете ја понудата'>
                            <td onClick={this.handleRemove} className='compare-offers-top-headers' offerid={offer.id} 
                            key={idx}>Понуда #{idx+1}</td>
                            </Tippy>
                            )
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Име на понуда</th>
                        {
                            this.state.offersToCompare.map((offer,idx) => <td key={idx}><a href={offer.offer_url}>{offer.offer_name}</a></td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Продавница</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}><b>{offer.offer_shop}</b></td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Цена</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.price}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>РАМ меморија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.ram_memory == null || 
                            offer.ram_memory == '' ? '/' : offer.ram_memory}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>РОМ меморија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.rom_memory == null || 
                            offer.rom_memory == '' ? '/' : offer.rom_memory}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Предна камера</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.front_camera == null || 
                            offer.front_camera == '' ? '/' : offer.front_camera}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Задна камера</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.back_camera == null || 
                            offer.back_camera == '' ? '/' : offer.back_camera}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Процесор</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.cpu == null || 
                            offer.cpu == '' ? '/' : offer.cpu}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Чипсет</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.chipset == null || 
                            offer.chipset == '' ? '/' : offer.chipset}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Оперативен систем</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.operating_system == null || 
                            offer.operating_system == '' ? '/' : offer.operating_system}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Батерија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.battery == null || 
                            offer.battery == '' ? '/' : offer.battery}</td>)
                        }
                    </tr>
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Боја</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.color == null || 
                            offer.color == '' ? '/' : offer.color}</td>)
                        }
                    </tr>
                </tbody>
                </table>
            }
            else{
                return <h1 className='no-offers-saved-message'>Нема зачувано понуди</h1>
            }
            
      })()}
       
      </div>
    )
  }
}

export default CompareOffersComponent
