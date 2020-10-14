import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import {UserDetails} from '../../../Common/LocalStorage'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStaticApprover'
import TotalGrid from '../../../Component/Table/TotalGrid'
import { Tabs, Tab } from 'react-bootstrap';
import Loader from '../../../Component/Loader'
import {FromateDate,ddmmyy, TodayDateSalash} from '../../../Component/Dates'
import {connect} from 'react-redux';
import Enum from '../../../Common/GlobalEnum'
import {InvoiceDetails} from '../../../validation'
import {GetDownloadFile} from '../../../Actions/Vendor'
import Modal from '../../../Component/Modal'
import {ApiExtract} from '../../../Common/GetDatas'
import BootstrapTable from '../../../Component/Table/BootstrapCustomTablePr'
import {InvoiceSave, InvoiceVerify, holdInvoice, FillTaxCode} from '../../../Apis/RequesterServices'
import { GetViewInvoiceDetailsClick, GetInvoiceHeader, GetInvoicePDF, FundTypeOrPersonCodeORProjectCodeAction, GetGenerateDEBITPDF, GetGenerateCREDITPDF, GetFillTaxCode } from '../../../Actions/Requester'
import Alert from '../../../Component/Modal/alert'
import BackButton from '../../../Component/Buttons/Back'
import {CheckFileDetails, HandlePaymentTerm, NumberFormate} from '../../../Actions/Common/Functions'

class InvoiceViewDetails extends Component {
    constructor(props){
       
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_pdf = this.view_pdf.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.show_model = this.show_model.bind(this)
        this.getSelectedProduct = this.getSelectedProduct.bind(this)
        this.emptyModel = this.emptyModel.bind(this)
        this.state = {
            table_body : [],
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
            type:'save',
            show_status : true ,
            table_modal_popup : '',
            modal_title : '',
            table_model_header : [],
            table_model_body : [],
            current_id : '',
            rendred:false,
            active_key:'PurchaseOrder'
            
        }

    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.upload_document && nextProps.upload_document.displayAttachFile && nextProps.upload_document.displayAttachFile.attachFileList && nextProps.upload_document.displayAttachFile.attachFileList!=prevState.file_name){
               return {
                file_name: nextProps.upload_document.displayAttachFile.attachFileList,
                files : nextProps.upload_document.displayAttachFile.attachFileList
            }
        }
        else if(nextProps.file_delete && nextProps.file_delete.displayAttachFile && nextProps.file_delete.displayAttachFile.attachFileList){
            return {
                files : nextProps.file_delete.displayAttachFile.attachFileList
            }
        }
        else if(nextProps.search_list && nextProps.search_list.invDetail){
            return {
                table_body : nextProps.search_list.invDetail
            }
        }
        return {nextProps,prevState}
    }

    componentDidMount(){
        let _user_details = UserDetails()
        if(_user_details && _user_details.ROLE_NAME){
            let _role = (_user_details.ROLE_NAME).trim()
            if(_role === "FINANCE MANAGER"){
                this.setState({
                    show_status: false,
                })
            }
        }
        var _details = this.props.location.datas
        this.setState({
            products: _details,
        })
        this.props.FundTypeOrPersonCode({ type: "L1" })
        this.props.GetViewInvoiceDetailsClick(_details)
        this.props.GetFillTaxCode()
    }

     componentDidUpdate(){
        if((!this.state.rendred) && this.props.search_list && this.props.search_list.financeApprFlow){
            let _user_details = UserDetails();
            _user_details.UM_USER_NAME = _user_details.UM_USER_NAME.trim();
            let _details = this.props.search_list.financeApprFlow
            let _remarks = '';
             _details.forEach((list_details, index)=>{
                if(list_details.AO_NAME == _user_details.UM_USER_NAME || _user_details.UM_USER_NAME==list_details.AAO_NAME){
                    _remarks = list_details.FA_AO_REMARK
                }
            })
            this.setState({
                remarks : _remarks,
                rendred : true
            })
        }
    }

    FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType": Enum.EnumUploadType.DocAttachmentTemp,
            "strDocType": "INV",
            "pEnumUploadForm": Enum.EnumUploadFrom.FrontOff,
            "strDocNo": "",
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": attachment,
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": "New"
        }
        if(_file_name == "ApproveDto.internalAttachment"){
            req.AttachType = 'I';
            this.props.UploadDocuments(this.state.internal_file, req)
        }
        else{
            req.AttachType = '';
        }
       
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
            else if(e.target.name=="prDto.externalAttachment"){
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
                modal_body:_details.message,
                loading:false,
                model:true,
                status: false,
            })
        }
    }

    deleteFile(filePath, attachType){
        filePath.AttachType = attachType;
        filePath.modeType = "New";
        this.props.delete_file(filePath)
    }

   


    closemodel = () => {
        this.setState({
            model : false,
            table_modal_popup : false 
        })
        if(this.state.status && this.state.type=="verify"){
            this.props.history.push({pathname : '/RequesterInvoiceManagement'})
        }
        else if(this.state.status && this.state.type=="save"){
            var _details = this.props.location.datas
            this.props.GetViewInvoiceDetailsClick(_details)
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
        let _exec = true;
        let _user_details = UserDetails();
        let requestData = {
            "lblInvNo": this.state.products.IM_INVOICE_NO,
            "vendorId": this.state.products.CDM_S_COY_ID,
            "txtRemark": this.state.remarks,
            "aryPTaxCode": [],
            "aryFundType": [],
            "folder":(_user_details.ROLE_NAME === 'FINANCE MANAGER ') ? 'A' : 'N',
            "invoiceIndex": this.state.products.IM_INVOICE_INDEX
        }
        
        for (let index = 0; index < this.props.search_list.invDetail.length; index++) {
            const element = this.props.search_list.invDetail[index];
            let tempTaxDetail = { "lineno": element.ID_PO_LINE, "taxCode": element.ID_GST_RATE }
            let tempFundDetail = { "lineno": element.ID_PO_LINE, "fundCode": element.ID_ANALYSIS_CODE1 }
            if (!element.ID_ANALYSIS_CODE1) {
                _exec = false
            }
            requestData.aryPTaxCode.push(tempTaxDetail);
            requestData.aryFundType.push(tempFundDetail);
        }

        if(_exec){
            this.setState({loading:true})
            let _status = await ApiExtract(InvoiceVerify, requestData)
            if(_status){
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
                status:false,
                model:true,
                modal_body: 'Please Select valid Fund Type',
                loading:false,
            })
        }
            
    }

    saveInvoice = async() => {
        let requestData = {
            "txtRemark": (this.state.remarks) ? this.state.remarks : '',
            "aryPTaxCode": [],
            "aryFundType": [],
            "invoiceIndex": this.state.products.IM_INVOICE_INDEX
        }
        for (let index = 0; index < this.props.search_list.invDetail.length; index++) {
            const element = this.props.search_list.invDetail[index];
            let tempTaxDetail = { "lineno": element.ID_PO_LINE, "taxCode": element.ID_GST_INPUT_TAX_CODE }
            let tempFundDetail = { "lineno": element.ID_PO_LINE, "fundCode": element.ID_ANALYSIS_CODE1 }
            requestData.aryPTaxCode.push(tempTaxDetail);
            requestData.aryFundType.push(tempFundDetail);
        }

        this.setState({loading:true})
        let _status = await ApiExtract(InvoiceSave, requestData)
        if(_status){
            this.setState({
                status: _status.status,
                model:true,
                modal_body: `Invoice no ${(this.state.products) ? this.state.products.IM_INVOICE_NO:''} has been saved successfuly `,
                loading:false,
                type:'save'
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



    viewInvoicePDF = () => {
        let inputData = { 'IM_INVOICE_NO': this.state.products.IM_INVOICE_NO, 'POM_B_COY_ID': this.props.search_list.invMstr[0].POM_B_COY_ID, 'POM_S_COY_ID': this.props.search_list.invMstr[0].POM_S_COY_ID }
        this.props.GetInvoicePDF(inputData)
    }

   async getSelectedProduct(e, details, selected){
        let {current_id, current_model, table_body} = this.state;
        if(current_id!=null && current_model){
           
            table_body.forEach((flist_details,index)=>{
                if(flist_details.ID_INVOICE_LINE==current_id){
                    current_id = index
                }
            })
            
         
        
            
            let _details =  Object.assign({},table_body[current_id],  e)
            table_body[current_id] = _details;
            console.log('_index_details', _details)

            if(table_body[current_id]){
                if(current_model=="FUNDTYPE"){
                    table_body[current_id][current_model] = e.AC_ANALYSIS_CODE_DESC
                    table_body[current_id].ID_ANALYSIS_CODE1= e.AC_ANALYSIS_CODE
                    table_body[current_id].FUNDTYPE = e.AC_ANALYSIS_CODE_DESC+':'+e.AC_ANALYSIS_CODE
                }
                else if(current_model=="GST_RATE"){
                    this.setState({loading:true})
                    let _status = await ApiExtract(FillTaxCode, {strRate : e.TM_TAX_RATE})
                    if(_status){
                        this.setState({
                            loading:false,
                        })

                    }
                }
            }
            

            console.log('table_body', table_body)
        }

        this.setState({
            table_body: table_body,
            table_modal_popup : false,
            show_submit_button : false,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
        })
    }  

    emptyModel(){
        let {current_id, current_model, table_body} = this.state;
        if(current_id!=null && current_model){
            let _details =  Object.assign({},table_body[current_id])
            table_body[current_id] = _details;
            if(current_model=="FUNDTYPE"){
                table_body[current_id].ID_ANALYSIS_CODE1= ''
                table_body[current_id].FUNDTYPE = ''
            }

        }

        this.setState({
            table_body: table_body,
            table_modal_popup : false,
            show_submit_button : false,
            table_model_body :[],
            model : false ,
            current_model : '',
            current_id : ''
        })
    }  

    show_model = (details, selector, index)=> {
        console.log('details.ID_INVOICE_LINE',details)
        if(selector=='FUNDTYPE'){
           this.setState({
                table_modal_popup : true,
                current_id : details.ID_INVOICE_LINE,
                current_model :selector,
                modal_title : 'Select Fund Type',
                table_model_header :  [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ],
                table_model_body :this.props.fund_type_project_code_l1,
           })
        }
        else if(selector=='GST_RATE'){
            this.setState({
                table_modal_popup : true,
                current_id : details.ID_INVOICE_LINE,
                current_model :selector,
                modal_title : 'Select Default SST Tax Code (Purchase)',
                table_model_header :  [
                    {name : "Description", id:"TM_TAX_DESC", key:true},
                    {name : "Code", id:"TM_TAX_RATE"},
                ],
                table_model_body :this.props.fill_tax_code,
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


    DebitPdf = (row) =>{
        let _temp_details = {"DN_NO": row.DNM_DN_NO, "DN_SCoyID":row.DNM_DN_S_COY_ID, "DN_BCoyID":row.DNM_DN_B_COY_ID}
        this.props.GetGenerateDEBITPDF(_temp_details)
    }

    CreditPdf = (row) =>{
        let _temp_details = {"CN_NO": row.CNM_CN_NO, "CN_SCoyID":row.CNM_CN_S_COY_ID, "CN_BCoyID":row.CNM_CN_B_COY_ID}
        this.props.GetGenerateCREDITPDF(_temp_details)
    }

   
    render(){
       
        let prevAppType = '';
        let _user_details = UserDetails();
        let _selected_index = 0
        let _width = 0;
        let _approval_details = (this.props.search_list && this.props.search_list.financeApprFlow) ? this.props.search_list.financeApprFlow : [] 
        if(_approval_details.length>0){
            let _temp_details = _approval_details.filter((list)=>(_user_details.UM_USER_NAME==list.AO_NAME  || _user_details.UM_USER_NAME==list.AAO_NAME) ? list.FA_SEQ : '')
            if(_temp_details && _temp_details.length > 0){
                _selected_index = _temp_details[0].FA_SEQ
            }
        }


        let _sub_total  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST)), 0).toFixed(2) : 0;
        let _shipping_amount  = parseFloat((this.props.search_list &&  this.props.search_list.invDetail && this.props.search_list.invDetail[0]) ? this.props.search_list.invDetail[0].IM_SHIP_AMT:'0.00').toFixed(2)
        let _sub_gst  = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST) * ((val.ID_GST)/100)),  0).toFixed(2) : 0;
        let _sst_output_tax = (this.state.table_body && this.state.table_body.length) ? this.state.table_body.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST)*(val.ID_GST/100)),  0).toFixed(2) : 0;
        let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total)  + parseFloat(_shipping_amount)

        const { handleSubmit, submitting } = this.props
        let _table_header = [
            {name : "Line", id:"ID_INVOICE_LINE", width:'52px', key:true, dataFormat:'index', type:'index'},
            {name : "Fund Type(L1)", id:"FUNDTYPE", width:'100px', formatter: (cellContent, row) => {
                    return   <div >{row.FUNDTYPE} <i data-details="FUNDTYPE" data-name="0" data-id="0" className="fa fa-pencil-square-o text-right" aria-hidden="true" onClick={() => this.show_model(row, 'FUNDTYPE', cellContent)}></i></div>
            }},
            {name : "Person Code(L9)", id:"PERSONCODE", width:'100px'},
            {name : "Project ACR/Code (L8) Code", id:"PROJECTCODE", width:'143px'},
            {name : "Item Description", id:"ID_PRODUCT_DESC", width:'123px'},
            {name : "UOM", id:"ID_UOM", width:'50px'},
            {name : "Qty", id:"ID_RECEIVED_QTY", width:'55px',dataFormat:'price'},
            {name : "Unit Price", id:"ID_UNIT_COST", width:'70px',dataFormat:'price'},
            {name : "Total", id:"ID_RECEIVED_QTY_1", width:'80px', formatter: (cellContent, row) => {
                return   <div className="text-right">{NumberFormate(row.ID_RECEIVED_QTY * row.ID_UNIT_COST)}</div>
            }},
            {name : "Tax", id:"ID_GST_VALUE", width:'66px',dataFormat:'price'},
            {name : "Warranty Terms", id:"ID_WARRANTY_TERMS", width:'111px', formatter: (cellContent, row) => {
                return   <div className="text-right">{row.ID_WARRANTY_TERMS}</div>
            }},
        ];


        let _get_sub_details = this.state.table_body.filter((list)=> (list.GST_RATE!='' && list.GST_RATE!=null && list.GST_RATE!='N/A') ? list  : '')
        if((this.state.table_body && this.state.table_body.length>0) && _get_sub_details && _get_sub_details.length >0){
            _width = 1
            _table_header = [
                {name : "Line", id:"ID_INVOICE_LINE", width:'52px', key:true, dataFormat:'index', type:'index'},
                {name : "Fund Type(L1)", id:"FUNDTYPE", width:'100px', formatter: (cellContent, row) => {
                        return   <div >{row.FUNDTYPE} <i data-details="FUNDTYPE" data-name="0" data-id="0" className="fa fa-pencil-square-o text-right" aria-hidden="true" onClick={() => this.show_model(row, 'FUNDTYPE', cellContent)}></i></div>
                }},
                {name : "Person Code(L9)", id:"PERSONCODE", width:'100px'},
                {name : "Project ACR/Code (L8) Code", id:"PROJECTCODE", width:'143px'},
                {name : "Item Description", id:"ID_PRODUCT_DESC", width:'123px'},
                {name : "UOM", id:"ID_UOM", width:'50px'},
                {name : "Qty", id:"ID_RECEIVED_QTY", width:'55px',dataFormat:'price'},
                {name : "Unit Price", id:"ID_UNIT_COST", width:'70px',dataFormat:'price'},
                {name : "Total", id:"ID_RECEIVED_QTY_1", width:'80px', formatter: (cellContent, row) => {
                    return   <div className="text-right">{NumberFormate(row.ID_RECEIVED_QTY * row.ID_UNIT_COST)}</div>
                }},
            
                {name : "SST Rate", id:"GST_RATE", width:'66px', formatter: (cellContent, row) => {
                    return   <div className="text-left">{(row.GST_RATE) ? row.GST_RATE : 'N/A'}</div>
                }},
                {name : "SST Amount", id:"GST_RATE", width:'78px', formatter: (cellContent, row) => {
                    return   <div className="text-right">{(row.ID_GST_VALUE) ? parseFloat(row.ID_GST_VALUE).toFixed(2) : '0.00'}</div>
                }},
                {name : "SST Tax Code (Purchase)", id:"GST_RATE", width:'78px', formatter: (cellContent, row) => {
                    return   <div >{row.GST_RATE} {(row.GST_RATE!='' && row.GST_RATE!=null && row.GST_RATE!='N/A') ? <i data-details="TAXCODE" data-name="0" data-id="0" className="fa fa-pencil-square-o text-right" aria-hidden="true" onClick={() => this.show_model(row, 'GST_RATE', cellContent)}></i> : ''}</div>
                }},
                {name : "Warranty Terms", id:"ID_WARRANTY_TERMS", width:'111px', formatter: (cellContent, row) => {
                    return   <div className="text-right">{row.ID_WARRANTY_TERMS}</div>
                }},
            ];
        }
        else if (this.state.table_body && this.state.table_body.length>0){
            _width = 1
        }

        const _credit_note = [
            {name : "Credit Note No.", id:"CNM_CN_NO", key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.CreditPdf(row)}>{row.CNM_CN_NO} </button>
                )
            }},
            {name : "Credit Note Creation Date", id:"CNM_CREATED_DATE", dataFormat:'date'},
            {name : "Credit Note Created By", id:"UM_USER_NAME"},
            {name : "Status", id:"STATUS_DESC", width:'143px'},
            {name : "Amount Description", id:"AMOUNT", dataFormat:'price'},
        ];

        const _debit_note = [
            {name : "Debit Note No.", id:"DNM_DN_NO", key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.DebitPdf(row)}>{row.DNM_DN_NO} </button>
                )
            }},
            {name : "Debit Note Creation Date", id:"DNM_CREATED_DATE", dataFormat:'date'},
            {name : "Debit Note Created By", id:"UM_USER_NAME"},
            {name : "Status", id:"STATUS_DESC", width:'143px'},
            {name : "Amount Description", id:"AMOUNT", dataFormat:'price'},
        ];

        let _table_header_1 = [
            {name : "Level", id:"POM_PO_NO", width:'100px', key:true, dataFormat:'index', type:'index'},
            {name : "Approving Officer", id:"AO_NAME", width:'100px',  formatter: (cellContent, row) => {
                let _details =  (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{row.AO_NAME}</div>;
            }},
            {name : "A_Approving Officer", id:"AAO_NAME", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{row.AAO_NAME}</div>;
            }},
            {name : "Approval Type", id:"approvalType", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                let elementData = row;
                let _invoice_amount = _total
                let aoLimit = elementData.AO_LIMIT ? elementData.AO_LIMIT : 0;
                let _sub_details = '';
                _sub_details= 'Approval';
                
                if (elementData.FA_AGA_TYPE == 'FO' && (_invoice_amount < aoLimit)) {
                    _sub_details= 'N/A';
                }

                if (_sub_details== 'N/A' && prevAppType == 'Approval') {
                    prevAppType = 'Already Set'
                    _sub_details= 'Approval';
                }

                if (prevAppType !== 'Already Set') {
                    prevAppType =_sub_details;
                }

                if (row.FA_AO_ACTION && ((row.FA_SEQ-1) == row.FA_AO_ACTION) && ((this.props.search_list && this.props.search_list.invDetail[0] && this.props.search_list.invDetail[0].IM_INVOICE_STATUS)==5)){
                    return <div className={_details}>Hold</div>
                }
                else{
                    return <div className={_details}>{_sub_details}</div>
                }

            }},
            {name : "Approved Date", id:"FA_ACTION_DATE", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{(row.FA_ACTION_DATE) ? ddmmyy(row.FA_ACTION_DATE) : ''}</div>;
            }},
            {name : "Remarks", id:"FA_AO_REMARK", width:'100px',formatter: (cellContent, row) => {
                let _details = (_selected_index==row.FA_SEQ) ? 'bold_row' : ''
                return <div className={_details}>{(row.FA_AO_REMARK && row.FA_AO_REMARK!=null && row.FA_AO_REMARK!='null') ? row.FA_AO_REMARK : ''}</div>;
            }},
        ];

        if(this.props.location && this.props.location.redirect_to_tab=="VerifiedInvoice"){
            let _hightlight = true
            _table_header_1 = [
                {name : "Level", id:"POM_PO_NO", width:'100px', key:true, dataFormat:'index', type:'index'},
                {name : "Approving Officer", id:"AO_NAME", width:'100px',  formatter: (cellContent, row) => {
                    let _details =  (_selected_index==row.FA_SEQ || _selected_index+1==row.FA_SEQ) ? 'bold_row' : ''
                    return <div className={_details}>{row.AO_NAME}</div>;
                }},
                {name : "A_Approving Officer", id:"AAO_NAME", width:'100px',  formatter: (cellContent, row) => {
                    let _details = (_selected_index==row.FA_SEQ || _selected_index+1==row.FA_SEQ) ? 'bold_row' : ''
                    return <div className={_details}>{row.AAO_NAME}</div>;
                }},
                {name : "Approval Type", id:"approvalType", width:'100px',  formatter: (cellContent, row) => {
                  
                    let _details = (_selected_index==row.FA_SEQ || _selected_index+1==row.FA_SEQ) ? 'bold_row' : ''
                    let elementData = row;
                    let _invoice_amount = _total
                    let _sub_details ='';
                    let aoLimit = elementData.AO_LIMIT ? elementData.AO_LIMIT : 0;
                    _sub_details= 'Approval';
                    if (elementData.FA_AGA_TYPE == 'FO' && (_invoice_amount < aoLimit)) {
                        _sub_details= 'N/A';
                    }
    
                    if (_sub_details== 'N/A' && prevAppType == 'Approval') {
                        prevAppType = 'Already Set'
                        _sub_details= 'Approval';
                    }
    
                    if (prevAppType !== 'Already Set') {
                        prevAppType =_sub_details;
                    }

                    if (row.FA_AO_ACTION && ((row.FA_SEQ-1) == row.FA_AO_ACTION) && ((this.props.search_list && this.props.search_list.invDetail[0] && this.props.search_list.invDetail[0].IM_INVOICE_STATUS)==5)){
                        return <div className={_details}>Hold</div>
                    }
                    else{
                        return <div className={_details}>{_sub_details}</div>
                    }

                }},
                {name : "Approved Date", id:"FA_ACTION_DATE", width:'100px',  formatter: (cellContent, row) => {
                    let _details = (_selected_index==row.FA_SEQ || _selected_index+1==row.FA_SEQ) ? 'bold_row' : ''
                    return <div className={_details}>{(row.FA_ACTION_DATE) ? ddmmyy(row.FA_ACTION_DATE) : ''}</div>;
                }},
                {name : "Remarks", id:"FA_AO_REMARK", width:'100px',formatter: (cellContent, row) => {
                    let _details = (_selected_index==row.FA_SEQ || _selected_index+1==row.FA_SEQ) ? 'bold_row' : ''
                    return <div className={_details}>{(row.FA_AO_REMARK && row.FA_AO_REMARK!=null) ? row.FA_AO_REMARK : ''}</div>;
                }},
            ];
        }

      

        return <div id="tabs">
                    <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
                        this.setState({active_key:k})   
                        this.props.history.push({
                            pathname: 'RequesterInvoiceManagement',
                            redirect_to_tab : k,
                        })
                    }}>
                     <Tab eventKey="PurchaseOrder" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER')) ? "Verified Invoice" : "New Invoice"}>
                        <div className="tab-content py-3 px-3 px-sm-0">
                        <Fragment>
                                {(this.props.requester_invoice_loader) ? <Loader /> : '' }
                                {(this.props.file_upload_ld) ? <Loader /> : '' }
                                {(this.props.file_delete_ld) ? <Loader /> : '' }
                                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                                {(this.state.loading) ? <Loader /> : '' }
                                {(this.props.dr_loading) ? <Loader /> : '' }
                                {(this.props.gipdf_loader) ? <Loader /> : '' }
                                {(this.props.debit_pdf_loading) ? <Loader /> : '' }
                                {(this.props.credit_pdf_loading) ? <Loader /> : '' }
                                
                                
                            <form onSubmit={handleSubmit(this.submit_invoice.bind(this))}>
                            {(this.state.products && this.state.products.displayheader!=false) ? 
                            <div></div> : ''}
                            <TabHeading color={'bg-info text-white'}>Invoice Header</TabHeading> 
                            <div className="" >
                            <div className="row">
                                            <div className="col-12 md-2 col-lg-2"><label>Vendor : </label></div>
                                                <div className="col">
                                                    <address>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_COY_NAME+" \n":''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_ADDR_LINE1+" \n":''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? `${this.props.search_list.invMstr[0].POM_S_ADDR_LINE2}\n` : ''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_ADDR_LINE3 ? `${this.props.search_list.invMstr[0].POM_S_ADDR_LINE3}\n` : '' : ''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_POSTCODE+" \n":''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_CITY+" \n":''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0] && this.props.search_list.invMstr[0].S_State) ? this.props.search_list.invMstr[0].S_State+" \n":''}
                                                        {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0] && this.props.search_list.invMstr[0].S_Country) ? this.props.search_list.invMstr[0].S_Country+" \n":''}
                                                        
                                                    </address>
                                                </div>

                                                <div className="col-xs-12 col-sm-6">
                                                    <div className="row">

                                                    
                                                            <Fragment>
                                                                <div className="col-12">
                                                                {this.state.show_status ?
                                                                        <div className="row">
                                                                    
                                                                            <div className="col-12 md-4 col-lg-4">
                                                                                <label>Status : </label> 
                                                                            </div>
                                                                            <div className="col">
                                                                                <p style={{display:'inline-block'}}>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].STATUS_DESC:''}</p>
                                                                            </div>
                                                                        </div>
                                                                        :''}
                                                                </div>
                                                                <div className="col-12">
                                                                
                                                                    <div className="row">
                                                                            <div className="col-12 md-4 col-lg-4">
                                                                                <label>Vendor Code  : </label> 
                                                                            </div>
                                                                            <div className="col">
                                                                            <p style={{display:'inline-block'}}>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_COY_ID:''}</p>
                                                                            </div>
                                                                    </div>
                                                                    
                                                                    <label> </label> 
                                                                </div>
                                                            </Fragment>
                                                    
                                                    </div>
                                                </div>
                                                </div> 

                                        
                                        

                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>Business Reg Number : </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].CM_BUSINESS_REG_NO:''}</p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Invoice No:  </label></div>
                                                <div className="col"><p>{(this.state.products) ? this.state.products.IM_INVOICE_NO:''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>Telephone Number : </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_PHONE:''}</p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Date</label></div>

                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? ddmmyy(this.props.search_list.invMstr[0].POM_PO_DATE):''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>Email :    </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_S_EMAIL:''}</p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Vendor Ref: </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].IM_OUR_REF:''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>Bill To : </label></div>
                                                <div className="col"><address>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].CM_COY_NAME+" \n":''}
                                                                                {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_B_ADDR_LINE1+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_B_ADDR_LINE2+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0].POM_B_ADDR_LINE3) ? this.props.search_list.invMstr[0].POM_B_ADDR_LINE3+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_B_CITY+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_B_POSTCODE+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0])  ? this.props.search_list.invMstr[0].STATE+" \n":''}
                                                    {(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0])  ? this.props.search_list.invMstr[0].COUNTRY+" \n":''}
                                                    </address></div>
                                                <div className="col-12 md-2 col-lg-2"><label>PAMB Ref: </label></div>
                                                <div className="col"><p className="align_numbers">{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0] && this.props.search_list.invMstr[0].IM_YOUR_REF) ? (this.props.search_list.invMstr[0].IM_YOUR_REF.replace('null','')).split(',').join(', '):''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>File Attached : </label></div>
                                                <div className="col">
                                                {(this.props.search_list && this.props.search_list.displayAttachFile && this.props.search_list.displayAttachFile.length > 0 && this.props.search_list.displayAttachFile[0].Text!=="No Files Attached" ) ? this.props.search_list.displayAttachFile.map((list, index) => {
                                                    return <p className="download-files"><u><span className="downloadPointer"  onClick={() => this.props.GetDownloadFile(list)}>{list.strFile} ({list.Text}) &nbsp;&nbsp;</span></u> </p>
                                                }) : <div className="nofile">No Files Attached</div>}
                                                </div>
                                                <div className="col-12 md-2 col-lg-2"><label>Payment Terms: </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? HandlePaymentTerm(this.props.search_list.invMstr[0].POM_PAYMENT_TERM):''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label>Vendor Remarks : </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0] && this.props.search_list.invMstr[0].IM_REMARK!='undefined') ? this.props.search_list.invMstr[0].IM_REMARK:''}</p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Payment Method: </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_PAYMENT_METHOD:''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label> </label></div>
                                                <div className="col"><p></p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Shipment Terms: </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_SHIPMENT_TERM:''}</p></div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 md-2 col-lg-2"><label> </label></div>
                                                <div className="col"><p></p></div>
                                                <div className="col-12 md-2 col-lg-2"><label>Shipment Mode: </label></div>
                                                <div className="col"><p>{(this.props.search_list &&  this.props.search_list.invMstr && this.props.search_list.invMstr[0]) ? this.props.search_list.invMstr[0].POM_SHIPMENT_MODE:''}</p></div>
                                            </div>
                            
                                            <TabHeading color={'bg-info text-white margin-bottom-none'}> Approval Workflow</TabHeading> 
                                            <div className="main_detaials">
                                                    <BootstrapCustomTable 
                                                        table_header={_table_header_1} 
                                                        table_body={(this.props.search_list && this.props.search_list.financeApprFlow) ? this.props.search_list.financeApprFlow : [] } 
                                                        products={this.getProducts} 
                                                        select={false} 
                                                        selectname={'pr_no'} 
                                                        app_details ={(this.props.search_list && this.props.search_list.invDetail) ? this.props.search_list.invDetail :[] }
                                                        responsive={true} 
                                                        click={true}
                                                        search={false}
                                                        table_name="issue_grn"
                                                        get_details = {this.get_details}
                                                        invoiceAmount = {this.props.search_list && this.props.search_list.invDetail && this.props.search_list.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE), 0).toFixed(2) + parseFloat((this.props.search_list &&  this.props.search_list.invDetail && this.props.search_list.invDetail[0]) ? this.props.search_list.invDetail[0].IM_SHIP_AMT:'0.00').toFixed(2)}
                                                    />
                                                </div>
                                                    
                                                <br/>
                                                <BootstrapCustomTable 
                                                        table_header={_table_header} 
                                                        table_body={this.state.table_body} 
                                                        products={this.getProducts} 
                                                        select={false} 
                                                        selectname={'pr_no'} 
                                                        app_details ={(this.props.search_list && this.props.search_list.invDetail) ? this.props.search_list.invDetail :[] }
                                                        responsive={true} 
                                                        click={true}
                                                        search={false}
                                                        footer={false}
                                                        table_name="issue_grn"
                                                        get_details = {this.get_details}
                                                        invoiceAmount = {(this.props.search_list && this.props.search_list.invDetail && this.props.search_list.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE), 0).toFixed(2)) + parseFloat((this.props.search_list &&  this.props.search_list.invDetail && this.props.search_list.invDetail[0]) ? this.props.search_list.invDetail[0].IM_SHIP_AMT:'0.00').toFixed(2)}
                                                />
                                                    


                                        {(_width) ? <TotalGrid
                                            table_header = {_table_header}
                                            body_text={['Sub Total', 'Tax', 'Shipping & Handling', 'Grand Total']}
                                            body_value={[NumberFormate(_sub_total), NumberFormate(_sub_gst), NumberFormate(_shipping_amount), (_total ? NumberFormate(_total) : 0)]}
                                            body_type={['text', 'text', 'text', 'text']}
                                            text_grid={7-_width}
                                            total={8-_width}
                                            total_td={2}
                                            body_loop={4}
                                            adjust={13}
                                        /> : ''}   

                                        {(this.props.search_list && this.props.search_list.cnSummary && this.props.search_list.cnSummary.length>0) ?
                                        <Fragment>
                                        <TabHeading color={'bg-info text-white margin-bottom-none'}> Credit Note/Credit Advice Summary  </TabHeading>
                                        <BootstrapCustomTable 
                                            table_header={_credit_note} 
                                            table_body={this.props.search_list.cnSummary} 
                                            products={this.getProducts} 
                                            select={false} 
                                            selectname={'cd_no'} 
                                            responsive={true} 
                                            click={true}
                                            search={false}
                                            table_name="cd_no"
                                
                                        /></Fragment> : ''}

                                        {(this.props.search_list && this.props.search_list.dnSummary && this.props.search_list.dnSummary.length>0) ?
                                        <Fragment>
                                        <TabHeading color={'bg-info text-white margin-bottom-none'}> Debit Note/Debit Advice Summary  </TabHeading>  
                                        <BootstrapCustomTable 
                                            table_header={_debit_note} 
                                            table_body={this.props.search_list.dnSummary} 
                                            products={this.getProducts} 
                                            select={false} 
                                            selectname={'dn_no'} 
                                            responsive={true} 
                                            click={true}
                                            search={false}
                                            table_name="dn_no"
                                        /></Fragment> : ''}
                                        {(this.state.products && this.state.products.FromPage && this.state.products.FromPage!='vi') ? 
                                            <div className="mt-2 row">
                                                <div className="col-lg-2 col-md-2"><label className="form-label">Remarks :</label></div>
                                                        <div className="col"><textarea rows="1" className="form-control" onChange={(e) => {this.getTextBoxValues(e)}} value={this.state.remarks}></textarea></div>
                                                <div className="col-lg-4 col-md"><label className="form-label"></label></div>
                                            </div>
                                        :''}
                                    </div> 
                                    
                                    <div className="mt-2 row">
                                        <div className="col-12 col-sm-6 text-left go-back">
                                            <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                        </div>
                                        <div className="col-12 col-sm-6 text-right">
                                            <div>
                                            {(this.state.products && this.state.products.FromPage!='vi') ? 
                                                <Fragment>
                                                
                                                
                                                    <button type="button" className="btn btn-outline-primary btn-sm ml-2" onClick={this.saveInvoice}>Save</button>
                                                    <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={this.submitToRequesterInvoiceVerify} >{!this.state.show_status ? 'Approve Invoice' : 'Verify Invoice'}</button>
                                                    {_user_details.ROLE_NAME === 'FINANCE MANAGER ' ?  <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={this.HoldInvoice}>Hold Invoice</button> : ''}
                                                    <button type="button" className="btn btn-outline-info btn-sm ml-2" onClick={this.viewInvoicePDF}>View Invoice</button>
                                                </Fragment>
                                            :''}
                                            
                                            {(this.state.products && this.state.products.FromPage=='vi') ?  <button type="button" className="btn btn-outline-info btn-sm ml-2" onClick={this.viewInvoicePDF}>View Invoice</button> : ''}    
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <Modal size="lg" open={this.state.table_modal_popup} header ={true} title ={this.state.modal_title} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                                    <button type='button' className='btn btn-sm btn-outline-info' onClick={ this.emptyModel }>Save</button> 
                                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                                    <h5>{this.state.modal_body}</h5>
                                
                                    <Fragment>
                                        {/* <form onSubmit={handleSubmit(this.handleformsubmit.bind(this))}> */}
                                            <div className="mt-2">
                                                <BootstrapTable
                                                    table_header={this.state.table_model_header} 
                                                    table_body={this.state.table_model_body} 
                                                    select={true} 
                                                    mode={'radio'}
                                                    radioname={'code'} 
                                                    responsive={false} 
                                                    products = {this.getSelectedProduct}
                                                    inputPrefix = 'raisePOForm'
                                                />
                                            </div>
                                        {/* </form> */}
                                    </Fragment>
                                
                                </Modal>
                                <Alert 
                                    message={this.state.modal_body}
                                    status={this.state.status} 
                                    show={this.state.model} 
                                    confirm={this.closemodel}
                                />
                                
                        </Fragment>
                        </div>
                    </Tab>
                    <Tab eventKey="VerifiedInvoice" title={(_user_details.ROLE_NAME.includes('Manager') || _user_details.ROLE_NAME.includes('MANAGER') ) ? "Approved Invoice" : "Verified Invoice"}>
                        <div className="tab-content py-3 px-3 px-sm-0">

                        </div>
                    </Tab>
                    {(_user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') || _user_details.UM_USER_ID.startsWith('FM') || _user_details.UM_USER_ID.startsWith('fm') ) ? '' : <Tab eventKey="PaidInvoice" title="Paid Invoice">
                                <div className="tab-content py-3 px-3 px-sm-0">
                                </div>
                        </Tab>}
                        {(_user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('officer') || _user_details.ROLE_NAME.includes('OFFICER') || _user_details.ROLE_NAME.includes('Verifier') || _user_details.ROLE_NAME.includes('VERIFIER')) ? 
                        <Tab eventKey="PendingFYFA" title="Pending FYFA">
                                <div className="tab-content py-3 px-3 px-sm-0">
                               
                                </div>
                        </Tab> :'' }
                </Tabs>
            </div>
    }
}

const mapStateToProps = (state) =>({
    search_list : state.requester_invoice_search.responseList,
    requester_invoice_loader : state.requester_invoice_search.loading,
    gipdf_loader : state.generate_ipdf.loading,
    invoice_header : state.invoice_header.responseList,
    invoice_header_leader : state.invoice_header.loading,
    dr_loading : state.file_download.loading,
    fund_type_project_code_l1 : state.fund_type_project_code.responseListL1,

    credit_pdf : state.generate_credit_pdf,
    credit_pdf_loading : state.generate_credit_pdf.loading,

    debit_pdf : state.generate_debit_pdf,
    debit_pdf_loading : state.generate_debit_pdf.loading,

    fill_tax_code : state.fill_tax_code.responseList,
    fill_tax_code_loading : state.fill_tax_code.loading,

})
const mapDispatchToProps = (dispatch) =>({
    GetViewInvoiceDetailsClick : (values) => dispatch(GetViewInvoiceDetailsClick(values)),
    FundTypeOrPersonCode : (values) => dispatch(FundTypeOrPersonCodeORProjectCodeAction(values)),
    GetInvoiceHeader : (values) => dispatch(GetInvoiceHeader(values)),
    GetInvoicePDF : (values) => dispatch(GetInvoicePDF(values)),
    GetGenerateDEBITPDF  : (values) => dispatch(GetGenerateDEBITPDF(values)),
    GetGenerateCREDITPDF  : (values) => dispatch(GetGenerateCREDITPDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetFillTaxCode : (values) => dispatch(GetFillTaxCode(values)),
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default reduxForm({
    form:'InvoiceViewDetails',
    InvoiceDetails
})(MainRoute);

