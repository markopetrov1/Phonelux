import { Grid, Pagination } from '@mui/material'
import axios from 'axios'
import React, { Component } from 'react'
import '../PhoneCardComponent/PhoneCardComponent'
import PhoneCardComponent from '../PhoneCardComponent/PhoneCardComponent'
import './PhoneCardGridComponent.css'
import phoneImage from '../../images/phone.png'
import SortByComponent from '../FiltersComponents/SortByComponent'

export class PhoneCardGridComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      phones: [],
      currentPage: 1,
      phonesPerPage: 12,
      numberOfPages: 0,
      currentPhones: []
    }

  }


  getQueryString = () => {
    let filters = '?'
    if(localStorage.getItem('shops'))
      {
        filters += 'shops='+localStorage.getItem('shops')+'&'
      }
      if(localStorage.getItem('brands'))
      {
        filters += 'brands='+localStorage.getItem('brands')+'&'
      }
      if(localStorage.getItem('priceRange'))
      {
        filters += 'priceRange='+localStorage.getItem('priceRange')+'&'
      }

      if(localStorage.getItem('sortBy'))
      {
        filters += 'sortBy='+localStorage.getItem('sortBy')+'&'
      } 

      return filters
  }

  componentDidUpdate(prevProps) {
    if(JSON.stringify(prevProps) != JSON.stringify(this.props)){
      let filters = '?'

      if(this.props.shops)
      {
        filters += 'shops='+this.props.shops+'&'
      }
      if(this.props.brands)
      {
        filters += 'brands='+this.props.brands+'&'
      }
      if(this.props.priceRange)
      {
        filters += 'priceRange='+this.props.priceRange+'&'
      }
      if(this.props.searchValue)
      {
        filters += 'searchValue='+this.props.searchValue+'&'
      }

      if(this.props.sortBy)
      {
        filters += 'sortBy='+this.props.sortBy+'&'
      } 

      if(this.props.ram)
      {
        filters += 'ram='+this.props.ram+'&'
      } 

      if(this.props.rom)
      {
        filters += 'rom='+this.props.rom+'&'
      } 

      if(this.props.frontcamera)
      {
        filters += 'frontcamera='+this.props.frontcamera+'&'
      } 

      if(this.props.backcamera)
      {
        filters += 'backcamera='+this.props.backcamera+'&'
      } 

      if(this.props.chipset)
      {
        filters += 'chipset='+this.props.chipset+'&'
      } 

      if(this.props.cpu)
      {
        filters += 'cpu='+this.props.cpu+'&'
      } 

      if(this.props.operatingsystem)
      {
        filters += 'operatingsystem='+this.props.operatingsystem+'&'
      } 

      if(this.props.color)
      {
        filters += 'color='+this.props.color+'&'
      } 

      if(this.props.battery)
      {
        filters += 'battery='+this.props.battery+'&'
      } 

      axios.get('/phones'+filters)
      .then(response => {
        this.setState({
          phones: response.data,
          numberOfPages: Math.ceil(response.data.length / this.state.phonesPerPage)
        },(e) => this.setNewPage(e,this.state.currentPage))
      }
      )
      .catch(error => console.log(error))
      console.log(filters)
    }
  }

  componentDidMount() {
    axios.get('/phones'+this.getQueryString())
      .then(response => {
        this.setState({
          phones: response.data,
          numberOfPages: Math.ceil(response.data.length / this.state.phonesPerPage)
        },(e) => this.setNewPage(e,this.state.currentPage))
      }
      )
      .catch(error => console.log(error))
  }


  setNewPage = (event,page) => {

    const indexOfLastPhone = parseInt(page) * this.state.phonesPerPage;
    const indexOfFirstPhone = indexOfLastPhone - this.state.phonesPerPage;

    const currPhones = this.state.phones.slice(indexOfFirstPhone, indexOfLastPhone)

    this.setState({
      currentPage: parseInt(page),
      currentPhones: currPhones
    })

  }

  render() {

    return (
      <div className='phonecardgrid-wrapper'>
      <Grid className='phonecardgrid-grid-container' 
      container 
      alignItems="center"
      justifyItems="center"
       spacing={2}>

        {this.state.currentPhones.map((phone,idx) => <Grid key={idx} className='phonecardgrid-item' item md={3}>
          <PhoneCardComponent id={phone.id} brand={phone.brand}
          model={phone.model} image_url={phone.image_url == null ? phoneImage : phone.image_url} total_offers={phone.total_offers} lowestPrice={phone.lowestPrice}/></Grid>)}

      </Grid>

      <div className='pagination-wrapper'>
         <Pagination className='paginationcomponent-pagination' onChange={this.setNewPage} page={this.state.currentPage}
          count={this.state.numberOfPages} color="primary" />
      </div>

      </div>
    )
  }
}

export default PhoneCardGridComponent
