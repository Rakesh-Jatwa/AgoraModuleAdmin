import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import ApprovalRejectList from './ApprovalRejectList' 
import ApprovalList from './ApprovalList' 
import {UploadDocuments} from '../../../Actions/Requester'
import {GetDeleteFile} from '../../../Actions/Vendor'
import {GetSearchPurchaseReqApproval, GetViewSinglePr,  GetPurchaseReqRejectSearch, GetDownloadFile} from '../../../Actions/Approver'


class Purchase extends Component {
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs">
         <Tab eventKey="ApprovalList" title="Approval List">
          <div className="tab-content py-3 px-3 px-sm-0">
             <ApprovalList
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetViewSinglePr}
                search_result = {this.props.pr_details}
                loading = {this.props.loading}
                history = {this.props.history}
                location = {this.props.location}
                UploadDocuments = {this.props.UploadDocuments}
                form_details = {this.props.form_datas}
                pr_details={this.props.pr_approval_details}
                download_file = {this.props.GetDownloadFile}
                dr_loading = {this.props.dr_loading}
                fileupload = {this.props.fileupload}
                delete_file = {this.props.GetDeleteFile}
                file_delete = {this.props.file_delete}
                upload_document = {this.props.upload_document}
                fue_loading = {this.props.fue_loading}
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
            />
        </div>
      </Tab>
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  purchase_reqest_approval : state.purchase_reqest_approval.responseList,
  pr_approval_details : state.approver_pr,
  purchase_reqest_reject : state.purchase_reqest_reject.responseList,
  pr_loading:state.purchase_reqest_reject.loading,
  loading:state.view_single_pr.loading,
  pr_details : state.view_single_pr.responseList,
  upload_document : state.file_upload_external.responseList,
  fue_loading : state.file_upload_external.loading,
  form_datas : state.form.ApprovalItems,
  dr_loading : state.file_delete_external.loading,
  fileupload : state.fileupload,
  file_delete : state.file_delete_external.responseList,
})


const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetSearchPurchaseReqApproval : (values) => dispatch(GetSearchPurchaseReqApproval(values)),
  GetSearchPurchaseReqApproval : (values) => dispatch(GetSearchPurchaseReqApproval(values)),
  GetViewSinglePr : (values) => dispatch(GetViewSinglePr(values)),
  UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
  GetPurchaseReqRejectSearch : (values) => dispatch(GetPurchaseReqRejectSearch(values)),
  GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
  GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
  
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;