import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import CreditDebitNote from './CreditDebitNote' 
import CreditNoteListing from './CreditNoteListing' 
import DebitNoteListing from './DebitNoteListing' 
import {GetGenerateDEBITPDF , GetGenerateCREDITPDF, GetInvoicePDF} from '../../../Actions/Requester'
import {GetDNListing, GetInvoiceListing, GetGeneratePOPDF, GetViewGRNPDF, GetCNListing} from '../../../Actions/Vendor'

class Purchase extends Component {
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="DebitCredit" transition={false} id="tabs">
         <Tab eventKey="DebitCredit" title="Debit Note / Credit Note ">
            <div className="tab-content py-3 px-3 px-sm-0">
                <CreditDebitNote />
            </div>
        </Tab>
      <Tab eventKey="Debit Note Listing" title="Debit Note Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
        <DebitNoteListing 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetDNListing}
                search_result = {this.props.tab_2_data}
                loading = {this.props.tab_2_loading}
                error = {this.props.tab_2_error}
                gpopdf_loading = {this.props.gpopdf_loading}
                ipdf_loading = {this.props.ipdf_loading}
                GetGeneratePOPDF = {this.props.GetGeneratePOPDF}
                GetInvoicePDF = {this.props.GetInvoicePDF}
                debit_pdf_loading ={this.props.debit_pdf_loading}
                GetGenerateDEBITPDF = {this.props.GetGenerateDEBITPDF}
            />
        </div>
      </Tab>
      <Tab eventKey="Credit Note Listing" title="Credit Note Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
          <CreditNoteListing
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetCNListing}
                search_result = {this.props.tab_3_data}
                loading = {this.props.tab_3_loading}
                error = {this.props.tab_3_error}
                gpopdf_loading = {this.props.gpopdf_loading}
                ipdf_loading = {this.props.ipdf_loading}
                GetGeneratePOPDF = {this.props.GetGeneratePOPDF}
                GetInvoicePDF = {this.props.GetInvoicePDF}
                credit_pdf_loading ={this.props.credit_pdf_loading}
                GetGenerateCREDITPDF = {this.props.GetGenerateCREDITPDF}
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

  tab_2_data : state.dn_listing.responseList,
  tab_2_error : state.dn_listing,
  tab_2_loading : state.dn_listing.loading,

  tab_3_data : state.cn_listing.responseList,
  tab_3_error : state.cn_listing,
  tab_3_loading : state.cn_listing.loading,


  gpopdf_loading : state.generate_popdf.loading,
  gdopdf_loading : state.generate_dopdf.loading,
  ipdf_loading : state.generate_ipdf.loading,
  gpdf_loading : state.generate_grnpdf.loading,

  credit_pdf : state.generate_credit_pdf,
  credit_pdf_loading : state.generate_credit_pdf.loading,

  debit_pdf : state.generate_credit_pdf,
  debit_pdf_loading : state.generate_credit_pdf.loading
  
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetCNListing : (values) => dispatch(GetCNListing(values)),
  GetDNListing : (values) => dispatch(GetDNListing(values)),
  GetInvoiceListing : (values) => dispatch(GetInvoiceListing(values)),
  GetGenerateDEBITPDF  : (values) => dispatch(GetGenerateDEBITPDF(values)),
  GetGenerateCREDITPDF  : (values) => dispatch(GetGenerateCREDITPDF(values)),
  GetInvoicePDF  : (values) => dispatch(GetInvoicePDF(values)),
  GetViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;