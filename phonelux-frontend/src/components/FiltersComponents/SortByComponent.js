import React, { Component } from 'react'
import './SortByComponent.css'

export class SortByComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         sortBy: 'mostPopular'
      }
    }

    handleChange = (e) => {
      this.props.changeHandler({sortBy: e.target.value})
    }

    render() {
    return (
        <div className="sortby-component-wrapper">
        <select defaultValue={'mostPopular'} onChange={this.handleChange} className='sortby-component-select'>
          <option value="mostPopular">Најпопуларно</option>
          <option value="ascending">Цена: Ниска {'>'} Висока</option>
          <option value="descending">Цена: Висока {'>'} Ниска</option>
        </select>
      </div>
    )
  }
}

export default SortByComponent
