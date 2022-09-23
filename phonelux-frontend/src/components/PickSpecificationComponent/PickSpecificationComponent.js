import { Box, Modal } from '@mui/material'
import React, { Component } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import './PickSpecificationComponent.css'
import UserContext from '../../context/UserContext';
import axios from 'axios';

export class PickSpecificationComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        checked: []
      }
    }

    handleToggle = (value) => () => {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = [...this.state.checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

       this.setState({
        checked: newChecked
       }, () => {
        var config = {
            method: 'put',
            url: '/user/'+this.context.userId+'/editspecifications',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token'), 
              'Content-Type': 'text/plain'
            },
            data : this.state.checked
          };

          axios(config)
          .then(response => {
            localStorage.setItem('pickedSpecifications',this.state.checked)
          })
          .catch(function (error) {
            console.log(error);
          });
       })
      };

      componentDidMount(){
        var config = {
            method: 'get',
            url: '/user/'+this.context.userId+'/getspecifications',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          
          axios(config)
          .then(response => {
            this.setState({
                checked: response.data
            },() => {localStorage.setItem('pickedSpecifications',this.state.checked)})
          })
          .catch(function (error) {
            console.log('error here',error);
          });
          
      }
    

  render() {
    return (
     <div className='pick-specification-modal-main'>
        <Modal 
          open={this.props.openModal}
          onClose={this.props.handleClose}
        >
          <Box className='pick-specification-modal-box'>
            <div className='pick-specification-modal-title'>Изберете спецификации кои што сакате да се прикажани</div>
             <List className='pick-specification-list' sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {['РАМ меморија', 'РОМ меморија', 'Предна камера', 'Задна камера',
                'Чипсет', 'Процесор', 'Оперативен систем', 'Боја', 'Батерија'].map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem
            className='pick-specification-specs-item'
            key={value}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={this.handleToggle(value)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText className='pick-specification-item-label' primary={value} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
          </Box>
        </Modal>
      </div>
    )

   
  }
}

PickSpecificationComponent.contextType = UserContext

export default PickSpecificationComponent
