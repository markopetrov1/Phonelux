import React, { Component } from 'react'
import './UserComponent.css'

export class UserComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }

    
  render() {
    return (
      <tr className='superadmin-section-table-row'>
        <td>{this.props.firstname}</td>
        <td>{this.props.lastname}</td>
        <td>{this.props.email}</td>
        <td>{this.props.role == 'USER' ? 'Регистриран корисник' : 'Администратор'}</td>
        <td>{
        this.props.role == 'USER' ? 
        <button onClick={() => this.props.addAdmin(this.props.id)} className='superadmin-addadmin-button'>
          Додај админ привилегии
        </button> :
         <button onClick={() => this.props.removeAdmin(this.props.id)} className='superadmin-removeadmin-button'>
          Одземи админ привилегии
         </button>
      }</td>
      </tr>
    )
  }
}

export default UserComponent
