import React,{Component, Fragment} from 'react'
import {useSelector, useDispatch, } from "react-redux";
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {reduxForm, Field } from 'redux-form';
import {TodayDateSalash} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {GetDeleteFile} from '../../../../Actions/Vendor'
import {UploadDocuments, GetGenerateDEBITPDF} from '../../../../Actions/Requester'
import {GetDownloadFile} from '../../../../Actions/Approver'
import {FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'
import {GetDNDetails, GetEmptyCNDN } from '../../../../Actions/Vendor'
import {ApiExtract} from '../../../../Common/GetDatas'
import {GetSubmitDN} from '../../../../Apis/Vendor'
import {connect} from 'react-redux';
import {round_decimal} from '../../../../Actions/Common/Functions'
class DebitView extends Component {

    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this);
        this.handleTableInputs = this.handleTableInputs.bind(this)
        this.state = {
            products:[],
            file_upload :false,
            delete :false,
            loading:false,
            start_data:'',
            status : false,
            end_data:'',
            modal_title:'',
            modal_body:'',
            show : false,
            type:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            invoice_number :'',
            show_details : false,
            invDetails : [],
            lineItems : [],
            relatedCreditNotes : [],
            attachments : [],
            rerendered : false,
            rendered : false,
            render_table_input :  false,
            table_inputs : [],
            internal_file : '',
            internal_file_name : '',
            remarks : '',
            do_number : '',
        }
    }

    componentDidMount(){
        this.props.GetDNDetails({invoiceNo : this.props.invoice_number})
        // this.props.GetDNDetails({invoiceNo : 'POSB/INV/000510'})
        
    }

   
    static getDerivedStateFromProps(props, state){
        let _details = [];
         if((!state.file_upload) && (!state.delete) && props.dn_details && props.dn_details.hasOwnProperty('invDetails') && (!state.render)){
           return {
                invDetails : (props.dn_details && props.dn_details.invDetails) ? props.dn_details.invDetails[0] : [],
                lineItems : (props.dn_details && props.dn_details.lineItems) ? props.dn_details.lineItems : [],
                relatedCreditNotes : (props.dn_details && props.dn_details.relateDebitNotes) ? props.dn_details.relateDebitNotes : [],
                // render :  (this.state.dn_details && this.state.dn_details.lineItems  && this.state.dn_details.lineItems.length > 0) ? true : false,
            }
         }
        
         else if((state.file_upload) && (!state.delete)  && props.upload_document && props.upload_document.displayAttachFile){
            return {
                attachments :  props.upload_document.displayAttachFile.attachFileList
            }
         }
         else if((!state.file_upload) && (state.delete)  && props.file_delete && props.file_delete.displayAttachFile){
            return {
                attachments :  props.file_delete.displayAttachFile.attachFileList
            }
         }
         return null
    }

    componentDidUpdate(){
        if(this.props.dn_details && this.props.dn_details.lineItems && this.props.dn_details.lineItems.length>0 && this.state.render_table_input==false){
            let _temp_details = this.props.dn_details.lineItems;
            if(_temp_details.length){
                let _temp_array = new Array();
                _temp_details.forEach((enumObject, index)=>{
                   _temp_array[index] = {
                        qty : '0.00',
                        unit_price : '0.00',
                        Amount_1 : '0.00',
                        gst_rate : enumObject.ID_GST_RATE,
                        output_tax_code : enumObject.ID_GST_OUTPUT_TAX_CODE,
                        ID_GST : enumObject.ID_GST,
                        ID_RECEIVED_QTY : enumObject.ID_RECEIVED_QTY,
                        ID_UNIT_COST : enumObject.ID_UNIT_COST,
                        Amount : enumObject.Amount,
                        ID_GST_RATE : enumObject.ID_GST_RATE,
                        inv_line_no : enumObject.ID_INVOICE_LINE,
                        line_remark : '',
                        update_gst_amount : 0,
                   }
                })
                if(_temp_array.length){
                    this.setState({
                        table_inputs : _temp_array,
                        render_table_input : true 
                    })
                }
            }
           
       }
    }

    DownloadDocuments  = (nternal_file) =>{
        this.props.GetDownloadFile(nternal_file)
    }

    closeModel (details){
        this.setState({
            show : false,
        })
    }

    SubmitDetails = async() =>{
        let {table_inputs} = this.state;
        let _temp_submit_details = await this.saveItem(table_inputs);
        if(_temp_submit_details){
            let _details ={
                "strBCoyID":  (this.state.invDetails) ? this.state.invDetails.POM_B_COY_ID : '',
                "inv_no":  (this.props.invoice_number) ? this.props.invoice_number : '',
                "strPONo":  (this.state.invDetails) ? this.state.invDetails.POM_PO_NO : '',
                "total": (this.state.invDetails) ? this.state.invDetails.POM_PO_COST : '',
                "decInvTotal": (this.state.invDetails) ? this.state.invDetails.POM_PO_COST : '',
                "GST_Invoice": '',
                "currency": (this.state.invDetails) ? this.state.invDetails.POM_CURRENCY_CODE : '',
                "remark": this.state.remarks,
                "items" : table_inputs
            }
            this.setState({ loading:true})
            let _status = await ApiExtract(GetSubmitDN, _details);
            if(_status){
                this.setState({
                    model:false,
                    loading:false,
                    show:true,
                    modal_title : '',
                    status :_status.status,
                    modal_body : _status.message,
                    do_number : (_status.status && _status.response && _status.response.number) ? _status.response.number : '', 
                })
            }
        }
    }


     FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let internal_file = this.state.internal_file
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":"10",
            "strDocType":"DN",
            "pEnumUploadForm": "0",
            "strDocNo":"",
            "blnTemp":"false",
            "strIndex":"",
            "seq":"",
            "pFrontOfficeSite":"",
            "AttachType":"I",
            "ItemCode":"",
            "LineNo":"",
            "POLine":"",
            "modeType":"New"
        }
       
        if(_file_name == "ApproveDto.internalAttachment" && internal_file){
            req.AttachType = 'I';
            
            this.setState({
                file_upload:true,
                delete:false
            })
            this.props.UploadDocuments(internal_file, req)
            attachment.target.value = "";
        }
        else{
            this.setState({
                status: false,
                modal_body: "Select a file to upload",
                show:true,
            })
        }
       
    }

    DeleteDocuments  = (delete_files) =>{
        let _temp_details = delete_files
        _temp_details.CDA_DOC_TYPE = "CN";
        _temp_details.AttachType = "I";
        _temp_details.modeType = "New";
        _temp_details.CDA_DOC_NO = "";
        this.setState({
            file_upload:false,
            delete:true
        })
        this.props.GetDeleteFile(_temp_details)
    }

    SendUpload = (e) => {
        if(e.target.name=="ApproveDto.internalAttachment"){
            this.setState({
                internal_file : e.target.files[0],
                internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
        else if(e.target.name=="prDto.externalAttachment"){
            if(e.target.files && e.target.files.length){
                this.setState({
                    external_file : e.target.files[0],
                    external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
        }
        else{

        }
    }

    handleTableInputs(details, names, new_details){
        let {table_inputs, lineItems} = this.state;
        let _empty_details = new Array();
        let _new_details = new Array()
        if(names=="line_remark"){
            _empty_details[`${new_details}`] = {
                [names] :  (details.target.value!='') ? details.target.value : ''
            };
        }
        else{
            _empty_details[`${new_details}`] = {
                [names] : (parseFloat(details.target.value) >= 0) ? details.target.value : ''
            };
        }

       
     
        _new_details[`${new_details}`] = Object.assign({}, table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        if(_new_details && _new_details.hasOwnProperty(new_details)){
            let temp_details = _new_details[`${new_details}`]
            temp_details.Amount_1 = parseFloat(round_decimal(((temp_details.qty) ? temp_details.qty : 0) * ((temp_details.unit_price) ? temp_details.unit_price : 0))).toFixed(2)
            temp_details.update_gst_amount = ((temp_details.ID_GST) ? parseFloat(round_decimal(((temp_details.ID_GST/100)*temp_details.Amount_1),2)).toFixed(2) : 0)
            _new_details[`${new_details}`] = temp_details;
        }
        table_inputs[`${new_details}`] = _new_details[`${new_details}`]
        this.setState({
            table_inputs : table_inputs
        })
    }

    saveItem = async (_submit_details) =>{
        let {table_inputs} = this.state;
        let _date_inst = new Date();
        let _result = true;
        if(table_inputs.length){
            await table_inputs.forEach((list_details, index_details)=>{  
                if(!list_details.hasOwnProperty('unit_price') || !list_details.unit_price || list_details.unit_price<=0){
                    this.setState({
                        show:true,
                        modal_title : '',
                        status :false,
                        modal_body : 'Unit Price is Required'
                    })
                    _result = false
                } 
                else if(!list_details.hasOwnProperty('qty') || !list_details.qty || list_details.qty<=0){
                    this.setState({
                        show:true,
                        modal_title : '',
                        status :false,
                        modal_body : 'Quantity is Required'
                    })
                    _result = false
                } 
                else if(!list_details.hasOwnProperty('ID_RECEIVED_QTY') || (list_details.qty>list_details.ID_RECEIVED_QTY)){
                    this.setState({
                        show:true,
                        modal_title : '',
                        status :false,
                        modal_body : `Line ${index_details}. Debit Note Item Qty has exceed invoice item Qty`
                    })
                    _result = false
                } 
            
                else if(!list_details.hasOwnProperty('qty') || !list_details.qty){
                    this.setState({
                        show:true,
                        modal_title : '',
                        status :false,
                        modal_body : 'Quantity is Required'
                    })
                    _result = false
                } 
            })
            return _result;
        }
        else{
            this.setState({
                show:true,
                status :false,
                modal_title : '',
                modal_body : 'Quanity and Unit Price is Required'
            })
            _result = false
        }
    }

    ViewPdf = () =>{
        let {lineItems} = this.state
        let _temp_details = {"DN_NO":(this.state.do_number) ? this.state.do_number:'', "DN_SCoyID":(lineItems && lineItems.length>0) ? lineItems[0].ID_S_COY_ID : '', "DN_BCoyID":(lineItems && lineItems.length>0) ? lineItems[0].IM_B_COY_ID : ''}
        this.props.GetGenerateDEBITPDF(_temp_details)
    }

    render(){
        let _table_data_header = [
            {name : "Item Name", id:"ID_PRODUCT_DESC", width:'100px', key:true},
            {name : "UOM", id:"ID_UOM", width:'50px'},
            {name : "Qty", id:"qty", width:'100px', dataFormat:"cn_input"},
            {name : "Unit Price", id:"unit_price", width:'100px', dataFormat:"cn_input"},
            {name : "Amount	", id:"Amount_1", width:'150px', dataFormat:"cndn_input_disabled"},
            {name : "SST Rate", id:"ID_GST_RATE", width:'85px'},
            {name : "SST Amount", id:"update_gst_amount", width:'110px', dataFormat:"cndn_input_sst_disabled"},
            {name : "SST Tax Code (Supply)", id:"SSTTaxCode", width:'163px', dataFormat:"pricena"},
            {name : "Remarks", id:"line_remark", width:'144px', dataFormat:"cn_textarea"},
        ];

        let _sub_total  = this.state.table_inputs  ? this.state.table_inputs.reduce((a, val) => a += val.qty * val.unit_price, 0).toFixed(2): '0.00';
        let _sub_gst  = this.state.table_inputs  ? this.state.table_inputs.reduce((a, val) => a  += (val.ID_GST) ? (val.qty * val.unit_price) * (val.ID_GST/100) : 0 , 0).toFixed(2) :  '0.00';
        let _total  = (parseFloat(_sub_total)+parseFloat(_sub_gst)).toFixed(2)

        return <Fragment> 
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.file_upload_ld) ? <Loader /> : '' }
                {(this.props.fd_loader) ? <Loader /> : '' }
                {(this.props.fd_loading) ? <Loader /> : '' }
                {(this.props.fr_loading) ? <Loader /> : '' }
                
                {(this.props.debit_pdf_loading) ? <Loader /> : '' }
                {(this.props.dn_loading) ? <Loader /> : '' }
                <form >
            
                    <PageHeading 
                        heading="Raise Debit Note" 
                        subheading="Fill in the relevant info and click the Submit button to submit the debit note to the selected buyer." 
                    />
                    <TabHeading color={'bg-info text-white'}> Debit Note</TabHeading> 
                

                    <div className="row mt-2">
                        <div className="col-md-12">
                            <div className="row" >
                                <div className="col-md-12 col-12 col-lg-2"><label>Debit Note Number :</label></div>
                                <div className="col"><p> {(this.state.do_number) ? this.state.do_number : 'To Be Allocated By System' }</p></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>	Invoice No. :</label></div>
                                <div className="col"><p>{(this.props.invoice_number) ? this.props.invoice_number : ''}</p></div>
                            
                            </div>
                            <div className="row" >
                            
                                <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? TodayDateSalash() : ''}</p></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? TodayDateSalash(this.state.invDetails.POM_SUBMIT_DATE) : ''}</p></div>
                            

                            </div>
                            <div className="row" >
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div className="row">
                                        <div className="col-md-12 col-12 col-lg-4"><label>Bill To : </label></div>
                                        <div className="col">
                                            <p>{(this.state.invDetails) ? <div className="user_address">
                                                {(this.state.invDetails.POM_S_ADDR_LINE1) ?  this.state.invDetails.POM_S_ADDR_LINE1+','+'\n' : ''} 
                                                {(this.state.invDetails.POM_S_ADDR_LINE2) ?  this.state.invDetails.POM_S_ADDR_LINE2+','+'\n' : ''} 
                                                {(this.state.invDetails.POM_S_ADDR_LINE3) ?  this.state.invDetails.POM_S_ADDR_LINE3+','+'\n' : ''} 
                                                {(this.state.invDetails.POM_S_CITY) ?  this.state.invDetails.POM_S_CITY+','+'\n' : ''} 
                                                {(this.state.invDetails.POM_S_POSTCODE) ?  this.state.invDetails.POM_S_POSTCODE+','+'\n' : ''} 
                                                {(this.state.invDetails.POM_S_COUNTRY) ?  this.state.invDetails.POM_S_COUNTRY+'\n' : ''} 
                                            </div> : ''}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div className="row">
                                        <div className="col-md-12 col-12 col-lg-4"><label>Currency  : </label></div>
                                        <div className="col"><p> {(this.state.invDetails) ? this.state.invDetails.POM_CURRENCY_CODE : ''}</p></div>
                                    </div>
                                    <div className="row" >
                                        <div className="col-md-12 col-12 col-lg-4"><label>Invoice Amount : </label></div>
                                        <div className="col"><p> {(this.state.invDetails && this.state.invDetails.IM_INVOICE_TOTAL) ? parseFloat(this.state.invDetails.IM_INVOICE_TOTAL).toFixed(2) : ''}</p></div>
                                    </div>
                                    <div className="row" >
                                        <div className="col-md-12 col-12 col-lg-4"><label>Related Debit Note : </label></div>
                                        <div className="col">{(this.state.relatedCreditNotes && this.state.relatedCreditNotes.length > 0) ? this.state.relatedCreditNotes.map((elem)=> <div onClick={()=>  this.props.GetGenerateDEBITPDF({"DN_NO":elem.DNM_DN_NO, "DN_SCoyID":elem.DNM_DN_S_COY_ID, "DN_BCoyID":elem.DNM_DN_B_COY_ID})} className="invoice_inline">{elem.DNM_DN_NO},</div>):''}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-12 col-lg-4"><label>Total Related Debit Note Amount: </label></div>
                                        <div className="col"><p>{(this.state.relatedCreditNotes && this.state.relatedCreditNotes.length > 0) ?  this.state.relatedCreditNotes.reduce((a, val) => a += (val.DNM_DN_TOTAL), 0).toFixed(2) :''}</p></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 col-12 col-lg-4"><label>Net Amount  : </label></div>
                                        <div className="col"><p> {(this.state.invDetails && this.state.invDetails.IM_INVOICE_TOTAL) ? parseFloat(this.state.invDetails.IM_INVOICE_TOTAL).toFixed(2) : ''}</p></div>
                                    </div>
                                </div>
                                
                            </div>

                        
                            

                            <div className="mt-2 row view_remark">
                            <div className="col-12 " style={{padding:'0px'}}>  
                                <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>this.setState({remarks: e.target.value})}/>
                                <div className="col-12 col-sm-6 ">
                                <div className="row mt-2 ">
                                        <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Internal Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file}/>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 row view_remark">
                            <div className="col-lg-2 col-md-2 col-12">
                                <label>Internal File Attached : </label>
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">
                                <div className="col_details">
                                    {(this.state.attachments && this.state.attachments.length>0) ? this.state.attachments.map((list, index) => {
                                        if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => this.DownloadDocuments(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => this.DeleteDocuments(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }) : 'No files attached'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
                <div className="row">
                    <div className="col-md-12">
                        
                        <BootstrapCustomTable 
                            table_header={_table_data_header} 
                            table_body={this.state.lineItems} 
                            mode={'radio'}
                            select={false} 
                            change={true}
                            getInputs = {this.handleTableInputs}
                            input_values = {this.state.table_inputs}
                            selectname={'pr_no'} 
                            responsive={true} 
                        />
                    </div>
                    <div className="col-md-12 mt-2 mb-2 sub_total_main text-right">
                                <div className="sub_total"> <strong>Sub Total</strong> : <span className="sub_text">{_sub_total}</span></div>
                                <div className="sub_total"> <strong>SST Amount</strong> : <span className="sub_text">{_sub_gst}</span></div>
                        <hr></hr>
                                <div className="sub_total"> <strong>Grand Total</strong> : <span className="sub_text">{_total}</span></div>
                    </div>
                </div>
                <div className="mt-2 mb-5 row">
                    {(!this.state.do_number) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.SubmitDetails()}> Submit</button> </div> : ''}
                    {/* <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" >Reset</button></div> */}
                    {(this.state.do_number) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.ViewPdf()}>View</button></div> : ''}
                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.close()} >Back</button></div>
                </div>
            </form>
         
            <Alert 
                confirm={this.closeModel} 
                title={this.state.title}
                message={this.state.modal_body}
                status={this.state.status}
                show={this.state.show}
            />
            </Fragment>

    }   
}



const mapStateToProps = state => ({
    dn_details : state.dn_details.responseList,
    dn_loading : state.dn_details.loading,

    upload_document : state.upload_document.responseList,
    file_upload_ld : state.upload_document.loading,
  
    fr_loading : state.file_delete.loading,
    file_delete : state.file_delete.responseList,
  
    file_download: state.file_download.responseList,
    fd_loader: state.file_download.loading,

    debit_pdf : state.generate_debit_pdf,
    debit_pdf_loading : state.generate_debit_pdf.loading,
  
  })
  
  const mapDispatchToProps = dispatch => ({
    GetDNDetails: (values) => dispatch(GetDNDetails(values)),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetGenerateDEBITPDF  : (values) => dispatch(GetGenerateDEBITPDF(values)),
    EmptyCNDN : () => dispatch(GetEmptyCNDN()),
})
  
const DebitViewMain = connect(mapStateToProps, mapDispatchToProps)(DebitView);
let DebitViewHolder = reduxForm({
    form: 'ConverPRListing'
})(DebitViewMain)
export default DebitViewHolder

