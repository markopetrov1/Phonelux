import React, { Component } from 'react'
import UserContext from '../context/UserContext'
import GroupedFiltersComponent from './GroupedFiltersComponent/GroupedFiltersComponent'
import HeaderComponent from './HeaderComponent/HeaderComponent'
import PhoneCardGridComponent from './PhoneCardGridComponent/PhoneCardGridComponent'


export class HomepageComponent extends Component {

constructor(props) {
  super(props)

  this.state = {
    shops: '',
    brands: '',
    priceRange: '',
    searchValue: '',
    sortBy: 'mostPopular',
    ram: '',
    rom: '',
    frontcamera: '',
    backcamera: '',
    chipset: '',
    cpu: '',
    operatingsystem: '',
    color: '',
    battery: ''
  }
}

changeFilters = (e) => {

  if(e.hasOwnProperty('priceRange'))
  {
    this.setState({
      priceRange: e.priceRange
    })
  }

  if(e.hasOwnProperty('shops'))
  {
    this.setState({
      shops: e.shops
    })
  }

  if(e.hasOwnProperty('brands'))
  {
    this.setState({
      brands: e.brands
    })
  }

  if(e.hasOwnProperty('searchValue'))
  {
    this.setState({
      searchValue: e.searchValue
    })

  }
  
  if(e.hasOwnProperty('sortBy'))
  {
    this.setState({
      sortBy: e.sortBy
    })
  }

  if(e.hasOwnProperty('ram'))
  {
    this.setState({
      ram: e.ram
    })

  }
  
  if(e.hasOwnProperty('rom'))
  {
    this.setState({
      rom: e.rom
    })
  }

  if(e.hasOwnProperty('frontcamera'))
  {
    this.setState({
      frontcamera: e.frontcamera
    })
  }

  if(e.hasOwnProperty('backcamera'))
  {
    this.setState({
      backcamera: e.backcamera
    })

  }
  
  if(e.hasOwnProperty('chipset'))
  {
    this.setState({
      chipset: e.chipset
    })
  }

  if(e.hasOwnProperty('cpu'))
  {
    this.setState({
      cpu: e.cpu
    })

  }
  
  if(e.hasOwnProperty('operatingsystem'))
  {
    this.setState({
      operatingsystem: e.operatingsystem
    })
  }

  if(e.hasOwnProperty('color'))
  {
    this.setState({
      color: e.color
    })

  }
  
  if(e.hasOwnProperty('battery'))
  {
    this.setState({
      battery: e.battery
    })
  }
}

componentDidMount(){
  if(localStorage.getItem('brands'))
  {
    this.setState({
      brands: localStorage.getItem('brands')
    })
  }
  if(localStorage.getItem('shops'))
  {
    this.setState({
      shops: localStorage.getItem('shops')
    })
  }
  if(localStorage.getItem('priceRange'))
  {
    this.setState({
      priceRange: localStorage.getItem('priceRange')
    })
  }
 
  if(localStorage.getItem('sortBy'))
  {
    this.setState({
      sortBy: localStorage.getItem('sortBy')
    })
  }
  if(localStorage.getItem('ram'))
  {
    this.setState({
      ram: localStorage.getItem('ram')
    })
  }
  if(localStorage.getItem('rom'))
  {
    this.setState({
      rom: localStorage.getItem('rom')
    })
  }
  if(localStorage.getItem('frontcamera'))
  {
    this.setState({
      frontcamera: localStorage.getItem('frontcamera')
    })
  }
  if(localStorage.getItem('backcamera'))
  {
    this.setState({
      backcamera: localStorage.getItem('backcamera')
    })
  }
  if(localStorage.getItem('chipset'))
  {
    this.setState({
      chipset: localStorage.getItem('chipset')
    })
  }
  if(localStorage.getItem('cpu'))
  {
    this.setState({
      cpu: localStorage.getItem('cpu')
    })
  }
  if(localStorage.getItem('operatingsystem'))
  {
    this.setState({
      operatingsystem: localStorage.getItem('operatingsystem')
    })
  }
  if(localStorage.getItem('color'))
  {
    this.setState({
      color: localStorage.getItem('color')
    })
  }
  if(localStorage.getItem('battery'))
  {
    this.setState({
      battery: localStorage.getItem('battery')
    })
  }
  console.log(this.state)
}


  render() {
    // console.log(this.context)
    // console.log(localStorage.getItem('token'))
    console.log(this.state)
    return (
        <>
        <HeaderComponent/>
        <GroupedFiltersComponent passFilters={this.changeFilters}/>
        <PhoneCardGridComponent {...this.state}/>
        </>
    )
  }
}

HomepageComponent.contextType = UserContext


export default HomepageComponent
