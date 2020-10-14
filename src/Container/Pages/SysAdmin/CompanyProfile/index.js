import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master'
import Parameters from './Parameters'
import DeliveryAddress from './DeliveryAddress'
import BillingAddress from './BillingAddress'
import Department from './Department'


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
                <Tab eventKey="Master" title="Company Details">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        {
                          this.state.active_key === "Master" ? <Master  {...this.props}/> : null
                        }
                    </div>
                </Tab>
                <Tab eventKey="Parameters" title="Parameters">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        {
                          this.state.active_key === "Parameters" ?
                            <Parameters  {...this.props} {...this.state} get_role={this.get_rold_id} block_render={this.BlockRender}/> : null
                        }
                    </div>
                </Tab>
                <Tab eventKey="DeliveryAddress" title="Delivery Address">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        {
                          this.state.active_key === "DeliveryAddress" ?
                            <DeliveryAddress {...this.props} change_tab = {this.ChangeActiveKey}/> : null
                        }
                    </div>
                </Tab>
                <Tab eventKey="BillingAddress" title="Billing Address">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        {
                          this.state.active_key === "BillingAddress" ?
                            <BillingAddress {...this.props} change_tab = {this.ChangeActiveKey}/> : null
                        }
                    </div>
                </Tab>
                <Tab eventKey="Department" title="Department">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        {
                          this.state.active_key === "Department" ?
                            <Department {...this.props} change_tab = {this.ChangeActiveKey}/> : null
                        }
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

export default ContractCatalogue;
