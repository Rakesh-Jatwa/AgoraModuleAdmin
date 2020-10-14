import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm, change } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import { HandleDocType, HandlePayment, ConvertInvoiceMassApproval} from '../../../../Actions/Common/Functions'
import Loader from '../../../../Component/Loader'
import {FromateDate, FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import NewInvoiceFilter from '../Filters/NewInvoiceFilter'
import {MassVerifyInvoice, InvoiceTrackingSave} from '../../../../Apis/Approver'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'

let _updatedetails ='';
class PurchaseRequest extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleSelect = this.handleSelect.bind(this)
        this.getProducts = this.getProducts.bind(this);
        this.getProductsall = this.getProductsall.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.handleTableInputs = this.handleTableInputs.bind(this)
        this.UnselectAll = this.UnselectAll.bind(this)
        this.TableDetails = this.TableDetails.bind(this)
        this.table = React.createRef();
        this.state = {
            products:[],
            table_body:[],
            selected_products : [],
            start_data:'',
            end_data:'',
            modal_title:'',
            loading:false,
            modal_body:'',
            paymentUIDueDate : '',
            paymentDueDate : '',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            vendor_details:'',
            input_remarks : [],
            open:false,
            modal:false,
            modal_title:'',
            modal_body:'',
            total_amount : 0,
            show_status : false,
            render : false,
            cl_render : false,
            initial_object:{
                invoiceDto:{
                    docNumber: "",
                    documenType: "",
                    paymentMode: "",
                    companyResident: "",
                    amountFrom: "",
                    vendorName: "",
                    currency: "",
                    paymentDueDate: "",
                    fundType: "",
                    amountTo: "",
                    IPPstatus: "11,12,19",
                    status: "1"
                }
            }
        }
    }

    componentDidMount(){
        let _user_details = UserDetails()
        if(_user_details && _user_details.ROLE_NAME){
            let _role = (_user_details.ROLE_NAME).trim()
            if(_role.includes('MANAGER') || _role.includes('Manager') ||  _role.includes('Approv') ||  _role.includes('APPROV')){
                this.setState({
                    show_status: true,
                })
            }
        }
        var _details = this.props.location.datas
      
        this.setState({
            products: _details,
        })
        this.props.dispatch(change('invoice_filter_form','invoiceDto.fundType','ITNP'))
        this.props.dispatch(change('invoice_filter_form','invoiceDto.doctype','INV'))
        this.props.GetInvoiceFundTypeList()
        this.handlefiltersubmit()
    }


    componentDidUpdate(){
        if(!this.state.cl_render && this.props.search_result && this.props.search_result.ReqInvoiceSearchResult){
            let _details = Object.assign([], this.props.search_result.ReqInvoiceSearchResult)
            if(_details && _details.length){
                let _temp_details = [];
                _details.forEach((list_details,index)=>{
                    _temp_details[index] = {
                        key : list_details.IM_INVOICE_INDEX,
                        value : list_details.REMARKS,
                    }
                })
                if(_temp_details && _temp_details.length){
                    this.setState({
                        input_remarks : _temp_details,
                        cl_render : true
                    })
                }
            }
        }
    }
 

    closemodel = () => {
        this.setState({
            model : false
        })
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
    }
   
    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
                end_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
       else if(name=="payment_date"){
            this.setState({
                paymentUIDueDate :(date) ? date : '', 
                paymentDueDate : (date) ? date : '',
            })
       }
    }

    UnselectAll = () =>{
        this.setState({
          products : []
        })
     }

    get_details(details){
        if(details && details.CDM_PO_NO){
            let _details = details;
            _details.invoiceNo =  _details.IM_INVOICE_NO
            _details.vendorId =  _details.CDM_S_COY_ID
            _details.FromPage =  'NV'
            _details.displayheader =  false
            this.props.history.push({
                pathname : '/view_p2p_invoice',
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
                pathname : '/view_invoice',
                datas : _details,
                redirect_to_tab : 'PurchaseOrder',
                redirect_to_page : 'RequesterInvoiceManagement',
            })
        }
       
    }

    handleTableInputs(details, names, new_details){
       let _details = details.target.getAttribute('data-name')
       if(_details ){
            let _temp_details  = this.state.input_remarks
            _temp_details[_details] = {
                key : details.target.getAttribute('data-invoiceno'),
                value : details.target.value
            }

            console.log('_temp_details', _temp_details)
            this.setState({
                input_remarks : _temp_details
            })
        }
       
    }

    handlefiltersubmit = (details) => {
        let initial_object = this.state.initial_object.invoiceDto;
        let invoiceDto = (details && details.invoiceDto) ? details.invoiceDto : {}
        let _final_object = Object.assign({}, initial_object, invoiceDto)
        if(_final_object){
            _final_object.paymentUIDueDate = this.state.paymentUIDueDate;
            _final_object.paymentDueDate =  this.state.paymentDueDate ? FromateDate_YY_MM_DD(this.state.paymentDueDate) : '';
            _final_object = RemoveSpecialCharacter(_final_object)
            this.props.get_search_list({invoiceDto:_final_object})
        }
      
    }

    getProducts (values, details){
        let _all_products = this.state.selected_products;
        if(details && values.hasOwnProperty('IM_INVOICE_INDEX')){
            let total = 0
            let _temp_details = ConvertInvoiceMassApproval(values);
            _all_products.push(_temp_details)
            if(_all_products.length){
                _all_products.forEach((list_details)=>{
                    total += list_details.total_amount
                })
            }
            else{
                total = 0;
            }
            this.setState({
                selected_products : _all_products,
                total_amount : isNaN(total) ? 0 :  parseFloat(total).toFixed(2)
            })
        }
        else{
            let total = 0
            let _products = this.state.selected_products.filter((fieldValue, index) =>  fieldValue.invoiceIndex != values.IM_INVOICE_INDEX);
            console.log('_products', _products)
            if(_products.length){
                _products.forEach((list_details)=>{
                    total += list_details.total_amount
                })
            }
            else{
                total = 0;
            }
            this.setState({
                selected_products : _products,
                total_amount : isNaN(total) ? 0 :  parseFloat(total).toFixed(2)
            })
        }
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.selected_products;
        if(_products.length){
            let total = 0
            if(details){
                for(let i=0;i<_products.length;i++){
                    let _temp_details = ConvertInvoiceMassApproval(_products[i]);
                    _all_products.push(_temp_details)
                    if (i != _products.length) {
                        total += _temp_details.total_amount
                        await this.setState({selected_products : _all_products})
                    }
                }
                this.setState({
                     total_amount : isNaN(total) ? 0 : parseFloat(total).toFixed(2)
                })
            }
            else{
                let total = 0
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                    _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.invoiceIndex != _products[i].IM_INVOICE_INDEX);
                    console.log('_temp_query', _temp_query)
                    if (i != _products.length) {
                            total += _temp_query.total_amount
                            this.setState({selected_products : _temp_query})
                    }
                }
                this.setState({
                    total_amount : isNaN(total) ? 0 :  parseFloat(total).toFixed(2)
                })
            }
        }

    }

    closeModel (details){
        this.setState({
            modal : false,
            invoiceIndex : ''
        })

        if(this.state.status){
            this.props.get_search_list(this.state.initial_object)
        }
    }

    ApproveAll = async() => {
        let {selected_products, input_remarks} = this.state        
        if(selected_products.length){
            let _temp_details = selected_products.map((list_details, index)=>{
                let _invoice_details = input_remarks.filter((list_sub)=>list_sub.key == list_details.invoiceIndex)
                if(_invoice_details && _invoice_details.length>0 && _invoice_details[0].value){
                    let _sub_details = list_details
                    _sub_details.txtRemark = _invoice_details[0].value
                    return _sub_details
                }
                else if(list_details.txtRemark){
                    let _sub_details = list_details
                    _sub_details.txtRemark = list_details.txtRemark
                    return _sub_details
                }
                return false
            })
            
            _temp_details = _temp_details.filter((list_details,index)=>(list_details.invoiceIndex && list_details.invoiceIndex!=false && list_details.invoiceIndex!=null))
            if(_temp_details && _temp_details.length > 0 && _temp_details[0]){

                let _details = _temp_details
                this.setState({ loading : true })
                let _status =  await ApiExtract(MassVerifyInvoice, _details)
                if(_status){
                    this.setState({
                        title : '',
                        modal_body : _status.message,
                        status : _status.status,
                        modal  :  true ,
                        submit_type : 'mass',
                        loading : false,
                        products:[],
                    })
                }
            }
            else{
                this.setState({
                    modal:true,
                    modal_body:'Enter Remark for your selected Invoice Number',
                    status : false
                })
            }
           
        }
        else{
            this.setState({
                modal:true,
                modal_body:'Select Atleast One Product to Approve',
                status : false
            })
        }
    }

    ResetAll = () =>{
        if(this.props.search_result && this.props.search_result.ReqInvoiceSearchResult){
            let _details = Object.assign([], this.props.search_result.ReqInvoiceSearchResult)
            if(_details && _details.length){
                let _temp_details = [];
                _details.forEach((list_details,index)=>{
                    _temp_details[index] = {
                        key : list_details.IM_INVOICE_INDEX,
                        value : (list_details.REMARKS!=null) ? list_details.REMARKS : '',
                    }
                })
                if(_temp_details && _temp_details.length){
                    this.setState({
                        input_remarks : _temp_details,
                    })
                }
            }
        }
    }

    TableDetails = (instance) => {
        this._updatedetails = instance;
        console.log('instance', instance, this._updatedetails)
    }

    ClearAll = () =>{
        this.setState({
            fundType : '',
            paymentDueDate : ''
        })
    }

    viewInvoicePDF = () => {
        let {selected_products} = this.state
        if(selected_products && selected_products.length==1){
            let _user_details = UserDetails()
            selected_products  = selected_products[0]
            console.log('selected_products', selected_products)
            let inputData = { 'IM_INVOICE_NO': selected_products.lblInvNo, 'POM_B_COY_ID': _user_details.UM_COY_ID, 'POM_S_COY_ID': selected_products.vendorId }
            this.props.GetInvoicePDF(inputData)
        }  
        else{
            this.setState({
                modal:true,
                modal_body:'Only one selection allowed',
                status : false
            })
        }    
        
    }


    SaveAll = async() =>{
        let {selected_products, input_remarks} = this.state        
        if(selected_products.length){
            let _temp_details = selected_products.map((list_details, index)=>{
                let _invoice_details = input_remarks.filter((list_sub)=>list_sub.key == list_details.invoiceIndex)
                if(_invoice_details && _invoice_details.length>0 && _invoice_details[0].value){
                    let _sub_details = list_details
                    _sub_details.strAORemark = _invoice_details[0].value
                    _sub_details.intInvoiceIndex = _sub_details.invoiceIndex
                    return _sub_details
                }
                else if(list_details.txtRemark){
                    let _sub_details = list_details
                    _sub_details.intInvoiceIndex  = list_details.invoiceIndex
                    _sub_details.strAORemark = list_details.txtRemark
                    return _sub_details
                }
                else{
                    let _sub_details = list_details
                    _sub_details.intInvoiceIndex  = list_details.invoiceIndex
                    _sub_details.strAORemark = ''
                    return _sub_details
                }
                return false
            })
        
           let _details = _temp_details
           if(_temp_details && _temp_details.length > 0 && _temp_details[0]){
                this.setState({ loading : true })
                let _status = await ApiExtract(InvoiceTrackingSave, {invoiceData : _details})
                if(_status){
                    localStorage.removeItem('set_inv')
                    this.setState({
                        status: _status.status,
                        modal:true,
                        modal_body: _status.message,
                        loading:false,
                        type:'verify'
                    })
                }
            }
            else{
                this.setState({
                    modal:true,
                    modal_body:'Please make at least one selection!',
                    status : false
                })
            }
        }
        else{
            this.setState({
                modal:true,
                modal_body:'Please make at least one selection!',
                status : false
            })
        }
    }

    render(){
        const { handleSubmit } = this.props
        let {table_body} = this.state
      
        const _table_header = [
            {name : "Document No", id:"IM_INVOICE_NO", width:'200px', key:true,formatter: (cellContent, row) => {
                return (
                    (row && row.CDM_PO_NO) ? 
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.IM_INVOICE_NO + ((row.invoiceType) ? ' ('+row.invoiceType+')' : '')} {row.HAS_ATTACHEMENT==1 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button> :  
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.IM_INVOICE_NO} {row.HAS_ATTACHEMENT==1 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
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
            {name : "Approval Remarks", id:"REMARKS", width:'144px',dataFormat:"inv_mass_textarea"},
            {name : "Company Resident", id:"IM_RESIDENT_TYPE", width:'100px'},
            {name : "Payment Mode", id:"POM_PAYMENT_METHOD", width:'144px',formatter: (cellContent, row) => {
                return HandlePayment(row.POM_PAYMENT_METHOD)
            }},
            {name : "Fund Type", id:"ID_ANALYSIS_CODE1", width:'100px'},
        
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.gipdf_loader) ? <Loader /> : '' }
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant new Invoice. Click the Document No. to view the Invoice Details." 
            />
             <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
             <NewInvoiceFilter invoice_fund_type = {this.props.invoice_fund_type}  handle_options={this.handleSelect}  handlefiltersubmit = {this.handlefiltersubmit} handledate = {this.handleDate} date = {this.state.paymentDueDate} clear ={this.ClearAll}/>
             <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.ReqInvoiceSearchResult) ? this.props.search_result.ReqInvoiceSearchResult : []} 
                            products={this.getProducts} 
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            ref={this.TableDetails}
                            change={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                            selectall={this.getProductsall}
                            input_remarks = {this.state.input_remarks}
                            getInputs={this.handleTableInputs}
                           
                           
                        />

                    </div>
                </div>
                {(this.state.show_status) ?
                <div className="mt-2 row">
                        <div className="col-lg-1 col-md-1"><label className="form-label">Total <sapn className="text-danger">*</sapn> : </label></div>
                        <div className="col-lg-5 col-md-3"><input rows="1" className="form-control" value={this.state.total_amount}  disabled/></div>
                        <div className="col-lg-5 col-md-8"><label className="form-label"></label></div>
                </div>
                : ''}
                <div className="row mt-2">
                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.SaveAll()}>Save</button> </div>
                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.ApproveAll()}>Mass {(this.state.show_status) ? 'Approve' : 'Verify'}</button> </div>
                    <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm" onClick={()=>this.ResetAll()}>Reset</button></div>
                    {(this.state.show_status) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-warning btn-sm" onClick={()=>this.viewInvoicePDF()}>View Invoice</button></div> : ''}
                </div>
                <Alert 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.modal} 
                    confirm={this.closeModel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'NewInvoice',
})(PurchaseRequest);
