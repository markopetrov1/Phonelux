import { Pagination } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios'
import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import UserComponent from '../UserComponent/UserComponent'
import "./SuperAdminComponent.css"
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import UserContext from '../../context/UserContext';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


export class SuperAdminComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         users: [],
         currentUsers: [],
         usersPerPage:10,
         numberOfPages: 0,
         currentPage: 1,
        //  numberOfUsers: 0,
        //  numberOfAdmins: 0
      }
    }

    componentDidMount(){
      // if(!localStorage.getItem('token'))
      // {
      //     window.location.href = "/"
      // }

      // if(this.context.role != 'SUPERADMIN')
      // {
      //     window.location.href = "/"
      // }
      this.getUsers()
    }

    addAdmin = (id) => {
      var config = {
        method: 'put',
        url: '/management/addadmin/'+id,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };
      
      axios(config)
      .then(response => {
        this.getUsers()
      })
      .catch(error => {
        console.log(error);
      });

    }

    removeAdmin = (id) => {
      var config = {
        method: 'put',
        url: '/management/removeadmin/'+id,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };
      
      axios(config)
      .then(response => {
        this.getUsers()
      })
      .catch(error => {
        console.log(error);
      });
    }

    getUsers = (filter) =>{
      let queryParams = '?'
      if(filter)
      {
        queryParams+='searchValue='+filter
      }
      var config = {
        method: 'get',
        url: '/management/users'+queryParams,
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      };
      
      axios(config)
      .then(response => {
        this.setState({
          users: response.data,
          // numberOfUsers: response.data.filter(user => user.userRole == 'USER').length,
          // numberOfAdmins: response.data.filter(user => user.userRole == 'ADMIN').length,
          numberOfPages: Math.ceil(response.data.length / this.state.usersPerPage)
        },(e) => this.setNewPage(e,this.state.currentPage))
      })
      .catch(error => {
        console.log(error);
      });
    }

    setNewPage = (event,page) => {

      const indexOfLastUser = parseInt(page) * this.state.usersPerPage;
      const indexOfFirstUser = indexOfLastUser - this.state.usersPerPage;
  
      const currUsers = this.state.users.slice(indexOfFirstUser, indexOfLastUser)
  
      this.setState({
        currentPage: parseInt(page),
        currentUsers: currUsers
      })
  
    }
    
  render() {
    return (
      <div className='superadmin-section-main'>
        <HeaderComponent/>
        <div className='superadmin-section-header'>
          <h1 className='superadmin-section-header-text'>
            Менаџмент со корисници
          </h1>
        </div>
        <div className='superadmin-users-section'>

          <table cellPadding={20} className='superadmin-section-table'>
            <thead className='superadmin-section-table-head'>
              <tr>
              <th>Име</th>
              <th>Презиме</th>
              <th>Е-маил адреса</th>
              <th>Привилегии</th>
              <th>
              <Search onChange={(event) => this.getUsers(event.target.value)} className="search-user-field">
                <SearchIconWrapper id="search-user-iconwrapper">
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  className="search-user-input"
                  placeholder="Пребарувај…"
                  inputProps={{ 'aria-label': 'search' }}/>  
              </Search>
              </th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.currentUsers.map((user,idx) => <UserComponent key={idx} id={user.id} firstname={user.firstName} 
                lastname={user.lastName} email={user.email} role={user.userRole} addAdmin={this.addAdmin} removeAdmin={this.removeAdmin}/>) 
              }
            </tbody>
          </table>

        </div>
        <div className='pagination-wrapper'>
         <Pagination className='superadmin-users-pagination' onChange={this.setNewPage} page={this.state.currentPage}
          count={this.state.numberOfPages} color="primary" />
      </div>
      </div>
    )
  }
}

SuperAdminComponent.contextType = UserContext

export default SuperAdminComponent
