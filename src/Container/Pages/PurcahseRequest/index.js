import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import CancelledPR from './CancelledPR' 
import ConvertOrder from './ConverPR' 
import ConvertPRListing from './ConverPRListing' 
import {GetCommodityTypeList, GetCancelledPRListingSearch} from '../../../Actions/Requester'
import {GetConvertPRSearch, GetConvertPRListingSearch} from '../../../Actions/Approver'


class Purchase extends Component {
    state = {
      active_key : 'ConvertOrder',
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
        <Tabs defaultActiveKey="ConvertOrder" transition={false} activeKey={this.state.active_key} onSelect={k => {this.setState({active_key:k})         }}>
         <Tab eventKey="ConvertOrder" title="Convert Purchase Request">
          <div className="tab-content py-3 px-3 px-sm-0">
             <ConvertOrder
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetConvertPr}
                search_result = {this.props.search_list_1}
                loading = {this.props.po_listing}
                history = {this.props.history}
                location = {this.props.location}
                commodity_list = {this.props.commodity_list}
                GetCommodityTypeList = {this.props.GetCommodityTypeList}
             />
          </div>
        </Tab>
      <Tab eventKey="ConvertPRListing" title="Convert PR Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <ConvertPRListing 
              reset_form = {this.props.ResetRejectFrom}
              get_search_list = {this.props.ConvertPRListingSearch}
              search_result = {this.props.search_list_2}
              loading = {this.props.pr_loading}
              history={this.props.history}
            />
        </div>
      </Tab>
      <Tab eventKey="CancelledPR" title="Cancelled PR">
        <div className="tab-content py-3 px-3 px-sm-0">
            <CancelledPR 
                 reset_form = {this.props.ResetRejectFrom}
                  get_search_list = {this.props.GetCancelledPRListingSearch}
                  search_result = {this.props.search_list_3}
                  loading = {this.props.cr_loading}
                  history={this.props.history}
            />
        </div>
      </Tab>
      
     
    </Tabs></div>
    }
}




const mapStateToProps = state => ({
  search_list_1 : state.convert_pr_search.responseList,
  search_list_2 : state.convert_pr_list_search.responseList,
  search_list_3 : state.cancel_pr_list.responseList,
  po_listing : state.convert_pr_search.loading,
  pr_loading : state.convert_pr_list_search.loading,
  cr_loading : state.cancel_pr_list.loading,
  commodity_list : state.commodity_type_list.responseList,
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetConvertPr : (values) => dispatch(GetConvertPRSearch(values)),
  GetCommodityTypeList  : () => dispatch(GetCommodityTypeList()),
  ConvertPRListingSearch : (values) => dispatch(GetConvertPRListingSearch(values)),
  GetCancelledPRListingSearch : (values) => dispatch(GetCancelledPRListingSearch(values)),
  
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;