import { Pagination } from '@mui/material'
import axios from 'axios'
import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import './OfferReportsComponent.css'
import SingleReportComponent from './SingleReportComponent'

export class OfferReportsComponent extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         offerReports: [],
         currentReports: [],
         reportsPerPage:10,
         numberOfPages: 0,
         currentPage: 1,
      }
    }

    componentDidMount(){
       this.getOfferReports()
    }

    removeOfferReport = (id) => {
        var config = {
            method: 'delete',
            url: '/offerreport/remove/'+id,
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          
          axios(config)
          .then(response => {
            this.getOfferReports()
          })
          .catch(error => {
            console.log(error);
          });
          
    }

    removeAllOfferReports = () => {
        var config = {
            method: 'delete',
            url: '/offerreport/removeall',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          
          axios(config)
          .then(response => {
            this.getOfferReports()
          })
          .catch(error => {
            console.log(error);
          });
    }

    getOfferReports = () => {
        var config = {
            method: 'get',
            url: '/offerreport/allreports',
            headers: { 
                'Authorization': 'Bearer '+localStorage.getItem('token')
            }
            };
    
            axios(config)
            .then(response => {
            this.setState({
                offerReports: response.data,
                numberOfPages: Math.ceil(response.data.length / this.state.reportsPerPage)
            },(e) => this.setNewPage(e,this.state.currentPage))
            })
            .catch(error => {
            console.log(error);
            });
    }

    setNewPage = (event,page) => {

        const indexOfLastReport = parseInt(page) * this.state.reportsPerPage;
        const indexOfFirstReport = indexOfLastReport - this.state.reportsPerPage;
    
        const currReports = this.state.offerReports.slice(indexOfFirstReport, indexOfLastReport)
    
        this.setState({
          currentPage: parseInt(page),
          currentReports: currReports
        })
    }
    
  render() {
    console.log(this.state)
    return (
        <div className='offerreports-section-main'>
        <HeaderComponent/>
        <div className='offerreports-section-header'>
          <h1 className='offerreports-section-header-text'>
            Пријавени невалидни понуди
          </h1>
        </div>

        {
            this.state.offerReports.length > 0 ? 
            <>
              <div className='offerreports-section'>
                <table cellPadding={20} className='offerreports-section-table'>
                <thead className='offerreports-section-table-head'>
                    <tr>
                    <th>Име на понуда</th>
                    <th>Време на пријавување</th>
                    <th>Последно пријавена од</th>
                    <th>Вкупно пријави</th>
                    <th>
                    <button className='reportoffer-removeall-button' onClick={this.removeAllOfferReports}>Отстрани ги сите пријави</button>
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.state.currentReports.map((offer,idx) => <SingleReportComponent key={idx} id={offer.id} 
                    times_reported={offer.times_reported} reportedAt={offer.reportedAt} phoneOffer={offer.phoneOffer} 
                    reportedBy={offer.reportedBy} removeOfferReport={this.removeOfferReport}/>)
                    }
                </tbody>
                </table>

                </div>
                <div className='offerreports-pagination-wrapper'>
                <Pagination className='offerreports-pagination' onChange={this.setNewPage} page={this.state.currentPage}
                count={this.state.numberOfPages} color="primary" />
                </div>      
            </>
            :
            <div className='no-offerreports-wrapper'>
                <h1 className='no-offerreports-message'>Нема пријавено понуди</h1>
            </div>
        }
      </div>
    )
  }
}

export default OfferReportsComponent
