import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master' 

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
                <Tab eventKey="Master" title="Approved Vendor">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Master  {...this.props}/>
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

export default ContractCatalogue;