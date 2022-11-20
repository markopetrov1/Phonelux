import React, { Component } from 'react'

export class ScrapperInfoComponent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
  render() {
    return (
        <tr className='scrappers-section-table-row'>
        <td>{this.props.store}</td>
        <td>{this.props.status == 'success' ? <span className='scrapper-info-success'>Успешно</span> 
        : 
        <span className='scrapper-info-failed'>Неуспешно</span>}</td>
        <td>{this.props.recievedAt.split('T')[0]}</td>
      </tr>
    )
  }
}

export default ScrapperInfoComponent
