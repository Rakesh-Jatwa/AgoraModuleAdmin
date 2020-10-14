import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {UploadDocuments,FundTypeOrPersonCodeORProjectCodeAction, FillAddressAction, DeliveryAddressAction, CostCentreCodeAction, SegmentationAction,GetSearchPRList, 
  GetSearchPRCancelList, GetPurchaseRequestItemsDetails, GetFillAddress, GetDeleteFile, GetPurchaseRequestItemsDetailsPopUp, GetFFRaisePOScreen, GetPurchaseRequestItemsDetailsNcPopUp, GetPurchaseRequestItemsDetailsFFPopUp, GetFreeFormDetails} from '../../../Actions/Requester'
import {GetViewSinglePr} from '../../../Actions/Approver'
import { GetDownloadFile} from '../../../Actions/Vendor'
import Request from './Request' 
import Listing from './Listing' 
import Cancellation from './Cancellation' 

class Purchase extends Component {
  state = {
    active_key : 'home',
  }

    componentDidMount(){
      if(this.props.location && this.props.location.redirect_to_tab){
        this.setState({
          active_key : this.props.location.redirect_to_tab
        })
      }
    }

    render (){
     
        return <div id="tabs">
          <Tabs defaultActiveKey="home" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
                if(k=='home'){
                  window.location.reload()
                }
                this.setState({active_key:k})
                localStorage.removeItem('pr_details')
                
          }}>
           <Tab eventKey="home" title="Purchase Request">
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
                  free_form_details  = {this.props.GetFreeFormDetails}
                  free_form = {this.props.free_form}
              />
          </div>
        </Tab>
        <Tab eventKey="profile" title="Purchase Request Listing">
          <div className="tab-content py-3 px-3 px-sm-0">
              <Listing 
                get_search_prlist ={this.props.GetSearchPRList} 
                search_product_list = {this.props.search_product_list}
                sp_loading = {this.props.sp_loading}
                history ={this.props.history}
                get_pr_details = {this.props.GetViewSinglePr}
              />
          </div>
        </Tab>
        <Tab eventKey="contact" title="Purchase Request Cancellation">
          <div className="tab-content py-3 px-3 px-sm-0">
            <Cancellation 
                get_search_prlist ={this.props.GetSearchPRCancelList} 
                search_product_list = {this.props.search_product_cancel_list}
                sp_loading = {this.props.spl_loading}
                get_void_pr = {this.props.GetVoidPR}
                pr_status = {this.props.pr_status}
                history ={this.props.history}
                get_pr_details = {this.props.GetViewSinglePr}
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
  request_form : state.form.po_request_main,
  fund_type_project_code : state.fund_type_project_code.responseList,
  fund_type_project_code_l8 : state.fund_type_project_code.responseListL8,
  fund_type_project_code_l9 : state.fund_type_project_code.responseListL9,
  address : state.address.responseList,
  delivery_address : state.delivery_address.responseList,
  cost_centre_code : state.cost_centre_code.responseList,
  segmentation : state.segmentation.responseList,
  search_product_list : state.search_product_list.responseList,
  sp_loading : state.search_product_list.loading,
  search_product_cancel_list : state.search_product_cancel_list.responseList,
  spl_loading : state.search_product_cancel_list.loading,
  pr_status : state.purchase_request_status.responseList,
  get_fill_address: state.get_fill_address.responseList,
  dr_loading : state.file_download.loading,
  pri_popup_details : state.purchase_request_items_popup,
  pri_popup : state.purchase_request_items_popup.responseList,
  free_form : state.free_form.responseList,
  nc_popup : state.purchase_request_items_nc_popup.responseList,
  pri_ncpopup_details : state.purchase_request_items_nc_popup,

  ff_popup : state.purchase_request_items_ff_popup.responseList,
  pri_ffpopup_details : state.purchase_request_items_ff_popup,

  gl_code : state.gl_code.responseList,
  gl_loading: state.gl_code.loading,
})

const mapDispatchToProps = dispatch => ({
  UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
  FundTypeOrPersonCodeORProjectCodeAction  : (datas) => dispatch(FundTypeOrPersonCodeORProjectCodeAction(datas)),
  FillAddressAction  : () => dispatch(FillAddressAction()),
  DeliveryAddressAction  : () => dispatch(DeliveryAddressAction()),
  CostCentreCodeAction  : () => dispatch(CostCentreCodeAction()),
  SegmentationAction  : () => dispatch(SegmentationAction()),
  GetSearchPRList  : (values) => dispatch(GetSearchPRList(values)),
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
  GetFreeFormDetails : () => dispatch(GetFreeFormDetails()),
})


const PurchaseDetails = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseDetails;