import axios from 'axios'
import React, { Component } from 'react'

const UserContext = React.createContext()

export class UserProvider extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         userId: '',
         name: '',
         role: ''
      }
    }

    componentDidMount(){
        if(localStorage.getItem('token'))
        {
            let token = localStorage.getItem('token')
            axios.get('/token/'+token)
            .then(response => {
             const {id, firstName,userRole} = response.data
             this.setState({
                userId: id,
                name: firstName,
                role: userRole,
             })
            }).catch(error => console.log(error))
        }
    }
    
  render() {
    const {userId,name,role} = this.state
    return (
      <UserContext.Provider value={{
        userId,
        name,
        role,
      }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserContext
