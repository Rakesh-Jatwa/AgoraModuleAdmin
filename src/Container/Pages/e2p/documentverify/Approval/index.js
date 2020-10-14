import React,{Component, Fragment} from 'react';
import Loader from '../../../../../Component/Loader'
import {FormDatePickerParallelSingle, FromSelectParallelSingle, FromInputsParallelSingle} from '../../../../../Component/From/FromInputs'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {Field, reduxForm, reset} from 'redux-form';
import {connect} from 'react-redux'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTable'
import {FromateDate_YY_MM_DD, CompareDate} from '../../../../../Component/Dates'
import Alert from '../../../../../Component/Modal/alert'
import Details from '../Details'
import {GetE2PApprovalList, GetE2PApprovalDetails, GetE2PViewAudit, GetE2PCanApprove} from '../../../../../Actions/Approver'
import {HandlePayment, ConvertMassApproval, HandleDocType} from '../../../../../Actions/Common/Functions'
import {E2PApprovalSubmit} from '../../../../../Apis/Approver'
import {GetDownloadFile} from '../../../../../Actions/Approver'
import ViewAudit from '../../../../ViewAudit'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {UploadDocuments} from '../../../../../Actions/Requester'
import {GetDeleteFile} from '../../../../../Actions/Vendor'
import VendorSelect from '../../../Form/VendorSelect'
import {RemoveSpecialCharacter} from '../../../../../Actions/Common/Functions'
class Approval extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.handleTableInputs = this.handleTableInputs.bind(this);
        this.getProductsall = this.getProductsall.bind(this)
        this.state = {
            products:[],
            selected_products:[],
            attachments : [],
            view_details: {},
            lineItem : [],
            approval_details:[],
            start_data:"",
            end_data:"",
            psd_start_data:'',
            psd_end_data:'',
            Payment_start_data:'',
            Payment_end_data:'',
            open:false,
            modal:false,
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            loading:false,
            checked_details:[0,1,2,3,4,5,6,7],
            check_value:false,
            show_result:false,
            delete : false, 
            file_upload : false,
            submit_type: '',
            selected_datas:{},
            invoiceIndex : '',
            docno : '',
            statusno  :'',
            vaendor_name:'',
            input_remarks : [],
            vendor_details : '',
            object_initial :{
                "docno":"",
                "doctype":"",
                "startdt":"",
                "enddt":"",
                "vendor":"",
                "frm":"IPPAO",
            }
        }

        this.Checkall= this.Checkall.bind(this);
        this.ClearAll= this.ClearAll.bind(this);
        
    }

    componentDidMount(){
      
        this.props.GetE2PApprovalList(this.state.object_initial) 
        localStorage.removeItem('e2p_req_details')
        localStorage.removeItem('e2p_aprov_details')
        if(this.props.location && this.props.location.page_name=="dashboard"){
            let {details,cell,row} = this.props.location
            this.getPage_details(details,cell,row)
        }
    }

    static getDerivedStateFromProps (nextProps, prevState){
        console.log('file_upload', nextProps.fileupload)
        if(!prevState.show_result && nextProps.approval_list  && nextProps.approval_list.data){
            return {
                products : nextProps.approval_list.data,
            }
        }
        else if((!prevState.file_upload) && (!prevState.delete)  && prevState.show_result && nextProps.approval_details  && nextProps.approval_details.documentDetails){
            return {
                view_details : nextProps.approval_details.documentDetails.length ? nextProps.approval_details.documentDetails[0] : {},
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

        let _values = (values.Filters) ? values.Filters : {}
        let _form_value = {}
        _form_value = Object.assign({}, this.state.object_initial,(_values) ? _values : values )
        _form_value.startdt = (_values && _values.startdt) ? FromateDate_YY_MM_DD(_values.startdt)  :"";
        _form_value.enddt =  (_values && _values.enddt) ? FromateDate_YY_MM_DD(_values.enddt)  :"";
        _form_value.vendor = this.state.vendor_details
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetE2PApprovalList(_form_value)
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
            this.props.GetE2PApprovalList(_form_value)
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

    ClearAll = () =>{
        this.props.reset('e2p_Approval')
        this.setState({
          all_check_value:[],
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


    getProducts (values, details){
        let _all_products = this.state.selected_products;
        if(details && values.hasOwnProperty('IM_INVOICE_INDEX')){
            let _temp_details = ConvertMassApproval(values);
            _all_products.push(_temp_details)
            this.setState({
                selected_products : _all_products
            })
        }
        else{
            let _products = this.state.selected_products.filter((fieldValue, index) =>  fieldValue.strIPPDocIdx != values.IM_INVOICE_INDEX);
            this.setState({
                selected_products : _products
            })
        }
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.selected_products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    let _temp_details = ConvertMassApproval(_products[i]);
                    _all_products.push(_temp_details)
                    if (i != _products.length) {
                        await this.setState({selected_products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                    _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.strIPPDocIdx != _products[i].IM_INVOICE_INDEX);
                    if (i != _products.length) {
                            this.setState({selected_products : _temp_query})
                    }
                }
                
            }
        }
        
    }

    UnselectAll = () =>{
       this.setState({
         products : []
       })
    }

    ApproveAll = async() => {
        
        let {selected_products, input_remarks} = this.state        
        if(selected_products.length){
            let _temp_details = selected_products.map((list_details, index)=>{
                let _invoice_details = input_remarks.filter((list_sub)=>list_sub.key == list_details.strIPPDocIdx)
                if(_invoice_details && _invoice_details.length>0 && _invoice_details[0].value){
                    let _sub_details = list_details
                    _sub_details.strRemark = _invoice_details[0].value
                    return _sub_details
                }
                else if(list_details.strRemark){
                    let _sub_details = list_details
                    _sub_details.strRemark = list_details.strRemark
                    return _sub_details
                }
                return false
            })
            
            _temp_details = _temp_details.filter((list_details,index)=>(list_details.strIPPDocIdx && list_details.strIPPDocIdx!=false && list_details.strIPPDocIdx!=null))
            if(_temp_details && _temp_details.length > 0 && _temp_details[0]){

                let _details = {
                    approvalType : "mass",
                    strAction:"verify",
                    frm:"IPPAO",
                    massApprovalData : _temp_details
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

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
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

        console.log('this.state.object_initial', details, cell, row)
      
        this.setState({
            show_result:true,
         
        })
        this.props.GetE2PCanApprove({
            paymentmethod:cell.IM_PAYMENT_TERM,
            paymentAmount:cell.IM_INVOICE_TOTAL,
        })
        this.props.GetE2PApprovalDetails({
            docno : cell.IM_INVOICE_NO,
            index : cell.IM_INVOICE_INDEX,
            compid : cell.IM_B_COY_ID,
            "frm":"IPPAO"
        })        
    }

    close_show_details = () =>{
        this.handlefromsubmit({})
        this.setState({
            show_result : false
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

    

    viewPageDetails(details, cell, row){
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'listing'
        })
    }

    setInvoiceIndex = (invoice_index, docno, statusno) =>{
        this.setState({
            invoiceIndex : invoice_index,
            docno : docno,
            statusno : statusno,
            "frm":"IPPAO"
        })
    }
    

    closeModel (details){
        this.setState({
            modal : false,
            invoiceIndex : ''
        })

        if(this.state.submit_type=="mass" && this.state.status){
            this.props.GetE2PApprovalList(this.state.object_initial) 
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
            this.setState({
                input_remarks : _temp_details
            })
        }
       
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
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
            {name : "Submitted Date", id:"IM_SUBMIT_DATE", width:'134px', dataFormat:'date'},
            {name : "Vendor", id:"IM_S_COY_NAME", width:'235px'},
            {name : "Currency", id:"IM_CURRENCY_CODE", width:'89px'},
            {name : "Payment Amount", id:"IM_INVOICE_TOTAL", width:'140px', dataFormat:'number'},
            {name : "Payment Method", id:"STATUS_DESC", width:'146px', formatter: (cellContent, row) => {
                return HandlePayment(row.IM_PAYMENT_TERM)
            }},
            {name : "Remarks", id:"IM_REMARK", width:'130px',dataFormat:'e2paotextarea'}
        ]

       

        return <Fragment>

             {(this.props.fd_loading) ? <Loader /> : '' }
             {(this.props.fu_loading) ? <Loader /> : '' }
             {(this.props.fr_loading) ? <Loader /> : '' }
             {(this.props.loading) ? <Loader /> : '' }
             {(this.state.loading) ? <Loader /> : '' }
             
              {!this.state.show_result && 
              <div className="show_list">  
                <PageHeading 
                    subheading="Fill in the search criteria and click on Search button to list the relevant E2P document." 
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">    
                    
                        <Field type="text" name="Filters.docno" component={FromInputsParallelSingle} className="form-control" placeholder="Document No." label="Document No. : " />
                        <Field type="text" name="Filters.doctype" component={FromSelectParallelSingle} className="form-control" placeholder="Document Type " label="Document Type : " >
                            <option selected="selected" value="">---Select---</option>
                            <option value="INV">Invoice</option>
                            <option value="BILL">Bill</option>
                            <option value="CN">Credit Note</option>
                            <option value="DN">Debit Note</option>
                            <option value="LETTER">Letter</option>
                        </Field>       
                        <Field type="text" name="Filters.startdt" selected={this.state.start_data} component={FormDatePickerParallelSingle} className="form-control" placeholder="Document Start Date " label="Document Start Date : "    onChange={this.handleDate.bind(this, 'start_date')} />
                        <Field type="text" name="Filters.enddt" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallelSingle} className="form-control : " placeholder="Document End Date " label="Document End Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        <div className="col-12 col-md-6">
                            <div className="row mt-2"> 
                                <div className="col-md-12"><label>Vendor  : </label></div>   
                                <div className="col-12">    
                                    <VendorSelect getOptions={this.handleSelect}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                    {/* <button type="button" className="ml-4  btn btn-outline-primary btn-sm" onClick={()=>{this.Checkall()}}>Select All</button> */}
                                    <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>{this.ClearAll()}}>Clear</button>
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
                                table_body={this.state.products} 
                                products={this.getProducts} 
                                select={true} 
                                click={false}
                                responsive={true} 
                                headerclick={this.handleheaderlinks}
                                selectall={this.getProductsall}
                                change={true}
                                getInputs={this.handleTableInputs}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.ApproveAll()}>Mass Verify</button> </div>
                            <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.UnselectAll()}>Reset</button></div>
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
                        <Details frompage="ao1_approve" 
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
                            delete = {true}
                            button_details =  {this.props.can_approve}
                            docAttachment={this.state.docAttachment} 
                            from_page = {'approval'}
                        />
                    </div>
                }
     </Fragment>
    }
}


const mapStateToProps = state => ({
    approval_list : state.approval_list.responseList,
    loading : state.approval_list.loading,
    approval_details : state.approval_details.responseList,
    ad_loading : state.approval_details.loading,
    fd_loading : state.file_download.loading,
    fu_loading : state.fileupload.loading,
    fr_loading : state.file_delete.loading,
    file_download: state.file_download.responseList,
    fileupload : state.fileupload.responseList,
    file_delete : state.file_delete.responseList,

    can_approve : state.can_approve.responseList,
    cl_loading : state.can_approve.loading,
})
  
const mapDispatchToProps = dispatch => ({
    GetE2PApprovalList  : (values) => dispatch(GetE2PApprovalList(values)),
    GetE2PApprovalDetails  : (values) => dispatch(GetE2PApprovalDetails(values)),
    GetE2PViewAudit  : (values) => dispatch(GetE2PViewAudit(values)),
    ResetRejectFrom  : () => dispatch(reset('RejectList')),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
    GetE2PCanApprove  : (values) => dispatch(GetE2PCanApprove(values)),
})

const ApprovalHolder = connect(mapStateToProps, mapDispatchToProps)(Approval);
export default reduxForm({
    form:'e2p_Approval',
})(ApprovalHolder);
