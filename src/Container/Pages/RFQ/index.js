import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import RaiseRFQ from './RaiseRFQ' 
import RFQListing from './RFQListing' 
import OutstandingRFQ from './OutstandingRFQ' 
import Quotation from './Quotation' 
import {GetDeleteFile} from '../../../Actions/Vendor'
import {GetQuoteList, GetQuotationPDFGenerate, GetRFQListAllWithVendor, GetRFQPDFGenerate, GetOutstandingRfq, GetRaiseRFQPageLoadDetails, GetDownloadFile, GetRFQVendorListDetails} from '../../../Actions/Approver'
import {UploadDocuments,  GetCommodityTypeList, GetVendorNameListService, GetRfqAddItemSearch} from '../../../Actions/Requester'

class Purchase extends Component {
    state = {
      active_key : 'RaiseRFQ',
      rfq_num :'',
      rfq_id :'',
      rfq_name :'',
      status : '',
      rendred :true,
      rerender : true,
    }

  
    componentDidMount(){
      localStorage.removeItem('rfq_details')
      if(this.props.location && this.props.location.redirect_to_tab){
        this.setState({
          active_key : this.props.location.redirect_to_tab
        })
      }
    }

    componentDidUpdate(){
      if(this.props.location && this.props.location.datas && this.state.rerender){
        let {datas} = this.props.location
        console.log('componentDidUpdate', datas)
        this.setState({
            rfq_num :datas.RM_RFQ_No,
            rfq_id :datas.RM_RFQ_ID,
            rfq_name : datas.RM_RFQ_Name,
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
        rfq_num :  activtab.rfq_num,
        rfq_id :  activtab.rfq_id,
        rfq_name : activtab.rfq_name,
        status : activtab.status,
        rendred : false
      })
    }

    getVendorDetails = () =>{
      let _details = this.state;
      this.setState({rendred : true})
      return {
        rfq_num :  _details.rfq_num,
        rfq_id :  _details.rfq_id,
        rfq_name : _details.rfq_name,
        status : _details.status,
      }
    }

   
    componentWillUnmount(){
      localStorage.removeItem('rfq_from');
    }


    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="RaiseRFQ" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => this.setState({active_key:k})}>
         <Tab eventKey="RaiseRFQ" title="Raise RFQ">
          <div className="tab-content py-3 px-3 px-sm-0">
             <RaiseRFQ
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetRaiseRFQPageLoadDetails}
                search_result = {this.props.search_list_1}
                loading = {this.props.refq_loading}
                history={this.props.history}
                get_details = {this.getVendorDetails}
                rendred = {this.state.rendred}
                UploadDocuments = {this.props.UploadDocuments}
                upload_document  = {this.props.upload_document}
                fue_loading  = {this.props.fue_loading}
                download_documents = {this.props.GetDownloadFile}
                dr_loading = {this.props.dr_loading}
                post_delete_file = {this.props.GetDeleteFile}
                get_delete_file = {this.props.file_delete}
                df_loading = {this.props.fd_loading}
                post_vendor = {this.props.GetRFQVendorListDetails}
                get_vendor = {this.props.vendor_list}
                vendor_name_list_service ={this.props.vendor_name_list_service}
                commodity_list = {this.props.commodity_list}
                GetVendorNameListService = {this.props.GetVendorNameListService}
                GetCommodityTypeList = {this.props.GetCommodityTypeList}
                rfq_add_item_search_rl = {this.props.rfq_add_item_search_rl}
                GetRfqAddItemSearch =  {this.props.GetRfqAddItemSearch}
             />
          </div>
        </Tab>
        
      <Tab eventKey="OutstandingRFQ" title="Outstanding RFQ">
        <div className="tab-content py-3 px-3 px-sm-0">
            <OutstandingRFQ 
               reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetOutstandingRfq}
                search_result = {this.props.search_list_2}
                loading = {this.props.loading_2}
                history={this.props.history}
                change_tab = {this.setActivationKey}
                update_details = {this.setVendorDetails}
                vendor_name_list_service ={this.props.vendor_name_list_service}
            />
        </div>
      </Tab>
      <Tab eventKey="RFQListing" title="RFQ Listing">
        <div className="tab-content py-3 px-3 px-sm-0">
            <RFQListing 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetRFQListAllWithVendor}
                search_result = {this.props.search_list_3}
                loading = {this.props.loading_3}
                loading_pdf = {this.props.rfqpdf_loading}
                downlod_pdf = {this.props.GetRFQPDFGenerate}
                history={this.props.history}
                change_tab = {this.setActivationKey}
                update_details = {this.setVendorDetails}
                vendor_name_list_service ={this.props.vendor_name_list_service}
            />
        </div>
      </Tab>
      <Tab eventKey="Quotation" title="Quotation">
        <div className="tab-content py-3 px-3 px-sm-0">
            <Quotation 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetQuoteList}
                search_result = {this.props.search_list_4}
                loading = {this.props.loading_4}
                loading_pdf = {this.props.loading_pdf}
                downlod_pdf = {this.props.GetQuotationPDFGenerate}
                history={this.props.history}
                change_tab = {this.setActivationKey}
                update_details = {this.setVendorDetails}
                vendor_name_list_service ={this.props.vendor_name_list_service}
               
            />
        </div>
      </Tab>
      
     
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  search_list_1 : state.refq_page_load_details.responseList,
  refq_loading : state.refq_page_load_details.loading,
  upload_document : state.file_upload_external.responseList,
  fue_loading : state.file_upload_external.loading,
  dr_loading : state.file_download.loading,
  fd_loading : state.file_delete_external.loading,
  file_delete : state.file_delete_external.responseList,
  vendor_list : state.vendor_list.responseList,
  vl_loading : state.vendor_list.loading,
  commodity_list : state.commodity_type_list.responseList,
  vendor_name_list_service : state.vendor_name_list_service.responseList,
  
  search_list_2 : state.outstanding_rfq.responseList,
  loading_2 : state.outstanding_rfq.loading,

  search_list_3 : state.rfq_list_all_with_vendor.responseList,
  loading_3 : state.rfq_list_all_with_vendor.loading,
  rfqpdf_loading : state.rfqpdf_generate.loading,
  rfq_add_item_search  : state.rfqpdf_generate.loading,
  rfq_add_item_search_rl  : state.rfq_add_item_search.responseList,
  search_list_4 : state.quote_list.responseList,
  loading_4 : state.quote_list.loading,

  loading_pdf : state.quote_pdf.loading,
})

const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  GetQuoteList : (values) => dispatch(GetQuoteList(values)),
  UploadDocuments  : (file, values) => dispatch(UploadDocuments(file, values)),
  GetRFQPDFGenerate : (values) => dispatch(GetRFQPDFGenerate(values)),
  GetQuotationPDFGenerate : (values) => dispatch(GetQuotationPDFGenerate(values)),
  GetRFQListAllWithVendor : (values) => dispatch(GetRFQListAllWithVendor(values)),
  GetOutstandingRfq : (values) => dispatch(GetOutstandingRfq(values)),
  GetRaiseRFQPageLoadDetails : (values) => dispatch(GetRaiseRFQPageLoadDetails(values)),
  GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
  GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
  GetRfqAddItemSearch  : (values) => dispatch(GetRfqAddItemSearch(values)),
  GetRFQVendorListDetails  : () => dispatch(GetRFQVendorListDetails()),
  GetCommodityTypeList  : () => dispatch(GetCommodityTypeList()),
  GetVendorNameListService  : () => dispatch(GetVendorNameListService()),
})


const RFQ = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default RFQ;