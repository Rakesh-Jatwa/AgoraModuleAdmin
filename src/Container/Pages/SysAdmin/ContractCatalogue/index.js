import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master'
import Matrix from './Matrix'
import Listing from './Listing'
import MultiUser from './MultiUser'
import BatchUploadDownload from './BatchUploadDownload'
import Audit from './Audit'


class ContractCatalogue extends Component {
    state = {
        active_key : 'Master',
        role_id : '',
        render : true
    }
    ChangeActiveKey = (details, role_id) =>{
        this.setState({
            active_key :details,
            role_id : role_id,
            render:true
        })
    }

    BlockRender = () =>{
        this.setState({
            render:false
        })
    }

    get_rold_id =  () =>{
        return {
            role_id : this.state.role_id,
            render : this.state.render,
        }
    }

    render (){
        return <div id="tabs">
            <Tabs defaultActiveKey="Master" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k}) }}>
                <Tab eventKey="Master" title="Contract Catalogue">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Master  {...this.props} {...this.state}/>
                    </div>
                </Tab>
                <Tab eventKey="Matrix" title="Items Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Matrix  {...this.props} {...this.state} get_role={this.get_rold_id} block_render={this.BlockRender}/>
                    </div>
                </Tab>
                <Tab eventKey="Listing" title="Users Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Listing {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="MultiUser" title="Multi Users Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <MultiUser {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="BatchUploadDownload" title="Batch Upload/Download">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <BatchUploadDownload {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="Audit" title="Audit">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Audit {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

export default ContractCatalogue;
