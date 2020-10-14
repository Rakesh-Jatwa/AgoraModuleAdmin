import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import IssueInvoice from './IssueInvoice' 
import InvoiceListing from './InvoiceListing' 
import {GetInvoicePDF , GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetIssueInvoice, GetInvoiceListing, GetGeneratePOPDF, GetViewGRNPDF } from '../../../Actions/Vendor'


class Purchase extends Component {
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="IssueInvoice" transition={false} id="tabs">
         <Tab eventKey="IssueInvoice" title="Issue Invoice">
          <div className="tab-content py-3 px-3 px-sm-0">
             <IssueInvoice
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetIssueInvoice}
                search_result = {this.props.tab_1_data}
                loading = {this.props.tab_1_loading}
                history = {this.props.history}
                location = {this.props.location}
                error = {this.props.tab_1_error}
                gdopdf_loading = {this.props.gdopdf_loading}
                GetGenerateDOPDF = {this.props.GetGenerateDOPDF}
                gpdf_loading = {this.props.gpdf_loading}
                GetViewGRNPDF = {this.props.GetViewGRNPDF}
                
             />
          </div>
        </Tab>
      <Tab eventKey="Invoice Listing" title="Invoice Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <InvoiceListing 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetInvoiceListing}
                search_result = {this.props.tab_2_data}
                loading = {this.props.tab_2_loading}
                error = {this.props.tab_2_error}
                gpopdf_loading = {this.props.gpopdf_loading}
                ipdf_loading = {this.props.ipdf_loading}
             
                GetGeneratePOPDF = {this.props.GetGeneratePOPDF}
                GetInvoicePDF = {this.props.GetInvoicePDF}
            />
        </div>
      </Tab>
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  tab_1_data : state.invoice_issue.responseList,
  tab_1_error : state.invoice_listing,
  tab_1_loading : state.invoice_issue.loading,

  tab_2_data : state.invoice_listing.responseList,
  tab_2_error : state.invoice_listing,
  tab_2_loading : state.invoice_listing.loading,
  gpopdf_loading : state.generate_popdf.loading,
  gdopdf_loading : state.generate_dopdf.loading,
  ipdf_loading : state.generate_ipdf.loading,
  gpdf_loading : state.generate_grnpdf.loading,

})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetIssueInvoice : (values) => dispatch(GetIssueInvoice(values)),
  GetInvoiceListing : (values) => dispatch(GetInvoiceListing(values)),
  GetGeneratePOPDF  : (values) => dispatch(GetGeneratePOPDF(values)),
  GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
  GetInvoicePDF  : (values) => dispatch(GetInvoicePDF(values)),
  GetViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;