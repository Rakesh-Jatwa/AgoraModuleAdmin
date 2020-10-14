import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm, change } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import { HandleDocType, HandlePayment} from '../../../../Actions/Common/Functions'
import Loader from '../../../../Component/Loader'
import {FromateDate, FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import NewInvoiceFilter from '../Filters/NewInvoiceFilter'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'

class PurchaseOrder extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            paymentUIDueDate : '',
            paymentDueDate : '',
            start_data:'',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            vendorName : '',
            initial_object:{
                invoiceDto:{ 
                    "docNumber":"",
                    "doctype":"",
                    "paymentMode":"",
                    "companyResident":"",
                    "amountFrom":"",
                    "currency":"",
                    "paymentDueDate":"",
                    "fundType":"",
                    "amountTo":"",
                    "IPPstatus":"13,12",
                    "status":"2,3,5",
                    "paymentUIDueDate":null,
                    "folder":"S"
                }
                
            }
        }
    }

    componentDidMount(){
        let _user_details = UserDetails()
        this.props.reset('VerifiedInvoice')
        if(_user_details.UM_COY_ID=='pamb' || _user_details.UM_COY_ID=='PAMB'){
            this.props.dispatch(change('invoice_filter_form','invoiceDto.fundType','ITNP'))
            this.setState({
                initial_object:{
                    invoiceDto:{ 
                        "docNumber":"",
                        "doctype":"",
                        "paymentMode":"",
                        "companyResident":"",
                        "amountFrom":"",
                        "currency":"",
                        "paymentDueDate":"",
                        "fundType":"ITNP",
                        "amountTo":"",
                        "IPPstatus":"13,12",
                        "status":"2,3,5",
                        "paymentUIDueDate":null,
                        "folder":"S"
                    }
                    
                }
            })
        }
     
        if(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER')){
            this.handlefiltersubmit()
            this.setState({
                initial_object:{
                    invoiceDto:{ 
                        "docNumber":"",
                        "doctype":"",
                        "paymentMode":"",
                        "companyResident":"",
                        "amountFrom":"",
                        "currency":"",
                        "paymentDueDate":"",
                        "fundType":"",
                        "amountTo":"",
                        "IPPstatus":"13,12",
                        "status":"2,3,5",
                        "paymentUIDueDate":null,
                        "folder":"S"
                    }
                    
                }
            })
        }
    }

   


    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        let _details = details;
        _details.invoiceNo =  _details.IM_INVOICE_NO
        _details.vendorId =  _details.CDM_S_COY_ID
        _details.FromPage = "vi"
        this.props.history.push({
            pathname : '/verify_p2p_invoice',
            datas : _details,
            redirect_to_tab : 'VerifiedInvoice',
            redirect_to_page : 'RequesterInvoiceManagement',
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
                end_data:(date) ? date : ''
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : ''
            })
       }
       else if(name=="payment_date"){
        this.setState({
            paymentUIDueDate :(date) ? date : '', 
            paymentDueDate : (date) ? date : ''
        })
   }
    }

    handlefiltersubmit = (details) =>{
        let _user_details = UserDetails()
        let initial_object = this.state.initial_object.invoiceDto;
        let invoiceDto = (details && details.invoiceDto) ? details.invoiceDto : {}
        let _final_object = Object.assign({}, initial_object, invoiceDto)
        if(_user_details.ROLE_NAME.includes('MANAGER') || _user_details.ROLE_NAME.includes('manager') || _user_details.ROLE_NAME.includes('Manager') ){
            _final_object.IPPstatus = "13";
            _final_object.status = "3";
            _final_object.folder = "N";
            _final_object.invfrom = "InvApproved";
        }
        if(_user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('OFFICER') || _user_details.ROLE_NAME.includes('Officer') ){
            _final_object.invfrom = "sent";
        }
        if(_final_object){
            
            _final_object.paymentUIDueDate = (this.state.paymentUIDueDate) ? this.state.paymentUIDueDate : null;
            _final_object.paymentDueDate =  this.state.paymentDueDate ? FromateDate_YY_MM_DD(this.state.paymentDueDate) : '';
            this.props.get_search_list({invoiceDto:_final_object})

        }
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
    }

    handlefromsubmit(values){
      
        let _form_value = values;
        if(_form_value.PoListing && _form_value.PoListing.StartDate){
            delete  _form_value.ApproveDto.StartDate
        }
        if(_form_value.ApproveDto && _form_value.ApproveDto.EndDate){
            delete  _form_value.ApproveDto.EndDate
        }
     
        let _initial_obj = {
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            PoStatus:'',
            Fulfilment:'',
            PoStatus: ["1,2", "3", "4,5", "6,3"],
            Fulfilment : this.state.Fulfilment,
            folder : "S"
        }
      
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.PoListing.PoStatus =  ["1,2", "3", "4,5", "6,3"]
        _form_value.PoListing.folder ="S"
        _form_value.PoListing = RemoveSpecialCharacter(_form_value.PoListing)
        this.props.get_search_list(_form_value)
    }

    ClearAll = () =>{
        
        this.setState({
            fundType : '',
            start_data :'',
            paymentUIDueDate : '',
            paymentDueDate :'',
        })
        this.props.reset('VerifiedInvoice')
    }

    render(){
        
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Document No", id:"IM_INVOICE_NO", width:'200px', key:true,formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.IM_INVOICE_NO + ((row.invoiceType) ? ' ('+row.invoiceType+')' : '')} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Document Type", id:"INVOICE", width:'100px',formatter: (cellContent, row) => {
                return HandleDocType(row.IM_INVOICE_TYPE)
            }},
            {name : "Due Date", id:"IM_PAYMENT_DATE", width:'100px',dataFormat:"inv_date"},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'144px'},
            {name : "Base Amount (MYR)", id:"INVAMT_INMYR", width:'100px',dataFormat:"number"},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'90px'},
            {name : "Amount", id:"IM_INVOICE_TOTAL", width:'90px',dataFormat:"number"},
            {name : "Purchaser/Teller", id:"POM_BUYER_NAME", width:'144px'},
            {name : "Approval Remarks", id:"REMARKS", width:'144px',dataFormat:"inv_mass_all"},
            {name : "Company Resident", id:"IM_RESIDENT_TYPE", width:'100px'},
            {name : "Payment Mode", id:"POM_PAYMENT_METHOD", width:'144px',formatter: (cellContent, row) => {
                return HandlePayment(row.POM_PAYMENT_METHOD)
            }},
            {name : "Fund Type", id:"ID_ANALYSIS_CODE1", width:'100px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant new Invoice. Click the Document No. to view the Invoice Details." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <NewInvoiceFilter invoice_fund_type = {this.props.invoice_fund_type} handle_options={this.handleSelect} handlefiltersubmit = {this.handlefiltersubmit} handledate = {this.handleDate} date = {this.state.paymentDueDate} clear ={this.ClearAll}/>
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.ReqInvoiceSearchResult) ? this.props.search_result.ReqInvoiceSearchResult : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                           
                        />

                    </div>
                </div>
               
        </Fragment>
    }
}

export default reduxForm({
    form:'VerifiedInvoice',
})(PurchaseOrder);
