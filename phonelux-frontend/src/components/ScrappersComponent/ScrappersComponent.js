import axios from 'axios'
import React, { Component } from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import ScrapperInfoComponent from './ScrapperInfoComponent'
import "./ScrappersComponent.css"

export class ScrappersComponent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        scrapperinfos: []
      }

    }

    componentDidMount(){
        var config = {
            method: 'get',
            url: '/scrapperinfo',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          
          axios(config)
          .then(response => {
            this.setState({
                scrapperinfos: response.data
            })
          })
          .catch(error => {
            console.log(error);
          });
    }
    
  render() {
    return (
        <div className='scrappers-section-main'>
            <HeaderComponent/>
            <div className='scrappers-section-header'>
            <h1 className='scrappers-section-header-text'>
                Преземање на содржина
            </h1>
            </div>

            <div className='scrappers-info-section'>
                <table cellPadding={20} className='scrappers-section-table'>
                    <thead className='scrappers-section-table-head'>
                    <tr>
                    <th>Продавница</th>
                    <th>Статус</th>
                    <th>Датум</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.scrapperinfos.map((info,idx) => <ScrapperInfoComponent key={idx} id={info.id} store={info.store} 
                        status={info.status} recievedAt={info.recievedAt}/>) 
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
  }
}

export default ScrappersComponent
