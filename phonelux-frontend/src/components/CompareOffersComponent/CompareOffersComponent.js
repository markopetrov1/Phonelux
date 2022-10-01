import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import './CompareOffersComponent.css'
import CompareIcon from '@mui/icons-material/Compare';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export class CompareOffersComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         offersToCompare: [],
         showAllSpecs : false
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

    changeShownSpecs = () => {
        this.setState({
            showAllSpecs: !this.state.showAllSpecs
        })
    }

    
  render() {
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
                        <th className='compare-offer-table-headers'>
                            {
                                this.state.showAllSpecs ? 
                            <Tippy placement='bottom' content='Прикажи ги избраните спецификации'>
                                <VisibilityOffIcon className='show-all-specs-icon' onClick={this.changeShownSpecs} style={{fontSize: '45px'}}/>
                            </Tippy> :
                            <Tippy placement='bottom' content='Прикажи ги сите спецификации'>
                                <VisibilityIcon className='show-all-specs-icon' onClick={this.changeShownSpecs} style={{fontSize: '45px'}}/>
                            </Tippy>
                            }
                        </th>
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
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.price} ден.</td>)
                        }
                    </tr>
                    { this.state.showAllSpecs ||
                    !localStorage.getItem('pickedSpecifications') || 
                    localStorage.getItem('pickedSpecifications').includes("РАМ меморија") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>РАМ меморија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.ram_memory == null || 
                            offer.ram_memory == '' ? '/' : offer.ram_memory}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || 
                     localStorage.getItem('pickedSpecifications').includes("РОМ меморија") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>РОМ меморија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.rom_memory == null || 
                            offer.rom_memory == '' ? '/' : offer.rom_memory}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Предна камера") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Предна камера</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.front_camera == null || 
                            offer.front_camera == '' ? '/' : offer.front_camera}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Задна камера") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Задна камера</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.back_camera == null || 
                            offer.back_camera == '' ? '/' : offer.back_camera}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Процесор") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Процесор</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.cpu == null || 
                            offer.cpu == '' ? '/' : offer.cpu}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Чипсет") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Чипсет</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.chipset == null || 
                            offer.chipset == '' ? '/' : offer.chipset}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Оперативен систем") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Оперативен систем</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.operating_system == null || 
                            offer.operating_system == '' ? '/' : offer.operating_system}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Батерија") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Батерија</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.battery == null || 
                            offer.battery == '' ? '/' : offer.battery}</td>)
                        }
                    </tr> : <></>
                    }
                     { this.state.showAllSpecs ||
                     !localStorage.getItem('pickedSpecifications') || localStorage.getItem('pickedSpecifications').includes("Боја") ?
                    <tr className='compare-offers-table-row'>
                        <th className='compare-offer-table-headers'>Боја</th>
                        {
                        this.state.offersToCompare.map((offer,idx) => <td key={idx}>{offer.color == null || 
                            offer.color == '' ? '/' : offer.color}</td>)
                        }
                    </tr> : <></>
                    }
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

