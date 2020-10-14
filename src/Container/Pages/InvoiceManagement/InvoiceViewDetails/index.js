import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import TotalGrid from '../../../../Component/Table/TotalGrid'
import Loader from '../../../../Component/Loader'
import {FromateDate, ddmmyy} from '../../../../Component/Dates'
import {connect} from 'react-redux';
import Enum from '../../../../Common/GlobalEnum'
import {InvoiceDetails} from '../../../../validation'
import { UploadDocuments, ClearUploadDocuments } from '../../../../Actions/Requester'
import {UserDetails} from '../../../../Common/LocalStorage'
import {GetViewInvoiceDetailsVendor, GetViewGRNPDF, GetDeleteFile, GetGeneratePOPDF, GetPoListDetails} from '../../../../Actions/Vendor'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {InvoiceSubmit } from '../../../../Apis/Vendor'
import {CheckFileDetails, HandlePaymentTerm, NumberFormateEmpty} from '../../../../Actions/Common/Functions'
import {FromInputsParallel, FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'


class InvoiceViewDetails extends Component {
    constructor(props){
       
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_pdf = this.view_pdf.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
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
            file_name:'',
            checked_initial : [0,1,2],
            checked_details:[],
            status:true,
            loading:false,
            attachment : [],
            delete : false, 
            rendered:true,
            po_details : [],
            view_type : '',
        }
    }


   static getDerivedStateFromProps(props, state){
        if((state.rendered) && (props.search_list) && (props.search_list.displayAttachFile) && (props.search_list.displayAttachFile.attachFileList)){
            console.log('123')
            return {
                rendered:false,
                attachment:props.search_list.displayAttachFile.attachFileList
            }
        }
        else if((!state.delete) && (!state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile) && (props.upload_document.displayAttachFile.attachFileList)){
            console.log('3123')
            return {
                attachment:props.upload_document.displayAttachFile.attachFileList
            }
        }
        else if( (!state.rendered) && state.delete && (props.file_delete) && (props.file_delete.displayAttachFile) && (props.file_delete.displayAttachFile.attachFileList)){
            console.log('4123')
            return {
                attachment:props.file_delete.displayAttachFile.attachFileList
            }
        }
        else{
            return {
                attachment : []
            }
        }
        return {props, state}
    }


    componentDidMount(){
        this.props.ClearUploadDocuments()
        var _details = (this.props && this.props.location) ? this.props.location.datas : {};
        if(_details.hasOwnProperty('BALSHIP')){
            _details.BALSHIP = 0;
        }
        this.setState({
            products: _details,
            view_type : (_details &&  _details.from_location) ? _details.from_location : '',
            model:false,
            model_body : '',
        })
        let _temp_array = {
            "POM_PO_NO": (_details) ? _details.POM_PO_NO: '',
            "DO_Number": (_details) ? _details.DO_Number : '',
            "GRN_Number": (_details) ? _details.GRN_Number : '',
            "POM_PO_DATE": (_details) ? _details.POM_PO_DATE : '',
        };
       this.setState({ po_details: _temp_array });
       this.props.GetViewInvoiceDetailsVendor(_details)
       this.props.GetPoListDetails({poIndex : (_details && _details.POM_PO_INDEX) ? _details.POM_PO_INDEX : 0 })
    }



    FileUpload = (attachment) => {
        this.setState({delete:false})
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
        if(_file_name == "ApproveDto.internalAttachment" && this.state.internal_file){
            req.AttachType = 'E';
            this.props.UploadDocuments(this.state.internal_file, req)
            this.setState({
                internal_file:'',
                internal_file_name:'',
                external_file:'',
                external_file_name:''
            })
        }
        else{
            this.setState({
                model:true,
                status: false,
                modal_body :'Choose a File to Upload',
            })
            
        }

        
       
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

    ClearAll = () =>{
        this.props.reset('InvoiceViewDetails');
    }

    deleteFile(filePath, attachType){
        filePath.AttachType = attachType;
        filePath.modeType = "New";
         this.setState({delete:true})
        this.props.delete_file(filePath)
        
    }

    documentDownload(filePath){
        this.props.download_file(filePath)
    }


    closemodel = () => {
        this.setState({
            model : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/VendorInvoiceManagement'
            })
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

   async  submit_invoice(values_details){
    let _sub_gst  = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) => a  += (val.POD_GST) ? (val.QTY * val.POD_UNIT_COST) * (val.POD_GST/100) : 0 , 0): 0;
    let _total  = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) =>a += (val.QTY * val.POD_UNIT_COST), 0): 0
    let _shipping = (this.state.products && this.state.products.BALSHIP) ? this.state.products.BALSHIP : 0
        _total = parseFloat((_sub_gst) ? _sub_gst: 0) + parseFloat((_total) ? _total : 0)
        let {getUnInvoiceGRNLine, poMstrDetails} = this.props.search_list;
        let _stored_details = this.state.products
        if(getUnInvoiceGRNLine && poMstrDetails && _stored_details && values_details.Vendorinvoiceno){
            let reqData = [{
                "doc": _stored_details.POM_PO_NO + "," + _stored_details.DO_Number + "," + _stored_details.GRN_Number,//POM_PO_NO,GRN Number,DO Number
                "ref": values_details.Vendorinvoiceno, 
                "remark": (typeof values_details.remark != 'undefined' && values_details.remark && values_details.remark!=null) ? values_details.remark : '',
                "amount":  _total ? parseFloat(_total).toFixed(2) : 0,
                "b_com_id": _stored_details.CM_COY_ID,
                "inv_status": "1",
                "bill_meth": _stored_details.POM_BILLING_METHOD,
                "po_no": _stored_details.POM_PO_NO,
                "grn_no": _stored_details.GRN_Number,
                "do_no": _stored_details.DO_Number,
                "pay_day": _stored_details.PAY_DAY,
                "tax": "0",
                "ShipAmt": _stored_details.BALSHIP ? parseFloat(_stored_details.BALSHIP).toFixed(2) : 0,
                "pom_po_index": _stored_details.POM_PO_INDEX,
                "do_date": ""
            }];

          
        
            this.setState({loading:true})
            let _status = await ApiExtract(InvoiceSubmit, reqData)
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
                model:true,
                status: false,
                modal_body :'Fields marked with asterisks are mandatory'
            })
        }

            
        
    }

    view_pdf = () =>{
        let _user_details = UserDetails();
        let _details = this.state.products;
        _details.USER_ID = _details.POM_B_COY_ID;
        _details.POM_B_COY_ID = _user_details.UM_COY_ID;
        this.props.ViewGRNPDF(_details)
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

    ViewPo(){
        let data = { 'POM_B_Coy_ID': this.state.products.POM_B_COY_ID, 'POM_PO_No': this.state.products.POM_PO_NO }
        this.props.GetGeneratePOPDF(data)
    }

    HandleShippingCharge=(e)=>{
        let _details = this.state.products;
        _details.BALSHIP = (e.target.value) ? e.target.value : 0
        this.setState({
            products : _details
        })
    }


    PrevUrl = () =>{
        this.setState({
            rendered : true
        })
        this.props.ClearUploadDocuments()
        this.props.history.goBack()
    }

    render(){
        const { handleSubmit, submitting } = this.props
        let _table_header = [

            {name : "Line", id:"POM_PO_NO", type:'index', width:'43px', key:true},
            {name : "Item Code", id:"POD_PRODUCT_DESC", width:'100px'},
            {name : "UOM", id:"POD_UOM", width:'54px'},
            {name : "Qty", id:"QTY", width:'60px',dataFormat:'price'},
            {name : "Unit Price", id:"POD_UNIT_COST", width:'90px',dataFormat:'price'},
            {name : "Sub Total", id:"POD_UNIT_COST", width:'87px',  formatter: (cellContent, row) => {
                return  <div className="text-right">{NumberFormateEmpty(row.QTY * row.POD_UNIT_COST)}</div>
            }},
           
            {name : "SST Rate", id:"GST_RATE", width:'88px',  formatter: (cellContent, row) => {
                    return  <div className="text-right">{(row.POD_GST) ? parseFloat(row.POD_GST).toFixed(2) : 'N/A' }</div>
            }},
            {name : "SST Amount	", id:"POD_GST", width:'110px',  formatter: (cellContent, row) => {
                return <div className="text-right">{ ((row.POD_GST) ? ((row.QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
            }},
            {name : "SST Tax Code (Supply)", id:"POD_GST_RATE", width:'162px', formatter: (cellContent, row) => {
                  return  <div>{(row.POD_GST_RATE) ? row.POD_GST_RATE : '' }</div>
            }},
            {name : "Warranty Terms", id:"POD_WARRANTY_TERMS", width:'69px', formatter: (cellContent, row) => {
            return  <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
            }},
            {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'123px', formatter: (cellContent, row) => {
                 return  (row.PR_CUSTOM_FIELD && row.PR_CUSTOM_FIELD.length > 0) ? row.PR_CUSTOM_FIELD[0].PCD_FIELD_VALUE : ''
            }},
            
        ];

        const _table_header_do_summary = [
            {name : "DO NO", id:"DOM_DO_NO", type:'index', width:'60px', key:true},
            {name : "DO Creation Date", id:"CREATIONDATE", width:'100px',dataFormat:'date'},
            {name : "DO Submission Date", id:"SUBMITIONDATE", width:'70px',dataFormat:'date'},
            {name : "DO Created By", id:"DOM_CREATED_BY", width:'60px'},
            {name : "GRN No", id:"GM_GRN_NO", width:'95px'},
            {name : "GRN Date", id:"GM_CREATED_DATE", width:'92px',dataFormat:'date'},
            {name : "GRN Received Date", id:"GM_DATE_RECEIVED", width:'110px',dataFormat:'date'},
            {name : "GRN Created by", id:"GM_CREATED_BY", width:'132px'},
        ];

        // if(this.state.view_type!='po_number'){
        //     _table_header.splice(10, 12); 
        //     _table_header.join()
        // }
      
        
        let _final_amount = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) => a += (val.QTY * val.POD_UNIT_COST), 0) : 0
        let _sub_total  = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) => a += val.QTY * val.POD_UNIT_COST, 0) : 0;
        let _sub_gst  = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) => a  += (val.POD_GST) ? (val.QTY * val.POD_UNIT_COST) * (val.POD_GST/100) : 0 , 0).toFixed(2): 0;
        let _total  = (this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine.reduce((a, val) =>a += (val.QTY * val.POD_UNIT_COST), 0): 0
        let _shipping = (this.state.products && this.state.products.BALSHIP) ? this.state.products.BALSHIP : 0
        let _sub_total_inc = 0
        _sub_total_inc = parseFloat(_sub_total)+parseFloat(_sub_gst);
        _total = parseFloat(_sub_gst)+parseFloat(_total)+parseFloat(_shipping);
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.file_upload_ld) ? <Loader /> : '' }
                {(this.props.file_delete_ld) ? <Loader /> : '' }
                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                {(this.props.save_loading) ? <Loader /> : '' }
                {(this.props.gpdf_loading) ? <Loader /> : '' }
                 {(this.props.popdf_loading) ? <Loader /> : '' }
                
            <form onSubmit={handleSubmit(this.submit_invoice.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="" 
            />
            <TabHeading color={'bg-info text-white'}>{(this.state.view_type!='po_number') ? 'Invoice Details Header' : 'Purchase Order Header'}</TabHeading> 
            <div className="" >
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Invoice Number : </label></div>
                        <div className="col"><p>To Be Assigned</p></div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Requisitioner :  </label></div>
                        <div className="col"><p>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_BUYER_NAME : ''}</p></div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Date : </label></div>
                        <div className="col">{ddmmyy()}</div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Contact Number : </label></div>
                        <div className="col"></div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Tax Reg. No. : </label></div>
                        <div className="col"><p>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].CM_TAX_REG_NO :''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Currency Code : </label></div>
                        <div className="col"><p>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_CURRENCY_CODE : ''}</p></div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Your Ref.  : </label></div>
                        <div className="col">{(this.state.products) ? this.state.products.POM_PO_NO + " ," + this.state.products.DO_Number + " , " + ((this.state.products.GRN_Number) ? this.state.products.GRN_Number : '') : ''}</div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Attention To : </label></div>
                        <div className="col">{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_S_ATTN : ''}</div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Payment Terms : </label></div>
                        <div className="col"><address>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? HandlePaymentTerm(this.props.search_list.poMstrDetails[0].POM_PAYMENT_TERM): ''}</address></div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Shipment Terms : </label></div>
                        <div className="col"><address>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_SHIPMENT_TERM: ''}</address></div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Payment Method : </label></div>
                        <div className="col">{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_PAYMENT_METHOD: ''}</div>
                        <div className="col-12 col-md-2 col-lg-2 "><label>Shipment Mode :</label></div>
                        <div className="col"><p>{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_SHIPMENT_MODE: ''}</p></div>
                    </div>
                    <div className="row mt-2"  >
                        <div className="col-12 col-md-2 col-lg-2 "><label>Bill To : </label></div>
                        <div className="col">{(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_BUYER_NAME: ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_B_ADDR_LINE1 : ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_B_ADDR_LINE2 : ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_B_ADDR_LINE3 : ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_B_POSTCODE : ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].POM_B_CITY : ''}<br />
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].STATE : ''} &nbsp;
                            {(this.props.search_list && this.props.search_list.poMstrDetails && this.props.search_list.poMstrDetails.length) ? this.props.search_list.poMstrDetails[0].COUNTRY: ''}<br />
                        </div>
                       
                    </div>
                    <hr></hr>
                    {(this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ?
                    <Fragment>
                        <TabHeading color={'bg-info text-white'}>{(this.state.view_type!='po_number') ? 'Invoice Details Line Detail' : 'Purchase Order Line Detail'}</TabHeading> 
                        <div className="no-border-table">
                            <BootstrapCustomTable 
                                    table_header={_table_header} 
                                    table_body={(this.props.search_list && this.props.search_list.getUnInvoiceGRNLine) ? this.props.search_list.getUnInvoiceGRNLine : [] } 
                                    products={this.getProducts} 
                                    select={false} 
                                    selectname={'pr_no'} 
                                    responsive={true} 
                                    click={true}
                                    search={false}
                                    table_name="issue_grn"
                                    get_details = {this.get_details}
                                    
                            />
                        </div>
                    </Fragment>
                    : ''}
                    
                 
                    <TotalGrid
                    table_header = {_table_header}
                    body_text={['Sub Total', 'SST Amount', 'Sub Total (incl. Tax)', 'Shipping & Handling','Grand Total','Total']}
                    body_value={[NumberFormateEmpty(_sub_total), NumberFormateEmpty(_sub_gst), NumberFormateEmpty(_sub_total_inc), (this.state.products && this.state.products.BALSHIP) ? NumberFormateEmpty(this.state.products.BALSHIP) : '', (_total) ? NumberFormateEmpty(_total) : '0.00']}
                    body_type={['text', 'text', 'text', 'input', 'text']}
                    text_grid={4}
                    total={5}
                    total_td={2}
                    body_loop={5}
                    adjust={-3}
                    HandleShippingCharge = {this.HandleShippingCharge}
                    />  

                    
                    </div> 
                    {this.state.view_type!='po_number' && 
                        <Fragment>
                            <div className="row mt-2 adjust-width-invoice">
                                <Field type="text" name="Vendorinvoiceno" component={FromInputsParallel} rem={true} className="form-control" placeholder=" Vendor invoice no " label=" Vendor invoice no"  required/>
                            </div>
                            <div className="row mt-2 adjust-width-invoice">
                                <Field type="text" name="remark" component={FromTextareaParallel} className="form-control" placeholder="Remarks " label="Add Remarks" required/>
                            </div>
                            <div className="mt-2 row adjust-width-invoice">
                                <div className="col-12" style={{padding:'0px'}}>  
                                    <div className="col-12 col-sm-7">
                                        <div className="row mt-2 file-upload-invoice">
                                    
                                            <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Attachment :" buttontext="Upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                       

                

                        <div className="mt-2 row">
                            <div className="col-lg-12 col-md file-attached">
                                <div className="row">
                                    <label className="col-12 col-sm-3 col-md-2">File Attached : </label>
                                    <div className="col-12 col-sm-9 col-md-10">
                                        <ul style={{listStyle:'none'}}>
                                        {(this.state.attachment && this.state.attachment.length && (this.state.attachment[0].Text!=="No Files Attached")) ? this.state.attachment.map((list)=>{ 
                                            return <p className="download-files"><u><span onClick={() => this.documentDownload(list)}>{list.strFile} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span ><i onClick={() => this.deleteFile(list, 'E')} className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }) : 'No Files Attached'}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }

                {this.state.view_type=='po_number' && 
                <Fragment>
                    <TabHeading color={'bg-info text-white'}>DO And GRN Summary</TabHeading> 
                    <BootstrapCustomTable 
                        table_header={_table_header_do_summary} 
                        table_body={(this.props.po_line_details && this.props.po_line_details.length >0) ? this.props.po_line_details : [] } 
                        products={this.getProducts} 
                        select={false} 
                        selectname={'pr_no'} 
                        responsive={true} 
                        click={true}
                        search={false}
                        table_name="issue_grn"
                        get_details = {this.get_details}
                    />
                </Fragment>
    }
                
                <div className="mt-2 row">
                    <div className="col-12 col-sm-6 text-left go-back">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.PrevUrl()} >Back</button>
                    </div>
                    <div className="col-12 col-sm-6 text-right">
                        <div className="mt-2 mb-5 justify-content-end row">
                             {/* {this.state.view_type=='po_number' && <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.view_pdf()}>VIEW GRN</button></div>} */}
                             {this.state.view_type!='po_number' && <div className="col-lg-auto col-md"> <button type="submit"  disabled={submitting}  className="btn btn-outline-primary btn-sm">SUBMIT</button></div> }
                             {this.state.view_type!='po_number' && <div className="col-lg-auto col-md"> <button type="button" onClick= {this.ClearAll} className="btn btn-outline-danger btn-sm">RESET</button></div> }
                             {this.state.view_type=='po_number' && <div className="col-lg-auto col-md-auto">   <button type="button" className="ml-4 btn btn-sm btn-outline-success" onClick={()=>this.ViewPo()}>View PO</button></div>}
                        </div>
                    </div>
                </div>
                    
                
                </form>
                
                <Alert
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}

const mapStateToProps = (state) =>({
    search_list : state.invoice_details_view_vendor.responseList,
    loading : state.invoice_details_view_vendor.loading,
    upload_document : state.file_upload_external.responseList,
    file_delete : state.file_delete_external.responseList,
    gpdf_loading : state.generate_grnpdf.loading,
    file_upload_ld : state.file_upload_external.loading,
    file_delete_ld : state.file_delete_external.loading,
    deliver_view_ld : state.deliveryorder_view.loading,
    popdf_loading : state.generate_popdf.loading,
    po_line_details : state.po_line_details.responseList,
    
})
const mapDispatchToProps = (dispatch) =>({
    GetViewInvoiceDetailsVendor : (values) => dispatch(GetViewInvoiceDetailsVendor(values)),
    ViewGRNPDF: (values) => dispatch(GetViewGRNPDF(values)),
    UploadDocuments  : (file, values) => dispatch(UploadDocuments(file, values)),
    ClearUploadDocuments: () => dispatch(ClearUploadDocuments()),
    
    delete_file  : (values) => dispatch(GetDeleteFile(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetPoListDetails : (values) => dispatch(GetPoListDetails(values)),
    
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default reduxForm({
    form:'InvoiceViewDetails',
    InvoiceDetails
})(MainRoute);

