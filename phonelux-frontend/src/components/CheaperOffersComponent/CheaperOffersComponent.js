import React, { Component } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "./CheaperOffersComponent.css"
import PhoneOfferComponent from '../PhoneOfferComponent/PhoneOfferComponent';
import { Link } from 'react-router-dom';


export class CheaperOffersComponent extends Component {
constructor(props) {
  super(props)

  this.state = {

  }
}

  render() {

    return (
        <div>
        <Modal 
          open={this.props.openModal}
          onClose={this.props.handleClose}
          aria-labelledby="cheaperoffers-modal-title"
          aria-describedby="cheaperoffers-modal-description"
        >
          <Box className='cheaperoffers-modal-box'>
          <table cellPadding={20} className='cheaperoffers-table'>
            <thead className='cheaperoffers-table-head'>
              <tr>
              <th>Продавница</th>
              <th>Име на понуда</th>
              <th>Цена</th>
              <th>Поевтина за</th>
              <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.cheaperOffers.map((offer,idx) => 
                <tr key={idx} className='cheaperoffers-table-row'>
                  <td>{offer.offer_shop}</td>
                  <td><a href={offer.offer_url}>{offer.offer_name}</a></td>
                  <td>{offer.price} ден.</td>
                  <td><b>{this.props.openedOfferPrice-offer.price} ден.</b></td>
                  <td>
                    <Link style={{ textDecoration: 'none' }} to={"/phoneoffer/"+offer.id}>
                      <button className='phone-offer-specifications-button'>Спецификации</button>
                    </Link>
                  </td>
                </tr>
                ) 
              }
            </tbody>
          </table>
          </Box>
        </Modal>
      </div>
    )
  }
}

export default CheaperOffersComponent


