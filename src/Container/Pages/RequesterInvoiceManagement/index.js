import React, {Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {connect} from 'react-redux';
import {reset, change} from 'redux-form';
import NewInvoice from './NewInvoice' 
import PaidInvoice from './PaidInvoice' 
import VerifiedInvoice from './VerifiedInvoice' 
import Pending from './Pending' 
import {UserDetails} from '../../../Common/LocalStorage'
import {GetRequesterInvoiceSearch,GetRequesterVerifiedInvoiceSearch, GetViewInvoiceDetailsClick, GetRequesterInvoicePaid, GetInvoicePDF, GetInvoiceFundTypeList, GetPendingFYFA} from '../../../Actions/Requester'

let _user_details = UserDetails()
class Purchase extends Component {
    state = {
      active_key : 'PurchaseOrder',
    }

    //PurchaseOrder
    componentDidMount(){
      if(this.props.location && this.props.location.redirect_to_tab){
        this.setState({
          active_key : this.props.location.redirect_to_tab
        })
      }
    }
    
  
    
    render(){
        return <div id="tabs">
        <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
            this.setState({active_key:k})   
            if(k=="PurchaseOrder"){
              if(_user_details.UM_COY_ID=='pamb' || _user_details.UM_COY_ID=='PAMB'){
                this.props.change('invoice_filter_form','invoiceDto.fundType','ITNP')
              }
              this.props.reset('invoice_filter_form')
              
              this.props.change('invoice_filter_form','invoiceDto.doctype','INV')
            }
            else if(k=="VerifiedInvoice"){
              this.props.reset('invoice_filter_form')
              if(_user_details.UM_COY_ID=='pamb' || _user_details.UM_COY_ID=='PAMB'){
                this.props.change('invoice_filter_form','invoiceDto.fundType','ITNP')
              }
              this.props.change('invoice_filter_form','invoiceDto.doctype','INV')
            }
            else if(k=="PaidInvoice"){
              this.props.reset('invoice_filter_form')
              if(_user_details.UM_COY_ID=='pamb' || _user_details.UM_COY_ID=='PAMB'){
                this.props.change('invoice_filter_form','invoiceDto.fundType','ITNP')
              }
              this.props.change('invoice_filter_form','invoiceDto.doctype','INV')
            }
            else if(k=="PendingFYFA"){
              this.props.reset('invoice_filter_form')
              if(_user_details.UM_COY_ID=='pamb' || _user_details.UM_COY_ID=='PAMB'){
                this.props.change('invoice_filter_form','invoiceDto.fundType','ITNP')
              }
              this.props.change('invoice_filter_form','invoiceDto.doctype','INV')
            }
            
        }}>
         <Tab eventKey="PurchaseOrder" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER')) ? "Verified Invoice" : "New Invoice"}>
          <div className="tab-content py-3 px-3 px-sm-0">
          
             <NewInvoice
                reset_form = {this.props.ResetApprovalFrom}
                get_search_list = {this.props.GetRequesterInvoiceSearch}
                search_result = {this.props.invoice_list}
                loading = {this.props.pr_loading}
                history = {this.props.history}
                location = {this.props.location}
                GetInvoicePDF = {this.props.GetInvoicePDF}
                gipdf_loader = {this.props.gipdf_loader}
                invoice_fund_type = {this.props.invoice_fund_type}
                GetInvoiceFundTypeList = {this.props.GetInvoiceFundTypeList}
             />
          </div>
        </Tab>
      <Tab eventKey="VerifiedInvoice" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER') ) ? "Approved Invoice" : "Verified Invoice"}>
        <div className="tab-content py-3 px-3 px-sm-0">
            <VerifiedInvoice 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetRequesterVerifiedInvoiceSearch}
                search_result = {this.props.verified_invoice}
                loading = {this.props.vi_loading}
                history = {this.props.history}
                location = {this.props.location}
                gipdf_loader = {this.props.gipdf_loader}
                invoice_fund_type = {this.props.invoice_fund_type}
                GetInvoiceFundTypeList = {this.props.GetInvoiceFundTypeList}
            />
        </div>
      </Tab>
      {(_user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') || _user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') ) ? '' : <Tab eventKey="PaidInvoice" title="Paid Invoice">
     <div className="tab-content py-3 px-3 px-sm-0">
            <PaidInvoice 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetRequesterInvoicePaid}
                search_result = {this.props.paid_list}
                loading = {this.props.pa_loading}
                history = {this.props.history}
                location = {this.props.location}
                gipdf_loader = {this.props.gipdf_loader}
                invoice_fund_type = {this.props.invoice_fund_type}
                GetInvoiceFundTypeList = {this.props.GetInvoiceFundTypeList}
            />
              </div>
      </Tab>}
      {(_user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('officer') || _user_details.ROLE_NAME.includes('OFFICER') || _user_details.ROLE_NAME.includes('Verifier') || _user_details.ROLE_NAME.includes('VERIFIER')) ? 
      <Tab eventKey="PendingFYFA" title="Pending FYFA">
             <div className="tab-content py-3 px-3 px-sm-0">
            <Pending 
                reset_form = {this.props.ResetRejectFrom}
                get_search_list = {this.props.GetPendingFYFA}
                search_result = {this.props.pending_fyfa}
                loading = {this.props.fyfa_loading}
                history = {this.props.history}
                location = {this.props.location}
                gipdf_loader = {this.props.gipdf_loader}
                invoice_fund_type = {this.props.invoice_fund_type}
                GetInvoiceFundTypeList = {this.props.GetInvoiceFundTypeList}
            />
            </div>
      </Tab> :'' }
    </Tabs></div>
    }
}



const mapStateToProps = state => ({
  invoice_list : state.requester_invoice_search.responseList,
  verified_invoice  : state.verified_invoice.responseList,
  vi_loading  : state.verified_invoice.loading,
  verified_list : state.requester_invoice_search.verified_list,
  pending_fyfa : state.pending_fyfa.responseList,
  fyfa_loading : state.pending_fyfa.loading,
  paid_list : state.requester_paid_invoice_search.responseList,
  pr_loading : state.requester_invoice_search.loading,
  pa_loading : state.requester_paid_invoice_search.loading,
  gipdf_loader : state.generate_ipdf.loading,
  inf_loading : state.invoice_fund_type.loading,
  invoice_fund_type : state.invoice_fund_type.responseList,
})

const mapDispatchToProps = dispatch => ({
  reset : (values) => dispatch(reset(values)),
  change : (form,field, value) => dispatch(change(form,field, value)),
  GetViewInvoiceDetailsClick : (values) => dispatch(GetViewInvoiceDetailsClick(values)),
  GetRequesterInvoiceSearch : (values) => dispatch(GetRequesterInvoiceSearch(values)),
  GetRequesterVerifiedInvoiceSearch : (values) => dispatch(GetRequesterVerifiedInvoiceSearch(values)),
  GetPendingFYFA : (values) => dispatch(GetPendingFYFA(values)),
  GetRequesterInvoicePaid : (values) => dispatch(GetRequesterInvoicePaid(values)),
  GetInvoiceFundTypeList : () => dispatch(GetInvoiceFundTypeList()),
  GetInvoicePDF : (values) => dispatch(GetInvoicePDF(values)),
  
  
})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(Purchase);
export default PurchaseHolder;