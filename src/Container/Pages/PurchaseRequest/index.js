import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import ApprovalRejectList from './ApprovalRejectList' 
import ApprovalList from './ApprovalList' 
import {GetSearchPurchaseReqApproval, GetPurchaseReqRejectSearch} from '../../../Actions/Approver'


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
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs"  activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k})}}>
         <Tab eventKey="ApprovalList" title="Approval List">
          <div className="tab-content py-3 px-3 px-sm-0">
             <ApprovalList
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetSearchPurchaseReqApproval}
                search_result = {this.props.purchase_reqest_approval}
                loading = {this.props.loading}
                history = {this.props.history}
             />
          </div>
        </Tab>
      <Tab eventKey="ApprovalRejected" title="Approved / Rejected Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <ApprovalRejectList 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetPurchaseReqRejectSearch}
                search_result = {this.props.purchase_reqest_reject}
                loading = {this.props.pr_loading}
                history = {this.props.history}
            />
        </div>
      </Tab>
      
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  purchase_reqest_approval : state.purchase_reqest_approval.responseList,
  loading:state.purchase_reqest_approval.loading,

  purchase_reqest_reject : state.purchase_reqest_reject.responseList,
  pr_loading:state.purchase_reqest_reject.loading

  
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalList')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetSearchPurchaseReqApproval : (values) => dispatch(GetSearchPurchaseReqApproval(values)),
  GetPurchaseReqRejectSearch : (values) => dispatch(GetPurchaseReqRejectSearch(values)),
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;