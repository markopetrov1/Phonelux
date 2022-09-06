import { Grid } from '@mui/material'
import axios from 'axios'
import React, { Component } from 'react'
import PaginationComponent from '../PaginationComponent/PaginationComponent'
import '../PhoneCardComponent/PhoneCardComponent'
import PhoneCardComponent from '../PhoneCardComponent/PhoneCardComponent'
import './PhoneCardGridComponent.css'
import phoneImage from '../../images/phone.png'

export class PhoneCardGridComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      phones: [],
      loading: true,
      currentPage: 1,
      phonesPerPage: 12,
      numberOfPages: 0,
      currentPhones: []
    }

  }

  componentDidMount() {

    axios.get('/phones')
      .then(response => {
        this.setState({
          phones: response.data,
          loading: false,
          numberOfPages: Math.ceil(response.data.length / this.state.phonesPerPage)
        },() => this.setNewPage(this.state.currentPage))
      }
      )
      .catch(error => console.log(error))
  }

  setNewPage = (newPage) => {
    if(newPage == '')
    {
      newPage = this.state.currentPage-1
    }

    if(newPage == '')
    {
      newPage = this.state.currentPage+1
    }


    const indexOfLastPhone = parseInt(newPage) * this.state.phonesPerPage;
    const indexOfFirstPhone = indexOfLastPhone - this.state.phonesPerPage;

    const currPhones = this.state.phones.slice(indexOfFirstPhone, indexOfLastPhone)

    this.setState({
      currentPage: parseInt(newPage),
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

        {this.state.currentPhones.map((phone) => <Grid className='phonecardgrid-item' item md={3}>
          <PhoneCardComponent key={phone.id} id={phone.id} brand={phone.brand}
          model={phone.model} image_url={phone.image_url == null ? phoneImage : phone.image_url} total_offers={phone.total_offers} lowestPrice={phone.lowestPrice}/></Grid>)}

        {/* <Grid item xs={12} md={12}>
        <PaginationComponent
          currentPage={this.state.currentPage}
          changePageHandler={this.setNewPage}
          numberOfPages={this.state.numberOfPages} />
          </Grid> */}
      </Grid>
      <PaginationComponent
          currentPage={this.state.currentPage}
          changePageHandler={this.setNewPage}
          numberOfPages={this.state.numberOfPages} />
      </div>
    )
  }
}

export default PhoneCardGridComponent
