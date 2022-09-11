import React, { Component } from 'react'
import './PhoneCardComponent.css'
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

export class PhoneCardComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }

  
    
  render() {
    return (
      <Link style={{ textDecoration: 'none' }} to={"phones/"+this.props.id}>
      <Paper sx={{borderRadius: '50px'}} className='phonecard-paper' elevation={3}>
      <div className='phonecard'>
        <img src={this.props.image_url}/>
        <h3 className='phonecard-model-header'>{this.props.model}</h3>
        <h5 className='phonecard-lowestprice-header'>Најниска цена: <p className='phonecard-lowestprice'>{this.props.lowestPrice}</p> ден.</h5>
        <h5 className='phonecard-totaloffers-header'>Вкупно понуди: <p className='phonecard-totaloffers'>{this.props.total_offers}</p></h5>
      </div>
      </Paper>
      </Link>
    )
  }
}

export default PhoneCardComponent
