import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import {reset} from 'redux-form';
import {GetSearchPurchaseReqApproval, GetViewSinglePr,  GetPurchaseReqRejectSearch, GetDownloadFile} from '../../../Actions/Approver'
import {GetGeneratePRPDF} from '../../../Actions/Requester'
import {addDate, TodayDateSalash} from '../../../Component/Dates'
import {FromTextareaParallel} from '../../../Component/From/FromInputs'
import TabHeading from '../../../Component/Heading/TabHeading';
import PageHeading from '../../../Component/Heading/PageHeading';
import ConfirmationModel from '../../../Component/Modal/ConfirmationModel'
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import {ApiExtract} from '../../../Common/GetDatas'
import {getDuplicatePR, CancelPR} from '../../../Apis/RequesterServices'
import {NumberFormate} from '../../../Actions/Common/Functions'
import BackButton from '../../../Component/Buttons/Back'

class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.download_files = this.download_files.bind(this)
        this.state = {
            products:{},
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            model:false,
            modal_error:false,
            modal_errors:'',
            remarks:'',
            status:'',
            req_data:{},
            dto_data:{},
            loading:false,
            status :false, 
            attachment : [],
            delete : false, 
            rendered:true,
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            hidden_submit:false,
            tab_name :'Purchase Request Listing'
        }
    }
    
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/purchaseRequest'
            })
        }
    }

 

    get_details(details){
        this.props.history.push({
            pathname : '/viewpr',
            datas : details.datas,
        })
    }

    static getDerivedStateFromProps(props, state){
        if((state.rendered) && (props.search_result) && (props.search_result.displayAttachFile)){
            return {
                rendered:false,
                attachment:props.search_result.displayAttachFile
            }
        }
        else if((!state.delete) && (!state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile)){
            return {
              
                attachment:props.upload_document.displayAttachFile
            }
        }
        else if( (!state.rendered) && state.delete && (props.file_delete) && (props.file_delete.displayAttachFile)){
            return {
                attachment:props.file_delete.displayAttachFile
            }
        }
        return {props, state}
    }

   

    
   
    SendUpload = (e) => {
        if(e.target.name=="ApproveDto.internalAttachment"){
            if(e.target.files && e.target.files.length){
                 this.setState({
                    internal_file : e.target.files[0],
                    internal_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                })
            }

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

   



    download_files = (data, status) => {
        let requestParam = '';
        if (status === 'reqDoc') {
            requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': data.CDA_DOC_TYPE, 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': data.pEnumDownloadType };
        }
        else {
            requestParam = data;
        }
        this.props.download_file(requestParam);
    }


    DuplicatePr = async () => {
        if(this.props.location && this.props.location && this.props.location.datas){
            this.setState({loading:true})
            let _status = await ApiExtract(getDuplicatePR, this.props.location.datas)
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
    }
    CancelPr = async () => {
        if(this.props.location && this.props.location && this.props.location.datas){
            console.log('CancelPr',this.props.location)
            if(this.state.remarks){
                this.setState({loading:true})
                let _details = {
                    lblPRNo: this.props.location.datas.PRM_PR_No,
                    PRIndex: this.props.location.datas.PRM_PR_Index,
                    CurrentAppSeq: "",
                    strRemark: this.state.remarks,
                    caller: ""
                }
                if(this.props.location && this.props.location.show_details && this.props.location.show_details=="convert_pr_req_1"){
                    _details.caller = "ConvertPR"
                }
                let _status = await ApiExtract(CancelPR, _details)
                if(_status ){
                    if( _status.status){
                        this.setState({
                            status: _status.status,
                            model:true,
                            modal_body: (_status.response && _status.response.strMsg) ? _status.response.strMsg : '',
                            loading:false,
                            type:'verify'
                        })
                    }
                    else{
                        this.setState({
                            status: _status.status,
                            model:true,
                            modal_body: (_status.message) ? _status.message : '',
                            loading:false,
                            type:'verify'
                        })
                    }
                   
                }
                
            }
            else{
                this.setState({
                    status:false,
                    model:true,
                    modal_body:'Please enter remarks to cancel this PR',
                    loading:false,
                    type:'verify'
                })
            }
        }
    }

    confirm_function = (type, text) => {
        
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            modal_body: `Are you sure that you want ${text} ?`,
        })

    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="duplicate"){
            this.getDuplicatePR()
        }
        else if(_confimation_type=="cancel"){
            this.CancelPr()
        }

    }

    prpdf = () =>{
        if(this.props.location && this.props.location && this.props.location.datas){
                this.props.GetGeneratePRPDF(this.props.location.datas)
        }
    }
    


    componentDidMount(){
        this.setState({
            products : this.props.location.datas,
            model:false,
            model_body:false
        })
        this.props.get_search_list(this.props.location.datas)

        if(this.props.location && this.props.location.redirect_to_tab){
            if(this.props.location.redirect_to_tab=="contact"){
                this.setState({
                    active_key : "profile1",
                    tab_name :'Purchase Request Cancellation'
                })
            }
            else{
                this.setState({
                    active_key :  "profile1",
                    tab_name :'Purchase Request Listing'
                })
            }
           
        }
    }


    

    render(){
        
        let _sub_total  = (this.props.search_result  && this.props.search_result.itemDetails &&  this.props.search_result.itemDetails.PR_DETAILS ) ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a += val.PRD_ORDERED_QTY * val.PRD_UNIT_COST, 0).toFixed(2): '0.00';
        let _sub_gst  = (this.props.search_result  && this.props.search_result.itemDetails &&  this.props.search_result.itemDetails.PR_DETAILS )  ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a  += (val.PRD_GST) ? (val.PRD_ORDERED_QTY * val.PRD_UNIT_COST) * (val.PRD_GST/100) : 0 , 0).toFixed(2) :  '0.00';
        let _total  = (parseFloat(_sub_total)+parseFloat(_sub_gst)).toFixed(2)

        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Level", id:"PRA_SEQ", width:'50px', key:true},
            {name : "Approving Officer", id:"AO_NAME", width:'100px'},
            {name : "A.Approving Officer", id:"AAO_NAME", width:'100px'},
            {name : "Approval Type", id:"PRA_APPROVAL_TYPE", width:'144px', formatter: (cellContent, row) => {
                return (
                    row.PRA_APPROVAL_TYPE === '2' ? 'Endorsement' : 'Approval' 
                )
            }},

            {name : "Action Date", id:"PRA_ACTION_DATE", width:'144px'},
            {name : "Remarks", id:"PRA_AO_REMARK", width:'122px'},
            {name : "Attachment", id:"userAttachFileList", width:'144px', dataFormat:"downloads"}

        ];

        const _table_data_header = [
            {name : "Line", id:"PRD_CT_ID", width:'50px', key:true, type:"index"},
            {name : "Gift", id:"GIFT", width:'100px'},
            {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px',dataFormat:"validatedata"}, 
            {name : "Person Code (L9)", id:"PERSONCODE", width:'144px',dataFormat:"validatedata"}, 
            {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px',dataFormat:"validatedata"}, 
            {name : "Item Code", id:"PRD_B_ITEM_CODE", width:'122px'},
            {name : "GL Description (GL Code)", id:"PRD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.CBG_B_GL_DESC + ' (' + row.PRD_B_GL_CODE + ')'
                )
            }},
            {name : "Category Code", id:"PRD_B_CATEGORY_CODE", width:'100px',dataFormat:"validatedata"}, 
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'150px'},
            {name : "Converted", id:"icPONo", width:'150px'},
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"PRD_UOM", width:'100px'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'100px'},
            {name : "Last Txn. Price", id:"PRD_UNIT_COST", width:'100px', dataFormat:"number"},
            {name : "Amount", id:"AMOUNT", width:'100px', dataFormat:"number"},
            {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
            {name : "SST Amount", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                    return ((row.PRD_GST) ? ((row.PRD_ORDERED_QTY * row.PRD_UNIT_COST) * (row.PRD_GST/100)) : 0).toFixed(2)
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'100px',dataFormat:"validatedata"}, 
            {name : "Cost Centre Code (L7)", id:"STATUS_DESC", width:'100px',formatter: (cellContent, row) => {
                return row.CDM_DEPT_CODE + "- " + row.AM_ACCT_DESC
            }},
            {name : "Delivery Address", id:"PRD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                return row.PRD_D_ADDR_LINE1 + row.PRD_D_ADDR_LINE2 + row.PRD_D_ADDR_LINE3
            }},
            {name : "Est. Date of Delivery", id:"data.PRD_ETD", width:'100px',formatter: (cellContent, row) => {
                return addDate(this.props.search_result.itemDetails.PR_MSTR[0].PRM_SUBMIT_DATE, row.PRD_ETD)
            }},
            {name : "Warranty Terms (mths)", id:"PRD_WARRANTY_TERMS", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-right">{row.PRD_WARRANTY_TERMS}</div>
            }},
            {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
            {name : "Remarks", id:"PRD_REMARK", width:'100px'},

        ];

     

        if(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR && this.props.search_result.itemDetails.PR_MSTR[0] && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Type=='cc'){
            for ( let _table_data_head in _table_data_header) {
                if(_table_data_header[_table_data_head].id=="PRD_UNIT_COST"){
                    _table_data_header[_table_data_head].name  = "Contract Price"
                }
                if(_table_data_header[_table_data_head].id=="icPONo"){
                    _table_data_header[_table_data_head].name  = "PO.No"
                    _table_data_header[_table_data_head].id = 'PRD_CONVERT_TO_DOC'
                }
            }
        }

        console.log('_table_data_header', _table_data_header)

        return <div id="tabs">
                  <Tabs defaultActiveKey="home" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
                        this.props.history.push({
                            pathname : '/purchaseRequest',
                            redirect_to_tab : k,
                        })
        
                  }}>
                   <Tab eventKey="home" title="Purchase Request">
                        <div className="tab-content py-3 px-3 px-sm-0">
                        </div>
                    </Tab>
                    {this.state.tab_name=="Purchase Request Cancellation" ? 
                    <Tab eventKey="profile" title="Purchase Request Listing">
                        <div className="tab-content py-3 px-3 px-sm-0">
                        </div>
                    </Tab>
                    :''}
                    <Tab eventKey="profile1" title={this.state.tab_name}>
                        <div className="tab-content py-3 px-3 px-sm-0">
                            <Fragment>
                                {(this.props.loading) ? <Loader /> : '' }
                                {(this.state.loading) ? <Loader /> : '' }
                                {(this.props.dr_loading) ? <Loader /> : '' }
                                {(this.props.fue_loading) ? <Loader /> : '' }
                                {(this.props.sr_loading) ? <Loader /> : '' }
                                {(this.props.pr_loader) ? <Loader /> : '' }
                                {(this.props.fd_loading) ? <Loader /> : '' }
                                
                                {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
                                <PageHeading 
                                    heading={(this.props.location && this.props.location.type && this.props.location.type!="ConvertPRListing") ? "" : ''}
                                    subheading="Click the Duplicate PR button to duplicate the PR or Cancel PR button to cancel the PR." 
                                />

                                
                                    <TabHeading color={'bg-info text-white'}>Purchase Request Header</TabHeading> 
                                    <div className="row">
                                        <div className="col-12 col-md-2 col-lg-2"><label>  PR Number :	</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_NO : '' }  {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_URGENT==1) ? '(Urgent)'  : '' }</div>
                                    
                                        <div className="col-12 col-md-2 col-lg-2"><label>  Status :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  
                                                    (this.state.products && this.state.products.PRM_PR_STATUS == "99") ? 'Sourcing'  : 
                                                    (this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC  == "Submitted" ) ? this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC + " " + "for approval" :  
                                                    (this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC == "Approved") ? this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC + " " + "by management" : 
                                                    (this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC == "Rejected By") ? this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC + " " + "Management / Vendor" : 
                                                    (this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC == "Cancelled By" && this.props.search_result.itemDetails.PR_MSTR[0].NAME) ? this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC + " (" + this.props.search_result.itemDetails.PR_MSTR[0].NAME+')' :
                                                    (this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC == "Held By" && this.props.search_result.itemDetails.PR_MSTR[0].NAME) ? this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC + " (" + this.props.search_result.itemDetails.PR_MSTR[0].NAME+')' :
                                                
                                                    this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC 
                                        : '' }</div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-12 col-md-2 col-lg-2"><label>  Requestor Name  :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_REQ_NAME : '' }</div>

                                        <div className="col-12 col-md-2 col-lg-2"><label>  Submission Date :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  TodayDateSalash(this.props.search_result.itemDetails.PR_MSTR[0].PRM_SUBMIT_DATE) : '' }</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-2 col-lg-2"><label>  Requestor Contact  :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_REQ_PHONE : '' }</div>

                                        <div className="col-12 col-md-2 col-lg-2"><label>  Attention To :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_S_ATTN : '' }</div>
                                    </div>
                                    {(this.props.location && this.props.location.show_details && this.props.location.show_details=="convert_pr_req") ?
                                        <div className="row">
                                            <div className="col-12 col-md-2 col-lg-2"><label>   Billing Address :		</label></div>
                                            <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_B_ADDR_LINE1 : '' }<br></br>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_B_ADDR_LINE2  : '' } <br></br>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_B_ADDR_LINE3  : '' }
                                                <br></br>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_B_POSTCODE  : '' }<br></br>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_B_CITY  : '' } <br></br>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].STATE  : '' } {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].CT : '' }   </div>

                                        </div> : ''}

                                    <div className="row">
                                        <div className="col-12 col-md-2 col-lg-2"> <label>  Internal Remarks :		</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> <div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_INTERNAL_REMARK : '' }</div></div>
                                        <div className="col-12 col-md-2 col-lg-2"> <label>External Remarks :</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> <div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_External_Remark : '' }</div></div>
                                    </div>

                                    {(this.props.location && this.props.location.show_details && this.props.location.show_details=="convert_pr_req") ?
                                    <div className="row">
                                        <div className="col-12 col-md-2 col-lg-2"><label> Vendor :	</label></div>
                                        <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_S_COY_NAME : '' }</div>
                                        <div className="col-12 col-md-2 col-lg-2"><label> 	Currency :	</label></div>
                                        <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_CURRENCY_CODE : '' }</div>
                                    </div>: ''}
                                
                                    {(this.props.location && this.props.location.show_details && this.props.location.show_details=="convert_pr_req") ?
                                    <Fragment>
                                        <div className="row">
                                            <div className="col-12 col-md-2 col-lg-2"><label> Payment Terms :</label></div>
                                            <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_PAYMENT_TERM : '' }</div>
                                            <div className="col-12 col-md-2 col-lg-2"><label>	 Payment Method :		</label></div>
                                            <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_PAYMENT_METHOD : '' }</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-2 col-lg-2"><label>  Shipment Terms :</label></div>
                                            <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_SHIPMENT_TERM : '' }</div>
                                            <div className="col-12 col-md-2 col-lg-2"><label>	 Shipment Mode :		</label></div>
                                            <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR.length) ?  this.props.search_result.itemDetails.PR_MSTR[0].PRM_SHIPMENT_MODE : '' }</div>
                                        </div>
                                    </Fragment>
                                    :''}
                                            
                                    <div className="row mt-2">
                                        <div className="col-12 col-sm-6">
                                            <div className="row">
                                                <div className="col-md-4 col-12 col-lg-4"><label>Internal File(s) Attached : </label></div>
                                                <div className="col">
                                                    {(this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.length > 0 ) ?  this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                                        if (list.CDA_TYPE == 'I') {
                                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                                        }
                                                    }) : 'No files attached '}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="row">
                                                <div className="col-md-4 col-12 col-lg-4"><label>External File(s) Attached  : </label></div>
                                                <div className="col">
                                                    {(this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.length > 0) ? this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                                        if (list.CDA_TYPE == 'E') {
                                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                                        }
                                                    }):'No files attached '}
                                                </div>
                                            </div>
                                        </div>   
                                    </div>



                                    <TabHeading color={'bg-info text-white margin-bottom-none'}>Approval Workflow</TabHeading> 
                                    <div className="row">    
                                        <div className='col-12'>   
                                                    <table className="table table-hover table-stripe">
                                                        <thead className="bg-info text-white p-1">
                                                            <tr className="bg-lightblue">
                                                                <th>Level</th>
                                                                <th>Approving Officer</th>
                                                                <th>A.Approving Officer</th>
                                                                <th>Approval Type</th>
                                                                <th>Action Date</th>
                                                                <th>Remarks</th>
                                                                <th>Attachment</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW &&  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow &&  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.map((data, index) =>
                                                                <tr key={index}>
                                                                    <td>{data.PRA_SEQ}</td>
                                                                    <td>{data.AO_NAME}</td>
                                                                    <td>{data.AAO_NAME}</td>
                                                                    <td>{data.PRA_APPROVAL_TYPE === '2' ? 'Endorsement' : 'Approval'}</td>
                                                                    <td>{data.PRA_ACTION_DATE !== null ? TodayDateSalash(data.PRA_ACTION_DATE) : ''}</td>
                                                                    <td>{data.PRA_AO_REMARK}</td>
                                                                    <td>{data.userAttachFileList.map((val, index) => {
                                                                        return <p><u><span onClick={() => this.download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
                                                                    })}</td>
                                                                </tr>
                                                            )}

                                                            
                                                        </tbody>
                                                    </table>
                                        
                                        </div>
                                    </div>
                                    <TabHeading color={'bg-info text-white margin-bottom-none'}>Purchase Request Line Details</TabHeading> 
                                        <div className="row">    
                                            <div className='col-12'>   
                                            <BootstrapCustomTable 
                                                table_header={_table_data_header} 
                                                table_body={(this.props.search_result  && this.props.search_result.itemDetails &&  this.props.search_result.itemDetails.PR_DETAILS ) ?  this.props.search_result.itemDetails.PR_DETAILS : [] } 
                                                products={this.getProducts} 
                                                select={false} 
                                                selectname={'pr_no'} 
                                                responsive={true} 
                                                click={true}
                                                table_name="issue_grn"
                                                get_details = {this.get_details}

                                            />
                                            <table className="table table-striped">
                                                <tr>
                                                    <td className="text-right" colSpan={4}><strong>Sub Total :</strong></td>
                                                            <td className="text-right" style={{width:'109px'}}> {(_sub_total && _sub_total>0) ? NumberFormate(_sub_total) : '0.00' } </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-right" colSpan={4}><strong>SST Amount :</strong></td>
                                                    <td className="text-right"  style={{width:'109px'}}>{(_sub_gst && _sub_gst>0) ? NumberFormate(_sub_gst) : '0.00' }</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-right" colSpan={4}><strong>Grand Total :</strong></td> 
                                                    <td className="text-right" style={{width:'109px'}}>{(_total && parseFloat(_total)>0) ? NumberFormate(_total) : '0.00' }</td>
                                                </tr>
                                            </table>
                                            </div>
                                        </div>
                                        <div className="mt-2 row">
                                            <div className="col-12" style={{padding:'0px'}}>  
                                                {(this.props.location && this.props.location.type && this.props.location.type=="listing1") ? <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks " label=" Remarks :"  onChange={(e)=>this.setState({remarks : e.target.value})}/> : ''}
                                                {(this.props.location && this.props.location.type && this.props.location.type=="cancel") ? <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} rem={true} className="form-control" placeholder="Cancel Remarks" label="Cancel Remarks"  onChange={(e)=>this.setState({remarks : e.target.value})}/> : ''}
                                                <div className="col-12 col-sm-6">
                                                
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 mb-5 row">
                                        <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                        {(this.props.location && this.props.location.type && this.props.location.type=="listing" && (this.props.location.datas && this.props.location.datas.STATUS_DESC!='Held By' && this.props.location.datas.STATUS_DESC!='Held')) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.DuplicatePr()}>Duplicate PR</button></div> : '' }
                                        {(this.props.location && this.props.location.type && (this.props.location.type=="cancel")) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.confirm_function('cancel', 'cancel This PR')}>Cancel PR</button></div> : '' }
                                        {(this.props.location && this.props.location.type && this.props.location.type=="cancel" || this.props.location.type=="ConvertPRListing" || this.props.location.type=="pr_cancel") ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.prpdf()}>View PR PDF</button></div> : '' }
                                        {(this.props.location && this.props.location.type && this.props.location.type=="listing" && (this.props.location.datas && this.props.location.datas.STATUS_DESC!='Rejected By' && this.props.location.datas.STATUS_DESC!='Rejected') && (this.props.location.datas && this.props.location.datas.STATUS_DESC!='Held By' && this.props.location.datas.STATUS_DESC!='Held')) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.prpdf()}>View PR PDF</button></div> : '' }
                                        
                                        </div>
                                

                                    <Alert 
                                        title="" 
                                        message={this.state.modal_body} 
                                        status={this.state.status} show={this.state.model} confirm={this.closemodel}
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
                    {this.state.tab_name=="Purchase Request Listing" ? 
                    <Tab eventKey="contact" title="Purchase Request Cancellation">
                        <div className="tab-content py-3 px-3 px-sm-0">
                        </div>
                    </Tab>
                    :''}
                </Tabs>
            </div>
    }
}




const mapStateToProps = state => ({
  purchase_reqest_approval : state.purchase_reqest_approval.responseList,
  pr_loader : state.purchase_reqest_approval.loading,
  
  pr_details : state.approver_pr,
  purchase_reqest_reject : state.purchase_reqest_reject.responseList,
  pr_loading:state.purchase_reqest_reject.loading,
  loading:state.purchase_request_items.loading,
  sr_loading : state.view_single_pr.loading,
  search_result : state.view_single_pr.responseList,
  fue_loading : state.file_upload_external.loading,
  form_details : state.form.ApprovalItems,
  dr_loading : state.file_delete_external.loading,
  pdf_loading : state.generate_prpdf.loading,
  fd_loading : state.file_download.loading,
  
})


const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  get_search_list : (values) => dispatch(GetViewSinglePr(values)),
  GetPurchaseReqRejectSearch : (values) => dispatch(GetPurchaseReqRejectSearch(values)),
  download_file  : (values) => dispatch(GetDownloadFile(values)),
  GetGeneratePRPDF  : (values) => dispatch(GetGeneratePRPDF(values)),

})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(ApprovalRejectList);
export default reduxForm({
    form:'PurchaseHolder',
})(PurchaseHolder);
