import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import ApprovalRejectList from '../../SearchPOAO/ApprovedRejectedList' 
import ApprovalList from './ApprovalList' 
import {UploadDocuments, ClearUploadDocuments} from '../../../../Actions/Requester'
import {GetDeleteFile} from '../../../../Actions/Vendor'
import {GetSearchPurchaseReqApproval, GetViewSinglePr,  GetPurchaseReqRejectSearch, GetDownloadFile, GetApppoDetails, GetPoApprovallistAll} from '../../../../Actions/Approver'



class Purchase extends Component {
  state = {
    active_key : 'ApprovalList',
  }
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs" 
          activeKey={this.state.active_key} onSelect={k => {
            if(k=="ApprovalList"){
                this.props.history.push({
                  pathname : 'SearchPO_AO',
                  redirect_to_tab : 'ApprovalList',
                  redirect_to_page : 'SearchPO_AO'
                })
            }
            else{
              this.setState({active_key:k}) 
            }
          }}>

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
                fd_loading= {this.props.fd_loading}
                upload_document = {this.props.upload_document}
                fue_loading = {this.props.fue_loading}
                ClearUploadDocuments = {this.props.ClearUploadDocuments}
                
             />
          </div>
          
        </Tab>
      <Tab eventKey="ApprovalRejected" title="Approved / Rejected Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <ApprovalRejectList 
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
  purchase_reqest_approval : state.purchase_reqest_approval.responseList,
  pr_approval_details : state.approver_pr,
  loading:state.po_approval_details.loading,
  pr_details : state.po_approval_details.responseList,
  upload_document : state.file_upload_external.responseList,
  fue_loading : state.file_upload_external.loading,
  form_datas : state.form.ApprovalItems,
  dr_loading : state.file_download.loading,
  fd_loading : state.file_delete_external.loading,
  fileupload : state.fileupload,
  file_delete : state.file_delete_external.responseList,
  search_list_2 : state.get_po_approval_list_all.responseList,
  po_listing_rej : state.get_po_approval_list_all.loading,
})


const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetSearchPurchaseReqApproval : (values) => dispatch(GetSearchPurchaseReqApproval(values)),
  GetViewSinglePr : (values) => dispatch(GetApppoDetails(values)),
  UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
  ClearUploadDocuments  : (filename, data) => dispatch(ClearUploadDocuments(filename, data)),
  
  GetPurchaseReqRejectSearch : (values) => dispatch(GetPurchaseReqRejectSearch(values)),
  GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
  GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
  GetPoApprovallistAll  : (values) => dispatch(GetPoApprovallistAll(values)),
  
  

})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;