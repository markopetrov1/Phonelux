import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SingleReportComponent.css'
import DeleteIcon from '@mui/icons-material/Delete';
import Tippy from '@tippyjs/react';
import { Delete } from '@mui/icons-material';

export class SingleReportComponent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
  render() {
    return (
        <tr className='offerreports-section-table-row'>
          <td><Link to={"/phoneoffer/"+this.props.phoneOffer.id}>{this.props.phoneOffer.offer_name}</Link></td>
          <td>{this.props.reportedAt.split('T')[0]}</td>
          <td>{this.props.reportedBy}</td>
          <td>{this.props.times_reported}</td>
          <td>{
           <Tippy placement='bottom' content='Отстрани пријава'>
           <Delete className='offerreport-remove-icon' onClick={() => this.props.removeOfferReport(this.props.id)}
            style={{fontSize: '45px'}}/>
        </Tippy>
        }</td>
        </tr>
      )
  }
}

export default SingleReportComponent
