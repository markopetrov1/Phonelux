import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./PaginationComponent.css"

export class PaginationComponent extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }

  render() {
    return (
      <div className='pagination-wrapper'>
         <Pagination className='paginationcomponent-pagination' onChange={(event) => this.props.changePageHandler(event.currentTarget.textContent)} 
         count={this.props.numberOfPages} color="primary" />
      </div>
    )
  }
}

export default PaginationComponent

