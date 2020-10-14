import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import NewDebitNote from './NewDebitNote' 
import VerifiedDebitNote from './VerifiedDebitNote' 
import DebitNoteListing from './DebitNoteListing' 
import {GetInvoicePDF , GetGenerateDOPDF, GetDNTrackingList} from '../../../Actions/Requester'
import {GetIssueInvoice, GetInvoiceListing, GetGeneratePOPDF, GetViewGRNPDF, } from '../../../Actions/Vendor'


class DebitNote extends Component {
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="DebitCredit" transition={false} id="tabs">
         <Tab eventKey="DebitCredit" title="New Debit Note">
            <div className="tab-content py-3 px-3 px-sm-0">
                <NewDebitNote 
                    get_search_list = {this.props.GetDNTrackingList}
                    search_result = {this.props.tab_1_data}
                    loading = {this.props.tab_1_loading}
                    location={this.props.location}
                    history={this.props.history}
                />
            </div>
        </Tab>
      <Tab eventKey="VerifiedDebitNote" title="Verified Debit Note">
        <div className="tab-content py-3 px-3 px-sm-0">
            <VerifiedDebitNote 
                get_search_list = {this.props.GetDNTrackingList}
                search_result = {this.props.tab_2_data}
                loading = {this.props.tab_2_loading}
                error = {this.props.tab_2_error}
                gpopdf_loading = {this.props.gpopdf_loading}
                ipdf_loading = {this.props.ipdf_loading}
                GetGeneratePOPDF = {this.props.GetGeneratePOPDF}
                GetInvoicePDF = {this.props.GetInvoicePDF}
                history={this.props.history}
            />
        </div>
      </Tab>
      <Tab eventKey="PaidDebitNote" title="Paid Debit Note">
        <div className="tab-content py-3 px-3 px-sm-0">
            <DebitNoteListing 
                get_search_list = {this.props.GetDNTrackingList}
                search_result = {this.props.tab_3_data}
                loading = {this.props.tab_3_loading}
                error = {this.props.tab_3_error}
                gpopdf_loading = {this.props.gpopdf_loading}
                ipdf_loading = {this.props.ipdf_loading}
                GetGeneratePOPDF = {this.props.GetGeneratePOPDF}
                GetInvoicePDF = {this.props.GetInvoicePDF}
                history={this.props.history}
            />
        </div>
      </Tab>
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  tab_1_data : state.dn_track_listing.responseList,
  tab_1_error : state.dn_track_listing,
  tab_1_loading : state.dn_track_listing.loading,

  tab_2_data : state.dn_track_listing.responseList_s,
  tab_2_error : state.dn_track_listing,
  tab_2_loading : state.dn_track_listing.loading,

  tab_3_data : state.dn_track_listing.responseList_paid,
  tab_3_error : state.dn_track_listing,
  tab_3_loading : state.dn_track_listing.loading,

  gpopdf_loading : state.generate_popdf.loading,
  gdopdf_loading : state.generate_dopdf.loading,
  ipdf_loading : state.generate_ipdf.loading,
  gpdf_loading : state.generate_grnpdf.loading,
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetDNTrackingList : (values) => dispatch(GetDNTrackingList(values)),
  GetGeneratePOPDF  : (values) => dispatch(GetGeneratePOPDF(values)),
  GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
  GetInvoicePDF  : (values) => dispatch(GetInvoicePDF(values)),
  GetViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),

})


const DebitNoteHolder = connect(mapStateToProps, mapDispatchToProps)(DebitNote);
export default DebitNoteHolder;