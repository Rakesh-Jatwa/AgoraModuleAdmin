import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset, change} from 'redux-form';
import {UploadDocuments,FundTypeOrPersonCodeORProjectCodeAction, FillAddressAction, DeliveryAddressAction, CostCentreCodeAction, SegmentationAction,GetSearchPRList, 
  GetSearchPRCancelList, GetPurchaseRequestItemsDetails, GetFillAddress,GetFreeFormDetails, GetDeleteFile, GetPurchaseRequestItemsDetailsPopUp, GetFFRaisePOScreen, GetPurchaseRequestItemsDetailsNcPopUp, GetPurchaseRequestItemsDetailsFFPopUp, GetApppoDetails} from '../../../Actions/Requester'
import {GetViewSinglePr, GetVendorDetailMethod} from '../../../Actions/Approver'
import { GetDownloadFile, GetPoPendingOrder, GetPoList, GetFillTax} from '../../../Actions/Vendor'
import Request from './Request' 
import Listing from './Listing' 
import Cancellation from './PoListing' 
import PurchaseOrder from './PurchaseOrder' 


class Purchase extends Component {
  state = {
    active_key : 'PurchaseOrder',
    PO_NO :'',
    index :'',
    status : '',
    rendred :true,
    rerender : true,
  }


  componentDidMount(){
    if(this.props.location && this.props.location.redirect_to_tab){
      if(this.props.location && this.props.location.redirect_to_tab=="PurchaseOrder"){
          localStorage.removeItem('free_from')
          localStorage.removeItem('po_from')
      }
      else{
        this.setState({
          active_key : this.props.location.redirect_to_tab
        })
      }
     
    }
    if(localStorage.getItem('free_from')){
        this.setState({
            active_key : 'contact'
        })
    }
    if(localStorage.getItem('po_from')){
        this.setState({
            active_key : 'RaisePO'
        })
    }
  }

  componentDidUpdate(){
    if(this.props.location && this.props.location.datas && this.state.rerender){
      let {datas} = this.props.location
      this.setState({
          POM_PO_NO :datas.RM_RFQ_No,
          POM_PO_INDEX :datas.RM_RFQ_ID,
          status : datas.status,
          rerender : datas.rerender,
          rendred : datas.rerender,
      })
    }
  }


  setActivationKey = (activtab) =>{
    this.setState({
      active_key : activtab
    })
  }

  setVendorDetails = (activtab) =>{
    this.setState({
      POM_PO_NO :  activtab.POM_PO_NO,
      POM_PO_INDEX :  activtab.POM_PO_INDEX,
      status : activtab.status,
      rendred : false
    })
  }

  getVendorDetails = () =>{
    let _details = this.state;
    this.setState({rendred : true})
    return {
      POM_PO_NO :  _details.POM_PO_NO,
      POM_PO_INDEX :  _details.POM_PO_INDEX,
      status : _details.status,
    }
  }

 

    render (){
        console.log('purchase_order', this.props.purchase_order)
          return <div id="tabs">
          <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k =>{ 
            
             this.setState({active_key:k})
              if(k=="PurchaseOrder"){
                localStorage.removeItem('free_from')
                localStorage.removeItem('po_from')
                window.location.reload()
              }
            
              return true
          }}>
           <Tab eventKey="PurchaseOrder" title="Purchase Order">
            <div className="tab-content py-3 px-3 px-sm-0">
              <PurchaseOrder
                  reset_form = {this.props.ResetApprovalFrom}
                  get_search_list = {this.props.GetPoPendingOrder}
                  search_result = {this.props.purchase_order}
                  loading = {this.props.pr_loading}
                  history = {this.props.history}
                  location = {this.props.location}
                  get_pr_details = {this.props.GetViewSinglePr}
                  change_tab = {this.setActivationKey}
                  update_details = {this.setVendorDetails}
              />
          </div>
        </Tab>
        <Tab eventKey="profile" title="Purchase Order Cancellation">
            <div className="tab-content py-3 px-3 px-sm-0">
                <Cancellation 
                  reset_form = {this.props.ResetApprovalFrom}
                  get_search_list = {this.props.GetPoPendingOrder}
                  search_result = {this.props.purchase_order_cancel}
                  loading = {this.props.pr_loading}
                  history = {this.props.history}
                  location = {this.props.location}
                  get_pr_details = {this.props.GetViewSinglePr}
                  change_tab = {this.setActivationKey}
                  update_details = {this.setVendorDetails}
                />
            </div>
        </Tab>
        <Tab eventKey="contact" title="Free Form Purchase Order">
          <div className="tab-content py-3 px-3 px-sm-0">
          <Request 
                  UploadDocuments = {this.props.UploadDocuments} 
                  upload_document={this.props.upload_document}
                  request_form = {this.props.request_form}
                  FundTypeOrPersonCode = {this.props.FundTypeOrPersonCodeORProjectCodeAction}
                  fund_type_project_code = {this.props.fund_type_project_code}
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
                  GetApppoDetails = {this.props.GetApppoDetails}
                  po_details ={this.props.po_details}
                  po_loading ={this.props.po_loading}
                  change_tab = {this.setActivationKey}
                  update_details = {this.setVendorDetails}
                  get_details = {this.getVendorDetails}
                  VendorDetail= {this.props.VendorDetail}
                  GetVendorDetailMethod= {this.props.GetVendorDetailMethod}
                  free_form_details  = {this.props.GetFreeFormDetails}
                  free_form = {this.props.free_form}
                  fill_tax = {this.props.fill_tax}
                  GetFillTax = {this.props.GetFillTax}
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
  request_form : state.form.free_form,
  fund_type_project_code : state.fund_type_project_code.responseList,
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

  purchase_order : state.po_list.responseList,
  pr_loading : state.po_list.loading,

  purchase_order_cancel : state.po_list.cancelresponseList,

  nc_popup : state.purchase_request_items_nc_popup.responseList,
  pri_ncpopup_details : state.purchase_request_items_nc_popup,

  ff_popup : state.purchase_request_items_ff_popup.responseList,
  pri_ffpopup_details : state.purchase_request_items_ff_popup,

  gl_code : state.gl_code.responseList,
  gl_loading: state.gl_code.loading,
  free_form : state.free_form.responseList,
  po_details : state.po_details.responseList,
  po_loading : state.po_details.loading,
  VendorDetail : (state.vendor_details_method.responseList && state.vendor_details_method.responseList.VendorDetail) ? state.vendor_details_method.responseList.VendorDetail : [],
  fill_tax : state.fill_tax.responseList,
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
  GetPoPendingOrder : (values) => dispatch(GetPoList(values)),
  GetApppoDetails : (values) => dispatch(GetApppoDetails(values)),
  GetVendorDetailMethod : (values) => dispatch(GetVendorDetailMethod(values)),
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  ResetFreeFrom  : () => dispatch(reset('free_form')),
  GetFreeFormDetails : () => dispatch(GetFreeFormDetails()),
  GetFillTax : (values) => dispatch(GetFillTax(values)),
})



const PurchaseDetails = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseDetails;