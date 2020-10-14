import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import ExpiredRejectedRFQ from './ExpiredRejectedRFQ' 
import QuotationListing from './QuotationListing' 
import OutstandingRFQ from './OutstandingRFQ' 
import {GetVendorRFQOutstanding, GetRFQQuotationListing, GetVendorRFQOutstandingExp} from '../../../../Actions/Vendor'


class Purchase extends Component {
    state = {
      active_key : 'OutstandingRFQ',
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
        <Tabs defaultActiveKey="OutstandingRFQ" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => this.setState({active_key:k})}>
         <Tab eventKey="OutstandingRFQ" title="Outstanding RFQ">
          <div className="tab-content py-3 px-3 px-sm-0">
             <OutstandingRFQ
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetVendorRFQOutstanding}
                search_result = {this.props.search_list_1}
                loading = {this.props.refq_loading}
                history={this.props.history}
             />
          </div>
        </Tab>
      <Tab eventKey="ExpiredRejectedRFQ" title="Expired / Rejected RFQ">
        <div className="tab-content py-3 px-3 px-sm-0">
            <ExpiredRejectedRFQ 
              reset_form = {this.props.ResetRejectFrom}
              get_search_list = {this.props.GetVendorRFQOutstandingExp}
              search_result = {this.props.search_list_2}
              loading = {this.props.ex_loading}
              history={this.props.history}
            />
        </div>
      </Tab>
      <Tab eventKey="QuotationListing" title="Quotation Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <QuotationListing
             reset_form = {this.props.ResetRejectFrom}
             get_search_list = {this.props.GetRFQQuotationListing}
             search_result = {this.props.search_list_3}
             loading = {this.props.loading_3}
             history={this.props.history}
             />
        </div>
      </Tab>
    </Tabs>
    </div>
    }
}



const mapStateToProps = state => ({
  search_list_1 : state.vendor_rfq_outstanding.responseList,
  refq_loading : state.vendor_rfq_outstanding.loading,

  search_list_2 : state.rfq_outstanding_exp.responseList,
  ex_loading : state.rfq_outstanding_exp.loading,

  search_list_3 : state.rfq_quote_access.responseList,
  loading_3 : state.rfq_quote_access.loading,

  

  
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetVendorRFQOutstanding : (values) => dispatch(GetVendorRFQOutstanding(values)),
  GetRFQQuotationListing : (values) => dispatch(GetRFQQuotationListing(values)),
  GetVendorRFQOutstandingExp : (values) => dispatch(GetVendorRFQOutstandingExp(values)),
  
})


const RFQ = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default RFQ;