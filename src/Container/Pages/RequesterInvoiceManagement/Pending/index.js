import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm, change } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate} from '../../../../Component/Dates'
import NewInvoiceFilter from '../Filters/NewInvoiceFilter'
import {FromInputsParallel, FromSelectParallel, FormDatePickerParallel} from '../../../../Component/From/FromInputs'
import {RemoveSpecialCharacter, HandleDocType, HandlePayment} from '../../../../Actions/Common/Functions'
class PurchaseOrder extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:'',
            paymentUIDueDate :'',
            paymentDueDate : '',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            checked_initial : [0,1,2],
            checked_details:[],
            initial_object:{
                "docno":"",
                "doctype":"",
                "strVen":""
            }
        }
    }


    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        let _details = details.datas;
        _details.invoiceNo =  _details.IM_INVOICE_NO
        _details.vendorId =  _details.CDM_S_COY_ID
        this.props.history.push({
            pathname : '/RequesterVerificationInvoice',
            datas : _details,
        })
    }

    componentDidMount(){
        this.props.dispatch(change('invoice_filter_form','invoiceDto.fundType','ITNP'))
        this.props.dispatch(change('invoice_filter_form','invoiceDto.doctype','INV'))
        this.props.GetInvoiceFundTypeList()
        
    }

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
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
        }
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.PoListing.PoStatus =  ["1,2", "3", "4,5", "6,3"]
        this.props.get_search_list(_form_value)
    }

    handlefiltersubmit = (details) => {
        let initial_object = this.state.initial_object;
        let invoiceDto = details.invoiceDto
        let _final_object = Object.assign({}, initial_object, invoiceDto)
        if(_final_object){
            _final_object = RemoveSpecialCharacter(_final_object)
            this.props.get_search_list(_final_object)
        }
      
    }

    ClearAll = () =>{
        this.props.reset('PaidInvoice')
    }

    get_details(details){
        if(details && details.CDM_PO_NO){
            let _details = details;
            _details.invoiceNo =  _details.IM_INVOICE_NO
            _details.vendorId =  _details.CDM_S_COY_ID
            _details.FromPage =  'NV'
            _details.displayheader =  false
            this.props.history.push({
                pathname : '/RequesterVerificationInvoice',
                datas : _details,
                redirect_to_tab : 'PurchaseOrder',
                redirect_to_page : 'RequesterInvoiceManagement',
            })
        }
        else{
            let _details = details;
            _details.invoiceNo =  _details.IM_INVOICE_NO
            _details.vendorId =  _details.CDM_S_COY_ID
            _details.frm = "IPPAO"
            this.props.history.push({
                pathname : '/view_invoice_fyfa',
                datas : _details,
                redirect_to_tab : 'PurchaseOrder',
                redirect_to_page : 'RequesterInvoiceManagement',
            })
        }
       
    }


    render(){
        
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Document No", id:"IM_INVOICE_NO", width:'200px', key:true, key:true,formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.IM_INVOICE_NO + ((row.invoiceType) ? ' ('+row.invoiceType+')' : '')} {row.HAS_ATTACHEMENT==1 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Document Type", id:"INVOICE", width:'100px',formatter: (cellContent, row) => {
                return HandleDocType(row.IM_INVOICE_TYPE)
            }},
            {name : "Document Date", id:"IM_PAYMENT_DATE", width:'100px',dataFormat:"date"},
            {name : "Vendor Name", id:"IM_S_COY_NAME", width:'144px'},
            {name : "Bank Code", id:"ic_bank_code", width:'100px',dataFormat:"number"},
            {name : "Bank Account", id:"ic_bank_acct", width:'100px'},
            {name : "Currency", id:"IM_CURRENCY_CODE", width:'90px'},
            {name : "Payment Amount", id:"IM_INVOICE_TOTAL", width:'90px',dataFormat:"price"},
            {name : "Payment Method", id:"IM_PAYMENT_TERM", width:'90px' ,formatter: (cellContent, row) => {
                return HandlePayment(row.IM_PAYMENT_TERM)
            }},
            {name : "Payment Date", id:"IM_DOC_DATE", width:'90px',dataFormat:"date"},
            {name : "Payment Advice No.", id:"POM_BUYER_NAME", width:'144px'},
            {name : "Status", id:"STATUS_DESC", width:'144px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant E2P document." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <form onSubmit={handleSubmit(this.handlefiltersubmit.bind(this))}>  
                <div className="mt-2 row">
                    <Field type="text" name="invoiceDto.docno" component={FromInputsParallel} className="form-control" placeholder="Document No. " label="Document No. :" />
                    <Field type="text" name="invoiceDto.strVen" component={FromInputsParallel} className="form-control" placeholder="Vendor Name" label="Vendor Name" />
                </div>
                <div className="mt-2 row">
                    <Field name="invoiceDto.doctype" className="form-control mb-3" component={FromSelectParallel} label={"Document Type :"}>
                    <option value="true" >--Select--</option>
                    <option value="BD">Bank Draft</option>
                    <option value="CH">Cashier's Order</option>
                    <option value="Cheque">Cheque</option>
                    <option value="LB">Local Bank Transfer</option>
                    <option value="TT">Telegraphic Transfer</option>
                    </Field>
                </div>
                <div className="mt-3 justify-content-end mr-5 row">
                    <div className="col-lg-auto col-md-auto"> <button type="submit" className="btn btn-outline-success btn-sm">Search</button></div>
                    <div className="col-lg-auto col-md-auto"><button type="button" className="btn btn-outline-danger btn-sm" onClick={this.ClearAll}>Clear</button></div>
                </div>  
            </form> 

                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                        
                            table_header={_table_header} 
                            table_body={this.props.search_result} 
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
    form:'PendigFyfa',
})(PurchaseOrder);
