import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import {FormDatePickerParallelSingle, FormRadioButton, FormRadioButtonSpan, FromInputsParallelSingle} from '../../../../Component/From/FromInputs'
import {GetDocumentEnquiryList} from '../../../../Actions/Requester'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import {HandlePayment, HandleDocType} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {connect} from 'react-redux';
import VendorSelect from '../../Form/VendorSelect'
import Details from '../documentverify/Details'
import {UserDetails} from '../../../../Common/LocalStorage'
import ViewAudit from '../../../ViewAudit'
import {GetE2PApprovalDetails} from '../../../../Actions/Approver'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'


class DocumentEnquiry extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.Checkall= this.Checkall.bind(this);
        this.state = {
            products:[],
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
            vendor_details : '',
            show_result:false,
            invoiceIndex : '',
            docno : '',
            statusno : '',
            view_details : {},
            initial_obj : {
                "docno":"",
                "docstatus":[1 ,2,3,19,4,10,11,12,13,14,15,16, 17,18],
                "docsdt":"",
                "docedt":"",
                "strVendorIndex":"",
                "strVenAddr":"",
                "payadv":"",
                "paysdt":"",
                "payedt":"",
                "psdsentsdt":"",
                "psdsentedt":""
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

    componentDidMount(){
        localStorage.removeItem('e2p_req_details')
        localStorage.removeItem('e2p_aprov_details')
    }

    static getDerivedStateFromProps (nextProps, prevState){
        if(!prevState.show_result && nextProps.approval_list && nextProps.approval_list && nextProps.approval_list.data){
            return {
                products : nextProps.approval_list.data,
            }
        }
        else if(prevState.show_result && nextProps.approval_details  && nextProps.approval_details.documentDetails){
            return {
                view_details : (nextProps.approval_details.documentDetails.length) ? nextProps.approval_details.documentDetails[0] : {},
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
        let _details = values.PurchaseRequestListing;
        let _checked_details = [];

        if(PurchaseRequestListing && PurchaseRequestListing.status && PurchaseRequestListing.status.length > 0){
            PurchaseRequestListing.status.forEach((list_details, index)=>{
                if(list_details){
                    _checked_details[index] ='';
                }
            })
            
            if(_checked_details && _checked_details.length){
                _checked_details = Object.keys(_checked_details)
            }
        }
        let _form_value = values;
        let _initial_obj = this.state.initial_obj;
        _form_value = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestListing) ? _form_value.PurchaseRequestListing : _form_value )
        _form_value.docsdt = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data) : '';
        _form_value.docedt = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data) : '';
        _form_value.strVendorIndex = this.state.vendor_details;
        _form_value.paysdt= (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.payment_start_data) : '';
        _form_value.payedt= (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.payment_start_data) : '';
        _form_value.psdsentsdt= (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.psd_start_data) : '';
        _form_value.psdsentedt= (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.psd_end_data) : '';
        _form_value.docstatus = (_checked_details && _checked_details.length > 0) ? _checked_details.toString() : (all_check_value && all_check_value.length > 0) ? all_check_value.toString : '';
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetDocumentEnquiryList(_form_value)
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
            this.props.GetDocumentEnquiryList(_form_value)
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

        else if(name=="psd_end_data"){
            this.setState({
                psd_end_data:date
            })
        }        else if(name=="payment_start_data"){
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
        let _tem_details =  UserDetails()
        this.setState({
            show_result:true,
        })

        this.props.GetE2PApprovalDetails({
            docno : cell.IM_INVOICE_NO,
            index : cell.IM_INVOICE_INDEX,
            compid : _tem_details.UM_COY_ID,
            "frm":"IPPAO",
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

    

    closeModel (details){
        this.setState({
            modal : false,
            invoiceIndex : '',
        })
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
    }

    setInvoiceIndex = (invoice_index, docno, statusno) =>{
        this.setState({
            invoiceIndex : invoice_index,
            docno : docno,
            statusno : statusno
        })
    }

    close_show_details = () =>{
        this.setState({
            show_result : false
        })
    }



    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Document No.", id:"IM_INVOICE_NO", width:'162px', key:true,formatter: (cellContent, row) => {
                return (
                    row.STATUS_DESC != 'Draft' ? <button type="button" className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.IM_INVOICE_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button > : <button className="btn btn-outline-info btn-sm" size="sm" variant="primary"  ><span className="row_name">{row.IM_INVOICE_NO}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span></button >
                )
            }},
            {name : "Document Type", id:"IM_INVOICE_TYPE", width:'164px', formatter: (cellContent, row) => {
                return HandleDocType(row.IM_INVOICE_TYPE)
            }},
            {name : "Document Date", id:"IM_DOC_DATE", width:'148px', dataFormat:'date'},
            {name : "Vendor", id:"IM_S_COY_NAME", width:'235px'},
            {name : "Bank Code", id:"IM_BANK_CODE", width:'130px'},
            {name : "Bank Account", id:"IM_BANK_ACCT", width:'130px'},
            {name : "Currency", id:"IM_CURRENCY_CODE", width:'89px'},
            {name : "Sub-Document Payment Amount", id:"ISD_DOC_AMT", width:'141px', dataFormat:'number'},
            {name : "Payment Amount", id:"IM_INVOICE_TOTAL", width:'153px', dataFormat:'number'},
            {name : "Payment Method", id:"STATUS_DESC", width:'146px', formatter: (cellContent, row) => {
                return HandlePayment(row.IM_PAYMENT_TERM)
            }},
            {name : "Payment Date", id:"IM_PAYMENT_DATE", width:'130px', dataFormat:'date'},
            {name : "Payment Advice No", id:"IM_PAYMENT_NO", width:'160px', dataFormat:'date'},
            {name : "Status", id:"STATUS_DESC", width:'130px' ,formatter: (cellContent, row) => {
                return (row.STATUS_DESC=='Approved') ? 'FM Approved'  : row.STATUS_DESC
            }},
        
        ]

       
        return <Fragment>
        
            {(this.state.loading) ? <Loader /> : '' }
            {(this.props.loading) ? <Loader /> : '' }
            {(this.props.approval_loading) ? <Loader /> : '' }
            
            {!this.state.show_result && 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <PageHeading heading="E2P Enquiry" subheading="Fill in the search criteria and click on Search button to list the relevant E2P document." />
                    <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                    <div className="row mt-2">   
                        <Field type="text" name="PurchaseRequestListing.docno" component={FromInputsParallelSingle} className="form-control" placeholder="Document No. " label="Document No. :" />
                        <Field type="text" name="PurchaseRequestListing.payadv" component={FromInputsParallelSingle} className="form-control" placeholder="Payment Advice No " label="Payment Advice No : " />       
                        <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document Start Date " label="Document Start Date : "    onChange={this.handleDate.bind(this, 'start_date')} />
                        <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document End Date " label="Document End Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.psd_start_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="PSD Sent Start Date " label="PSD Sent Start Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'psd_start_data')} />       
                        <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.psd_end_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="PSD Sent End Date " label="PSD Sent End Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'psd_end_data')} /> 
                        <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.payment_start_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Payment Start Date " label="Payment Start Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'payment_start_data')} />       
                        <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.payment_end_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Payment End Date " label="Payment End Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'payment_end_data')} /> 
                        <div className="col-12 col-md-6">  
                            <div className="row mt-2">
                                <div className="col-12">
                                    <label>Vendor : </label>
                                </div>    
                                <div className="col-12">    
                                    <VendorSelect getOptions={this.handleSelect}/>
                                </div>
                            </div>
                        </div>
                        <Field type="text" name="PurchaseRequestListing.strVenAddr" component={FromInputsParallelSingle}  className="form-control" placeholder="  Vendor Address (1st Line) " label="  Vendor Address (1st Line) : "   />
                        
                        <div className='col-12'>   
                                        <div className="mt-2 row ">
                                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                                <label htmlFor="PRType">Status : </label>
                                            </div>

                                            <div className="displayFlex col-lg-auto col-md-auto col-sm-auto col-auto e2p-enquiry">  
                                                <Field type="text" name="PurchaseRequestListing.status[10]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Draft/Draft[R]" checked={this.state.all_check_value.includes(10)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[16]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Submitted" checked={this.state.all_check_value.includes(16)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[18]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="E2P Verified" checked={this.state.all_check_value.includes(18)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[17]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Department Approved" checked={this.state.all_check_value.includes(17)} /> 
                                                <Field type="text" name="PurchaseRequestListing.status[11]" component={FormRadioButtonSpan}  onChange={this.getChecked} label="Finance Verified"  checked={this.state.all_check_value.includes(11)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[12]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Finance Approved" checked={this.state.all_check_value.includes(12)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[13]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="FM Approved" checked={this.state.all_check_value.includes(13)}/> 
                                                <Field type="text" name="PurchaseRequestListing.status[4]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Paid" checked={this.state.all_check_value.includes(4)}/> 
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
                                    <button type="reset" className="ml-4  btn btn-outline-danger btn-sm">Clear</button>
                                </div>
                            </div>
                        </div>
                        

                    </div> 
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
                                table_body={(this.props.document_enquiry) ? this.props.document_enquiry : [] } 
                                products={this.getProducts} 
                                select={false} 
                                click={false}
                                responsive={true} 
                                headerclick={this.handleheaderlinks}
                            />

                        </div>
                    </div>
                </form>
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
                        <Details docAttachment={this.state.docAttachment}  download_files={this.props.GetDownloadFile} from_page={'listing'}   attachments = {this.state.attachments} delete = {false} line_item={this.state.lineItem} vew_audit= {this.props.GetE2PViewAudit} close={this.close_show_details} details={this.state.view_details} loading={this.props.ad_loading} approval={this.state.approval_details} setInvoiceIndex ={this.setInvoiceIndex} />
                    </div>
                }

            
     </Fragment>
    }
}



const mapStateToProps = state => ({
    loading : state.document_enquiry.loading,
    document_enquiry : state.document_enquiry.responseList,

    approval_details :state.approval_details.responseList, 
    approval_loading :state.approval_details.loading, 
})
const mapDispatchToProps = dispatch => ({
    GetDocumentEnquiryList : (values) => dispatch(GetDocumentEnquiryList(values)),
    GetE2PApprovalDetails  : (values) => dispatch(GetE2PApprovalDetails(values))
})
const DocumentEnquiryHolder = connect(mapStateToProps, mapDispatchToProps)(DocumentEnquiry);
export default reduxForm({
    form:'login',
})(DocumentEnquiryHolder);
