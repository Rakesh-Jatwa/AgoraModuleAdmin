import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import ApprovedList from './ApprovedList' 
import ApprovedRejectedList from './ApprovedRejectedList' 
import {GetPoApprovallist, GetPoApprovallistAll, GetRFQListAllWithVendor} from '../../../Actions/Approver'


class Purchase extends Component {
  state = {
    active_key : 'ApprovalList',
  }

    componentDidMount(){
      if(this.props.location && this.props.location.redirect_to_tab){
        this.setState({
          active_key : this.props.location.redirect_to_tab
        })
      }
    }

    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => { this.setState({active_key:k})}}>
         <Tab eventKey="ApprovalList" title="Approval List">
          <div className="tab-content py-3 px-3 px-sm-0">
             <ApprovedList
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetPoApprovallist}
                search_result = {this.props.search_list_1}
                loading = {this.props.po_listing}
                history = {this.props.history}
                location = {this.props.location}
             />
          </div>
        </Tab>
      <Tab eventKey="ApprovedRejectedListing" title="Approved / Rejected Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <ApprovedRejectedList 
              reset_form = {this.props.ResetRejectFrom}
              get_search_list = {this.props.GetPoApprovallistAll}
              search_result = {this.props.search_list_2}
              loading = {this.props.po_listing_rej}
              history={this.props.history}
            />
        </div>
      </Tab>     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({

  search_list_1 : state.get_po_approval_list.responseList,
  po_listing : state.get_po_approval_list.loading,

  search_list_2 : state.get_po_approval_list_all.responseList,
  po_listing_rej : state.get_po_approval_list_all.loading,

})

const mapDispatchToProps = dispatch => ({
  GetPoApprovallist : (values) => dispatch(GetPoApprovallist(values)),
  GetPoApprovallistAll : (values) => dispatch(GetPoApprovallistAll(values)),
  GetRFQListAllWithVendor : (values) => dispatch(GetRFQListAllWithVendor(values)),
  
  
})



const RFQ = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default RFQ;