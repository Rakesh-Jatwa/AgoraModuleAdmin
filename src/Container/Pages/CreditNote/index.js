import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import NewCreditNote from './NewCreditNote' 
import CreditNoteListing from './CreditNoteListing' 
import {GetInvoicePDF , GetGenerateDOPDF, GetCreditNoteTrackingList, GetCreditNoteAckTrackingList} from '../../../Actions/Requester'
import {GetIssueInvoice, GetInvoiceListing, GetGeneratePOPDF, GetViewGRNPDF, } from '../../../Actions/Vendor'

class CreditNote extends Component {
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="NewCreditNote" transition={false} id="tabs">
         <Tab eventKey="NewCreditNote" title="New Credit Note">
            <div className="tab-content py-3 px-3 px-sm-0">
                <NewCreditNote 
                    get_search_list = {this.props.GetCreditNoteTrackingList}
                    search_result = {this.props.tab_1_data}
                    loading = {this.props.tab_1_loading}
                    error = {this.props.tab_1_error}
                />
            </div>
        </Tab>
      <Tab eventKey="AcknowledgedCreditNote" title="Acknowledged Credit Note">
        <div className="tab-content py-3 px-3 px-sm-0">
            <CreditNoteListing 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetCreditNoteAckTrackingList}
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
  tab_1_data : state.cn_track_listing.responseList,
  tab_1_error : state.cn_track_listing,
  tab_1_loading : state.cn_track_listing.loading,

  tab_2_data : state.cn_track_ack.responseList,
  tab_2_error : state.cn_track_ack,
  tab_2_loading : state.cn_track_ack.loading,

  gpopdf_loading : state.generate_popdf.loading,
  gdopdf_loading : state.generate_dopdf.loading,
  ipdf_loading : state.generate_ipdf.loading,
  gpdf_loading : state.generate_grnpdf.loading,

})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetCreditNoteAckTrackingList :  (values) => dispatch(GetCreditNoteAckTrackingList(values)),
  GetCreditNoteTrackingList : (values) => dispatch(GetCreditNoteTrackingList(values)),
  GetInvoiceListing : (values) => dispatch(GetInvoiceListing(values)),
  GetGeneratePOPDF  : (values) => dispatch(GetGeneratePOPDF(values)),
  GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
  GetInvoicePDF  : (values) => dispatch(GetInvoicePDF(values)),
  GetViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),
})


const CreditNoteHolder = connect(mapStateToProps, mapDispatchToProps)(CreditNote);
export default CreditNoteHolder;