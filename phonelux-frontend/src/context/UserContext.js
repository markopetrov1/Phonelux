import axios from 'axios'
import React, { Component } from 'react'

const UserContext = React.createContext()

export class UserProvider extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         userId: '',
         name: '',
         role: '',
         userFavouriteOffers: []
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
                role: userRole
             }, this.updateUserFavouriteOffers)
            }).catch(error => console.log(error))
        }
    }

    // updateUserFavouriteOffers = () =>{
    //   var config = {
    //     method: 'get',
    //     url: '/user/'+this.state.userId+'/favouriteoffers',
    //     headers: { 
    //       'Authorization': 'Bearer '+localStorage.getItem('token')
    //     }
    //   };

    //   axios(config)
    //   .then(response => {
    //     this.setState({
    //       userFavouriteOffers: response.data
    //     })
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // }


    
  render() {
    const {userId,name,role, userFavouriteOffers} = this.state
    // const {updateUserFavouriteOffers} = this
    return (
      <UserContext.Provider value={{
        userId,
        name,
        role,
        // userFavouriteOffers,
        // updateUserFavouriteOffers
      }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserContext
