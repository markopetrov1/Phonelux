import React, { Component } from 'react'

export class PhoneOfferComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
       
      }
    }
    
    
  render() {
    console.log(this.props)
    return (
      <tr className='phone-with-offers-table-row'>
      <td>{this.props.offer_shop}</td>
      <td><a href={this.props.offer_url}>{this.props.offer_name}</a></td>
      <td>{this.props.price} ден.</td>
      <td></td>
      </tr>
    )
  }
}

export default PhoneOfferComponent




// back_camera: null
// battery: null
// chipset: null
// color: null
// cpu: null
// front_camera: null
// id: 486
// image_url: "https://setec.mk/image/cache/catalog/Product/51841_0-228x228.jpg"
// is_validated: false
// last_updated: "2022-07-26T22:00:00.000+00:00"
// offer_description: "Apple iPhone 13 128GB Midnight, GSM/CDMA/HSPA/EVDO/LTE/ 5G, Display: Super Retina XDR OLED; HDR10; Dolby Vision; 800 nits (HBM); 1200 nit…"
// offer_name: "Apple iPhone 13 128GB Midnight"
// offer_shop: "Setec"
// offer_shop_code: "51841"
// offer_url: "https://setec.mk/index.php?route=product/product&path=10066_10067&product_id=51841"
// operating_system: null
// price: 63990
// ram_memory: null
// rom_memory: null
