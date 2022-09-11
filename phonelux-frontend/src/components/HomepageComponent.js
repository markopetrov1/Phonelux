import React, { Component } from 'react'
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
    sortBy: 'mostPopular'
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
}


  render() {
    return (
        <>
        <HeaderComponent/>
        <GroupedFiltersComponent passFilters={this.changeFilters}/>
        <PhoneCardGridComponent {...this.state}/>
        </>
    )
  }
}

export default HomepageComponent
