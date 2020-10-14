import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import {FormDatePickerParallelSingle, FromSelectParallelSingle, FormRadioButtonSpan, FromInputsParallelSingle} from '../../../../../Component/From/FromInputs'
import {GetE2PApprovalAprovRejPSD, GetE2PApprovalDetails} from '../../../../../Actions/Approver'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm, reset} from 'redux-form';
import {connect} from 'react-redux'
import {HandlePayment, HandleDocType, HandleStatus} from '../../../../../Actions/Common/Functions'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import {FromateDate, FromateDate_YY_MM_DD, CompareDate} from '../../../../../Component/Dates'
import Alert from '../../../../../Component/Modal/alert'
import {GetDownloadFile} from '../../../../../Actions/Approver'
import Details from '../Details'
import ViewAudit from '../../../../ViewAudit'
import VendorSelect from '../../../Form/VendorSelect'
import {RemoveSpecialCharacter} from '../../../../../Actions/Common/Functions'
class ApprovalListing extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.Checkall= this.Checkall.bind(this)
        this.state = {
            products:[],
            view_details : {},
            start_data:'',
            end_data:'',
            psd_start_data:'',
            psd_end_data:'',
            Payment_start_data:'',
            Payment_end_data:'',
            open:false,
            modal:false,
            check_value:false,
            all_check_value:[],
            loading:false,
            checked_details:[1 ,2,3,19,4,10,11,12,13,14,15,16, 17,18],
            check_value:false,
            show_result:false,
            invoiceIndex : '',
            docno : '',
            statusno : '',
            vendor_details : '',
            object_initial : {"docno": "", 'frm':'PSDAcceptReject', "doctype": "", "docstatus": '', "docsdt": '', "docedt": '',"strVendorIndex":'' },
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    componentDidMount(){
        // this.props.GetE2PApprovalAprovRej(this.state.object_initial)
    }

    static getDerivedStateFromProps (nextProps, prevState){
        if(!prevState.show_result && nextProps.approval_list && nextProps.approval_list && nextProps.approval_list.data){
            return {
                products : nextProps.approval_list.data,
            }
        }
        else if(prevState.show_result && nextProps.approval_details  && nextProps.approval_details.documentDetails){
            return {
                view_details : (nextProps.approval_details.documentDetails.length ? nextProps.approval_details.documentDetails[0] : {}),
                approval_details : nextProps.approval_details.approverDetails,
                lineItem : nextProps.approval_details.lineItem,
                attachments : (nextProps.approval_details && nextProps.approval_details.displayAttachFile && nextProps.approval_details.displayAttachFile) ? nextProps.approval_details.displayAttachFile : [],
                docAttachment :  nextProps.approval_details.docAttachment,
            }
        }
        return {nextProps, prevState}
    }


    handlefromsubmit(values){
       let  {PurchaseRequestListing, all_check_value} = values;
       let _checked_details_main = [];

       if(PurchaseRequestListing && PurchaseRequestListing.status && PurchaseRequestListing.status.length > 0){
           PurchaseRequestListing.status.forEach((list_details, index)=>{
               if(list_details){
                _checked_details_main[index] ='';
               }
           })
           
           if(_checked_details_main && _checked_details_main.length){
            _checked_details_main = Object.keys(_checked_details_main)
           }
       }
       
        let _form_value = values;
        let _initial_obj = this.state.object_initial
        _form_value = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestListing) ? _form_value.PurchaseRequestListing : _form_value )
        _form_value.docsdt = (_form_value && _form_value.docsdt) ? FromateDate_YY_MM_DD(_form_value.docsdt)  :"";
        _form_value.docedt =  (_form_value && _form_value.docedt) ? FromateDate_YY_MM_DD(_form_value.docedt)  :"";
        _form_value.docstatus = (_checked_details_main && _checked_details_main.length > 0) ? _checked_details_main.toString() : '';
        _form_value.strVendorIndex = this.state.vendor_details;
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetE2PApprovalAprovRej(_form_value)
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
            this.props.GetE2PApprovalAprovRej(_form_value)
        }
       

    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
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

    getProducts (values){
        let _all_products = this.state.products;
        if(values.hasOwnProperty('itemcode')){
            _all_products.push(values.itemcode)
            this.setState({
                products : _all_products
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
        
    }

    getPage_details(details, cell, row){
        console.log('getPage_details', cell)
        this.setState({
            show_result:true,
        })

        this.props.GetE2PApprovalDetails({
            docno : cell.IM_INVOICE_NO,
            index : cell.IM_INVOICE_INDEX,
            compid : cell.IM_B_COY_ID,
            "frm":"IPPAO",
        })  
    }

    
    close_show_details = () =>{
        this.setState({
            show_result : false
        })
    }

    DownloadDocument = (alter_details) => {
            let _temp_details = {
                strFile: alter_details.UA_ATTACH_FILENAME,
                strFile1: alter_details.UA_HUB_FILENAME,
                pEnumDownloadType: 6,
                Text: alter_details.UA_FILESIZE+'KB',
                ID: alter_details.UA_ATTACH_INDEX,
                CDA_DOC_TYPE: "IPP"
        }
        this.props.GetDownloadFile(_temp_details)
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

    

    closeModel (details){
        this.setState({
            modal : false,
            invoiceIndex : ''
        })
    }

    ClearAll = () =>{
        this.props.reset('E2P_Request_Listing')
        this.setState({
            docstatus :'',
            all_check_value : [],
        })
    }

    setInvoiceIndex = (invoice_index, docno, statusno) =>{

        this.setState({
            invoiceIndex : invoice_index,
            docno : docno,
            statusno : statusno
        })
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header =  [
            {name : "Document No.", id:"IM_INVOICE_NO", width:'131px', key:true,formatter: (cellContent, row) => {
                return <button className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.IM_INVOICE_NO} </button > 
            }},
            {name : "Document Type", id:"PRM_PR_TYPE", width:'164px', formatter: (cellContent, row) => {
                return HandleDocType(row.IM_INVOICE_TYPE)
            }},
            {name : "Document Date", id:"IM_DOC_DATE", width:'148px', dataFormat:'date'},
            {name : "PSD Sent Date", id:"im_prcs_sent", width:'148px', dataFormat:'date'},
            {name : "Vendor", id:"IM_S_COY_NAME", width:'235px'},
            {name : "Bank Code", id:"ic_bank_code", width:'130px'},
            {name : "Bank Account", id:"ic_bank_acct", width:'130px'},
            {name : "Currency", id:"IM_CURRENCY_CODE", width:'89px'},
            {name : "Payment Amount", id:"IM_INVOICE_TOTAL", width:'153px', dataFormat:'number'},
            {name : "Payment Mode", id:"STATUS_DESC", width:'146px', formatter: (cellContent, row) => {
                return HandlePayment(row.IM_PAYMENT_TERM)
            }},
            {name : "Status", id:"IM_INVOICE_STATUS", width:'130px', formatter: (cellContent, row) => {
                return HandleStatus(row.IM_INVOICE_STATUS)
            }},
        ]

       
        return <Fragment>
        
             {(this.state.loading) ? <Loader /> : '' }
             {(this.props.loading) ? <Loader /> : '' }
             {(this.props.fd_loading) ? <Loader /> : '' }
              {(this.props.sp_loading) ? <Loader /> : '' }
            {!this.state.show_result && 
            <div classNAME="main_holder">
            <PageHeading 
                subheading="Fill in the search criteria and click on Search button to list the relevant IPP document. 
                Select the PSD Sent Date and the IPP documents. Click Save to save the record.  
                " 
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
                        <Field type="text" name="e2psearch.enddt" selected={this.state.end_date} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document End Date " label="Document End Date" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        <div className="col-12 col-md-6">
                            <div className="row mt-2"> 
                                <div className="col-md-12"><label>Vendor</label></div>   
                                <div className="col-12">    
                                    <VendorSelect getOptions={this.handleSelect}/>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-12'>   
                        <div className="mt-2 row ">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">Status : </label>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 main_details">
                                <Field type="text" name="PurchaseRequestListing.status[10]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Draft" checked={this.state.all_check_value.includes(10)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[16]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Submitted" checked={this.state.all_check_value.includes(16)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[18]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="IPP Verified" checked={this.state.all_check_value.includes(18)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[17]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="PSD Sent" checked={this.state.all_check_value.includes(17)} /> 
                                <Field type="text" name="PurchaseRequestListing.status[11]"  component={FormRadioButtonSpan}  onChange={this.getChecked} label="PSD Received"  checked={this.state.all_check_value.includes(11)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[12]"  component={FormRadioButtonSpan}  onChange={this.getChecked} label="Finance Verified"  checked={this.state.all_check_value.includes(11)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[12]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Finance Approved" checked={this.state.all_check_value.includes(12)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[3]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="FM Approved" checked={this.state.all_check_value.includes(13)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[4]"   component={FormRadioButtonSpan} onChange={this.getChecked} label="Paid" checked={this.state.all_check_value.includes(4)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[15]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Void" checked={this.state.all_check_value.includes(15)}/> 
                                <Field type="text" name="PurchaseRequestListing.status[14]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Rejected" checked={this.state.all_check_value.includes(14)}/> 
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
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <Alert 
                            message={this.state.modal_body}
                            status={this.state.status} 
                            show={this.state.modal} 
                            confirm={this.closeModel}
                        />
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={this.state.products } 
                            products={this.getProducts} 
                            select={false} 
                            click={false}
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                        />

                        
                    </div>
                </div>
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
            {this.state.show_result && 
                 <div className="details_holder">
                    <Details  docAttachment={this.state.docAttachment}  download_files={this.DownloadDocument} from_page={'listing'}   attachments = {this.state.attachments} delete = {false} line_item={this.state.lineItem} vew_audit= {this.props.GetE2PViewAudit} close={this.close_show_details} details={this.state.view_details} loading={this.props.ad_loading} approval={this.state.approval_details} setInvoiceIndex ={this.setInvoiceIndex} />
                </div>
            }
            
     </Fragment>
    }
}

const mapStateToProps = state => ({
    approval_list : state.approval_rejected_list.responseList,
    loading : state.approval_rejected_list.loading,
    approval_details : state.approval_details.responseList,
    ad_loading : state.approval_details.loading,
    fd_loading : state.file_download.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetE2PApprovalAprovRej  : (values) => dispatch(GetE2PApprovalAprovRejPSD(values)),
    GetE2PApprovalDetails  : (values) => dispatch(GetE2PApprovalDetails(values)),
    ResetRejectFrom  : () => dispatch(reset('RejectList')),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
})

const ApprovalListingHolder = connect(mapStateToProps, mapDispatchToProps)(ApprovalListing);
export default reduxForm({
    form:'E2P_Request_Listing',
})(ApprovalListingHolder);
