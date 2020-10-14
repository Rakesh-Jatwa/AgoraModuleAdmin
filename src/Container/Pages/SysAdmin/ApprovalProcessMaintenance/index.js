import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Master from './Master' 
import ApprovingOfficerAssignment from './ApprovingOfficerAssignment'
import ItemAssignment from './ItemAssignment'
import UserAssignment from './UserAssignment'
import {
  ApprovalProcessGroupType,
  ApprovalProcessApprGroup
} from '../../../../Actions/SysAdmin';
import { connect } from 'react-redux';


class ContractCatalogue extends Component {
    state = {
        active_key : 'Master',
        role_id : '',
        render : true
    }

    componentDidMount() {
        var data={"id":"pamb"}
        this.props.ApprovalProcessGroupType(data)
        this.props.ApprovalProcessApprGroup(data)
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
                <Tab eventKey="Master" title="Approval Group">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <Master  {...this.props}/>
                    </div>
                </Tab>
                <Tab eventKey="ApprovingOfficerAssignment" title="Approving Officer Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <ApprovingOfficerAssignment {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="UserAssignment" title="User Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <UserAssignment {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
                <Tab eventKey="ItemAssignment" title="Item Assignment">
                    <div className="tab-content py-3 px-3 px-sm-0">
                        <ItemAssignment {...this.props} change_tab = {this.ChangeActiveKey}/>
                    </div>
                </Tab>
        </Tabs>
      </div>
    }
}

const mapStateToProps = (state) => ({
  group_types_list: state.group_types_list.responseList,
});

const mapDispatchToProps = (dispatch) => ({
  ApprovalProcessGroupType: (values) => dispatch(ApprovalProcessGroupType(values)),
  ApprovalProcessApprGroup: (values) => dispatch(ApprovalProcessApprGroup(values)),
});

const ContractCatalogueHolder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractCatalogue);

export default ContractCatalogueHolder;