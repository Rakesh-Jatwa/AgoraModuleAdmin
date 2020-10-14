import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master' 
import Matrix from './Matrix' 


class DashbaordMaintanance extends Component {
    state = {
        active_key : 'FileRecovery',
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
            <Tabs defaultActiveKey="FileRecovery" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k}) }}>
                <Tab eventKey="FileRecovery" title="File Recovery">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Master  {...this.props}/>
                    </div>
                </Tab>
                <Tab eventKey="ConfirmedListing" title="Confirmed Listing">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Matrix  {...this.props} {...this.state} get_role={this.get_rold_id} block_render={this.BlockRender}/>
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

export default DashbaordMaintanance;