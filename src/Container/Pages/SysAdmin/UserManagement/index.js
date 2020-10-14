
import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master'
import DeliveryAddress from './DeliveryAddress'
import BillingAddress from './BillingAddress'
import FinanceViewingDepartment from './FinanceViewingDepartment'
import CommodityAssignment from './CommodityAssignment'


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
                <Tab eventKey="Master" title="User Account">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Master  {...this.props} {...this.state}/>
                    </div>
                </Tab>
                <Tab eventKey="DeliveryAddress" title="Delivery Address">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <DeliveryAddress  {...this.props} {...this.state} get_role={this.get_rold_id} block_render={this.BlockRender}/>
                    </div>
                </Tab>
                <Tab eventKey="BillingAddress" title="Billing Address">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <BillingAddress {...this.props} {...this.state} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="FinanceViewingDepartment" title="Finance Viewing Department">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <FinanceViewingDepartment {...this.props} {...this.state} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="CommodityAssignment" title="Commodity Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <CommodityAssignment {...this.props}  {...this.state}change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

export default ContractCatalogue;
