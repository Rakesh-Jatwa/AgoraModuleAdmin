import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import {UserDetails} from '../../../Common/LocalStorage'
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStaticApprover'
import TotalGrid from '../../../Component/Table/TotalGrid'
import {FromTextareaParallel} from '../../../Component/From/FromInputs'
import Loader from '../../../Component/Loader'
import {FromateDate_YY_MM_DD,ddmmyy, TodayDateSalash} from '../../../Component/Dates'
import {connect} from 'react-redux';
import {InvoiceDetails} from '../../../validation'
import {GetDownloadFile} from '../../../Actions/Vendor'
import {GetE2PPopTaxCode} from '../../../Actions/Approver'
import Modal from '../../../Component/Modal'
import {ApiExtract} from '../../../Common/GetDatas'
import BootstrapTable from '../../../Component/Table/BootstrapCustomTablePr'
import {CNTrackingSave, CNAcknowledge} from '../../../Apis/RequesterServices'
import {GetInvoiceHeader, GetInvoicePDF,  GetCNTrackingDetails, GetGenerateCREDITPDF} from '../../../Actions/Requester'
import Alert from '../../../Component/Modal/alert'


class InvoiceViewDetails extends Component {
    constructor(props){
       
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_pdf = this.view_pdf.bind(this);
        this.show_model = this.show_model.bind(this)
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
            cnDetails : [],
            lineItems : [],
            RelatedCnNo : [],
            attachment : [],
            remarks : '',
            rerender : false
            
        }
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.search_list && nextProps.search_list &&  nextProps.search_list.hasOwnProperty('cnDetails')){
           return {
             cnDetails : (nextProps.search_list && nextProps.search_list.cnDetails) ? nextProps.search_list.cnDetails[0] : [],
             lineItems : (nextProps.search_list && nextProps.search_list.lineItems) ? nextProps.search_list.lineItems : [],
             RelatedCnNo : (nextProps.search_list && nextProps.search_list.RelatedCnNo) ? nextProps.search_list.RelatedCnNo : [],
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
        let _user_details = UserDetails()
        if(_user_details && _user_details.ROLE_NAME){
            let _role = (_user_details.ROLE_NAME).trim()
            if(_role === "FINANCE MANAGER"){
                this.setState({
                    show_status: false,
                })
            }
        }
        var {Cn_No, invoiceNo, Vcom_id} = this.props
        this.setState({
            products: {
                Cn_No : Cn_No,
                invoiceNo : invoiceNo,
                Vcom_id : Vcom_id
            },
        })
        this.props.GetCNTrackingDetails({Cn_No : Cn_No, invoiceNo : invoiceNo, Vcom_id : Vcom_id})
        this.props.GetE2PPopTaxCode()
    }


   
    getTextBoxValues=(e) => {
        this.setState({
            remarks:e.target.value
        })
    }


    closemodel = () => {
        this.setState({
            model : false,
            table_modal_popup : false 
        })
        if(this.state.status && this.state.type=="verify"){
            this.props.close()
        }
        else if(this.state.status && this.state.type=="save"){

        }
        else if(this.state.status && this.state.type=="submit"){
            if(this.props.handleParentupdate){
                this.props.handleParentupdate()
            }
            this.props.close()
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




    
    async SaveInv(){
        if(this.state.remarks){
            this.setState({loading:true})
            let _temp_details = this.state.lineItems.map((list_details)=>{
                return {
                    line_no : list_details.CND_CN_LINE,
                    inputGSTCode : list_details.CND_GST_RATE,
                }
            })
            let _ctemp_detaiuls =  {
                Cn_Index : (this.state.cnDetails) ? this.state.cnDetails.CNM_CN_INDEX : '',
                strAckRemark:this.state.remarks,
                items : _temp_details
            }
            let _status =  await ApiExtract(CNTrackingSave, _ctemp_detaiuls);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    hidden_submit : false,
                    type:'save'
                })
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Remarks Required",
                loading:false,
                hidden_submit : false,
                type:'save'
            })
        }
        
      
    }

    async SubmitInv(){
        if(this.state.remarks){
            this.setState({loading:true})
            let _temp_details = this.state.lineItems.map((list_details)=>{
                return {
                    line_no : list_details.CND_CN_LINE,
                    inputGSTCode : list_details.CND_GST_RATE,
                }
            })
            let _ctemp_detaiuls =  {
                intCnIndex : (this.state.cnDetails) ? this.state.cnDetails.CNM_CN_INDEX : '',
                strAckRemark:this.state.remarks,
                strCNNo :  (this.state.cnDetails) ? this.state.cnDetails.CNM_CN_NO : '',
                items : _temp_details
            }
            let _status =  await ApiExtract(CNAcknowledge, _ctemp_detaiuls);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                    hidden_submit : false,
                    type:'submit'
                })
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: "Remarks Required",
                loading:false,
                hidden_submit : false,
                type:'save'
            })
        }
    }



    viewInvoicePDF = () => {
        let inputData = { 'IM_INVOICE_NO': this.state.products.IM_INVOICE_NO, 'POM_B_COY_ID': this.props.search_list.invMstr[0].POM_B_COY_ID, 'POM_S_COY_ID': this.props.search_list.invMstr[0].POM_S_COY_ID }
        this.props.GetInvoicePDF(inputData)
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

    
    show_header_model = (list)=> {
        if(list.id=='ALTER_ID_GST_VALUE'){
           this.setState({
                table_modal_popup : true,
                current_model : 'ALTER_ID_GST_VALUE',
                modal_title : 'SST Tax Code (Purchase) ',
                table_model_header :  [
                    {name : "Tax", id:"GST", key:true},
                    {name : "Code", id:"TM_TAX_CODE"},
                ],
                table_model_body : (this.props.pop_tax_code) ? this.props.pop_tax_code.data : [],
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
            StartDate: (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"",
            PoStatus:'',
            Fulfilment:'',
            PoStatus: ["1,2", "3", "4,5", "6,3"],
            Fulfilment : this.state.Fulfilment,
        }
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.PoListing.PoStatus =  ["1,2", "3", "4,5", "6,3"]
        this.props.get_search_list(_form_value)
    }

    download_files = (data, status) => {
        let requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': 'I', 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': 0 };
        this.props.GetDownloadFile(requestParam);
    }

    ViewPdf = () =>{
        let {cnDetails, lineItems} = this.state
        let _temp_details = {"CN_NO":cnDetails.CNM_CN_NO, "CN_SCoyID":(lineItems && lineItems.length>0) ? lineItems[0].CNM_CN_S_COY_ID : '', "CN_BCoyID":(lineItems && lineItems.length>0) ? lineItems[0].CNM_CN_B_COY_ID : ''}
        this.props.GetGenerateCREDITPDF(_temp_details)
    }

   
    render(){
        
        let prevAppType = '';
        let _user_details = UserDetails();
        const { handleSubmit, submitting } = this.props
        const _table_header = [
            {name : "Line", id:"ID_INVOICE_LINE", width:'52px', key:true, dataFormat:'index', type:'index'},
            {name : "Item Description", id:"ID_PRODUCT_DESC", width:'123px'},
            {name : "UOM", id:"ID_UOM", width:'50px'},
            {name : "Qty", id:"CND_QTY", width:'50px'},
            {name : "Unit Price", id:"CND_UNIT_COST", width:'85px'},
            {name : "Total", id:"CNM_CN_TOTAL", width:'66px',formatter: (cellContent, row) => {
                return   <div className="text-right" >{parseFloat(row.CND_QTY * row.CND_UNIT_COST).toFixed(2)}</div>
            }},
            {name : "SST Rate", id:"ID_GST_RATE", width:'66px'},
            {name : "SST Amount", id:"ID_GST_VALUE", width:'66px', formatter: (cellContent, row) => {
                return   <div className="text-right">{ ((row.ID_GST) ? ((row.CND_QTY * row.CND_UNIT_COST) * (row.ID_GST/100)) : 0).toFixed(2)}</div>
            }},
            {name : "SST Tax Code (Purchase)", id:"ALTER_ID_GST_VALUE", width:'111px'},
            {name : "Remarks", id:"CND_REMARKS", width:'111px'},
        ];

     
       
       
        let _sub_total  = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) =>a += (parseFloat(val.CND_QTY * val.CND_UNIT_COST)), 0).toFixed(2) : 0;
        let _sub_gst  = (this.state.lineItems && this.state.lineItems.length) ? this.state.lineItems.filter((list)=>!list.hasOwnProperty('removed')).reduce((a, val) => a += parseFloat((val.CND_QTY * val.CND_UNIT_COST) * ((val.ID_GST)/100)),  0).toFixed(2) : 0;
        let _total  = parseFloat(_sub_gst) + parseFloat(_sub_total)

        return <Fragment>
              {(this.props.requester_invoice_loader) ? <Loader /> : '' }
                {(this.props.file_upload_ld) ? <Loader /> : '' }
                {(this.props.file_delete_ld) ? <Loader /> : '' }
                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.dr_loading) ? <Loader /> : '' }
                {(this.props.gipdf_loader) ? <Loader /> : '' }
                {(this.props.pdf_loading) ? <Loader /> : '' }
                {(this.props.credit_pdf_loading) ? <Loader /> : '' }
                
                
            <form onSubmit={handleSubmit(this.submit_invoice.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Click the Save button to save the new PO as draft DO. Click the Submit button to submit the DO to the buyer." 
            />
            <TabHeading color={'bg-info text-white'}>Invoice Header</TabHeading> 
            <div className="" >
                
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Credit Note Number : </label></div>
                                <div className="col"><p>{(this.state.cnDetails) ? this.state.cnDetails.CNM_CN_NO:''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Invoice No:  </label></div>
                                <div className="col"><p>{(this.state.cnDetails) ? this.state.cnDetails.IM_INVOICE_NO:''}</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>Date: </label></div>
                                <div className="col"><p>{(this.state.cnDetails) ? TodayDateSalash(this.state.cnDetails.CNM_CN_DATE):''}</p></div>
                                <div className="col-12 md-2 col-lg-2"><label>Date:  </label></div>
                                <div className="col"><p>{(this.state.cnDetails) ? TodayDateSalash(this.state.cnDetails.IM_CREATED_ON):''}</p></div>
                            </div>
                            <div className="row mt-2">
                            
                                    <div className="col-12 col-sm-12 col-md-6">
                                        <div className="row">
                                            <div className="col-12 md-4 col-lg-4"><label>Bill To : </label></div>
                                            <div className="col">
                                                <address>
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_ADDR_LINE1:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_ADDR_LINE2:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_ADDR_LINE3:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_POSTCODE:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_CITY:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_STATE:''}<br />
                                                    {(this.state.cnDetails) ? this.state.cnDetails.CNM_COUNTRY:''}<br />
                                            </address>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-6">
                                        <div className="row">
                                            <div className="col-12 col-sm-4 col-md-4"><label>Currency: </label></div>
                                            <div className="col"><p>{(this.state.cnDetails) ? this.state.cnDetails.CNM_CURRENCY_CODE:''}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-sm-4 col-md-4"><label>Invoice Amount: </label></div>
                                            <div className="col"><p>{(this.state.cnDetails) ? this.state.cnDetails.IM_INVOICE_TOTAL:''}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-sm-4 col-md-4"><label>Related Credit Note: </label></div>
                                            <div className="col"><p>{(this.state.RelatedCnNo) ? this.state.RelatedCnNo.map(function(elem){return elem.CNM_CN_NO}).join(", "):''}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-sm-4 col-md-4"><label>Total Related Credit Note Amount: </label></div>
                                            <div className="col"><p>{(this.state.RelatedCnNo) ?  this.state.RelatedCnNo.reduce((a, val) => a += (val.AMOUNT), 0).toFixed(2) :''}</p></div>
                                        </div>
                                    </div>

                            </div>
                           
                        
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label>File Attached : </label></div>
                                <div className="col">
                                {(this.state.attachment && this.state.attachment.length > 0 && this.state.attachment[0].Text!=="No Files Attached" ) ? this.state.attachment.map((list, index) => {
                                    return <p className="download-files"><u><span className="downloadPointer"  onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE}) &nbsp;&nbsp;</span></u> </p>
                                }) : <div className="nofile">No Files Attached</div>}
                                </div>
                               
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 md-2 col-lg-2"><label> Remarks : </label></div>
                                <div className="col"><p>{(this.state.cnDetails) ? this.state.cnDetails.CNM_REMARKS:''}</p></div>
                               
                            </div>


                                 <BootstrapCustomTable 
                                        table_header={_table_header} 
                                        show_header_model = {this.show_header_model}
                                        table_body={this.state.lineItems} 
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
                                        invoiceAmount = {this.props.search_list && this.props.search_list.invDetail && this.props.search_list.invDetail.reduce((a, val) => a += (val.ID_RECEIVED_QTY * val.ID_UNIT_COST) + (val.ID_GST_VALUE) + (val.POM_SHIP_AMT), 0).toFixed(2)}
                                 />
                                    


                                <TotalGrid
                                    table_header = {_table_header}
                                    body_text={['Sub Total', 'Tax', 'Grand Total']}
                                    body_value={[_sub_total, _sub_gst, (_total ? parseFloat(_total).toFixed(2) : 0)]}
                                    body_type={['text', 'text', 'text']}
                                    text_grid={7}
                                    total={8}
                                    total_td={2}
                                    body_loop={4}
                                    adjust={11}
                                />    
                        {(!this.props.hide_button) ?  
                        <div className="row">
                            <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>this.setState({remarks: e.target.value})}/>  
                        </div>
                        :''}
                       
                    </div> 
                    
                    <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <div className="">
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.close()}>Back</button>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 text-right">
                            <div>
                          
                                <Fragment>
                                {(!this.props.hide_button) ?  <button type="button" className="btn btn-outline-primary btn-sm ml-2" onClick={()=>this.SaveInv()}>Save</button> : ''}
                                     {(!this.props.hide_button) ?  <button type="button" className="btn btn-outline-info btn-sm ml-2" onClick={()=>this.SubmitInv()}>Acknowledge Credit Note</button> : ''}
                                    <button type="button" className="btn btn-outline-success btn-sm ml-2" onClick={()=>this.ViewPdf()}>View Credit Note</button>
                                   
                                  
                                </Fragment>
                          
                               
                            {(this.state.products && this.state.products.FromPage=='vi') ?  <button type="button" className="btn btn-outline-info btn-sm ml-2" onClick={this.viewInvoicePDF}>View </button> : ''}    
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
                                    products={this.getProducts} 
                                    select={true} 
                                    mode={'radio'}
                                    radioname={'code'} 
                                    responsive={false} 
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
    }
}

const mapStateToProps = (state) =>({

    search_list : state.cn_tracking_details.responseList,
    requester_invoice_loader : state.cn_tracking_details.loading,

    pdf_loading : state.generate_credit_pdf.loading,

    gipdf_loader : state.generate_ipdf.loading,
    invoice_header : state.invoice_header.responseList,
    invoice_header_leader : state.invoice_header.loading,
    dr_loading : state.file_download.loading,
    fund_type_project_code_l1 : state.fund_type_project_code.responseListL1,

    credit_pdf : state.generate_credit_pdf,
    credit_pdf_loading : state.generate_credit_pdf.loading,
    pop_tax_code : state.pop_tax_code.responseList,
})
const mapDispatchToProps = (dispatch) =>({
    GetCNTrackingDetails : (values) => dispatch(GetCNTrackingDetails(values)),
    GetInvoiceHeader : (values) => dispatch(GetInvoiceHeader(values)),
    GetInvoicePDF : (values) => dispatch(GetInvoicePDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetGenerateCREDITPDF : (values) => dispatch(GetGenerateCREDITPDF(values)),
    GetE2PPopTaxCode : (values) => dispatch(GetE2PPopTaxCode(values)),
    
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default reduxForm({
    form:'InvoiceViewDetails',
    InvoiceDetails
})(MainRoute);

