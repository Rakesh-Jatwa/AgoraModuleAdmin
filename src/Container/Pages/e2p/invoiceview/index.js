import React, {Component, Fragment} from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {reduxForm } from 'redux-form';
import {UserDetails} from '../../../../Common/LocalStorage'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStaticApprover'
import BootstrapCustomTableModel from '../../../../Component/Table/BootstrapCustomTablePr'
import Loader from '../../../../Component/Loader'
import {FromateDate,TodayDateSalash, DateTimeMinusTime} from '../../../../Component/Dates'
import {connect} from 'react-redux';
import ViewAudit from '../../../ViewAudit'
import {GetDownloadFile} from '../../../../Actions/Vendor'
import {ApiExtract} from '../../../../Common/GetDatas'
import {holdInvoice} from '../../../../Apis/RequesterServices'
import {E2PApprovalSubmit, E2PApprovalReject, InvoiceTrackingSave} from '../../../../Apis/Approver'
import {GetInvoiceHeader, GetInvoicePDF, UploadDocuments } from '../../../../Actions/Requester'
import {GetE2PApprovalDetails,  } from '../../../../Actions/Approver'
import Alert from '../../../../Component/Modal/alert'
import {HandlePayment, HandleStatus, NumberFormateEmpty, HandleDocType, HandleCategoryType, CheckFileDetails} from '../../../../Actions/Common/Functions'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {FromUplodsParallel} from '../../../../Component/From/FromInputs'
import {GetDeleteFile} from '../../../../Actions/Vendor'
import {FundTypeOrPersonCodeORProjectCodeAction, DeliveryAddressAction, CostCentreCodeAction, SegmentationAction, GetSearchPRCancelList, GetPurchaseRequestItemsDetails, GetFFRaisePOScreen} from '../../../../Actions/Requester'
import {GetE2PPopTaxCode, GetE2PWithHoldingTax, GetE2PPayFor} from '../../../../Actions/Approver'
import BootstrapCustomTableAlter from '../../../../Component/Table/e2ptable'
import Modal from '../../../../Component/Modal'
import {E2PSaveDocItemDetials, E2PsearchVendor} from '../../../../Apis/Approver'
import TotalGrid from '../../../../Component/Table/TotalGridHorizontal'
import TotalGridSub from '../../../../Component/Table/TotalGrid'

class InvoiceViewDetails extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_pdf = this.view_pdf.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.FileUpload = this.FileUpload.bind(this)
        this.handlePopup = this.handlePopup.bind(this)
        this.handleformsubmit = this.handleformsubmit.bind(this)
        this.getSelectedProduct = this.getSelectedProduct.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.closeDocument  = this.closeDocument.bind(this)
    this.SelecthandleChange = this.SelecthandleChange.bind(this)
        this.state = {
            products:[],
            start_data:'',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            files:[],
            remarks:'',
            file_name:'',
            checked_initial : [0,1,2],
            checked_details:[],
            status:true,
            loading:false,
            file_upload:false,
            delete:false,
            attachments : [],
            type:'save',
            show_status : true ,
            reject_reason : 'PSDDate',
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            rerenderd :true,
            loaded_details : {},
            table_model_body : [],
            table_model_header : [],
            table_body : [],
            datas:[],
            show_save: false,
            active_key:'PurchaseOrder'
            
        }
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(prevState.file_upload && (!prevState.delete) && nextProps.fileupload && nextProps.fileupload.displayAttachFile ){
            return {
                attachments : nextProps.fileupload.displayAttachFile
            }
        }
        else if((!prevState.file_upload) && (prevState.delete) && nextProps.file_delete && nextProps.file_delete.displayAttachFile){
            return {
                attachments : nextProps.file_delete.displayAttachFile
            }
        }
        else{
            return {
                attachments : []
            }
        }
        return null
    }

    componentDidMount(){
        let _user_details = UserDetails()
        if(_user_details && _user_details.ROLE_NAME){
            let _role = (_user_details.ROLE_NAME).trim()
            if(_role.includes('Manager') || _role.includes('MANAGER')){
                this.setState({
                    show_status: false,
                })
            }
        }
        var _details = this.props.location.datas
        this.setState({
            products: _details,
        })

        if(this.props.location.datas){
            this.props.GetE2PApprovalDetails({"docno": this.props.location.datas.IM_INVOICE_NO, "index": this.props.location.datas.IM_INVOICE_INDEX, compid: _user_details.UM_COY_ID,"frm":"IPPAO"})
            localStorage.setItem('set_inv',JSON.stringify({"docno": this.props.location.datas.IM_INVOICE_NO, "index": this.props.location.datas.IM_INVOICE_INDEX, compid:  _user_details.UM_COY_ID,"frm":"IPPAO"}))
            localStorage.setItem('set_inv_prev',JSON.stringify(this.props.location.datas))
            window.location.reload()
        }
        else if(localStorage.getItem('set_inv')){
            let _temp_details = JSON.parse(localStorage.getItem('set_inv'));
            if(localStorage.getItem('set_inv_prev')){
                this.setState({
                    products: JSON.parse(localStorage.getItem('set_inv_prev'))
                })
            }
            this.props.GetE2PApprovalDetails(_temp_details)

           
           
        }

        this.props.change('e2psearch.CurrencyCode', 'MYR')
        this.props.FundTypeOrPersonCode({ type: "L1" })
        this.props.FundTypeOrPersonCode({ type: "L2" })
        this.props.FundTypeOrPersonCode({ type: "L3" })
        this.props.FundTypeOrPersonCode({ type: "L4" })
        this.props.FundTypeOrPersonCode({ type: "L5" })
        this.props.FundTypeOrPersonCode({ type: "L8" })
        this.props.FundTypeOrPersonCode({ type: "L9" })
        
        this.props.DeliveryAddress()
        this.props.CostCentreCode()
        this.props.SegmentationAction()
        this.props.cl_code_access()
        this.props.GetE2PPopTaxCode()
        this.props.GetE2PWithHoldingTax()
        this.props.GetE2PPayFor()
        this.props.change('e2psearch.TotalAmount','0.00')
    }

    confirm_function = (type, text) => {
        
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })

    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="submit"){
            this.submitToRequesterInvoiceVerify()
        }
        else if(_confimation_type=="reject"){
            this.rejectInvoice()
        }
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
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

   

    getTextBoxValues=(e) => {
        this.setState({
            remarks:e.target.value
        })
    }

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="ApproveDto.internalAttachment"){
                this.setState({
                    internal_file : e.target.files[0],
                    internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else if(e.target.name=="ApproveDto.externalAttachment"){
                this.setState({
                    external_file : e.target.files[0],
                    external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }
            else{

            }
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body:_details.message,
            })
        }
    }

    deleteFile(filePath, attachType){
        filePath.AttachType = attachType;
        filePath.modeType = "New";
        this.props.GetDeleteFile(filePath)
    }

   
    SaveInvoice = async() =>{
        if(this.state.products && this.state.products.IM_INVOICE_INDEX){
          
            let requestData = {
                "intInvoiceIndex":this.state.products.IM_INVOICE_INDEX,
                "strAORemark": (this.state.remarks) ? this.state.remarks : '',
            }
            console.log('requestData', requestData)
            let _update_details = [];
            this.setState({loading:true})
            _update_details.push(requestData)
            console.log('_update_details', _update_details)
            let _status = await ApiExtract(InvoiceTrackingSave, {invoiceData : _update_details})
            if(_status){
                localStorage.removeItem('set_inv')
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    type:'verify'
                })
            }
        }
      
    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_popup : false,
            open:false,
            custom_modal_popup : false,
            table_modal_popup : false,
            invoiceIndex : false,
        })
        if(this.state.status && this.state.type=="verify"){
            this.props.history.push({pathname : '/RequesterInvoiceManagement'})
        }
    }

    get_details(details){
        this.props.history.push({
            pathname : '/approvepr',
            datas : details.datas,
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

    submit_invoice(values_details){
        let {getUnInvoiceGRNLine, poMstrDetails} = this.props.search_list;
        let _stored_details = this.state.products
        if(getUnInvoiceGRNLine && poMstrDetails && _stored_details && values_details.Vendorinvoiceno){
            let reqData = [{
                "doc": _stored_details.POM_PO_NO + "," + _stored_details.DO_Number + "," + _stored_details.GRN_Number,//POM_PO_NO,GRN Number,DO Number
                "ref": values_details.Vendorinvoiceno, 
                "remark": this.state.remarks,
                "amount": getUnInvoiceGRNLine.reduce((a, val) => a += (val.QTY * val.POD_UNIT_COST) + val.POD_TAX_VALUE, 0),
                "b_com_id": _stored_details.CM_COY_ID,
                "inv_status": "1",
                "bill_meth": _stored_details.POM_BILLING_METHOD,
                "po_no": _stored_details.POM_PO_NO,
                "grn_no": _stored_details.GRN_Number,
                "do_no": _stored_details.DO_Number,
                "pay_day": _stored_details.PAY_DAY,
                "tax": "0",
                "ShipAmt": _stored_details.BALSHIP,
                "pom_po_index": _stored_details.POM_PO_INDEX,
                "do_date": ""
            }];
            this.props.GetInvoiceSubmit(reqData)
        
        }
        else{
            this.setState({
                model:true,
                modal_body :'Please Fill Mandatory Feild'
            })
        }

            
        
    }

    view_pdf = () =>{
        this.props.ViewGRNPDF(this.state.products)
    }


     submitToRequesterInvoiceVerify = async(event) => {
        let requestData = {
            "strIPPDocIdx":this.state.products.IM_INVOICE_INDEX,
            "strRemark":this.state.remarks,
            "paymentmethod":this.state.products.POM_PAYMENT_METHOD,
            "paymentAmount":this.state.products.IM_INVOICE_TOTAL,
            "currentStatus":this.state.products.IM_INVOICE_STATUS,
            "approvalType" : 'single',
            "frm":"IPPFO",
            "strAction":"approve",
        }
        this.setState({loading:true})
        let _status = await ApiExtract(E2PApprovalSubmit, requestData)
        if(_status){
            localStorage.removeItem('set_inv')
            localStorage.removeItem('set_inv_prev')
            this.setState({
                status: _status.status,
                model:true,
                modal_body: _status.message,
                loading:false,
                type:'verify'
            })
        }
    }

    rejectInvoice = async() => {

        if(this.state.remarks){
            let requestData = {
                "strIPPDocIdx":this.state.products.IM_INVOICE_INDEX,
                "strRemark": this.state.remarks,
                "strRouteTo": this.state.reject_reason,
                "frm":"IPPFO",
            }

            
            this.setState({loading:true})
            let _status = await ApiExtract(E2PApprovalReject, requestData)
            if(_status){
                localStorage.removeItem('set_inv')
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    type:'verify'
                })
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Enter Remarks to reject this invoice",
                loading:false,
                type:'verify'
            })
        }
        
    }

     HoldInvoice  = async() =>{
        if(this.state.remarks){
            let requestData = {
                "lblInvNo": this.state.products.IM_INVOICE_NO,
                "vendorId": this.state.products.CDM_S_COY_ID,
                "txtRemark": this.state.remarks,
                "aryPTaxCode": [],
                "aryFundType": [],
                "folder": "N",
                "invoiceIndex": this.state.products.IM_INVOICE_INDEX
            }

            this.setState({loading:true})
            let _status = await ApiExtract(holdInvoice, requestData)
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    type:'hold'
                })
            }
            
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'Please Enter Remarks',
            })
        }
    }

    setInvoiceIndex = (invoice_index, docno, statusno) =>{
        this.setState({
            invoiceIndex : invoice_index,
            docno : docno,
            statusno : statusno
        })
    }



    viewInvoicePDF = () => {
        let inputData = { 'IM_INVOICE_NO': this.state.products.IM_INVOICE_NO, 'POM_B_COY_ID': this.props.search_list.documentDetails[0].POM_B_COY_ID, 'POM_S_COY_ID': this.props.search_list.documentDetails[0].POM_S_COY_ID }
        console.log('inputData', inputData)
        this.props.GetInvoicePDF(inputData)
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

    closeModel (details){
        this.setState({
            model : false,
            addmodel : false,
            validation:false,
            custom_modal_popup : false,
            table_modal_popup : false,
            invoiceIndex : false
        })
        if(this.state.InvIdx){
            // window.location.reload()
        }
    }

    FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":"8",
            "strDocType": "IPP",
            "pEnumUploadForm": "0",
            "strDocNo":(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails.length > 0) ? this.props.search_list.documentDetails[0].IM_INVOICE_NO  : '',
            "blnTemp": "false",
            "strIndex":"",
            "seq":"",
            "pFrontOfficeSite":"",
            "AttachType":"I",
            "ItemCode":"",
            "LineNo":"",
            "POLine":"",
            "modeType": (this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails.length > 0) ? "Mod" : "New",
            "frm": "IPPAO",
        }
        if(_file_name == "ApproveDto.internalAttachment" && this.state.internal_file){
            req.AttachType = 'I';
            this.props.UploadDocuments(this.state.internal_file, req)
            this.setState({
                file_upload : true,
                delete : false
            })
            attachment.target.value = "";
                
        }
        else{
            this.setState({
                modal_body : 'Select a file to upload',
                status : false,
                model : true,
            })
        }
    }

    delete_alter = (alter_details) =>{
        let _temp_details = {
             strFile: alter_details.ATTACH_FILENAME,
             strFile1: alter_details.HUB_FILENAME,
             pEnumDownloadType: 6,
             Text: alter_details.UA_FILESIZE+'KB',
             ID: alter_details.ATTACH_INDEX,
             CDA_DOC_TYPE: "IPP"
        }
       this.props.GetDownloadFile(_temp_details)
    }

    download_files = (_temp_details) =>{
        this.props.GetDownloadFile(_temp_details)
    }

    handleReject = (details, checked) =>{
        this.setState({
            reject_reason : details.target.value
        })
        
    }

    async SelecthandleChange  (name, e){
        let _table_body = this.state.table_body
        let  _details  = e.target.name;
        let  _value  = e.target.value;
        if(_details && _value){
            let _details_name =  _details.split('.')
            let _id  = _details_name[1]
            let  _qty_input = _details_name[3];
            if(_qty_input=='ID_PAY_FOR'){
                _table_body[name].ID_PAY_FOR = _value
            }

            if(_qty_input=='ID_GST_REIMB'){
                _table_body[name].ID_GST_REIMB = _value
            }

            if(_qty_input == "ID_GST_INPUT_TAX_CODE"){
                _table_body[name].ID_GST_INPUT_TAX_CODE = _value
            }

            if(_qty_input == "ID_CATEGORY"){
                _table_body[name].ID_CATEGORY = _value
            }

        }
        this.setState({
            show_submit_button : false,
            table_body : _table_body,
            show_save : true,
        })

    }

    select_function_inex(dates){
        let _selected_items = this.state.slected_items;
        let _target_value = dates.target.value;
        if(_target_value!='' && dates.target.checked){
            if(_target_value){
                _target_value = _target_value.split('.');
                if(_target_value.length){
                    _target_value = _target_value[0]
                }
            }
            if(!_selected_items.includes(_target_value)){
                _selected_items.push(_target_value)
                this.setState({
                    slected_items : _selected_items
                })
            }
           
        }
        else{
            if(_target_value){
                _target_value = _target_value.split('.');
                if(_target_value.length){
                    _target_value = _target_value[0]
                }
            }
            let slected_items = this.state.slected_items.filter((fieldValue, index) => fieldValue != _target_value);
            this.setState({
                slected_items : slected_items
           })
        }

       
    }

    delete_function = (details) =>{
        if(details){
            let {table_body} = this.state
            let _temp_details = ''
            _temp_details = table_body.map((list_details, index)=>{
                if(list_details.ID_INVOICE_LINE == details.ID_INVOICE_LINE){
                    list_details.removed=0
                    return list_details
                }
                return list_details
            })

            console.log('_temp_details', _temp_details)
            if(_temp_details && _temp_details.length){
                this.setState({
                    table_body :  _temp_details
                })
            }
            
        }
        console.log('delete_function', details)
    }

    getProducts (values, details){
        let _all_products = this.state.products;
        if(details){
            let _all_products = this.state.products;
            if(values.hasOwnProperty('itemcode')){
                _all_products.push(values.itemcode)
                this.setState({
                    products : _all_products
                })
            }
        }
        else{
             let products = this.state.products.filter((fieldValue, index) => fieldValue !== values.CDI_PRODUCT_CODE);
             this.setState({
                products : products
            })
        }
    }

     saveDocument =  async() => {
        if(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) {
            let _values = {}
            let {table_body} = this.state
            let TotalAmtNoGST = this.state.table_body.reduce((a, val) => a += parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST), 0).toFixed(2)
            let GSTAmt = this.state.table_body.reduce((a, val) => a += parseFloat(val.ID_GST_VALUE), 0)
            if(this.props.search_list.documentDetails[0].IM_INVOICE_EXCL_GST == TotalAmtNoGST){
                if(this.props.search_list.documentDetails[0].IM_INVOICE_GST == GSTAmt){
                    _values.DocNo =  this.props.search_list.documentDetails[0].IM_INVOICE_NO
                    _values.oldDocNo = this.props.search_list.documentDetails[0].IM_INVOICE_NO
                    _values.OldDocNo = this.props.search_list.documentDetails[0].IM_INVOICE_NO
                    _values.DocType = this.props.search_list.documentDetails[0].IM_INVOICE_TYPE
                    _values.VenCompIDX = ""
                    _values.VendorName = this.props.search_list.documentDetails[0].IM_S_COY_NAME
                    _values.mode = 'edit'
                    _values.frm = 'IPPAO'
                    _values.MasterDoc = ""
                    _values.TotalAmtNoGST = (this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += val.ID_RECEIVED_QTY * val.ID_UNIT_COST, 0).toFixed(2): 0.00
                    _values.GSTAmt = (this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += val.ID_GST_VALUE, 0).toFixed(2): 0.00
                    _values.items = table_body
               
                    if(table_body && table_body.length){
                        let _temp_submit_details = await this.saveItem(table_body)
                        if(_temp_submit_details){
                            this.setState({
                                loading:true,
                            })
                            let _status =  await ApiExtract(E2PSaveDocItemDetials, _values)
                            if(_status){
                                this.setState({
                                    show_submit_button : true, 
                                    status: _status.status,
                                    model:true,
                                    modal_body:_status.message,
                                    loading:false,
                                    show_save:false
                                })
                            }
                        }
                        else{
                            this.setState({
                                loading:false,
                            })
                        }
                    }
                    else{
                        this.setState({
                            status: false,
                            model:true,
                            modal_body: 'Select an item to create request ' ,
                            loading:false,
                        })
                    }
                }
                else{
                    this.setState({
                        status: false,
                        model:true,
                        modal_body: 'Invalid SST Amount' ,
                        loading:false,
                    })
                }
            }
            else{
                this.setState({
                    status: false,
                    model:true,
                    modal_body: 'Invalid Total Amount (excl. SST)' ,
                    loading:false,
                })
            }
            
        }
    }

    closeDocument = () =>{
    
        this.setState({
            show_save : false,
            rerenderd : true,
        })
       
        window.location.reload()
    }

    saveItem = async (_submit_details) =>{
        let {table_body} = this.state;
        let _result = true;
      
        if(table_body.length){
            await table_body.forEach((list_details)=>{   
                if(!list_details.hasOwnProperty('ID_PRODUCT_DESC') || !list_details.ID_PRODUCT_DESC){
                    this.setState({
                        model:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Enter Transaction Description'
                    })
                    _result = false
                }
                else if(!list_details.hasOwnProperty('ID_B_GL_CODE') || !list_details.ID_B_GL_CODE){
                    this.setState({
                        model:true,
                        modal_title : 'Validation',
                        modal_body : 'Please Select Valid GL Code'
                    })
                    _result = false
                }
            })
            return  _result;
        }
        else{
            return false
        }
    
    }


    handlePopup(input,details){

        let _get_all_state = this.state;
        let _target_id = input.target.getAttribute('data-name');
        let _target_name = input.target.getAttribute('data-details');
        let _details = {
            model : true ,
            custom_modal_popup : false,
            table_display :true,
            current_model : _target_name,
            current_id : _target_id,
            table_model_header : [],
            table_model_body : []
        }


        if(_target_name=="analysis1"){
            _details.table_model_header = [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ];
             _details.table_model_body = this.props.fund_type_project_code_l1;
             _details.fund_transfer_l1 = [_target_id]
             _details.modal_title = "Fund Type (L1)"

        }
        else if(_target_name=="deliveryAddress"){
            _details.table_model_header = [
                {name : "Code", id:"AM_ADDR_CODE", key:true},
                {name : "Address", id:"AM_ADDR_LINE1"},
                {name : "City", id:"AM_CITY"},
                {name : "State", id:"STATE"},
                {name : "Post Code", id:"AM_POSTCODE"},
                {name : "Country", id:"AM_COUNTRY"},
            ];
             _details.table_model_body = this.props.delivery_address;
             _details.da = [_target_id]
             _details.modal_title = "Delivery Address"
        }

        
        else if(_target_name=="analysis2"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l2;
            _details.modal_title = "Product Type"
        }

        else if(_target_name=="analysis3"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l3;
            _details.modal_title = "Channel"
        }

        else if(_target_name=="analysis4"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l4;
            _details.modal_title = " Reinsurance Company (L4)"
         
        }

        else if(_target_name=="analysis5"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l5;
            _details.modal_title = "Asset Fund (L5)"
        }

        else if(_target_name=="analysis7" || _target_name=="ID_COST_CENTER_2"){
            _details.table_model_header = [
                {name : "Budget Account Code", id:"AM_ACCT_CODE", key:true},
                {name : "Budget Account", id:"AM_ACCT_DESC"},
            ];
            _details.table_model_body = this.props.cost_centre_code;
            _details.modal_title = "Cost Centre Code (L7)"
        }

        else if(_target_name=="analysis9"){
            _details.table_model_header = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body = this.props.fund_type_project_code_l9
            _details.modal_title = "Person Code (L9)"
        }

        

        else if(_target_name=="analysis8"){
            _details.table_model_header  = [
                {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                {name : "Code", id:"AC_ANALYSIS_CODE"},
            ];
            _details.table_model_body =this.props.fund_type_project_code_l8
            _details.modal_title = "Project / ACR (L8) Code"
        }

        else if(_target_name=="GLDESCRIPTION" || _target_name=="ID_B_GL_CODE_CONCAT"){
            _details.table_model_header  = [
                {name : "Description", id:"GLCODE", key:true},
                {name : "Code", id:"DESCRIPTION"},
            ];
            _details.table_model_body = (this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode) ? this.props.gl_code.FFRaisePO.dsGLCode : []
            _details.modal_title = "Select GL Code"
        }

        else if(_target_name=="ID_WITHHOLDING_TAX"){
            _details.model  = false
            _details.custom_modal_popup = true
        }



        let _main_details = Object.assign({}, _get_all_state, _details)
        console.log('_main_details', _main_details)
        this.setState({
            table_modal_popup : _main_details.model,
            custom_modal_popup : _main_details.custom_modal_popup,
            custom_modal_type: _main_details.current_id,
            table_display : _main_details.table_display,
            current_model :  _main_details.current_model,
            current_id :  _main_details.current_id,
            table_model_header :  _main_details.table_model_header,
            table_model_body :  _main_details.table_model_body,
            show_save : true,
            ccc :  _main_details.ccc,
            da :  _main_details.da,
            modal_body:'',
            modal_title : _main_details.modal_title

        })
    }

    updateWithholdData = (_details) =>{
        let {table_body} = this.state
        if(table_body && table_body.length){
            if(this.state.custom_modal_type=="All"){
                table_body.forEach((list_details, index)=>{
                    table_body[index].ID_WITHHOLDING_TAX =  this.state.custim_model_text_value
                    table_body[index].ID_WITHHOLDING_OPT =  this.state.custim_model_check_box
                    table_body[index].ID_WITHHOLDING_REMARKS = this.state.custim_model_taxtarea_value
                })
            }
            else{
                table_body.forEach((list_details, index)=>{
                    if(index==this.state.custom_modal_type){
                        table_body[index].ID_WITHHOLDING_TAX =  this.state.custim_model_text_value
                        table_body[index].ID_WITHHOLDING_OPT =  this.state.custim_model_check_box
                        table_body[index].ID_WITHHOLDING_REMARKS = this.state.custim_model_taxtarea_value
                    }
                })
            }
            
            this.setState({
                table_body : table_body,
                custim_model_check_box : '',
                custim_model_text_value : '',
                custim_model_taxtarea_value : '',
                custom_modal_popup : false
            })
        }
    }

    getSelectedProduct(e, details, selected){
        let {current_id, current_model, table_body} = this.state;
       
      
        if(current_id!='' && current_model && table_body[current_id]){
            let _details =  Object.assign({},table_body[current_id],  e)
            table_body[current_id] = _details;
            if(current_model=="analysis1"){
                table_body[current_id][current_model] = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE1= e.AC_ANALYSIS_CODE
                table_body[current_id].FUNDTYPE = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis1 = e.AC_ANALYSIS_CODE_DESC
            }
            else if(current_model=="deliveryAddress"){
                table_body[current_id][current_model] = e.AM_ADDR_LINE1
                table_body[current_id].DeliveryAddr= e.AM_ADDR_CODE
            }
            else if(current_model=="analysis7" || current_model=="ID_COST_CENTER_2"){
                table_body[current_id][current_model] = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE
                table_body[current_id].prdAcctIndex = e.AM_ACCT_INDEX;
                table_body[current_id].ID_ANALYSIS_CODE7 = e.CDM_DEPT_CODE;
                table_body[current_id].costCentre = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                table_body[current_id].ID_COST_CENTER_2 = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                table_body[current_id].ID_COST_CENTER  = e.AM_ACCT_CODE
                table_body[current_id].ID_COST_CENTER_DESC  = e.AM_ACCT_DESC
                table_body[current_id].analysis7  = e.CDM_DEPT_CODE+'-'+e.AM_ACCT_DESC+':'+e.AM_ACCT_CODE;
                
            }
            
          
            else if(current_model=="GLDESCRIPTION" || current_model=="ID_B_GL_CODE_CONCAT"){
                table_body[current_id][current_model] =e.DESCRIPTION
                table_body[current_id].GLDESCRIPTION = e.DESCRIPTION;
                table_body[current_id].ID_B_GL_CODE_CONCAT = e.DESCRIPTION;
                table_body[current_id].ID_B_GL_CODE = e.GLCODE;
            }

            

            else if(current_model=="analysis2"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE2 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PRODUCTTYPE = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis2 = e.AC_ANALYSIS_CODE_DESC
                
            }
            else if(current_model=="analysis3"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE3 = e.AC_ANALYSIS_CODE 
                table_body[current_id].CHANNEL = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis3 = e.AC_ANALYSIS_CODE_DESC
                
            }

            else if(current_model=="analysis4"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE4 = e.AC_ANALYSIS_CODE 
                table_body[current_id].REINSURANCECOMPANY = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis4 = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="analysis5"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE5 = e.AC_ANALYSIS_CODE 
                table_body[current_id].ASSETFUND = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis5 = e.AC_ANALYSIS_CODE_DESC
                
            }

            else if(current_model=="analysis8"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE8 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PROJECTCODEDESC = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].analysis8 = e.AC_ANALYSIS_CODE_DESC
            }

            else if(current_model=="analysis9"){
                table_body[current_id][current_model]  = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].ID_ANALYSIS_CODE9 = e.AC_ANALYSIS_CODE 
                table_body[current_id].PERSONCODEDESC = e.AC_ANALYSIS_CODE_DESC
                table_body[current_id].PERSONCODE = e.AC_ANALYSIS_CODE;
                table_body[current_id].analysis9 = e.AC_ANALYSIS_CODE_DESC
            }
            
        }

        this.setState({
            table_body: table_body,
            table_modal_popup : false,
            show_submit_button : false,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : '',
            show_save : true,
        })
    }  
    

    handleformsubmit(values){
        var _submit_dtata = [];
        let _table_body_filter ='';
        let {table_body, datas} = this.state;
        datas.forEach((list)=>{
             _table_body_filter = table_body.filter((table_body_item)=>{
                return table_body_item.line==list
             })
             _submit_dtata.push(_table_body_filter[0]);
         })
     }

     handleChange  (event){
         
        let  _details  = event.target.name;
        let _name = event.target.getAttribute("data-id");
        let _data = this.state.datas;
        let id = event.target.getAttribute("data-inputname");
        let _qty_input = '';

       
        if(_details){
            let _details_name =  _details.split('.')
            _name = _details_name[1]
            _qty_input = _details_name[3];
        }

        console.log('event.target.value', _name, _qty_input)

        let table_body = this.state.table_body;
        table_body.filter((table_element, index) => { 
            return index == _name
        }).forEach((table_element_value) => {
            if(_data.indexOf(_name)<0){
                _data.push(_name)
            }
            if(_qty_input == "ID_GST"){
                table_element_value['AMOUNT']  =  (event.target.value) ? parseFloat(table_element_value['QUANTITY']) * parseFloat(table_element_value['UNITCOST']) : 0
                table_element_value['QUANTITY'] = (event.target.value) ? parseInt(event.target.value)  : 0
                table_element_value[id] = event.target.value
            }

            if(_qty_input == "UNITCOST"){
                table_element_value['AMOUNT']  =    (event.target.value) ? parseFloat(table_element_value['QUANTITY']) * parseFloat(table_element_value['UNITCOST']) : 0
                table_element_value['UNITCOST']  =  (event.target.value) ? parseInt(event.target.value)  : 0
                table_element_value[id] = event.target.value
            }
            
            if(_qty_input == "PRODUCTDESC"){
                table_element_value['PRODUCTDESC'] = (event.target.value) ? event.target.value : ''
                table_element_value[id] = event.target.value
            }

            if(_qty_input == "ID_PRODUCT_DESC"){
                table_element_value['ID_PRODUCT_DESC'] = (event.target.value) ? event.target.value : ''
                table_element_value[id] = event.target.value
            }
            
            if(_qty_input == "Remarks"){
                table_element_value['Remarks'] = event.target.value
            }

            if(_qty_input == "ID_GST_VALUE"){
                table_element_value['ID_GST_VALUE'] = (event.target.value) ? parseFloat(event.target.value) : 0
            }

            if(_qty_input == "ID_UNIT_COST"){
                table_element_value['ID_UNIT_COST'] = event.target.value
            }

            if(_qty_input == "ID_UNIT_COST_1"){
                table_element_value['ID_UNIT_COST_1'] = event.target.value
                table_element_value['ID_UNIT_COST'] = event.target.value
                let {documentDetails} = this.props.search_list
                let _exchange_rate = (documentDetails) ? documentDetails.exchangeRate : '0.00'
              
              
                if(documentDetails && documentDetails.length > 0 ){
                   _exchange_rate = Math.round((documentDetails[0].exchangeRate) * 10) / 10;
                   let _sub_det =  (event.target.value+table_element_value['ID_GST_VALUE']) * _exchange_rate
                   if(_sub_det){
                        _sub_det = parseFloat(_sub_det).toFixed(2)
                        table_element_value['exchange_rate'] = _sub_det
                   }
                    
                }
               

            }

            if(_qty_input == "WarrantyTerms"){
                table_element_value['WarrantyTerms'] = event.target.value
            }
            if(_qty_input == "GIFT"){
                table_element_value['GIFT'] = event.target.value
            }
            if(_qty_input == "Segmentation"){
                table_element_value['Segmentation'] = event.target.value
            }
            if(table_element_value[id]){
                table_element_value[id] =  event.target.value
            }
           
        })


        let _total_amount = 0;
        let _sst_amount = 0;
        let _sub_amount =0 ;
        let _total =0 ;
        table_body.forEach((_datas,index)=>{
            _sub_amount = 0
            _sst_amount = parseFloat(_datas.ID_GST_VALUE) 
            _total_amount += parseFloat(_datas.ID_UNIT_COST)
            _total += parseFloat(_datas.ID_UNIT_COST) * parseFloat(_datas.ID_GST_VALUE) 
            table_body[index].PRODUCTCODE = index;
            table_body[index].POD_ASSET_NO = "";
            table_body[index].POD_ASSET_GROUP = "";
            table_body[index].ProductType = "";
            table_body[index].GSTRATE = 0
            table_body[index].AMOUNT = parseFloat(_datas['QUANTITY']) * parseFloat(_datas['UNITCOST']) 
            
        })

        this.setState({
            table_body:table_body,
            datas:_data,
            sub_amount : _sst_amount,
            total_amount : _total_amount,
            total : _total,
            sst_amount : _sst_amount,
            show_submit_button : false,
            show_save:true
        })

       

        return event.target.value;
    }


    


    componentDidUpdate(){
        let _temp_details = {}
        if(this.state.rerenderd && this.props.gl_code && this.props.gl_code.FFRaisePO && this.props.gl_code.FFRaisePO.dsGLCode ){
          
         

            let {documentDetails, lineItem, approverDetails, displayAttachFile, docAttachment} = this.props.search_list
            let _user_details = UserDetails();
            _user_details.UM_USER_NAME = _user_details.UM_USER_NAME.trim();
            let _remarks = '';
            let _exchange_rate = 0;
            approverDetails.forEach((list_details, index)=>{
                if(list_details.AO_NAME == _user_details.UM_USER_NAME || _user_details.UM_USER_NAME==list_details.AAO_NAME){
                    _remarks = list_details.FA_AO_REMARK
                }
            })
            
            

          

            if(documentDetails && documentDetails.length){
                documentDetails  = documentDetails[0]

                let _doc_type = '';
                if(documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='INV'){
                    _doc_type = "Invoice"
                }
                else if(documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='CN'){
                    _doc_type = "Credit Note"
                }
                else if (documentDetails.IM_INVOICE_TYPE && documentDetails.IM_INVOICE_TYPE=='DN'){
                    _doc_type = "Debit Note" 
                }
                else {
                    _doc_type = "Bill"
                }
                _temp_details = {
                    "DocType": _doc_type, 
                    "DocNo": documentDetails.IM_INVOICE_NO,
                    "InvIdx": documentDetails.IM_INVOICE_INDEX,
                    "OldDocNo": documentDetails.IM_INVOICE_INDEX,
                    "DocDate": TodayDateSalash(documentDetails.IM_DOC_DATE),
                    "lateReason":  documentDetails.IM_DOC_DATE,
                    "ManualPONo": "",
                    "VendorName": documentDetails.IM_S_COY_ID,
                    "VendorNameMain" : documentDetails.IM_S_COY_NAME,
                    "VenCompIDX":  documentDetails.IM_S_COY_ID,

                    "CurrencyCode":  documentDetails.IM_CURRENCY_CODE,
                    "PaymentAmt":  documentDetails.IM_INVOICE_TOTAL,
                    "PaymentMethod":  documentDetails.IM_CURRENCY_CODE,
                    "WHT": "",
                    "WHTOpt": "",
                    "NoWHTReason": "",
                    "InternalRemark":documentDetails.IM_REMARK,
                    "ExchangeRate": documentDetails.IM_EXCHANGE_RATE,
                    "OldVenCompIDX": documentDetails.IM_S_COY_ID,
                    "BankCode" : documentDetails.im_bank_code,
                    "BankAccount" : documentDetails.im_bank_acct,
                    "DocDueDate": documentDetails.IM_DUE_DATE,
                    "PRCSSentDate": documentDetails.IM_PRCS_SENT,
                    "PRCSReceivedDate": documentDetails.IM_PRCS_SENT_UPD_DATE,
                    "BeneficiaryDetails": "",
                    "MasterDocument": "",
                    "CompanyCategory":documentDetails.IM_COMPANY_CATEGORY,
                    "ResidentType": documentDetails.IM_RESIDENT_TYPE,
                    "EmpId": "",
                    "TotalAmtNoGST": documentDetails.IM_INVOICE_EXCL_GST,
                    "GSTAmt": documentDetails.IM_INVOICE_GST,
                    "btnType": "save",
                    "status": "",
                    "GSTTotalIM1IM3": "",
                    "itemTotalAmt":  documentDetails.IM_INVOICE_TOTAL,
                    "isResident": documentDetails.IM_RESIDENT_TYPE,
                    "lblDocDueDate": "",
                    "rbtnCoyTypeSelectedValue": "",
                    "IC_bank_acct": documentDetails.im_bank_acct,
                }
                this.props.initialize({e2psearch:_temp_details})
            }
            lineItem.forEach((list_item, index)=>{
              
                let _details_main = `itemList.${index}.${index}`
                this.props.change(`${_details_main}.ID_PAY_FOR`, list_item.ID_PAY_FOR)
                this.props.change(`${_details_main}.ID_GST_REIMB`, list_item.ID_GST_REIMB)
                this.props.change(`${_details_main}.ID_PRODUCT_DESC`, list_item.ID_PRODUCT_DESC)
                this.props.change(`${_details_main}.ID_UNIT_COST`,parseFloat(list_item.ID_UNIT_COST).toFixed(2))
                this.props.change(`${_details_main}.ID_GST_VALUE`,list_item.ID_GST_VALUE)
                this.props.change(`${_details_main}.ID_GST_INPUT_TAX_CODE`,list_item.ID_GST_INPUT_TAX_CODE)
                this.props.change(`${_details_main}.ID_CATEGORY`,list_item.ID_CATEGORY)
                this.props.change(`${_details_main}.ID_REF_NO`,list_item.ID_REF_NO)
                let _temp_details = list_item
                lineItem[index] = _temp_details
                lineItem[index].ID_GIFT  = 'N'
                if(documentDetails.IM_CURRENCY_CODE!="MYR"){
                    let _exchange_rate = (documentDetails) ? documentDetails.exchangeRate : '0.00'
                    _exchange_rate = Math.round(_exchange_rate * 10) / 10;
                    this.props.change(`${_details_main}.ID_UNIT_COST_1`,parseFloat(list_item.ID_UNIT_COST).toFixed(2))
                    lineItem[index].ID_UNIT_COST_1 = list_item.ID_UNIT_COST
                    lineItem[index].exchange_rate  = (_exchange_rate) ? (list_item.ID_UNIT_COST * _exchange_rate) : list_item.ID_UNIT_COST
                    this.props.change(`${_details_main}.exchange_rate`,(lineItem[index].exchange_rate) ? parseFloat(lineItem[index].exchange_rate).toFixed(2) : '0.00')
                }
                else{
                    lineItem[index].exchange_rate = 0;
                }
               
                lineItem[index].id_gift  = 'N'
            })
            
            this.setState({
                loaded_details : _temp_details,
                table_body : (lineItem.length) ? lineItem : [],
                local_render : false,
                rerenderd : false,
                remarks : _remarks
            })
        }
    }

    handle_checkbox = (_vlaue) =>{
        this.setState({
            custim_model_check_box : _vlaue
        })
    }

    render(){
        let prevAppType = '';
        let _width=0;
        let _user_details = UserDetails();
        const { handleSubmit, submitting } = this.props
        let _selected_index = 0
        let _approval_details = (this.props.search_list && this.props.search_list.approverDetails) ? this.props.search_list.approverDetails : [] 
        if(_approval_details.length>0){
            let _temp_details = _approval_details.filter((list)=>(_user_details.UM_USER_NAME==list.AO_NAME  || _user_details.UM_USER_NAME==list.AAO_NAME) ? list.FA_SEQ : '')
            if(_temp_details && _temp_details.length > 0){
                _selected_index = _temp_details[0].FA_SEQ
            }
        }

        let _sub_details = (this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0] : {}
        let _sub_total = (this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) , 0).toFixed(2) : 0.00
        let _sub_total_myc = (this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += ((val.exchange_rate) ? val.exchange_rate + (val.ID_GST_VALUE) : 0) , 0) : 0.00
        let _exchange_rate = ((this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0])) ? this.props.search_list.documentDetails[0].exchangeRate : '0.00'
        _exchange_rate = Math.round(_exchange_rate * 10) / 10;
        let _sub_total_main = _sub_total * _exchange_rate
        _sub_total = (_sub_total) ? parseFloat(_sub_total).toFixed(2) : '0.00'
        _sub_total_main = (_sub_total_main) ? parseFloat(_sub_total_main).toFixed(2) : '0.00'

        let table_header = [
            {name : "Pay For", id:"ID_PAY_FOR",type:"select",key:false, value:(this.props.pop_pay_for && this.props.pop_pay_for.data) ? this.props.pop_pay_for.data : [], width:'100px'},
            {name : "Disb./Reimb.", id:"ID_GST_REIMB", width:'130px', type:"select", value:[{value:"D", name:"Disbursement"},{value:"R", name:"Reimbursement"},{value:"N/A", name:"N/A"}]},
          
            {name : "Transaction Description", id:"ID_PRODUCT_DESC", width:'167px', type:"input",rem:true},
            {name : "Amount(FCY) (excl. SST)", id:"ID_UNIT_COST_1", width:'100px', type:"number"},
            {name : "Amount(MYR) (excl. SST)", id:"ID_UNIT_COST", width:'100px', type:"number"},
            {name : "SST Amount", id:"ID_GST_VALUE", width:'100px', type:"price"},
            {name : "Input Tax Code", id:"ID_GST_INPUT_TAX_CODE", width:'100px',type:"select", value:(this.props.pop_tax_code && this.props.pop_tax_code.data) ? this.props.pop_tax_code.data : [], width:'100px'},
            {name : "Output tax code ", id:"ID_GST_RATE", key:false,width:'100px',type:"select", value:[{value:"", name:"N/A"}], width:'100px', select_status:"disable"},
            {name : "Category", id:"ID_CATEGORY", width:'100px', type:"select", value:[{value:"Life", name:"Life"},{value:"Non-Life", name:"Non-Life"},{value:"Mixed", name:"Mixed"}]},
            {name : "GL CODE", id:"ID_B_GL_CODE_CONCAT",type:"link_text", key:false, width:'150px', rem:true},
            {name : "Cost Centre Code (L7)", id:"ID_COST_CENTER_2", width:'130px',type:'link_text'},
            {name : "Fund Type (L1)", id:"analysis1", key:false, width:'100px',type:"link_text"},
            {name : "Product Type (L2)", id:"analysis2", key:false, width:'100px',type:"link_text"},
            {name : "Channel (L3)", id:"analysis3", key:false, width:'100px',type:"link_text"},
            {name : "Reinsurance Company (L4)", id:"analysis4", key:false, width:'100px',type:"link_text"},
            {name : "Asset Fund (L5)", id:"analysis5", key:false, width:'100px',type:"link_text"},
            {name : "Project (L8)", id:"analysis8", key:false, type:"link_text", width:'114px'},
            {name : "Person Code (L9)", id:"analysis9", key:false, type:"link_text", width:'114px'},
            {name : "Withholding Tax (%)", id:"ID_WITHHOLDING_TAX", key:false, type:"link_text",width:'200px'},

        ]
       
        let _table_header_1 = [
            {name : "Performed By", id:"AO_NAME", width:'100px', key:true, formatter: (cellContent, row) => {
                console.log('FA_SEQ',_selected_index, row.FA_SEQ)
                let _details =  (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{row.AO_NAME}</div>;
            }},
            {name : "User ID", id:"FA_AO", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{row.FA_AO}</div>;
            }},
            {name : "Date Time", id:"FA_ACTION_DATE", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{(row.FA_ACTION_DATE) ? DateTimeMinusTime(row.FA_ACTION_DATE) : ''}</div>;
            }},
            {name : "Remarks", id:"FA_AO_REMARK", width:'100px',formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{(row.FA_AO_REMARK) ? row.FA_AO_REMARK.replace('null','') : ''}</div>;
            }},
        ];


       


        let  _table_header = Object.assign([], table_header)
    
       
    
        if(_sub_details && _sub_details.IM_CURRENCY_CODE=="MYR"){
            _table_header.forEach((list,key)=>{
                if(list.id=='ID_UNIT_COST_1'){
                    delete _table_header[key]
                }
            })
        }
        else if(_sub_details && _sub_details.IM_CURRENCY_CODE!="MYR"){
            _table_header.forEach((list,key)=>{
                if(list.id=='ID_UNIT_COST'){
                     _table_header[key].id = 'exchange_rate'
                     _table_header[key].type = 'price'
                }
            })
        }

        if(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0] && (this.props.search_list.documentDetails[0].IM_INVOICE_TYPE=="CN" || this.props.search_list.documentDetails[0].IM_INVOICE_TYPE=="DN")){
            _table_header.splice(2, 0,{name : "Invoice Number", id:"ID_REF_NO", width:'124px', type:"text",rem:true});
            _table_header.join()
            _width = 0;
        }

        _table_header = _table_header.filter((list_details)=>list_details!='')

        console.log('_table_header', _table_header)

        return <div id="tabs">
        <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
            if(k=="PurchaseOrder"){

            }
            else{
                localStorage.removeItem('set_inv_prev')
                localStorage.removeItem('set_inv')
                this.props.history.push({
                    pathname: 'RequesterInvoiceManagement',
                    redirect_to_tab : k,
                })
            }
            
        }}>
         <Tab eventKey="PurchaseOrder" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER')) ? "Verified Invoice" : "New Invoice"}>
          
                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.dr_loading) ? <Loader /> : '' }
                {(this.props.gipdf_loader) ? <Loader /> : '' }
                {(this.props.fd_loading) ? <Loader /> : '' }
                {(this.props.fu_loading) ? <Loader /> : '' }
                {(this.props.fr_loading) ? <Loader /> : '' }
                {(this.props.loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.state.gl_loading) ? <Loader /> : '' }
                {(this.props.requester_invoice_loader) ? <Loader /> : '' }
                
                
            <form onSubmit={handleSubmit(this.submit_invoice.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Click the Approve button to approve the E2P Document or Reject button to reject the E2P Document." 
            />
            <TabHeading color={'bg-info text-white'}>Invoice Header</TabHeading> 
            <div className="" >
            <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Master Document  : </label></div>
                            <div className="col"><p>No</p></div>
                          
                        </div>
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Type : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? HandleDocType(this.props.search_list.documentDetails[0].IM_INVOICE_TYPE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Status : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? HandleStatus(this.props.search_list.documentDetails[0].IM_INVOICE_STATUS) : ''}</p></div>

                        </div>
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document No : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_INVOICE_NO : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Currency : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_CURRENCY_CODE : ''}</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Date : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? TodayDateSalash(this.props.search_list.documentDetails[0].IM_DOC_DATE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Total Amount (excl. SST) : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? NumberFormateEmpty(this.props.search_list.documentDetails[0].IM_INVOICE_EXCL_GST) : ''}</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Due Date : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? TodayDateSalash(this.props.search_list.documentDetails[0].IM_DUE_DATE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>SST Amount  : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? NumberFormateEmpty(this.props.search_list.documentDetails[0].IM_INVOICE_GST) : '0.00'}</p></div>
                        </div>

                        <div className="row" >
                          
                            <div className="col-md-12 col-12 col-lg-2"><label>Credit Term  : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.lineItem && this.props.search_list.lineItem[0]) ? this.props.search_list.lineItem[0].ic_credit_terms : 0} Days</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>PSD Sent Date : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? TodayDateSalash(this.props.search_list.documentDetails[0].IM_PRCS_SENT) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Payment Amount  : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? NumberFormateEmpty(parseFloat(this.props.search_list.documentDetails[0].IM_INVOICE_TOTAL)) : ''}</p></div>
                        </div>

                        <div className="row" >
                        <div className="col-md-12 col-12 col-lg-2"><label>PSD Received Date  : </label></div>
                        <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? TodayDateSalash(this.props.search_list.documentDetails[0].IM_PRCS_RECV) : ''}</p></div>
                            <div className="col-md-12 col-12 col-lg-2"><label>Payment Mode  : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? HandlePayment(this.props.search_list.documentDetails[0].IM_PAYMENT_TERM) : ''}</p></div>
                        </div>

                        <div className="row mt-2" >
                            <div className="col-md-12 col-12 col-lg-2 "><label>Manual PO No  : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0] && this.props.search_list.documentDetails[0].IM_IPP_PO!='undefined') ? this.props.search_list.documentDetails[0].IM_IPP_PO : '' } </p></div>

                            <div className="col-md-12 col-12 col-lg-2" style={{paddingRight:'0px'}}><label>Bank Code[Bank A/C No.] : </label></div>
                            <div className="col"><p> {(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].ic_bank_acct : ''}  </p></div>
                        </div>

                      

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_S_COY_NAME : ''} </p></div>

                           
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor Address  : </label></div>
                            <div className="col"><address>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? 
                              
                              <Fragment>
                              {(this.props.search_list.documentDetails[0].IM_ADDR_LINE1) ? this.props.search_list.documentDetails[0].IM_ADDR_LINE1+'\n' : ''}
                              {(this.props.search_list.documentDetails[0].IM_ADDR_LINE2) ? this.props.search_list.documentDetails[0].IM_ADDR_LINE2+'\n' : ''}
                              {(this.props.search_list.documentDetails[0].IM_ADDR_LINE3) ? this.props.search_list.documentDetails[0].IM_ADDR_LINE3+'\n' : ''}
                              {(this.props.search_list.documentDetails[0].IM_POSTCODE && this.props.search_list.documentDetails[0].IM_POSTCODE!="undefined") ? this.props.search_list.documentDetails[0].IM_POSTCODE+'\n' : ''}
                              {(this.props.search_list.documentDetails[0].IM_CITY) ? this.props.search_list.documentDetails[0].IM_CITY+'\n' : ''}
                              </Fragment>
                                
                            : ''}</address></div>


                          
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Internal Remarks : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_REMARK : ''} </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Beneficiary Details : </label></div>
                            <div className="col"><p> </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Late Submission Reason : </label></div>
                            <div className="col"><p>{(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0] && this.props.search_list.documentDetails[0].IM_LATE_REASON!='undefined') ? this.props.search_list.documentDetails[0].IM_LATE_REASON : ''} </p></div>
                        </div>

                      
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="row mt-2">
                                    <FromUplodsParallel name="ApproveDto.internalAttachment" decs="Recommended file size is 10240 KB" id ="external_attachment" label="Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.internal_file_name}/>
                                </div> 
                            </div>
                        </div>
                        <div className="mt-2 row">
                            <div className="col-lg-2 col-md-2 col-12">
                                {/* <label>Internal File Attached : </label> */}
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">

                                <div className="col_details">
                                    {( this.state.attachments && this.state.attachments[0]!== 'No Files Attached' && this.state.attachments.length>=1) ? this.state.attachments.map((list, index) => {
                                        if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span  onClick={() => this.DeleteDocuments({...list, modeType:'Mod', AttachType:'I', "frm": "IPPAO",CDA_DOC_NO:(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails.length>0) ? this.props.search_list.documentDetails[0].IM_INVOICE_NO : ''}, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }): ''}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 row">
                            <div className="col-lg-2 col-md-2 col-12">
                                <label>File Attached : </label>
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">

                                <div className="col_details">
                                    {( this.props.search_list && this.props.search_list.docAttachment && this.props.search_list.docAttachment[0]!== 'No Files Attached' && this.props.search_list.docAttachment.length>=1) ? this.props.search_list.docAttachment.map((list, index) => {
                                         if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => this.delete_alter(list)}>{list.ATTACH_FILENAME}</span></u> </p>
                                        }
                                    }): 'No Files Attached'}
                                </div>
                            </div>
                        </div>
                       
                        
                    
                            </div>
                        </div>
                            <TabHeading color={'bg-info text-white'}> Approval Workflow</TabHeading> 
                               <div className="main_detaials">
                                    <BootstrapCustomTable 
                                        table_header={_table_header_1} 
                                        table_body={(this.props.search_list && this.props.search_list.approverDetails) ? this.props.search_list.approverDetails : [] } 
                                        products={this.getProducts} 
                                        select={false} 
                                        selectname={'pr_no'} 
                                        app_details ={(this.props.search_list && this.props.search_list.invDetail) ? this.props.search_list.invDetail :[] }
                                        responsive={true} 
                                        click={true}
                                        search={false}
                                        table_name="issue_grn"
                                        subtotal={this.state.table_body.reduce((a, val) => a += parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST), 0).toFixed(2)}
                                        sstamount={this.state.table_body.reduce((a, val) => a += parseFloat(val.ID_GST_VALUE), 0)}
                                        grandtotal={this.state.table_body.reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + parseFloat(val.ID_GST_VALUE)), 0)}
                                        sstamount_out={0}
                                        get_details = {this.get_details}
                                        changefunction = {this.handleChange}
                                        invoiceAmount = {this.props.search_list && this.props.search_list.invDetail && this.props.search_list.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) + (val.POM_SHIP_AMT), 0).toFixed(2)}
                                    />
                                </div>
                               

                                    
                        {/* <BootstrapCustomTable 
                            table_header={_table_data_header} 
                            table_body={(this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem : [] } 
                            mode={'radio'}
                            select={false} 
                        />    */}
                       
                         <BootstrapCustomTableAlter 
                            table_header={_table_header} 
                            table_body={this.state.table_body} 
                            products={this.getProducts} 
                            select={false} 
                            serial={true}
                            selected_items={this.state.slected_items}
                            serial_text={'Line'}
                            selectname={'itemcode'} 
                            delete_function = {this.delete_function}
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                            extratotal={true}
                            colcount={_table_header.length+1}
                            table_id="line"
                            segmentation = {(this.props.segmentation) ? this.props.segmentation : []}
                            changefunction = {this.handleChange}
                            inputPrefix = 'itemList'
                            handle_popup= {this.handlePopup}
                            dates={this.state.dates}
                            select_function_inex = {this.select_function_inex}
                            select_change = {this.SelecthandleChange}
                            main_date = ''
                            change={this.props.change}
                         
                        />

                        {(_exchange_rate && _exchange_rate!='0.00') ? 
                        <TotalGrid
                            table_header = {_table_header}
                            body_text={['Total']}
                            body_value={[_sub_total, ((_sub_total_myc) ? parseFloat(_sub_total_myc).toFixed(2): '0.00')]}
                            body_type={['text']}
                            text_grid={3+_width}
                            total={4+_width}
                            total_td={2}
                            body_loop={1}
                            adjust_first_row={151-(_width) ? 46 : 0 }
                            adjust={5}
                        /> : <TotalGridSub
                            table_header = {_table_header}
                            body_text={['Total']}
                            body_value={[_sub_total]}
                            body_type={['text']}
                            text_grid={3+_width}
                            total={4+_width}
                            total_td={3}
                            body_loop={4}
                            adjust_first_row={151-(_width) ? -73 : 0 }
                            adjust={11}
                    /> }

                        
                        


                        

                        {/* <table className="table_details table table-hover table-bordered table-stripe">
                            <tbody>
                                <tr className="borderless-data"><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td className="td-min-w-100 text-right"><strong>Sub Total</strong></td><td className="text-right">{(this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += val.ID_RECEIVED_QTY * val.ID_UNIT_COST, 0).toFixed(2): 0.00}</td></tr>
                                <tr className="borderless-data"><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td className="text-right"><strong>Tax</strong></td><td className="text-right">{(this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += val.ID_GST_VALUE, 0).toFixed(2): 0.00}</td></tr>
                              
                                <tr className="borderless-data"><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td colSpan="10"></td><td className="borderless-data-top td-min-w-100 text-right"><strong>Grand Total</strong></td><td className="borderless-data-top text-right">{(this.props.search_list && this.props.search_list.lineItem) ? this.props.search_list.lineItem.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) , 0).toFixed(2): 0.00}</td></tr>
                            </tbody>
                        </table> */}
                        
                        {(_exchange_rate && _exchange_rate!='0.00') ? 
                        <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2"><label className="form-label">Exchange Rate <sapn className="text-danger">*</sapn> : </label></div>
                                <div className="col"><input rows="1" className="form-control"  value={(this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0] && this.props.search_list.documentDetails[0].IM_EXCHANGE_RATE) ? parseFloat(_exchange_rate).toFixed(2) : '0.00'} disabled/></div>
                                <div className="col-lg-4 col-md"><label className="form-label"></label></div>
                        </div> : ''}
                        <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2"><label className="form-label">Remarks <sapn className="text-danger">*</sapn> : </label></div>
                                <div className="col"><textarea rows="1" className="form-control" onChange={(e) => {this.getTextBoxValues(e)}} value={this.state.remarks}></textarea></div>
                                <div className="col-lg-4 col-md"><label className="form-label"></label></div>
                        </div>
                        {(this.state.show_status) ? 
                        <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2"><label className="form-label">Reject (Route To) : </label></div>
                                <div className="col">
                                        <input value="Others" checked={(this.state.reject_reason=="Others") ? true : false } name="reject_status" type="radio" onClick={this.handleReject} /><label htmlFor="Others">Others</label>
                                        <input value="PSDDate" checked={(this.state.reject_reason=="PSDDate") ? true : false } name="reject_status" type="radio" onClick={this.handleReject} className="ml-2"/> <label htmlFor="PSDDate">Psd Received Date</label>
                                </div>
                                <div className="col-lg-4 col-md"><label className="form-label"></label></div>
                        </div>
                        :'' }
                    </div> 
                    <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button>
                        </div>
                        <div className="col-12 col-sm-6 text-right">
                            <div>
    
                                {(this.state.show_save) ? 
                                    <Fragment>
                                        <button type="button" className="btn btn-outline-primary btn-sm ml-2 mr-2" onClick={()=>this.saveDocument()}>Save</button> 
                                        <button type="button" className="btn btn-outline-danger btn-sm ml-2 mr-2" onClick={()=>this.closeDocument()}>Cancel</button> 
                                    </Fragment>
                                :  ''}
                                {(!this.state.show_save) ? 
                                <Fragment>
                                    {(_user_details && _user_details.ROLE_NAME && _user_details.ROLE_NAME!='Finance Manager')? <button type="button" className="btn btn-outline-primary btn-sm ml-2 mr-2" onClick={()=>this.SaveInvoice()}>Save</button> : ''}
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={()=>this.confirm_function('submit',`${(_user_details.ROLE_NAME.includes('MANAGER') || _user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('Approv') || _user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('officer') || _user_details.ROLE_NAME.includes('APPROV')) ? 'approve this' : 'verify this'} Invoice`)}>{(_user_details.ROLE_NAME.includes('MANAGER') || _user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('officer')  || _user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('Approv') || _user_details.ROLE_NAME.includes('APPROV')) ? 'Approve' : 'Verify'}</button> 
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2 mr-2" onClick={()=>this.confirm_function('reject','reject this Invoice')}>Reject</button>
                                    <button type="button" className="btn btn-outline-info btn-sm" onClick={()=>{this.setInvoiceIndex((this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_INVOICE_INDEX : '', (this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? this.props.search_list.documentDetails[0].IM_INVOICE_NO : '' , (this.props.search_list && this.props.search_list.documentDetails && this.props.search_list.documentDetails[0]) ? HandleStatus(this.props.search_list.documentDetails[0].IM_INVOICE_STATUS) : '')}}>View Audit</button>
                                </Fragment>
                                : ''}
                                {/* {_user_details.ROLE_NAME === 'FINANCE MANAGER ' ?  <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.HoldInvoice}>Hold Invoice</button> : ''} */}
                            </div>
                        </div>
                    </div>
                </form>
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
                    show={this.state.model} 
                    confirm={this.closemodel}
                />

                <Modal className="modal-table-display" size="lg" open={this.state.custom_modal_popup} header ={true} title ={"Withholding Tax"} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateWithholdData }>Save</button> : ''}
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                       <table className="table table-striped">
                           <tbody>
                                <tr>
                                    <td style={{"width": "150px"}}>Withholding Tax : </td>
                                    <td style={{"width": "120px"}} ><input onChange={(e)=>{this.setState({ custim_model_text_value : e.target.value })}} type="text" className="form-control" disabled={(this.state.custim_model_check_box=='2') ? 'disabled' : ''} /></td>
                                    <td style={{"width": "50px"}} >%</td>
                                    <td >
                                        <input type="radio" onClick={(e)=>this.handle_checkbox(e.target.value)} value="0" name="tax_type" /> WHT applicable and payable by Company
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="1" name="tax_type"  /> WHT applicable and payable by Vendor
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="radio"  onClick={(e)=>this.handle_checkbox(e.target.value)} value="2" name="tax_type"  /> Not Applicable
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        If Not Please Key in the lateReason
                                        <textarea onChange={(e)=>{this.setState({
                                            custim_model_taxtarea_value : e.target.value
                                         })}} className="form-control" disabled={(this.state.custim_model_check_box=='0' || this.state.custim_model_check_box=='1') ? 'disabled' : ''} >  </textarea>
                                    </td>
                                </tr>
                           </tbody>
                       </table>
                    
              </Modal>
             

                <Modal size="lg" open={this.state.table_modal_popup} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                    {(this.state.table_display) ?  <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.updateData }>Save</button> : ''}
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                    <h5>{this.state.modal_body}</h5>
                    {(this.state.table_display) ?  
                    <Fragment>
                        <form onSubmit={handleSubmit(this.handleformsubmit.bind(this))}>
                            <div className="mt-2">
                                <BootstrapCustomTableModel
                                    table_header={this.state.table_model_header} 
                                    table_body={this.state.table_model_body} 
                                    select={true} 
                                    mode={'radio'}
                                    radioname={'code'} 
                                    responsive={false} 
                                    products = {this.getSelectedProduct}
                                    selected_checkbox={this.state.selected}
                                    inputPrefix = 'raisePOForm'
                                />
                            </div>
                        </form>
                    </Fragment>
                    :''}
                </Modal>

                <ConfirmationModel
                    title="" 
                    confimation = {true}
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.confimation_pop} 
                    onConfirm={(e)=>this.onConfirm()}
                    onCancel = {this.onCancel}
                />
                
      </Tab>
      <Tab eventKey="VerifiedInvoice" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER') ) ? "Approved Invoice" : "Verified Invoice"}>
        <div className="tab-content py-3 px-3 px-sm-0">
          
        </div>
      </Tab>
     {(_user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') || _user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') ) ? '' :
      <Tab eventKey="PaidInvoice" title="Paid Invoice">
           
      </Tab>}
      {(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER') ) ? '' : 
      <Tab eventKey="PendingFYFA" title="Pending FYFA">
            
      </Tab>}
      </Tabs></div>
    }
}

const mapStateToProps = (state) =>({
    search_list : state.approval_details.responseList,
    requester_invoice_loader : state.approval_details.loading,
    gipdf_loader : state.generate_ipdf.loading,
    invoice_header : state.invoice_header.responseList,
    invoice_header_leader : state.invoice_header.loading,
    dr_loading : state.file_download.loading,
    pop_tax_code : state.pop_tax_code.responseList,
    fd_loading : state.file_download.loading,
    fu_loading : state.fileupload.loading,
    fr_loading : state.file_delete.loading,
    file_download: state.file_download.responseList,
    fileupload : state.fileupload.responseList,
    file_delete : state.file_delete.responseList,

    fund_type_project_code : state.fund_type_project_code.responseList,
    fund_type_project_code_l1 : state.fund_type_project_code.responseListL1,
    fund_type_project_code_l2 : state.fund_type_project_code.responseListL2,
    fund_type_project_code_l3 : state.fund_type_project_code.responseListL3,
    fund_type_project_code_l4 : state.fund_type_project_code.responseListL4,
    fund_type_project_code_l5 : state.fund_type_project_code.responseListL5,
    fund_type_project_code_l6 : state.fund_type_project_code.responseListL6,
    fund_type_project_code_l7 : state.fund_type_project_code.responseListL7,
    fund_type_project_code_l8 : state.fund_type_project_code.responseListL8,
    fund_type_project_code_l9 : state.fund_type_project_code.responseListL9,
    gl_code : state.gl_code.responseList,
    gl_loading: state.gl_code.loading,
    delivery_address : state.delivery_address.responseList,
    cost_centre_code : state.cost_centre_code.responseList,
    segmentation : state.segmentation.responseList,
    pop_pay_for : state.pop_pay_for.responseList,
})


const mapDispatchToProps = (dispatch) =>({
    GetInvoiceHeader : (values) => dispatch(GetInvoiceHeader(values)),
    GetInvoicePDF : (values) => dispatch(GetInvoicePDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetE2PApprovalDetails : (values) => dispatch(GetE2PApprovalDetails(values)),
    UploadDocuments  : (filename, data) => dispatch(UploadDocuments(filename, data)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFile(values)),
    cl_code_access : (values) => dispatch(GetFFRaisePOScreen(values)),
    FundTypeOrPersonCode  : (datas) => dispatch(FundTypeOrPersonCodeORProjectCodeAction(datas)),
    DeliveryAddress  : () => dispatch(DeliveryAddressAction()),
    CostCentreCode  : () => dispatch(CostCentreCodeAction()),
    SegmentationAction  : () => dispatch(SegmentationAction()),
    GetSearchPRCancelList  : (values) => dispatch(GetSearchPRCancelList(values)),
    GetPurchaseRequestItemsDetails : (values) =>dispatch(GetPurchaseRequestItemsDetails(values)),
    GetE2PPopTaxCode : (values) => dispatch(GetE2PPopTaxCode(values)),
    GetE2PWithHoldingTax : (values) => dispatch(GetE2PWithHoldingTax(values)),
    GetE2PPayFor :  (values) => dispatch(GetE2PPayFor(values)),
    
        
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default reduxForm({
    form:'InvoiceViewDetails',
})(MainRoute);