import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import {UploadDocuments,FundTypeOrPersonCodeORProjectCodeAction, FillAddressAction, DeliveryAddressAction, CostCentreCodeAction, SegmentationAction,GetSearchPRList, 
  GetSearchPRCancelList, GetPurchaseRequestItemsDetails, GetFillAddress, GetDeleteFile, GetPurchaseRequestItemsDetailsPopUp, GetFFRaisePOScreen,
  GetPurchaseRequestItemsDetailsNcPopUp, GetPurchaseRequestItemsDetailsFFPopUp, GetVendorList, GetDocumentContinue, GetContinueDocument, GetE2PdocumentList, GetMultiGLTemplate, GetMultiInvoiceTemplate} from '../../../../Actions/Requester'
import { GetViewSinglePr, GetE2PPopTaxCode, GetE2PWithHoldingTax, GetE2PPayFor} from '../../../../Actions/Approver'
import {GetE2PApprovalDetails} from '../../../../Actions/Approver'
import { GetDownloadFile, GetPoPendingOrder} from '../../../../Actions/Vendor'
import Document from './Document' 
import Listing from './Listing'


class Purchase extends Component {
  state = {
    active_key : 'contact',
  }
    render (){
     
      
        return <div id="tabs">

      <Tabs defaultActiveKey="contact" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
                      if(k=='contact'){
                        window.location.reload()
                      }
                      this.setState({active_key:k})
                      localStorage.removeItem('e2p_req_details')
                      localStorage.removeItem('e2p_aprov_details')
          }}>
        <Tab eventKey="contact" title="E2P Document">
          <div className="tab-content py-3 px-3 px-sm-0">
            
          <Document 
                  UploadDocuments = {this.props.UploadDocuments} 
                  upload_document={this.props.upload_document}
                  request_form = {this.props.request_form}
                  FundTypeOrPersonCode = {this.props.FundTypeOrPersonCodeORProjectCodeAction}
                  fund_type_project_code = {this.props.fund_type_project_code}
                  fund_type_project_code_l1 = {this.props.fund_type_project_code_l1}
                  fund_type_project_code_l2 = {this.props.fund_type_project_code_l2}
                  fund_type_project_code_l3 = {this.props.fund_type_project_code_l3}
                  fund_type_project_code_l4 = {this.props.fund_type_project_code_l4}
                  fund_type_project_code_l5 = {this.props.fund_type_project_code_l5}
                  fund_type_project_code_l6 = {this.props.fund_type_project_code_l6}
                  fund_type_project_code_l7 = {this.props.fund_type_project_code_l7}
                  fund_type_project_code_l8 = {this.props.fund_type_project_code_l8}
                  fund_type_project_code_l9 = {this.props.fund_type_project_code_l9}
                  history ={this.props.history}
                  FillAddress = {this.props.FillAddressAction}
                  address = {this.props.address}
                  file_upload_external = {this.props.file_upload_external}
                  file_delete = {this.props.file_delete}
                  DeliveryAddress = {this.props.DeliveryAddressAction}
                  delivery_address = {this.props.delivery_address}
                  dr_loading = {this.props.dr_loading}
                  CostCentreCode = {this.props.CostCentreCodeAction}
                  cost_centre_code = {this.props.cost_centre_code}
                  download = {this.props.GetDownloadFile}
                  SegmentationAction = {this.props.SegmentationAction}
                  segmentation = {this.props.segmentation}
                  external_delete = {this.props.file_delete_external}
                  ed_loading = {this.props.ed_loading}
                  location = {this.props.location}
                  get_details = {this.props.GetPurchaseRequestItemsDetails}
                  get_details_popup = {this.props.GetPurchaseRequestItemsDetailsPopUp}
                  get_nc_popup = {this.props.GetPurchaseRequestItemsDetailsNcPopUp}
                  get_ff_popup = {this.props.GetPurchaseRequestItemsDetailsFFPopUp}
                  purchased_items = {this.props.purchase_request_items}
                  SavePurchaseRequest = {this.props.GetSavePurchaseRequest}
                  fill_address = {this.props.get_fill_address}
                  get_fill_address = {this.props.GetFillAddress}
                  get_delete_file = {this.props.GetDeleteFile}
                  pri_loading = {this.props.pri_loading}
                  pri_popup_details = {this.props.pri_popup_details}
                  pri_popup = {this.props.pri_popup}
                  gl_code= {this.props.gl_code}
                  gl_loading= {this.props.gl_loading}
                  cl_code_access = {this.props.GetFFRaisePOScreen}
                  nc_popup= {this.props.nc_popup}
                  ff_popup= {this.props.ff_popup}
                  pri_ncpopup_details= {this.props.pri_ncpopup_details}
                  pri_ffpopup_details= {this.props.pri_ffpopup_details}
                  vendor_list= {this.props.vendor_list}
                  vl_loading= {this.props.vl_loading}
                  get_vendor_list = {this.props.GetVendorList}
                  requester_continue= {this.props.requester_continue}
                  rc_loading = {this.props.rc_loading}
                  GetDocumentContinue = {this.props.GetDocumentContinue}

                  pop_pay_for ={this.props.pop_pay_for}
                  pop_tax_code ={this.props.pop_tax_code}
                  with_holding_tax ={this.props.with_holding_tax}
                  GetE2PApprovalDetails = {this.props.GetE2PApprovalDetails}
                  GetE2PPopTaxCode ={this.props.GetE2PPopTaxCode}
                  GetE2PWithHoldingTax ={this.props.GetE2PWithHoldingTax}
                  GetE2PPayFor ={this.props.GetE2PPayFor}
                  GetMultiGLTemplate = {this.props.GetMultiGLTemplate}
                  GetMultiInvoiceTemplate = {this.props.GetMultiInvoiceTemplate}
                  approval_details = {this.props.approval_details}
                  approval_loading = {this.props.approval_loading}
                  e2p_multi_doc_lo ={this.props.e2p_multi_doc_lo}
                  e2p_multi_doc ={this.props.e2p_multi_doc}
              />
            </div>

        </Tab>
        <Tab eventKey="profile" title="E2P Document Listing">
          <div className="tab-content py-3 px-3 px-sm-0">
              <Listing 
                loading = {this.props.document_loading}
                approval_details = {this.props.approval_details}
                approval_loading = {this.props.approval_loading}
                get_search_prlist = {this.props.GetE2PdocumentList}
                search_product_list = {this.props.document_list}
                GetE2PApprovalDetails = {this.props.GetE2PApprovalDetails}
                GetDownloadFile = {this.props.GetDownloadFile}
                dr_loading  = {this.props.dr_loading}
              />
          </div>
        </Tab>
      </Tabs></div>
    }
}

const mapStateToProps = state => ({
  purchase_request_items : state.purchase_request_items.responseList,
  pri_loading : state.purchase_request_items.loading,
  upload_document : state.upload_document,
  file_upload_external : state.file_upload_external,
  file_delete : state.file_delete,
  file_delete_external : state.file_delete_external,
  ed_loading: state.file_delete_external.loading,
  request_form : state.form.request_details,
  fund_type_project_code : state.fund_type_project_code.responseList,
  fund_type_project_code_l1 : state.fund_type_project_code.responseListL1,
  fund_type_project_code_l2 : state.fund_type_project_code.responseListL2,
  fund_type_project_code_l3 : state.fund_type_project_code.responseListL3,
  fund_type_project_code_l4 : state.fund_type_project_code.responseListL4,
  fund_type_project_code_l5 : state.fund_type_project_code.responseListL5,
  fund_type_project_code_l6 : state.fund_type_project_code.responseListL6,
  fund_type_project_code_l7 : state.fund_type_project_code.responseListL7,
  fund_type_project_code_l8 : state.fund_type_project_code.responseListL8,
  fund_type_project_code_l9 : state.fund_type_project_code.responseListL9,
  address : state.address.responseList,
  delivery_address : state.delivery_address.responseList,
  cost_centre_code : state.cost_centre_code.responseList,
  segmentation : state.segmentation.responseList,
  search_product_cancel_list : state.search_product_cancel_list.responseList,
  spl_loading : state.search_product_cancel_list.loading,
  pr_status : state.purchase_request_status.responseList,
  get_fill_address: state.get_fill_address.responseList,
  dr_loading : state.file_download.loading,
  pri_popup_details : state.purchase_request_items_popup,
  pri_popup : state.purchase_request_items_popup.responseList,
  purchase_order : state.purchase_order.responseList,
  pr_loading : state.purchase_order.loading,
  nc_popup : state.purchase_request_items_nc_popup.responseList,
  pri_ncpopup_details : state.purchase_request_items_nc_popup,
  vendor_list : state.e2p_vendor_list.responseList,
  vl_loading : state.e2p_vendor_list.loading,
  ff_popup : state.purchase_request_items_ff_popup.responseList,
  pri_ffpopup_details : state.purchase_request_items_ff_popup,
  requester_continue : state.requester_continue.responseList,
  rc_loading : state.requester_continue.loading,
  gl_code : state.gl_code.responseList,
  gl_loading: state.gl_code.loading,
  
  pop_pay_for : state.pop_pay_for.responseList,
  pop_tax_code : state.pop_tax_code.responseList,
  with_holding_tax: state.with_holding_tax.responseList,

  document_list :state.document_list.responseList, 
  document_loading :state.document_list.loading, 

  approval_details :state.approval_details.responseList, 
  approval_loading :state.approval_details.loading, 

  e2p_multi_doc_lo :state.e2p_multi_doc.loading, 
  e2p_multi_doc :state.e2p_multi_doc.loading, 
  

  
})

const mapDispatchToProps = dispatch => ({
  UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
  FundTypeOrPersonCodeORProjectCodeAction  : (datas) => dispatch(FundTypeOrPersonCodeORProjectCodeAction(datas)),
  FillAddressAction  : () => dispatch(FillAddressAction()),
  DeliveryAddressAction  : () => dispatch(DeliveryAddressAction()),
  CostCentreCodeAction  : () => dispatch(CostCentreCodeAction()),
  SegmentationAction  : () => dispatch(SegmentationAction()),
  GetSearchPRCancelList  : (values) => dispatch(GetSearchPRCancelList(values)),
  GetPurchaseRequestItemsDetails : (values) =>dispatch(GetPurchaseRequestItemsDetails(values)),
  GetPurchaseRequestItemsDetailsPopUp: (values) =>dispatch(GetPurchaseRequestItemsDetailsPopUp(values)),
  GetPurchaseRequestItemsDetailsNcPopUp: (values) =>dispatch(GetPurchaseRequestItemsDetailsNcPopUp(values)),
  GetPurchaseRequestItemsDetailsFFPopUp: (values) =>dispatch(GetPurchaseRequestItemsDetailsFFPopUp(values)),
  GetFillAddress : (values) => dispatch(GetFillAddress(values)),
  GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
  GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
  GetViewSinglePr : (values) => dispatch(GetViewSinglePr(values)),
  GetFFRaisePOScreen : (values) => dispatch(GetFFRaisePOScreen(values)),
  GetPoPendingOrder : (values) => dispatch(GetPoPendingOrder(values)),
  GetDocumentContinue :  (values) => dispatch(GetDocumentContinue(values)),
  GetE2PPopTaxCode : (values) => dispatch(GetE2PPopTaxCode(values)),
  GetE2PWithHoldingTax : (values) => dispatch(GetE2PWithHoldingTax(values)),
  GetE2PPayFor :  (values) => dispatch(GetE2PPayFor(values)),
  GetE2PdocumentList :  (values) => dispatch(GetE2PdocumentList(values)),
  GetE2PApprovalDetails :  (values) => dispatch(GetE2PApprovalDetails(values)),
  GetVendorList : (values) => dispatch(GetVendorList(values)),
  GetMultiGLTemplate : (values) => dispatch(GetMultiGLTemplate(values)),
  GetMultiInvoiceTemplate : (values) => dispatch(GetMultiInvoiceTemplate(values)),
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),

})


const PurchaseDetails = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseDetails;