import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Approval from './Approval' 
import Listing from './Listing'


class DocumentVerify extends Component {
    componentDidMount(){
      console.log('DocumentVerify_!', this.props)
    }
    render (){
     
        return <div id="tabs">
          <Tabs defaultActiveKey="contact" transition={false} id="tabs">
        
        <Tab eventKey="contact" title="Approval Listing">
            <div className="tab-content py-3 px-3 px-sm-0">
                <Approval  {...this.props}/>
            </div>
        </Tab>
        <Tab eventKey="profile" title="Approved / Rejected Listing">
          <div className="tab-content py-3 px-3 px-sm-0">
              <Listing {...this.props}/>
          </div>
        </Tab>
      </Tabs></div>
    }
}

export default DocumentVerify;