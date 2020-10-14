import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import {UserDetails} from '../../../Common/LocalStorage'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStaticApprover'
import TotalGrid from '../../../Component/Table/TotalGrid'

import Loader from '../../../Component/Loader'
import {FromateDate,ddmmyy, TodayDateSalash} from '../../../Component/Dates'
import {connect} from 'react-redux';
import {GetDownloadFile} from '../../../Actions/Vendor'
import {ApiExtract} from '../../../Common/GetDatas'
import {InvoiceSave, InvoiceVerify, holdInvoice} from '../../../Apis/RequesterServices'
import { GetViewInvoiceDetailsClick, GetInvoicePDF, GetInvoiceDetails } from '../../../Actions/Requester'
import BackButton from '../../../Component/Buttons/Back'
import {HandlePaymentTerm} from '../../../Actions/Common/Functions'

class InvoiceViewDetails extends Component {
    constructor(props){
       
        super(props);
        this.view_pdf = this.view_pdf.bind(this);
        this.show_model = this.show_model.bind(this)
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
            invDetails : {},
            lineItems : [],
            financeApprFlow : [],
            cnSummary : [],
            dnSummary : [],
            attachment : [],
            
        }
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.search_list && nextProps.search_list &&  nextProps.search_list.hasOwnProperty('invDetails')){
            return {
              invDetails : (nextProps.search_list) ? nextProps.search_list.invDetails[0] : '',
              lineItems : (nextProps.search_list && nextProps.search_list.lineItems) ? nextProps.search_list.lineItems : [],
              financeApprFlow : (nextProps.search_list && nextProps.search_list.financeApprFlow) ? nextProps.search_list.financeApprFlow : [],
              cnSummary : (nextProps.search_list && nextProps.search_list.cnSummary) ? nextProps.search_list.cnSummary : [],
              dnSummary : (nextProps.search_list && nextProps.search_list.cnSummary) ? nextProps.search_list.dnSummary : [],
              attachment : (nextProps.search_list && nextProps.search_list.displayAttachFile) ? nextProps.search_list.displayAttachFile : [],
            }
         }
         else if(nextProps.upload_document && nextProps.upload_document.displayAttachFile && nextProps.upload_document.displayAttachFile.attachFileList && nextProps.upload_document.displayAttachFile.attachFileList!=prevState.file_name){
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
        return null
    }

    componentDidMount(){
        var _details = this.props.datas
        this.setState({
            products: _details,
        })
       this.props.GetInvoiceDetails(_details)
    }

   
    getTextBoxValues=(e) => {
        this.setState({
            remarks:e.target.value
        })
    }


    view_pdf = () =>{
        this.props.ViewGRNPDF(this.state.products)
    }




    viewInvoicePDF = () => {
        let {invDetails} = this.state;
        console.log('invDetails', invDetails)
        let inputData = { 'IM_INVOICE_NO': (this.state.products) ? this.state.products.Inv_no:'', 'POM_B_COY_ID': invDetails.POM_B_COY_ID, 'POM_S_COY_ID': invDetails.POM_S_COY_ID }
        this.props.GetInvoicePDF(inputData)
    }

    

    show_model = (details, selector, index)=> {
        if(selector=='FUNDTYPE'){
           this.setState({
                table_modal_popup : true,
                current_id : (details.ID_INVOICE_LINE && details.ID_INVOICE_LINE >= 1) ? details.ID_INVOICE_LINE-1 : 0,
                current_model :selector,
                modal_title : 'Select Fund Type',
                table_model_header :  [
                    {name : "Description", id:"AC_ANALYSIS_CODE_DESC", key:true},
                    {name : "Code", id:"AC_ANALYSIS_CODE"},
                ],
                table_model_body :this.props.fund_type_project_code_l1,
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

   
    render(){
        
        let prevAppType = '';
        let _user_details = UserDetails();
        const _table_header = [
            {name : "Line", id:"ID_INVOICE_LINE", width:'52px', key:true, dataFormat:'index', type:'index'},
            {name : "Fund Type(L1)", id:"FUNDTYPE", width:'122px'},
            {name : "Person Code(L9)", id:"PERSONCODE", width:'117px'},
            {name : "Project ACR/Code (L8) Code", id:"PROJECTCODE", width:'178px'},
            {name : "Item Description", id:"ID_PRODUCT_DESC", width:'123px'},
            {name : "UOM", id:"ID_UOM", width:'50px'},
            {name : "Qty", id:"ID_RECEIVED_QTY", width:'50px'},
            {name : "Unit Price", id:"ID_UNIT_COST", width:'85px'},
            {name : "Total", id:"ID_RECEIVED_QTY_1", width:'66px', formatter: (cellContent, row) => {
                return   <div >{parseFloat(row.ID_RECEIVED_QTY * row.ID_UNIT_COST).toFixed(2)}</div>
            }},
            {name : "Tax", id:"ID_GST_VALUE", width:'66px'},
            {name : "Warranty Terms", id:"ID_WARRANTY_TERMS", width:'111px'},
        ];

        const _table_debit_header = [
            {name : "Debit Note No.", id:"DNM_DN_NO", width:'75px', key:true},
            {name : "Debit Note Creation Date", id:"DNM_CREATED_DATE", width:'122px', dataFormat:'date'},
            {name : "Debit Note Created By", id:"UM_USER_NAME", width:'117px'},
            {name : "Status", id:"STATUS_DESC", width:'117px'},
            {name : "Amount", id:"AMOUNT", width:'178px', dataFormat:'number'},
        ];

        const _table_credit_header = [
            {name : "Credit Note No.", id:"CNM_CN_NO", width:'75px', key:true},
            {name : "Credit Note Creation Date", id:"CNM_CREATED_DATE", width:'122px', dataFormat:'date'},
            {name : "Credit Note Created By", id:"UM_USER_NAME", width:'117px'},
            {name : "Status", id:"STATUS_DESC", width:'117px'},
            {name : "Amount", id:"AMOUNT", width:'178px', dataFormat:'number'},
        ];

        const _table_header_1 = [
            {name : "Level", id:"POM_PO_NO", width:'100px', key:true, dataFormat:'index', type:'index'},
            {name : "Approving Officer", id:"AO_NAME", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_user_details.UM_USER_NAME==row.AO_NAME  || _user_details.UM_USER_NAME==row.AAO_NAME) ? 'bold_row' : ''
                return <div className={_details}>{row.AO_NAME}</div>;
            }},
            {name : "A_Approving Officer", id:"AAO_NAME", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_user_details.UM_USER_NAME==row.AO_NAME  || _user_details.UM_USER_NAME==row.AAO_NAME) ? 'bold_row' : ''
                return <div className={_details}>{row.AAO_NAME}</div>;
            }},
            {name : "Approval Type", id:"approvalType", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_user_details.UM_USER_NAME==row.AO_NAME  || _user_details.UM_USER_NAME==row.AAO_NAME) ? 'bold_row' : ''
                let elementData = row;
                let _invoice_amount = this.state.invDetails && this.state.invDetails.invDetail && this.state.invDetails.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + ((val.ID_RECEIVED_QTY * val.ID_UNIT_COST) * (val.ID_GST_VALUE/100)) + (val.POM_SHIP_AMT), 0).toFixed(2)
                let _sub_details = '';
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
                 
                return <div className={_details}>{_sub_details}</div>
            }},
            {name : "Approved Date", id:"FA_ACTION_DATE", width:'100px',  formatter: (cellContent, row) => {
                let _details = (_user_details.UM_USER_NAME==row.AO_NAME  || _user_details.UM_USER_NAME==row.AAO_NAME) ? 'bold_row' : ''
                return <div className={_details}>{(row.FA_ACTION_DATE) ? ddmmyy(row.FA_ACTION_DATE) : ''}</div>;
            }},
            {name : "Remarks", id:"FA_AO_REMARK", width:'100px',formatter: (cellContent, row) => {
                let _details = (_user_details.UM_USER_NAME==row.AO_NAME  || _user_details.UM_USER_NAME==row.AAO_NAME) ? 'bold_row' : ''
                return <div className={_details}>{row.FA_AO_REMARK}</div>;
            }},
        ];

       
       
        let _sub_total  = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.ID_RECEIVED_QTY * val.ID_UNIT_COST)), 0).toFixed(2) : 0;
        let _shipping_amount  = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.POM_SHIP_AMT)), 0).toFixed(2) : 0;
        let _sub_gst  = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST) * ((val.ID_GST)/100)),  0).toFixed(2) : 0;
        let _sst_output_tax = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.ID_RECEIVED_QTY * val.ID_UNIT_COST)*(val.ID_GST/100)),  0).toFixed(2) : 0;
        let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total)  + parseFloat(_shipping_amount)

        return <Fragment>
              {(this.props.requester_invoice_loader) ? <Loader /> : '' }
                {(this.props.file_upload_ld) ? <Loader /> : '' }
                {(this.props.file_delete_ld) ? <Loader /> : '' }
                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.dr_loading) ? <Loader /> : '' }
                {(this.props.gipdf_loader) ? <Loader /> : '' }
                
                
           
             <PageHeading 
                heading="" 
                subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
            />
            <TabHeading color={'bg-info text-white'}>Invoice Header</TabHeading> 
            <div className="" >
                     
                                               
                          
            <div className="row">
                            <div className="col-12 md-2 col-lg-2"><label>Vendor : </label></div>
                                <div className="col">
                                    <address>{(this.state.invDetails) ? this.state.invDetails.POM_S_COY_NAME:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_ADDR_LINE1:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_ADDR_LINE2:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_ADDR_LINE3:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_POSTCODE:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_CITY:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_STATE:''}<br />
                                        {(this.state.invDetails) ? this.state.invDetails.POM_S_COUNTRY:''}<br />
                                    </address>
                                </div>

                                <div className="col-xs-12 col-sm-6">
                                    <div className="row">

                                      
                                            <Fragment>
                                                <div className="col-12">
                                                        <div className="row">
                                                            <div className="col">
                                                                <p style={{display:'inline-block'}}>{(this.state.invDetails) ? this.state.invDetails.STATUS_DESC:''}</p>
                                                            </div>
                                                        </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                            <div className="col-12 md-4 col-lg-4">
                                                                <label>Vendor Code  : </label> 
                                                            </div>
                                                            <div className="col">
                                                            <p style={{display:'inline-block'}}>{(this.state.invDetails) ? this.state.invDetails.POM_S_COY_ID:''}</p>
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
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.CM_BUSINESS_REG_NO:''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Invoice No:  </label></div>
                                <div className="col"><p>{(this.state.products) ? this.state.products.Inv_no:''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Telephone Number : </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.POM_S_PHONE:''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Date</label></div>

                                <div className="col"><p>{(this.state.invDetails) ? ddmmyy(this.state.invDetails.POM_PO_DATE):''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Email :    </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.POM_S_EMAIL:''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Vendor Ref: </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.IM_OUR_REF:''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Bill To : </label></div>
                                <div className="col"><address>{(this.state.invDetails) ? this.state.invDetails.CM_COY_NAME:''}<br />
                                    {(this.state.invDetails) ? this.state.invDetails.POM_B_ADDR_LINE1:''}<br />
                                    {(this.state.invDetails) ? this.state.invDetails.POM_B_ADDR_LINE2:''}<br />
                                    {(this.state.invDetails) ? this.state.invDetails.POM_B_ADDR_LINE3:''}<br />
                                    {(this.state.invDetails) ? this.state.invDetails.POM_B_CITY:''}<br />
                                    {(this.state.invDetails) ? this.state.invDetails.POM_B_POSTCODE:''}<br /></address></div>
                                <div className="col-12 md-2 col-lg-2"><label>PAMB Ref: </label></div>
                                <div className="col"><p className="align_numbers">{(this.state.invDetails && this.state.invDetails.IM_YOUR_REF) ? this.state.invDetails.IM_YOUR_REF.split(',').join(', '):''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>File Attached : </label></div>
                                <div className="col">
                                {(this.state.invDetails && this.state.invDetails.displayAttachFile && this.state.invDetails.displayAttachFile.length > 0 && this.state.invDetails.displayAttachFile[0].Text!=="No Files Attached" ) ? this.state.invDetails.displayAttachFile.map((list, index) => {
                                    return <p className="download-files"><u><span className="downloadPointer"  onClick={() => this.props.GetDownloadFile(list)}>{list.strFile} ({list.Text}) &nbsp;&nbsp;</span></u> </p>
                                }) : <div className="nofile">No Files Attached</div>}
                                </div>
                                <div className="col-12 md-2 col-lg-2"><label>Payment Terms: </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? HandlePaymentTerm(this.state.invDetails.POM_PAYMENT_TERM):''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Vendor Remarks : </label></div>
                                <div className="col"><p>{(this.state.invDetails && this.state.invDetails.IM_REMARK!='undefined') ? this.state.invDetails.IM_REMARK:''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Payment Method: </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.POM_PAYMENT_METHOD:''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label> </label></div>
                                <div className="col"><p></p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Shipment Terms: </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.POM_SHIPMENT_TERM:''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label> </label></div>
                                <div className="col"><p></p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Shipment Mode: </label></div>
                                <div className="col"><p>{(this.state.invDetails) ? this.state.invDetails.POM_SHIPMENT_MODE:''}</p></div>
                            </div>
              
                            <TabHeading color={'bg-info text-white margin-bottom-none'}> Approval Workflow</TabHeading> 
                            <div className="main_detaials">
                                <BootstrapCustomTable 
                                    table_header={_table_header_1} 
                                    table_body={this.state.financeApprFlow} 
                                    products={this.getProducts} 
                                    select={false} 
                                    selectname={'pr_no'} 
                                    responsive={true} 
                                    click={true}
                                    search={false}
                                    table_name="issue_grn"
                                />
                            </div>
                            <div className="mt-4">
                                <BootstrapCustomTable 
                                        table_header={_table_header} 
                                        table_body={this.state.lineItems} 
                                        products={this.getProducts} 
                                        select={false} 
                                        selectname={'pr_no'} 
                                        app_details ={(this.state.invDetails && this.state.invDetails.invDetail) ? this.state.invDetails.invDetail :[] }
                                        responsive={true} 
                                        click={true}
                                        footer={false}
                                        table_name="issue_grn"
                                        invoiceAmount = {this.state.invDetails && this.state.invDetails.invDetail && this.state.invDetails.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) + (val.POM_SHIP_AMT), 0).toFixed(2)}
                                />
                                <TotalGrid
                                    table_header = {_table_header}
                                    body_text={['Sub Total', 'Tax', 'Shipping & Handling', 'Grand Total']}
                                    body_value={[_sub_total, _sub_gst, _shipping_amount, (_total ? parseFloat(_total).toFixed(2) : 0)]}
                                    body_type={['text', 'text', 'text', 'text']}
                                    text_grid={7}
                                    total={8}
                                    total_td={2}
                                    body_loop={4}
                                    adjust={11}
                                />  
                            </div>  
                            {(this.props.type=="credit" ||this.props.type=="debit")? 
                            <Fragment>
                                <TabHeading color={'bg-info text-white margin-bottom-none'}>Debit Note/Debit Advice Summary </TabHeading> 
                                <div className="main_detaials">
                                    <BootstrapCustomTable 
                                        table_header={_table_debit_header} 
                                        table_body={this.state.dnSummary} 
                                        products={this.getProducts} 
                                        select={false} 
                                        selectname={'pr_no'} 
                                        responsive={true} 
                                        click={true}
                                        search={false}
                                        table_name="issue_grn"
                                    />
                                </div>
                            </Fragment> :''}

                            {(this.props.type=="credit" ||this.props.type=="debit")? 
                            <Fragment>
                                <TabHeading color={'bg-info text-white margin-bottom-none'}>Credit Note/Credits Advice Summary </TabHeading> 
                                <div className="main_detaials">
                                <BootstrapCustomTable 
                                    table_header={_table_credit_header} 
                                    table_body={this.state.cnSummary} 
                                    products={this.getProducts} 
                                    select={false} 
                                    selectname={'pr_no'} 
                                    responsive={true} 
                                    click={true}
                                    search={false}
                                    table_name="issue_grn"
                                />
                            </div>
                            </Fragment> :''}

                            
                         {(this.state.products && this.state.products.FromPage && this.state.products.FromPage!='vi') ? 
                            <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2"><label className="form-label">Remarks : </label></div>
                                        <div className="col"><textarea rows="1" className="form-control" onChange={(e) => {this.getTextBoxValues(e)}}>{this.state.remarks}</textarea></div>
                                <div className="col-lg-4 col-md"><label className="form-label"></label></div>
                            </div>
                        :''}
                    </div> 
                    
                    <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.close()} >Back</button>
                        </div>
                        <div className="col-12 col-sm-6 text-right go-back">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{this.viewInvoicePDF()}}>View Invoice</button>
                        </div>
                    </div>
              

                
        </Fragment>
    }
}

const mapStateToProps = (state) =>({
    search_list : state.cndn_invoice_details.responseList,
    requester_invoice_loader : state.cndn_invoice_details.loading,
    gipdf_loader : state.generate_ipdf.loading,
    invoice_header : state.invoice_header.responseList,
    invoice_header_leader : state.invoice_header.loading,
    dr_loading : state.file_download.loading,
    fund_type_project_code_l1 : state.fund_type_project_code.responseListL1,
})
const mapDispatchToProps = (dispatch) =>({
    GetInvoiceDetails : (values) => dispatch(GetInvoiceDetails(values)),
    GetInvoicePDF : (values) => dispatch(GetInvoicePDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default MainRoute

