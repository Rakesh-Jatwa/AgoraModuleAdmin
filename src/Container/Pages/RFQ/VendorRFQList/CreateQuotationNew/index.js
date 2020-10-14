import React, {Component, Fragment} from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import TabHeading from '../../../../../Component/Heading/TabHeading';

import {GetNewQuoteDetails, GetDownloadFile, GetDeleteFileMain, GetFillGST,GetFillTax} from '../../../../../Actions/Vendor'
import {GetRaiseRFQPageLoadDetails, GetRFQPDFGenerate} from '../../../../../Actions/Approver'
import {Field, reduxForm} from 'redux-form';
import {UploadDocuments, ClearUploadDocuments} from '../../../../../Actions/Requester'
import Loader from '../../../../../Component/Loader'
import {ddmmyy, TodayDateSalash} from '../../../../../Component/Dates'
import {connect} from 'react-redux';
import Enum from '../../../../../Common/GlobalEnum'
import Alert from '../../../../../Component/Modal/alert'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel'
import {numeric, decimal} from '../../../../../validation'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {VendorRfqSubmit} from '../../../../../Apis/Vendor'  
import {Unablesupply, RemoveImages} from '../../../../../Apis/Approver'
import {UserDetails} from '../../../../../Common/LocalStorage'
import {FormDatePicker} from '../../../../../Component/From/FromInputs';
import {NumberFormate, HandlePaymentTerm, round_decimal} from '../../../../../Actions/Common/Functions'
import {GetE2PPopTaxCode} from '../../../../../Actions/Approver'



class QuotationListing extends Component{

    constructor(props){
        super(props);
        this.state = {
            products:[],
            all_products:[],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status : false, 
            loading: false, 
            checked_initial : [0,1,2],
            checked_details:[],
            details : {},
            vendor_details : {},
            all_ship_term : [],
            all_ship_mode : [],
            GstQuo :false,
            strGstRegNo : '',
            quotaion_details : [],
            rendered : false,
            upload_details:false,
            external_file : '',
            external_file_name : '',
            show_tax : false,
            attachments : [],
            delete:false,
            loading:false,
            start_data : '',
            redate:false,
            user_attachments : [],
            confimation:false,
            confimation_pop:false ,
            confimation_type : '',
            vendor_remark:'',
            active_key : 'Test_details_1',
            tab_name : '',
            vendor_select_details : {
                RM_Shipment_Term:'',
                RM_Shipment_Mode:'',
            }
        }
    }

    async componentDidMount(){
        this.props.GetE2PPopTaxCode();
        if(this.props.location && this.props.location.datas){
            console.log('this.props.location.data', this.props.location.datas)
            await ApiExtract(RemoveImages, {qto_number : this.props.location.datas.RFQ_NO});
            this.props.GetFillGST({"RM_Coy_ID":(this.props.location.datas) ? this.props.location.datas.vcomid : ''})
            this.props.GetFillTax()
            this.props.ClearUploadDocuments()
            this.props.GetNewQuoteDetails({RFQ_NO:this.props.location.datas.RFQ_NO ,RFQ_ID:this.props.location.datas.RFQ_ID,EDIT:(this.props.location && this.props.location.datas && this.props.location.datas.RESUBMIT) ? this.props.location.datas.RESUBMIT : "", RESUBMIT :this.props.location.datas.RESUBMIT})
            if(this.props.location.redirect_to_tab=="OutstandingRFQ"){
                this.setState({
                    tab_name : "Outstanding RFQ",
                })
            }
            else if(this.props.location.redirect_to_tab=="QuotationListing"){
                this.setState({
                    tab_name : "Quotation Listing",
                })
            }
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.length > 0 && (!state.rendered)){
            return {
                details: props.search_result[0],
                // start_data : (props.search_result[0] && props.search_result[0].RM_Reqd_Quote_Validity ) ? props.search_result[0].RM_Reqd_Quote_Validity : new Date(),
                vendor_remark : (props.search_result[0] && props.search_result[0].RRM_Remarks ) ? props.search_result[0].RRM_Remarks : (props.search_result[0].RM_Remark) ? props.search_result[0].RM_Remark : '',
                vendor_details : (props.search_result && props.search_result[0].vendor_details && props.search_result[0].vendor_details.length > 0) ? props.search_result[0].vendor_details[0] : {},
                all_ship_term :  (props.search_result && props.search_result[0].all_ship_term) ? props.search_result[0].all_ship_term : [],
                all_ship_mode :  (props.search_result && props.search_result[0].all_ship_mode) ? props.search_result[0].all_ship_mode : [],
                GstQuo :  (props.search_result && props.search_result[0].GstQuo) ? props.search_result[0].GstQuo : false,
                strGstRegNo : (props.search_result && props.search_result[0].GstQuo) ? props.search_result[0].strGstRegNo : false,
                quotaion_details :  (props.search_result && props.search_result[0].quotaion_details) ? props.search_result[0].quotaion_details : [],
                rendered : (props.search_result && props.search_result[0].quotaion_details) ? true : false,
                rerendered : (props.search_result && props.search_result[0].quotaion_details) ? true : false,
                attachments : (props.search_result && props.search_result[0].COMPANY_DOC_ATTACHMENT) ? props.search_result && props.search_result[0].COMPANY_DOC_ATTACHMENT : [],
                user_attachments : (props.search_result && props.search_result[0].QUOTATION_ATTACHMENT) ? props.search_result && props.search_result[0].QUOTATION_ATTACHMENT : [],
            }
            
        }
        else if(!state.upload_details && !state.delete && props.file_upload && props.file_upload.displayAttachFile && props.file_upload.displayAttachFile.attachFileList){
            return {
               user_attachments : (props.file_upload.displayAttachFile.attachFileList) ? props.file_upload.displayAttachFile.attachFileList : [],
            }
        }
        else if(!state.file_delete && state.delete && props.file_delete && props.file_delete.displayAttachFile && props.file_delete.displayAttachFile.attachFileList){
            return {
                user_attachments : (props.file_delete.displayAttachFile.attachFileList) ? props.file_delete.displayAttachFile.attachFileList : [],
            }
        }
        else if(props.search_result.length == 0){
            return {
                details: [],
                vendor_details : [],
                all_ship_term :  [],
                all_ship_mode :  [],
                GstQuo :   false,
                quotaion_details : [],
                rendered : false,
                rerendered : false,
                attachments : []
            }
        }

        
        return null
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
     }

    closemodel = () => {
        this.setState({
            model : false
        })

        if(this.state.status){
            console.log('details',this.props.GetRaiseRFQPageLoadDetails() )
            this.props.GetRaiseRFQPageLoadDetails();
       
            this.props.ClearUploadDocuments()
            this.props.history.push({
                pathname:'/VendorRFQList'
            })
           
        }
    }


    handleChange = (value, param) => {
        let _details = this.state.vendor_details
        let {vendor_remark, vendor_select_details,  all_ship_mode,all_ship_term} =  this.state;
        let _temp_details = {..._details};
        if (param === 'username') {
            _temp_details.User_Name = value;
        }
        if (param === 'phone') {
            _temp_details.Phone = value;
        }
        if (param === 'email') {
            _temp_details.Email = value;
        }
        if (param === 'shipment_mode') {
            _temp_details.RM_Shipment_Mode = value;
            if(all_ship_mode.length>0){
                let _temp_details = all_ship_mode.filter((list_details)=>list_details.CODE_DESC==value);
                if(_temp_details && _temp_details.length){
                    vendor_select_details.RM_Shipment_Mode = (_temp_details[0] && _temp_details[0].CODE_ABBR) ? _temp_details[0] && _temp_details[0].CODE_ABBR.trim() : '4';
                }
            }
          
            
        }
        if (param === 'shipment_term') {
            _temp_details.RM_Shipment_Term = value;
            if(all_ship_mode.length>0){
                let _temp_details = all_ship_term.filter((list_details)=>list_details.CODE_DESC==value);
                if(_temp_details && _temp_details.length){
                    vendor_select_details.RM_Shipment_Term = (_temp_details[0] && _temp_details[0].CODE_ABBR) ? _temp_details[0] && _temp_details[0].CODE_ABBR.trim() : '4';
                }
            }

        }
        if (param === 'remarks') {
            vendor_remark = value;

        }
        this.setState({
            vendor_details : _temp_details,
            vendor_remark : vendor_remark,
            vendor_select_details : vendor_select_details
        })
    }

    handleitemChange = (value, param, index) => {
        let _details = this.state.quotaion_details
        if(_details.length > 0 &&  _details[index]){
            let _target =  _details[index]
            if(_target){
                let _temp_details = {..._target};
                if (param === 'RRDT_Min_Pack_Qty') {
                    _temp_details.RRDT_Min_Pack_Qty = value;
                }
                if (param === 'RRDT_Min_Order_Qty') {
                    _temp_details.RRDT_Min_Order_Qty = value;
                }
                if (param === 'RRDT_GST') {
                    _temp_details.RRDT_GST = parseFloat(value);
                }
                if (param === 'RRDT_Delivery_Lead_Time') {
                    _temp_details.RRDT_Delivery_Lead_Time = value;
                }
                if (param === 'RRDT_Warranty_Terms') {
                    _temp_details.RRDT_Warranty_Terms = value;
                }
                if (param === 'RRDT_Remarks') {
                    _temp_details.RRDT_Remarks = value;
                }
                if(param === 'gst'){
                    _temp_details.gst = (value.options[value.selectedIndex].value!='N/A') ? value.options[value.selectedIndex].value : 0;
                    _temp_details.Tax = value.options[value.selectedIndex].text;
                    _temp_details.RRDT_GST =  (value.options[value.selectedIndex].value!='N/A') ? value.options[value.selectedIndex].value : 0;
                }

                if(_temp_details.gst){
                    let _details =  _temp_details.RRDT_Quantity * _temp_details.RRDT_Unit_Price
                    _temp_details.RRDT_GST = ((_temp_details.gst/100) * _details)
                }
                else{
                    _temp_details.RRDT_GST = 0
                }
       
                console.log('_temp_details_main', _temp_details, _temp_details.gst)

                _details[index] = _temp_details
                this.setState({
                    quotaion_details : _details
                })
            }
        }
       
    }

    checkUnitPrice = (quotaion_details) => {
        let status = true;
        for (let index = 0; index < quotaion_details.length; index++) {
            const element = quotaion_details[index];
            if (element.RRDT_Unit_Price === "0.00" || element.RRDT_Unit_Price == "0.00" || element.RRDT_Unit_Price === null || element.RRDT_Unit_Price === "") {
                status = false;
                break;
            }
        }
        return status;
    }

    

    update_qunatity = (e, index) => {
        let _details  = this.state.quotaion_details
        let _value = (e.target.value) ? parseFloat(e.target.value) : 0
        let _temp_details = _details;
        _temp_details[index].RRDT_Amount = (_value) ? (_value * _temp_details[index].RRDT_Quantity) : 0
        _temp_details[index].RRDT_Amount = (_value && _temp_details[index].RRDT_Amount) ? _temp_details[index].RRDT_Amount : 0 
        _temp_details[index].RRDT_Amount = round_decimal( _temp_details[index].RRDT_Amount, 2)
        
        console.log('_temp_details[index].RRDT_Amount', _temp_details[index].RRDT_Amount)
        _temp_details[index].RRDT_Unit_Price = ((_value) ? _value : 0)
        if(_temp_details[index].gst){
            _temp_details[index].gst = parseFloat(_temp_details[index].gst)
            if(_temp_details[index].gst){
                let _details =  _temp_details[index].RRDT_Quantity * _temp_details[index].RRDT_Unit_Price
                _temp_details[index].RRDT_GST = ((_temp_details[index].gst/100) * _details)
            }
            else{
                _temp_details[index].RRDT_GST = 0
            }
        }
       
        this.setState({
            quotaion_details : _temp_details
        })
    }

    file_upload = (e, index) => {
        let _details  = this.state.quotaion_details
        let _value = e.target.value
        let _temp_details = _details;
        _temp_details[index].RRDT_Amount = _value * _temp_details[index].RRDT_Quantity;
        _temp_details[index].RRDT_Unit_Price = _value;
        this.setState({
            quotaion_details : _temp_details
        })
    }

    SendUpload = (e) => {
        if(e.target.files && e.target.files.length){
            this.setState({
                external_file : e.target.files[0],
                external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
    }

    download_pdf = () => {
        let _user_details = UserDetails();
        console.log('_user_details', _user_details)
        let _pdf_datas = { "VendorRequired": "T", "prmVCoyID":_user_details.UM_COY_ID, "RFQ_No": this.state.details.RM_RFQ_No, "BCOY_ID": this.state.details.RM_Coy_ID };
        this.props.GetRFQPDFGenerate(_pdf_datas)
    }
  
     

    FileUpload = (attachment) => {
        this.setState({delete:false})
        let req = {
            "pEnumUploadType": Enum.EnumUploadType.DocAttachment,
            "strDocType": "QuotTemp",
            "pEnumUploadForm": Enum.EnumUploadFrom.FrontOff,
            "strDocNo": this.state.details != '' ? this.state.details.RM_RFQ_No : "",
            "blnTemp": "false",
            "strIndex": "",
            "seq": "",
            "pFrontOfficeSite": "",
            "AttachType": "E",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": "New"
        }
        if(this.state.external_file){
            this.props.UploadDocuments(this.state.external_file, req)
            this.setState({
                external_file:'',
                external_file_name:''
            })
            attachment.target.value = "";
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Select a file to upload",
                loading:false,
            })
        }
       
    }

    delete_file = async (delete_file) =>{
       await this.setState({ delete : true})
        let _details = Object.assign({},delete_file, {AttachType:'E', modeType:'New', CDA_DOC_NO:(this.state.details != '' ? this.state.details.RM_RFQ_No : "")})
      
        _details.AttachType = "E"
        console.log('_details', this.state.delete)
        this.props.GetDeleteFile(_details)
    }

    quatation_submit = async (e) => {
        let _details =  Object.assign({},this.state.details)
        let _temp_1details = Object.assign({},this.state)
        let {vendor_select_details, all_ship_mode, all_ship_term} = _temp_1details
        let _temp_qt = new Array();
        this.state.quotaion_details.forEach((element)=> {
            if (element.RRDT_Unit_Price !== "0.00" && element.RRDT_Unit_Price != "0.00" && element.RRDT_Unit_Price !== null && element.RRDT_Unit_Price !== "") {
                _temp_qt.push(element)
            }
        })

        

        if(_temp_qt.length){
            let total = 0;
            for (let index = 0; index < _temp_qt.length; index++) {
                const element = _temp_qt[index];
                console.log('_temp_qt', _temp_qt)
                total += parseFloat(element.RRDT_Amount) + parseFloat((element.gst && element.gst!='null') ? ((element.RRDT_Quantity * element.RRDT_Unit_Price) * parseFloat(element.gst/100).toFixed(2)) : 0)
             
            }


            if (_details.RM_Shipment_Term) {
                _details.RM_Shipment_Term = (_details.RM_Shipment_Term) ? _details.RM_Shipment_Term.trim() : ''
                if(all_ship_mode.length>0){
                    let _temp_details = all_ship_term.filter((list_details)=>list_details.CODE_DESC==_details.RM_Shipment_Term);
                    if(_temp_details && _temp_details.length){
                        _details.RM_Shipment_Term = (_temp_details[0] && _temp_details[0].CODE_ABBR) ? _temp_details[0].CODE_ABBR.trim() : '4';
                    }
                }
            }


            if (_details.RM_Shipment_Mode) {
                _details.RM_Shipment_Mode = (_details.RM_Shipment_Mode) ? _details.RM_Shipment_Mode.trim() : ''
                if(all_ship_term.length>0){
                    let _temp_details = all_ship_mode.filter((list_details)=>list_details.CODE_DESC==_details.RM_Shipment_Mode);
                    if(_temp_details && _temp_details.length){
                        _details.RM_Shipment_Mode = (_temp_details[0] && _temp_details[0].CODE_ABBR) ? _temp_details[0].CODE_ABBR.trim() : '4';
                    }
                }
            }

            _details.total = parseFloat(total);
            _details.RM_Shipment_Term = (vendor_select_details.RM_Shipment_Term) ? vendor_select_details.RM_Shipment_Term  : ((_details.RM_Shipment_Term)  ? _details.RM_Shipment_Term:  'Not Applicable')
            _details.RM_Reqd_Quote_Validity = (this.state.start_data) ? this.state.start_data : (this.state.details.RRM_Offer_Till) ? this.state.details.RRM_Offer_Till : this.state.details.RM_Reqd_Quote_Validity;
            _details.RM_Shipment_Mode =  (vendor_select_details.RM_Shipment_Mode) ? vendor_select_details.RM_Shipment_Mode  : ((_details.RM_Shipment_Mode)  ? _details.RM_Shipment_Mode:  'Not Applicable')
            _details.RM_EXP_DATE = (this.state.start_data) ? this.state.start_data : (this.state.details.RRM_Offer_Till) ? this.state.details.RRM_Offer_Till : this.state.details.RM_Reqd_Quote_Validity;
            _details.RM_RFQ_Name = (_details.RM_RFQ_Name!="undefined" && _details.RM_RFQ_Name) ? _details.RM_RFQ_Name : ''
            _details.vendor_details = this.state.vendor_details
            _details.all_ship_term = this.state.all_ship_term
            _details.all_ship_mode = this.state.all_ship_mode
            _details.total_products = this.state.quotaion_details.length
            _details.qp_products = _temp_qt.length
            _details.qu_products = (_details.total_products) ? (_details.total_products - _temp_qt.length) : 0
            _details.GstQuo = this.state.GstQuo
            _details.quotaion_details = this.state.quotaion_details
            _details.EDIT = (this.props.location && this.props.location.datas && this.props.location.datas.RESUBMIT) ? this.props.location.datas.RESUBMIT : ""
            _details.RM_Remark =  this.state.vendor_remark
            console.log('_details.RRDT_GST_123', _details.hasOwnProperty('gst'), _details, _details.RRDT_GST)
            
            _details.quotaion_details.forEach((list_details,index)=>{
                if(list_details.hasOwnProperty('gst') && list_details.RRDT_GST){
                    _details.quotaion_details[index].gst = parseFloat(list_details.gst)
                }
                else if(list_details.RRDT_GST){
                    _details.quotaion_details[index].gst = (list_details.RRDT_GST) ? list_details.RRDT_GST : 'N/A';
                    _details.quotaion_details[index].Tax = (list_details.RRDT_GST_RATE) ? list_details.RRDT_GST_RATE : 'N/A';
                }
                else{
                    
                }
            })
            
            this.setState({loading:true})
            let _status = await ApiExtract(VendorRfqSubmit, _details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                modal_body : "Enter unit price to create quotation",
                status : false,
                model : true,
            })
        }
    }

    UnabletoSupply = async () =>{
       
        if(this.props.location && this.props.location.datas){
            let _details = this.props.location.datas
            let _temp_details= {
                vcomid : _details.vcomid,
                rfq_id: _details.RFQ_ID,
                rfq_no : _details.RFQ_ID,
            }
            this.setState({loading:true})
            let _status = await ApiExtract(Unablesupply, _temp_details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                rfq_no : _details.RFQ_ID,
                    modal_body: `RFQ : ${_details.RFQ_NO} has been rejected successfully`,
                    loading:false,
                })
            }
        }
    }

    componentDidUpdate(){
        if(this.state.rerendered){
            let _new_details = this.state.quotaion_details
            let _rfq_details = this.state.details
            if(this.state.GstQuo && this.state.strGstRegNo==""){
                this.setState({
                    show_tax : true
                });
            }
            if(this.props.location && this.props.location.datas && this.props.location.datas.RESUBMIT=="1"){
                this.state.quotaion_details.forEach((list, index)=>{
                    _new_details[index].RRDT_Amount =  _new_details[index].RRDT_Quantity * ((_new_details[index].RRDT_Unit_Price) ? _new_details[index].RRDT_Unit_Price : 0);
                    _new_details[index].RRDT_Unit_Price = (_new_details[index].RRDT_Unit_Price) ? _new_details[index].RRDT_Unit_Price: '0.00';
                    _new_details[index].RRDT_Amount = round_decimal(_new_details[index].RRDT_Amount, 2)
                    _new_details[index].gst = list.RRDT_GST
                    _new_details[index].Tax = list.RRDT_GST_RATE
                })
            }

           
            this.setState({
                quotaion_details : _new_details,
                rerendered :false,
            })
            
        }

        
        if(!this.state.redate && this.state.details && this.state.details.RRM_Offer_Till){
            this.props.change('rfqDto.rfqUIExpiryDate', ddmmyy(this.state.details.RRM_Offer_Till))
            this.setState({
                redate :true,
            })
        }
        else  if(!this.state.redate && this.state.details && this.state.details.RM_Reqd_Quote_Validity){
            this.props.change('rfqDto.rfqUIExpiryDate', ddmmyy(this.state.details.RM_Reqd_Quote_Validity))
            this.setState({
                redate :true,
            })
        }

    }

    download_files = (data, status) => {
        let requestParam = '';
        if (status === 'reqDoc') {
            requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': data.CDA_DOC_TYPE, 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': 0 };
        }
        else {
            requestParam = data;
        }
        this.props.GetDownloadFile(requestParam);
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }


    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="unable"){
            this.UnabletoSupply()
        }   
    }

    confirm_function = (type, text) => {
        this.setState({
            status: false, 
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `${text} `,
        })
    }

    previous_url = () =>{
        this.props.ClearUploadDocuments()
        console.log('this.props.location', this.props.location)
        if(this.props.location && this.props.location.redirect_to_tab){
            this.props.history.push({
                pathname : this.props.location.redirect_to_page,
                redirect_to_tab : this.props.location.redirect_to_tab,
                redirect_to_page : this.props.location.redirect_to_page,
            })
        }
        else{
            this.props.history.push({
                pathname : this.props.location.redirect_to_page,
                redirect_to_tab : this.props.location.redirect_to_tab,
                redirect_to_page : this.props.location.redirect_to_page,
            })
        }
            
    }


    render(){
        let _sub_total  = (this.state.quotaion_details ) ? this.state.quotaion_details.reduce((a, val) => a += !isNaN(val.RRDT_Amount) ? val.RRDT_Amount : 0, 0) : '0.00'
        let _sub_gst  = (this.state.quotaion_details ) ? this.state.quotaion_details.reduce((a, val) => a +=  ((val.RRDT_Quantity * val.RRDT_Unit_Price) * ((val.gst) ? parseFloat(val.gst/100).toFixed(2) : 0)) , 0): '0.00'
        let _total  = parseFloat(_sub_total)+parseFloat(_sub_gst)
        let {GstQuo, strGstRegNo, user_attachments} =  this.state
        user_attachments = user_attachments.map((list_details)=>{
            let _temp_Details = list_details

            _temp_Details.pEnumDownloadType = 0;
            if(_temp_Details.CDA_ATTACH_FILENAME){
                _temp_Details.strFile = _temp_Details.CDA_ATTACH_FILENAME
            }
            if(_temp_Details.CDA_HUB_FILENAME){
                _temp_Details.strFile1 = _temp_Details.CDA_HUB_FILENAME
            }

            if(_temp_Details.CDA_ATTACH_INDEX){
                _temp_Details.ID = _temp_Details.CDA_ATTACH_INDEX
            }

            return _temp_Details;
            
        })
        return <div id="tabs">
        <Tabs defaultActiveKey="OutstandingRFQ" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
         
                this.props.history.push({
                    pathname : '/VendorRFQList',
                    redirect_to_tab : k,
                }) 
           
        }}>
            {(this.props.location && this.props.location.redirect_to_tab=="QuotationListing") ?  
            <Tab eventKey="OutstandingRFQ" title="Outstanding RFQ">
                <div className="tab-content py-3 px-3 px-sm-0">
                
                </div>
            </Tab>  : ''}  
            {(this.props.location && this.props.location.redirect_to_tab=="QuotationListing") ?  
            <Tab eventKey="ExpiredRejectedRFQ" title="Expired / Rejected RFQ">
                <div className="tab-content py-3 px-3 px-sm-0">
                
                </div>
            </Tab>: ''}  
            
   
       
      <Tab eventKey="Test_details_1" title={this.state.tab_name}>
        <div className="tab-content py-3 px-3 px-sm-0">
        <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.file_upload_loading) ? <Loader /> : '' }
                {(this.props.fd_loading) ? <Loader /> : '' }
                {(this.props.fe_loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.pdf_loading) ? <Loader /> : '' }

                <TabHeading color={'bg-info text-white'}>RFQ Info</TabHeading> 
                <p>Fill in the relevant info and click the Submit button to submit the quotation to the selected buyer.</p>
                <p><b>RFQ Number : </b> {this.state.details != '' ? this.state.details.RM_RFQ_No : ""} <br/> <b> Expires on : </b> {(this.state.details != '' && this.state.details.RM_Currency_Code && this.state.details.RM_Currency_Code!='null') ? TodayDateSalash(this.state.details.RM_Expiry_Date) : ""}  <br/> <b> Currency :</b> {(this.state.details != '' && this.state.details.RM_Currency_Code && this.state.details.RM_Currency_Code!='null') ? this.state.details.RM_Currency_Code : ""}  </p>
                <div className="row mt-2">
                    <div className="col-12 col-md-6">
                    <div className="d-flex bg-info text-white p-1 mt-2">
                    <p>  RFQ Details : </p>
                    </div>
                    {this.state.details != '' ? 
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td>Validity :</td>
                                <td>{ddmmyy((this.state.details.RM_Reqd_Quote_Validity) ?  this.state.details.RM_Reqd_Quote_Validity : this.state.details.RM_Reqd_Quote_Validity)}</td>
                            </tr>
                            <tr>
                                <td> Contact Person :</td>
                                <td>{this.state.details.RM_Contact_Person}</td>
                            </tr>
                            <tr>
                                <td>Contact Number :</td>
                                <td>{this.state.details.RM_Contact_Number}</td>
                            </tr>
                            <tr>
                                <td> Email :</td>
                                <td>{this.state.details.RM_Email}</td>
                            </tr>
                            <tr>
                                <td>Payment Terms  :</td>
                                <td>{HandlePaymentTerm(this.state.details.RM_Payment_Term)}</td>
                            </tr>
                            <tr>
                                <td>Payment Method :</td>
                                <td>{this.state.details.RM_Payment_Type}</td>
                            </tr>
                            <tr>
                                <td>Shipment Mode :</td>
                                <td>{this.state.details.RM_Shipment_Mode}</td>
                            </tr>
                            <tr>
                                <td>Shipment Terms  :</td>
                                <td>{this.state.details.RM_Shipment_Term}</td>
                            </tr>
                            <tr>
                                <td> Remarks :</td>
                                <td>{(this.state.details.RM_Remark && this.state.details.RM_Remark!='undefined') ? this.state.details.RM_Remark : ''}</td>
                            </tr>
                            <tr>
                                <td>  Attachments :</td>
                                <td className="main_download"><p>{(this.state.attachments && this.state.attachments.length>0) ? this.state.attachments.map((list, index) => {
                                        if (list.Text !== 'No Files Attached') {
                                            if (list.CDA_TYPE == 'E') {
                                                return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                            }
                                        }
                                    }) : 'No Files Attached'}</p></td>
                            </tr>
                        </tbody>
                    </table> : ""}

                </div>
                    <div className="col-12 col-md-6">
                    <div className="d-flex bg-info text-white p-1 mt-2">
                        <p>  Vendor Details </p>
                    </div>
                    {this.state.details != '' ?     
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td> Valid Till :</td>
                                <td >
                                    <div className="user_details_qt row">
                                    {(this.state.redate) ? <Field type="text" name="rfqDto.rfqUIExpiryDate" selected={(this.state.start_data) ? this.state.start_data : new Date()} component={FormDatePicker} className="form-control " placeholder="RFQ Expiry Date " label="" onChange={this.handleDate.bind(this, 'start_date')} /> : ''}
                                    </div>
                                </td>   
                            </tr>
                            <tr>
                                <td> Contact Person :</td>
                                <td><input type="text" className="form-control" defaultValue={this.state.vendor_details.User_Name} onChange={(e) => this.handleChange(e.target.value, 'username')} /></td>
                            </tr>
                            <tr>
                                <td>Contact Number :</td>
                                <td><input type="text" className="form-control" defaultValue={this.state.vendor_details.Phone} onChange={(e) => this.handleChange(e.target.value, 'phone')} /></td>
                            </tr>
                            <tr>
                                <td> Email :</td>
                                <td><input type="text" className="form-control" defaultValue={this.state.vendor_details.Email} onChange={(e) => this.handleChange(e.target.value, 'email')} /></td>
                            </tr>
                            <tr>
                                <td>Payment Terms :</td>
                                <td> {this.state.details.pay_term} </td>
                            </tr>
                            <tr>
                                <td>Payment Method :</td>
                                <td>{this.state.details.pay_type}</td>
                            </tr>
                            <tr>
                                <td>Shipment Mode :</td>
                                <td>
                                    <select className="form-control" defaultValue={(this.state.details.RRM_Ship_Mode_Desc) ? this.state.details.RRM_Ship_Mode_Desc : 'Not Applicable'} onChange={(e) => this.handleChange(e.target.value, 'shipment_mode')}>
                                        {this.state.all_ship_mode.map((val, index) => {
                                            return (
                                                <option value={val.CODE_DESC}>{val.CODE_DESC}</option>
                                            )
                                        })}
                                        <option value="Not Applicable">Not Applicable</option>
                                    
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Shipment Terms  :</td>
                                <td>
                                    <select className="form-control" defaultValue={(this.state.details.RRM_Ship_Term_Desc) ? this.state.details.RRM_Ship_Term_Desc : 'Not Applicable'} onChange={(e) => this.handleChange(e.target.value, 'shipment_term')}>
                                        {this.state.all_ship_term.map((val, index) => {
                                            return (
                                                <option value={val.CODE_DESC}>{val.CODE_DESC}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td> Remarks :</td>
                                    <td><textarea className="form-control" onChange={(e) => this.handleChange(e.target.value, 'remarks')}>{this.state.vendor_remark}</textarea></td>
                            </tr>
                            <tr>
                                <td> File Attachments :<br></br>
                                    <span>Recommended file size is 10240 KB </span>
                                </td>
                                <td>
                                    <input type="file" id="file"  className="form-control" onChange={(e) => this.SendUpload(e)}/>
                                    <span className="btn btn-outline-primary mt-2 btn-sm"  onClick={(e)=>this.FileUpload(e)}>Upload</span>
                                </td>
                            </tr>
                            <tr>
                                <td> File(s) Attached :</td>
                                <td className="main_download">
                                
                                    <p>{(user_attachments && user_attachments.length>0) ? user_attachments.map((val, index) => {
                                        if (val.Text !== 'No Files Attached') {
                                            if (val.CDA_TYPE === 'E') {
                                                return <p className="download-files" style={{maxWidth: '250px'}}><u><span onClick={()=>this.props.GetDownloadFile(val)}>{val.strFile} &nbsp;&nbsp;</span></u> <span onClick={(e)=>this.delete_file(val)}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                            }
                                        }
                                    }) : 'No Files Attached'}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table> : ""}

                </div>
                </div>
                <div className="row mt-2">
                <br></br>
                    {this.state.quotaion_details != '' ? <div className="table-responsive">
                    <table className="table table-striped table-bordered text-right-input">
                        <thead>
                            <tr>
                                <th style={{width:'47px'}}>S.no </th>
                                <th style={{width:'109px'}}>Item Name</th>
                                <th style={{width:'64px'}}>UOM</th>
                                <th style={{width:'70px'}}>Pack Qty</th>
                                <th style={{width:'89px'}}>QTY</th>
                                <th style={{width:'89px'}}>MOQ</th>
                                <th style={{width:'85px'}}>Unit Price</th>
                                <th style={{width:'119px'}}>Amount</th>
                                <th style={{width:'109px'}}>SST Rate</th>
                                <th style={{width:'109px'}}>SST Amount</th>
                                <th style={{width:'109px'}}>Delivery Lead Time(days)</th>
                                <th style={{width:'109px'}}>Warranty Terms (mths) </th>
                                <th style={{width:'150px'}}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>     
                            {this.state.quotaion_details.map((val, index) => {
                                val.RRDT_GST_RATE = (val.RRDT_GST_RATE)  ? val.RRDT_GST_RATE : 'N/A'
                                return (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{val.RRDT_Product_Desc}</td>
                                            <td>{val.RRDT_UOM}</td>
                                            <td><input className="form-control" onKeyPress={(e) => decimal(e)}  type="text" defaultValue={val.RRDT_Min_Pack_Qty} onChange={(e) => this.handleitemChange(e.target.value, 'RRDT_Min_Pack_Qty', index)} /></td>
                                            <td>{(val.RRDT_Quantity) ? val.RRDT_Quantity.toFixed(2) : '0.00'}</td>
                                            <td><input className="form-control"  type="text" defaultValue={val.RRDT_Min_Order_Qty} onChange={(e) => this.handleitemChange(e.target.value, 'RRDT_Min_Order_Qty', index)}/></td>
                                            <td className="text-right"><input className="form-control"  type="text" onKeyPress={(e) => decimal(e)}  onChange={(e) => this.update_qunatity(e,index)}  defaultValue={(this.props.location && this.props.location.datas && this.props.location.datas.RESUBMIT=="1")?  (val.RRDT_Unit_Price && val.RRDT_Unit_Price > 0) ? parseFloat(val.RRDT_Unit_Price).toFixed(2) : 0.00 : 0.00} /></td>
                                            <td><input className="form-control"  type="text"  value={(val.RRDT_Amount && val.RRDT_Amount>0) ? parseFloat(val.RRDT_Amount).toFixed(2) : '0.00'} readOnly /></td>
                                            <td>
                                                <select className="form-control" disabled={this.state.show_tax} onChange={(e) => this.handleitemChange(e.target,'gst', index)} >
                                                    {(GstQuo==true) ? 
                                                        ((!strGstRegNo) && this.props.fill_gst && this.props.fill_gst.map((list,index)=>{
                                                            return <option value={list.CODE_ABBR} selected={(val.RRDT_GST_RATE==list.GST)? true : false}>{list.GST}</option>
                                                        })) : 
                                                        (this.props.fill_tax && this.props.fill_tax.map((list,index)=>{
                                                            return <option value={list.TAX_PERC} selected={(val.RRDT_GST_RATE==list.TAX_CODE)? true : false}>{list.TAX_CODE}</option>
                                                        }))
                                                    }
                                                    {(strGstRegNo=="" && GstQuo) ? <option value="">N/A</option> : ''}
                                                </select>
                                            </td>
                                            <td><input className="form-control"  disabled={true} onKeyPress={(e) => decimal(e)} type="text" value={(val.gst) ? round_decimal(((val.RRDT_Quantity * val.RRDT_Unit_Price) * parseFloat(val.gst/100)), 2).toFixed(2) : '0.00' } onChange={(e) => this.handleitemChange(parseFloat(e.target.value), 'RRDT_GST', index)}/></td>
                                            <td><input className="form-control" onKeyPress={(e) => decimal(e)} type="text" defaultValue={(val.RRDT_Delivery_Lead_Time > 0) ? val.RRDT_Delivery_Lead_Time : '0.00' } onChange={(e) => this.handleitemChange(parseFloat(e.target.value), 'RRDT_Delivery_Lead_Time', index)}/></td>
                                            <td><input className="form-control"  onKeyPress={(e) => decimal(e)} type="text" defaultValue={val.RRDT_Warranty_Terms} onChange={(e) => this.handleitemChange(e.target.value, 'RRDT_Warranty_Terms', index)}/></td>
                                            <td><input className="form-control text-remarks text-left"  type="text" defaultValue={val.RRDT_Remarks} onChange={(e) => this.handleitemChange(e.target.value, 'RRDT_Remarks', index)}/></td>
                                        </tr>
                                    )
                                })}

                                    <tr>
                                        <td className="text-right" colSpan={12}><strong>Sub Total :</strong></td>
                                                <td className="text-right" style={{width:'109px'}}> {(_sub_total && _sub_total>0) ? NumberFormate(_sub_total) : 0.00 } </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right" colSpan={12}><strong>SST Amount :</strong></td>
                                        <td className="text-right"  style={{width:'109px'}}>{(_sub_gst && _sub_gst>0) ? NumberFormate(_sub_gst) : 0.00 }</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right" colSpan={12}><strong>Grand Total :</strong></td> 
                                        <td className="text-right" style={{width:'109px'}}>{(_total && parseFloat(_total)>0) ? NumberFormate(_total) : 0.00 }</td>
                                    </tr>
                        
                        </tbody>
                        </table>
                        </div> : " "}   
                            
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={(e)=>{this.quatation_submit(e)}}>Submit</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary ml-2">Reset</button>
                        
                        {(this.props.location && this.props.location.datas && this.props.location.datas.RESUBMIT=="") ?  <button type="button" className="btn btn-sm btn-outline-danger ml-2"  onClick={()=>this.confirm_function('unable', 'You are not allowed to submit quote after choosing this option.')}>Unable To Supply</button> : ''}
                        <button type="button" className="btn btn-sm btn-outline-warning ml-2" onClick={()=>this.download_pdf()}>View RFQ</button>
                        <button type="button" className="btn btn-sm btn-outline-danger ml-2" onClick={()=>this.previous_url()} >Back</button>
                    </div>
                </div>
                <Alert 
                        title="Validation" 
                        message={this.state.modal_body} 
                        status={this.state.status} 
                        show={this.state.model} 
                        confirm={this.closemodel}
                />

                <ConfirmationModel 
                    title="" 
                    confimation = {true}
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.confimation_pop} 
                    onConfirm={(e)=>this.onConfirm()}
                    onCancel = {this.onCancel}
                />
            </Fragment>
        </div>
      </Tab>
      {(this.props.location && this.props.location.redirect_to_tab=="OutstandingRFQ") ?
        <Tab eventKey="ExpiredRejectedRFQ" title="Expired / Rejected RFQ">
            <div className="tab-content py-3 px-3 px-sm-0">
            
            </div>
        </Tab> : '' }
        {(this.props.location && this.props.location.redirect_to_tab=="OutstandingRFQ") ?
        <Tab eventKey="QuotationListing" title="Quotation Listing">
            <div className="tab-content py-3 px-3 px-sm-0">
            
            </div>
        </Tab>: ''}
    </Tabs>
    </div>
        
    }
}

const mapStateToProps = state => ({
    search_result : state.vendor_new_quote.responseList,
    file_upload_loading : state.file_upload_external.loading,
    fd_loading : state.file_download.loading,
    user_files : state.file_download.responseList,
    fe_loading : state.file_delete_external.loading,
    file_delete : state.file_delete_external.responseList,
    file_upload : state.file_upload_external.responseList,
    pdf_loading : state.rfqpdf_generate.loading,
    loading : state.vendor_new_quote.loading,
    pop_tax_code : state.pop_tax_code.responseList,
    fill_gst : state.fill_gst.responseList,
    fill_tax : state.fill_tax.responseList,
  })
  
const mapDispatchToProps = dispatch => ({
    GetNewQuoteDetails : (values) => dispatch(GetNewQuoteDetails(values)),
    UploadDocuments : (file, name) => dispatch(UploadDocuments(file, name)),
    ClearUploadDocuments : (file, name) => dispatch(ClearUploadDocuments()),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetDeleteFile  : (values) => dispatch(GetDeleteFileMain(values)),
    GetRFQPDFGenerate : (values) => dispatch(GetRFQPDFGenerate(values)),
    GetRaiseRFQPageLoadDetails : (values) => dispatch(GetRaiseRFQPageLoadDetails(values)),
    GetE2PPopTaxCode : (values) => dispatch(GetE2PPopTaxCode(values)),
    GetFillGST : (values) => dispatch(GetFillGST(values)),
    GetFillTax : (values) => dispatch(GetFillTax(values)),
    
    
})
  
  
const CreateQuotationNew = connect(mapStateToProps, mapDispatchToProps)(QuotationListing);

export default reduxForm({
    form:'QuotationListing',
})(CreateQuotationNew);
