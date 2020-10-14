import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Approval from './Approval' 
import Listing from './Listing'
import PendingFYFA from './PendingFYFA'


class DocumentVerify extends Component {
    render (){
     
        return <div id="tabs">
          <Tabs defaultActiveKey="contact" transition={false} id="tabs">
            <Tab eventKey="contact" title="PSD Acceptance List">
                <div className="tab-content py-3 px-3 px-sm-0">
                    <Approval {...this.props}/>
                </div>
            </Tab>
            <Tab eventKey="profile" title="PSD Accepted / Rejected Listing">
              <div className="tab-content py-3 px-3 px-sm-0">
                  <Listing {...this.props}/>
              </div>
            </Tab>
            <Tab eventKey="PendingFYFA" title="Pending FYFA">
              <div className="tab-content py-3 px-3 px-sm-0">
                  <PendingFYFA {...this.props}/>
              </div>
            </Tab>
        </Tabs>
      </div>
    }
}

export default DocumentVerify;