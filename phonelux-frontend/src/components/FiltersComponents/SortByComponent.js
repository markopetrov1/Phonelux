import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SortByComponent.css'
import SpecificationsFilterComponent from './SpecificationsFilterComponent'

export class SortByComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         sortBy: localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : 'mostPopular'
      }
    }

    handleChange = (e) => {
      this.props.changeHandler({sortBy: e.target.value})
      localStorage.setItem('sortBy',e.target.value)
    }

    render() {
    return (
        <div className="sortby-component-wrapper">
        {localStorage.getItem('token') ? <SpecificationsFilterComponent changeHandler={this.props.changeHandler}/> : <></>}
        <select defaultValue={this.state.sortBy} onChange={this.handleChange} className='sortby-component-select'>
          <option value="mostPopular">Најпопуларно</option>
          <option value="ascending">Цена: Ниска {'>'} Висока</option>
          <option value="descending">Цена: Висока {'>'} Ниска</option>
        </select>
      </div>
    )
  }
}

export default SortByComponent
