import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import {FormDatePickerParallelSingle, FromSelectParallelSingle, FormRadioButtonSpan, FromInputsParallelSingle} from '../../../../../Component/From/FromInputs'
import {GetFinList, GetE2PApprovalDetails, GetE2PViewAudit} from '../../../../../Actions/Approver'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm, reset } from 'redux-form';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import {FromateDate, DateMinusTimeLoginYear, CompareDate} from '../../../../../Component/Dates'
import Alert from '../../../../../Component/Modal/alert'
import {GetDownloadFile} from '../../../../../Actions/Approver'
import {HandlePayment, ConvertMassApproval, HandleDocType} from '../../../../../Actions/Common/Functions'
import ViewAudit from '../../../../ViewAudit'
import {UploadDocuments} from '../../../../../Actions/Requester'
import {GetDeleteFile} from '../../../../../Actions/Vendor'
import {E2PApprovalSubmit} from '../../../../../Apis/Approver'
import {ApiExtract} from '../../../../../Common/GetDatas'
import VendorSelect from '../../../Form/VendorSelect'
import {RemoveSpecialCharacter} from '../../../../../Actions/Common/Functions'
import Details from '../Details'
class Request extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.getProductsall = this.getProductsall.bind(this)
        this.Checkall= this.Checkall.bind(this);
        this.state = {
            products:[],
            view_details : {},
            checked_products:[],
            start_data:'',
            end_data:'',
            psd_start_data:'',
            psd_end_data:'',
            Payment_start_data:'',
            Payment_end_data:'',
            open:false,
            modal:false,
            delete : false, 
            file_upload : false,
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            attachments : [],
            loading:false,
            checked_details:[0,1,2,3,4,5,6,7],
            check_value:false,
            show_result:false,
            psd_received_date : new Date(),
            vendor_details : '',
            object_initial :{
                "docno":"",
                "doctype":"",
                "startdt":"",
                "enddt":"",
                "vendor":"",
                "frm":"IPPAO"
            },
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
    }


    componentDidMount(){
        this.props.change('e2psearch.PSD_received_date', new Date())
        this.props.change('Filters.UIStartDate', new Date())
       
        if(this.props.location && this.props.location && this.props.location.page_name=="dashboard"){
            let {details, cell, row} = this.props.location
            console.log('componentDidMount_1', details, cell, row)
            this.getPage_details(details, cell, row)
        }
        else{
            this.props.GetFinList(this.state.object_initial)
        }
    }
    
    static getDerivedStateFromProps (nextProps, prevState){
        if(!prevState.show_result && nextProps.approval_list  && nextProps.approval_list.data){
            return {
                products : nextProps.approval_list.data,
            }
        }
        else if((!prevState.file_upload) && (!prevState.delete)  && prevState.show_result && nextProps.approval_details  && nextProps.approval_details.documentDetails){
            return {
                view_details : (nextProps.approval_details.documentDetails.length ? nextProps.approval_details.documentDetails[0] : {}),
                approval_details : nextProps.approval_details.approverDetails,
                lineItem : nextProps.approval_details.lineItem,
                attachments : (nextProps.approval_details && nextProps.approval_details.displayAttachFile && nextProps.approval_details.displayAttachFile.attachFileList) ? nextProps.approval_details.displayAttachFile.attachFileList : [],
                docAttachment :  nextProps.approval_details.docAttachment,
            }
        }
        else if((prevState.file_upload) && (!prevState.delete)  && nextProps.fileupload && nextProps.fileupload.displayAttachFile){
            return {
                attachments :  nextProps.fileupload.displayAttachFile
            }
        }
        else if((!prevState.file_upload) && (prevState.delete)  && nextProps.file_delete && nextProps.file_delete.displayAttachFile){
            return {
                attachments :  nextProps.file_delete.displayAttachFile
            }
        }
        return {nextProps, prevState}
    }
    
    handlefromsubmit(values){
       let _check_key = '';
       let  {e2psearch, all_check_value} = values;
       let _details = values.e2psearch;
       let _checked_details = []
       
        let _form_value = values;
        let {checkbox} = this.state
        let _checkbox_details = [1, 2, 4, 5, 6, 7, 8, 9];
        let _initial_obj = {
            strPRNo: "",
            strItemCode: "",
            strStatus: (e2psearch && e2psearch.status && e2psearch.status.length) ? all_check_value : _checkbox_details,
            strStatus2: (e2psearch &&  e2psearch.status && e2psearch.status.length) ? all_check_value : _checkbox_details,
            strPRType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data  : null ,
            UIEndDate: (this.state.end_data) ? this.state.end_data  : null ,
            dteDateTo: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            dteDateFr: (this.state.end_data) ? FromateDate(this.state.end_data)  :"",
            strVen : this.state.vendor_details,
            "frm":"IPPAO"
        }
    
        _form_value = Object.assign({}, _initial_obj,(_form_value.e2psearch) ? _form_value.e2psearch : _form_value )
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetFinList(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.GetFinList(_form_value)
        }
       

    }

    handleheaderlinks(values){
        let _target_name = values.target.getAttribute('data-field');
        if(_target_name){
            this.setState({
                model:true,
                modal_title:_target_name
            })
        }
    }

    Checkall = () =>{
      let   {checked_details} = this.state
      this.setState({
        all_check_value:checked_details
      })
    }

    getChecked(details){
        let all_check_value = this.state.all_check_value;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            _checked = parseInt(_checked)
            all_check_value.push(_checked)
        }
        else{
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
          
        }
        this.setState({all_check_value:all_check_value})
    }

    updateData() {

    }

   

   

    getProducts (values, details){
        let _all_products = this.state.checked_products;
        if(details && values.hasOwnProperty('IM_INVOICE_INDEX')){
            let _temp_details = ConvertMassApproval(values);
            _all_products.push(_temp_details)
            this.setState({
                checked_products : _all_products
            })
        }
         else{
            let _products = this.state.checked_products.filter((fieldValue, index) =>  fieldValue.strIPPDocIdx != values.IM_INVOICE_INDEX);
            this.setState({
                checked_products : _products
            })
        }
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_date:date
            })
       }
       else if(name=="psd_start_data"){
            this.setState({
                psd_start_data:date
            })
        }
        else if(name=="payment_start_data"){
            this.setState({
                payment_start_data:date
            })
        }
        else if(name=="payment_start_data"){
            this.setState({
                payment_start_data:date
            })
        }
        else if(name=="payment_end_data"){
            this.setState({
                payment_end_data:date
            })
        }

        else if(name=="PSD_received_date"){
            this.setState({
                psd_received_date:date
            })
        }
        

        
    }

    getPage_details(details, cell, row){
        console.log('getPage_details', details, cell, row)
        this.setState({
            show_result:true,
         
        })

        this.props.GetE2PApprovalDetails({
            docno : cell.IM_INVOICE_NO,
            index : cell.IM_INVOICE_INDEX,
            compid : cell.IM_B_COY_ID,
            "frm":"IPPAO"
        })  
    }

    viewPageDetails(details, cell, row){
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'listing'
        })
    }

   

    async  getProductsall (_products, details){
        let _all_products = this.state.checked_products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    let _temp_details = ConvertMassApproval(_products[i]);
                    _all_products.push(_temp_details)
                    if (i != _products.length) {
                        await this.setState({checked_products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                    _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.strIPPDocIdx != _products[i].IM_INVOICE_INDEX);
                    if (i != _products.length) {
                            this.setState({checked_products : _temp_query})
                    }
                }
            }
        }
        
    }

    ApproveAll = async() => {
        let {checked_products, input_remarks, psd_received_date} = this.state
    
        if(CompareDate(new Date(),psd_received_date)){
            this.setState({
                modal:true,
                modal_body:'PSD Received Date Cannot be later than today ',
                status : false
            })
        }
        else{
            if(checked_products.length){
                let _temp_details = checked_products.map((list_details, index)=>{
                    list_details.PSDReceiveDate =  DateMinusTimeLoginYear(psd_received_date ? psd_received_date : new Date())
                    return list_details
                })

                _temp_details = _temp_details.filter((list_details,index)=>(list_details.strIPPDocIdx && list_details.strIPPDocIdx!=false && list_details.strIPPDocIdx!=null))
                if(_temp_details && _temp_details.length > 0 && _temp_details[0]){

                    let _details = {
                        approvalType : "mass",
                        strAction:"verify",
                        massApprovalData : _temp_details,
                        frm :"IPPPSD",
                    }


                    this.setState({ loading : true })
                    let _status =  await ApiExtract(E2PApprovalSubmit, _details)
                    if(_status){
                        this.setState({
                            title : '',
                            modal_body : _status.message,
                            status : _status.status,
                            modal  :  true ,
                            submit_type : 'mass',
                            loading : false
                        })
                        if(_status.status){
                            let _form_value = {"docno":"","doctype":"","docstatus":"","docsdt":"","docedt":"","strVendorIndex":""}
                            this.props.GetFinList(_form_value)
                        }
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
           
    }

    closeModel (details){
        this.setState({
            modal : false,
            invoiceIndex : ''
        })
    }

    close_show_details = () =>{
        this.handlefromsubmit(this.state.object_initial)
        this.setState({
            show_result : false
        })
    }

    setInvoiceIndex = (invoice_index, docno, statusno) =>{

        this.setState({
            invoiceIndex : invoice_index,
            docno : docno,
            statusno : statusno
        })
    }

    UploadDocuments  = (nternal_file, req) =>{
        this.setState({
            file_upload:true,
            delete:false
        })
        this.props.UploadDocuments(nternal_file, req)
    }

    DeleteDocuments  = (nternal_file, req) =>{
        this.setState({
            file_upload:false,
            delete:true
        })
        this.props.GetDeleteFile(nternal_file, req)
    }

    ClearAll = () =>{
        this.props.reset('FTApprovalHolder')
        this.setState({
          all_check_value:[],
        })
      }
   

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Document No.", id:"IM_INVOICE_NO", width:'131px', key:true,formatter: (cellContent, row) => {
                return <button className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.IM_INVOICE_NO} </button > 
            }},
            {name : "Document Type", id:"PRM_PR_TYPE", width:'136px', formatter: (cellContent, row) => {
                return HandleDocType(row.IM_INVOICE_TYPE)
            }},
            {name : "Document Date", id:"IM_DOC_DATE", width:'134px', dataFormat:'date'},
            {name : "PSD Sent Date", id:"im_prcs_sent", width:'127px', dataFormat:'date'},
            {name : "Created By", id:"im_created_by", width:'105px'},
            {name : "PSD Received Date", id:"im_prcs_recv", width:'151px', dataFormat:'date'},
            {name : "Vendor", id:"IM_S_COY_NAME", width:'235px'},
            {name : "Bank Code", id:"im_bank_code", width:'130px'},
            {name : "Bank Account", id:"im_bank_acct", width:'130px'},
            {name : "Currency", id:"IM_CURRENCY_CODE", width:'89px'},
            {name : "Payment Amount", id:"IM_INVOICE_TOTAL", width:'140px', dataFormat:'number'},
            {name : "Payment mode", id:"STATUS_DESC", width:'146px', formatter: (cellContent, row) => {
                return HandlePayment(row.IM_PAYMENT_TERM)
            }}
        ]

       
        return <Fragment>

             {(this.state.loading) ? <Loader /> : '' }
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.sp_loading) ? <Loader /> : '' }
             {(this.props.fd_loading) ? <Loader /> : '' }
             {(this.props.fu_loading) ? <Loader /> : '' }
             {(this.props.fr_loading) ? <Loader /> : '' }
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }

              {!this.state.show_result && 
              <div className="show_list">  
                    <PageHeading 
                        subheading="Fill in the search criteria and click on Search button to list the relevant IPP document.  Select the PSD Sent Date and the IPP documents. Click Save to save the record." 
                    />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">    
                    
                        <Field type="text" name="e2psearch.docno" component={FromInputsParallelSingle} className="form-control" placeholder="Document No." label="Document No.." />
                        <Field type="text" name="e2psearch.doctype" component={FromSelectParallelSingle} className="form-control" placeholder="Document Type " label="Document Type" >
                            <option selected="selected" value="">---Select---</option>
                            <option value="INV">Invoice</option>
                            <option value="BILL">Bill</option>
                            <option value="CN">Credit Note</option>
                            <option value="DN">Debit Note</option>
                            <option value="LETTER">Letter</option>
                        </Field>       
                        <Field type="text" name="e2psearch.startdt" selected={this.state.start_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document Start Date  " label="Document Start Date "    onChange={this.handleDate.bind(this, 'start_date')} />
                        <Field type="text" name="e2psearch.enddt" selected={this.state.end_date} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document End Date " label="Document End Date" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        <div className="col-12 col-md-6">
                            <div className="row mt-2"> 
                                <div className="col-md-12"><label>Vendor</label></div>   
                                <div className="col-12">    
                                    <VendorSelect getOptions={this.handleSelect}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                    <button type="button" className="ml-4  btn btn-outline-primary btn-sm" onClick={()=>{this.Checkall()}}>Select All</button>
                                    <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div> 
                    </form>
                    <hr></hr>
                    <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                        <TabHeading color={'bg-info text-white margin-bottom-none'}>Select Date </TabHeading> 
                        <div className="row mt-2 mb-4 PSD_received_date">   
                            <Field type="text" name="e2psearch.PSD_received_date" selected={this.state.psd_received_date} component={FormDatePickerParallelSingle} className="form-control" placeholder="PSD Receive Date" label="PSD Receive Date"    onChange={this.handleDate.bind(this, 'PSD_received_date')} />
                        </div>  
                    </form>
             
                    <div className="row mt-2">    
                        <div className='col-12'>   
                           
                            <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={this.state.products} 
                                products={this.getProducts} 
                                select={true} 
                                click={false}
                                responsive={true} 
                                headerclick={this.handleheaderlinks}
                                selectall={this.getProductsall}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={this.ApproveAll}>Received</button> </div>
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" >Reset</button></div>
                    </div>
                </div>
                }
                {this.state.show_result && 
                    <div className="details_holder">
                        <Details 
                            frompage="approve" 
                            delete={true}
                            line_item={this.state.lineItem} 
                            vew_audit= {this.props.GetE2PViewAudit} 
                            close={this.close_show_details} 
                            details={this.state.view_details} 
                            loading={this.props.ad_loading} 
                            approval={this.state.approval_details} 
                            setInvoiceIndex ={this.setInvoiceIndex} 
                            UploadDocuments = {this.UploadDocuments} 
                            download_files={this.props.GetDownloadFile}  
                            delete_file={this.DeleteDocuments}
                            attachments = {this.state.attachments}
                            docAttachment={this.state.docAttachment} 
                            />
                    </div>
                }

                {this.state.invoiceIndex && 
                    <ViewAudit invoiceIndex={this.state.invoiceIndex} open={(this.state.invoiceIndex)? true : false} footer ={true} footercontent={<Fragment>
                            <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closeModel }>Close</button></Fragment>}>
                        <TabHeading color={'bg-info text-white'}>Document Info</TabHeading> 
                        <div className="row mb-2">
                            <div className="col-12 col-sm-6">
                                <strong>Document No : {this.state.docno} </strong>
                            </div>
                            <div className="col-12 col-sm-6">
                                <strong>Document Status :  {this.state.statusno} </strong>
                            </div>
                        </div>
                        
                     </ViewAudit>
                 }
             
                <Alert 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.modal} 
                    confirm={this.closeModel}
                />
     </Fragment>
    }
}

const mapStateToProps = state => ({
    approval_list : state.approval_list_finance.responseList,
    loading : state.approval_list_finance.loading,
    approval_details : state.approval_details.responseList,
    ad_loading : state.approval_details.loading,
    fd_loading : state.file_download.loading,
    fu_loading : state.fileupload.loading,
    fr_loading : state.file_delete.loading,
    file_download: state.file_download.responseList,
    fileupload : state.fileupload.responseList,
    file_delete : state.file_delete.responseList,
    get_from_details : state.form.FTApprovalHolder
})
  
const mapDispatchToProps = dispatch => ({
    GetFinList  : (values) => dispatch(GetFinList(values)),
    GetE2PApprovalDetails  : (values) => dispatch(GetE2PApprovalDetails(values)),
    GetE2PViewAudit  : (values) => dispatch(GetE2PViewAudit(values)),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
    ResetRejectFrom  : () => dispatch(reset('RejectList')),
})

const ApprovalHolder = connect(mapStateToProps, mapDispatchToProps)(Request);

export default reduxForm({
    form:'FTApprovalHolder',
})(ApprovalHolder);
