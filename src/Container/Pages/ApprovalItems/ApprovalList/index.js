import React, {Component, Fragment} from 'react';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import Alert from '../../../../Component/Modal/alert'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RejectPR, ApprovePR, HoldPR} from '../../../../Apis/Approver'
import {addDate, TodayDateSalash} from '../../../../Component/Dates'
import {UserDetails} from '../../../../Common/LocalStorage'
import Enum from '../../../../Common/GlobalEnum'
import {FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'
import {NumberFormate, CheckFileDetails} from '../../../../Actions/Common/Functions'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {AppendPrStatus} from '../../../../Actions/Common/Functions'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.SendUpload = this.SendUpload.bind(this)
        this.RejectPr = this.RejectPr.bind(this)
        this.HoldPr = this.HoldPr.bind(this)
        this.ApprovePr = this.ApprovePr.bind(this)
        this.process_details = this.process_details.bind(this)
        this.download_files = this.download_files.bind(this)
        this.delete_file = this.delete_file.bind(this)
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
            status_text : ''
        }
    }
    
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status_text.includes('Reject') && this.state.status){
            this.props.history.push({
                pathname:'/approvepr'
            })
        }
        else if(this.state.status && this.state.confimation_type=="approve"){
            this.props.history.push({
                pathname:'/approvepr'
            })
        }
        else if(this.state.status){
            this.props.get_search_list(this.props.location.datas)
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

    handlefromsubmit(values){
      
        let _form_value = values;
       
        let _initial_obj = {
            PRNumber: "",
            VendorName : "",
            StartDate: (this.state.start_data) ? this.state.start_data  :"",
            EndDate: (this.state.end_data) ? this.state.end_data  :"",
            prType : "",
        }
        _form_value.ApproveDto = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.ApproveDto = RemoveSpecialCharacter(_form_value.ApproveDto)
        this.props.get_search_list(_form_value)
    }

    FileUpload = (attachment) => {
        let _user_Details  = UserDetails();
        this.setState({delete:false})
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":Enum.EnumUploadType.UserAttachment,
            "strDocType": "PR",
            "pEnumUploadForm": "0",
            "strDocNo":(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR) ? this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Index:'',
            "blnTemp": "false",
            "strIndex": "AO",
            "seq": "1",
            "pFrontOfficeSite": "",
            "AttachType": "E",
            "ItemCode": "",
            "LineNo": "",
            "POLine": "",
            "modeType": "New"
        }

        let approvalFlowList = (this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW)  ? this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow : []
        for (let i = 0; i < approvalFlowList.length; i++) {
            let dataElement = approvalFlowList[i];
            let praAO = dataElement.PRA_AO ? dataElement.PRA_AO.trim() : "";
            let praAAO = dataElement.PRA_A_AO ? dataElement.PRA_A_AO.trim() : "";
            let userId = _user_Details.UM_USER_ID ? _user_Details.UM_USER_ID.trim() : "";
            if (userId.toUpperCase() == praAO.toUpperCase() || userId.toUpperCase() == praAAO.toUpperCase()) {
            
                req.seq = dataElement.PRA_SEQ;
                break;
            }
        }
        approvalFlowList.map((data, index) => {
            if (_user_Details.UM_USER_ID === data.PRA_AO || _user_Details.UM_USER_ID === data.PRA_A_AO) {
                req.seq = data.PRA_SEQ
            }
        })
        

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
                status: false,
                model:true,
                modal_body: "Select a file to upload",
                loading:false,
                delete : true
            })
        }
       
    }

    

    SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
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
        else{
            this.setState({
                modal_title: '',
                title : '',
                modal_body: _details.message,
                status : false,
                model: true,
            })
        }
    }

    

    async RejectPr(){
        let {values} =  this.props.form_details
        if(values  && values.ApproveDto && values.ApproveDto.strRemark){
            let details = this.process_details('reject');
            let _status = await ApiExtract(RejectPR, details);
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
                model:true,
                status:false,
                modal_body: 'Please enter remarks',
            })
        }
       
    }

    async HoldPr(){
        if(this.state.remarks){
            let details = this.process_details('hold');
            console.log('HoldPr', details)
            let _status = await ApiExtract(HoldPR, details);
            if(_status){
                this.setState({
                    confimation_type : 'Hold',
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                model:true,
                status:false,
                modal_body: 'Please enter remarks',
            })
        }
    }

     process_details = (_type) => {
        let _user_Details  = UserDetails();
        let {products} = this.state;
        let _get_result_initial  = '';
        this.setState({loading:true})
        if(this.props.search_result &&  this.props.search_result.itemDetails.GET_APPROVAL_FLOW &&  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow){
            let _final_details =  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow;
          
            let _get_result = '';
            
            if(products){
                _get_result_initial = {
                    "lblPRNo": products.PRM_PR_No,
                    "PRIndex": products.PRM_PR_Index,
                    "Requestor": products.PRM_BUYER_ID,
                    "Requestor_name": products.PRM_REQ_NAME,
                    "strRemark": this.state.remarks,
                    "CurrentAppSeq": 1,
                    "ISHighestLevel":"",
                    "Consolidator": "",
                    "relief": false,
                    "ApprType": (this.state.modal_body.includes("Approve")) ? 1 : 2,
                    "AO": "",
                    "txtRemark": "tereff"
                }
            }

            

            for (let index = 0; index < _final_details.length; index++) {
                const val = _final_details[index];
                if ((val.PRA_ACTIVE_AO === "" || val.PRA_ACTIVE_AO === null) && (val.PRA_ACTION_DATE !== "" && val.PRA_ACTION_DATE !== null)) {
                    _get_result = val;
                    break;
                } else if ((val.PRA_APPROVAL_TYPE === "2") && (val.PRA_ACTION_DATE === "" || val.PRA_ACTION_DATE === null)) {
                    _get_result = val;
                    break;
                } else if ((val.PRA_APPROVAL_TYPE !== "2") && (val.PRA_ACTION_DATE === "" || val.PRA_ACTION_DATE === null)) {
                    _get_result = val;
                    break;
                } else if ((val.PRA_APPROVAL_TYPE !== "2") && (val.PRA_ACTION_DATE !== "" || val.PRA_ACTION_DATE !== null)) {
                    _get_result = val;
                    break;
                }
            }

            if(_get_result_initial){
                _get_result_initial.CurrentAppSeq = _get_result.PRA_SEQ;
                _get_result_initial.ISHighestLevel = _get_result.PRA_APPROVAL_TYPE === "2" ? false : true;
                _get_result_initial.Consolidator = "";
                _get_result_initial.relief = false;
                _get_result_initial.ApprType = _get_result.PRA_APPROVAL_TYPE;
                _get_result_initial.AO = _get_result.PRA_AO.trim();
                _get_result_initial.txtRemark = this.state.remarks;
               
            }

            let approvalFlowList = (this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW)  ? this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow : []
            if(_type=="hold"){
           
                for (let i = 0; i < approvalFlowList.length; i++) {
                    let dataElement = approvalFlowList[i];
                    let praAO = dataElement.PRA_AO ? dataElement.PRA_AO.trim() : "";
                    let praAAO = dataElement.PRA_A_AO ? dataElement.PRA_A_AO.trim() : "";
                    let userId = _user_Details.UM_USER_ID ? _user_Details.UM_USER_ID.trim() : "";
                    if (userId.toUpperCase() == praAO.toUpperCase() || userId.toUpperCase() == praAAO.toUpperCase()) {
                    
                        _get_result_initial.CurrentAppSeq = dataElement.PRA_SEQ;
                        break;
                    }
                }
                 approvalFlowList.map((data, index) => {
                    if (_user_Details.UM_USER_ID === data.PRA_AO || _user_Details.UM_USER_ID === data.PRA_A_AO) {
                        _get_result_initial.CurrentAppSeq = data.PRA_SEQ
                    }
                })
                
            }
            else if(_type=="reject"){
                 approvalFlowList.map((data, index) => {
                    if (_user_Details.UM_USER_ID === data.PRA_AO || _user_Details.UM_USER_ID === data.PRA_A_AO) {
                        _get_result_initial.CurrentAppSeq = data.PRA_SEQ
                    }
                })
            }
           
        }

        return _get_result_initial;
    }

    async ApprovePr(){
        let details =  this.process_details('approve')
        let _status =  await ApiExtract(ApprovePR, details);
        if(_status){
            this.setState({
                status: _status.status,
                model:true,
                modal_body: _status.message,
                loading:false,

                hidden_submit : (_status.status) ? true : false,
            })
        }
      
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

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="hold"){
            this.HoldPr()
        }
        else if(_confimation_type=="approve"){
            this.ApprovePr()
        }
        else if(_confimation_type=="reject"){
            this.RejectPr()
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


    delete_file =  async (data, type) =>{
        let _details = data
        _details.CDA_DOC_TYPE = "AO";
        _details.AttachType = "E";
        _details.CDA_DOC_NO = this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Index
       
        let _token_details = UserDetails();
       
        if(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.length){
            for (let i = 0; i < this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.length;  i++) {
                const _getApprFlow = this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow[i];
                let _pra_ao = (_getApprFlow && _getApprFlow.PRA_AO) ? _getApprFlow.PRA_AO.trim() : ''
                let _pra_a_ao = (_getApprFlow && _getApprFlow.PRA_A_AO) ?  _getApprFlow.PRA_A_AO.trim() : ''
                let _um_user_id = (_token_details && _token_details.UM_USER_ID) ?  _token_details.UM_USER_ID.trim() : ''
                _um_user_id = (_um_user_id) ? _um_user_id.trim() : '';
                if (_pra_ao == _um_user_id || _pra_a_ao == _um_user_id) {
                    _details.seq = _getApprFlow.PRA_SEQ;
                }
            }
        }


        this.setState({
            delete : true
        })
        this.props.delete_file(_details);
       
    }

    ClearAll = () =>{
        this.props.reset('ApprovalItems')
        this.setState({
            remarks : ''
        })
    
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
    }

   
    render(){
        let _user_details = UserDetails()

    
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

        let _table_data_header = [
            {name : "Line", id:"PRD_CT_ID", width:'50px', key:true, type:"index"},
            {name : "Vendor Name", id:"CM_COY_NAME", width:'100px'},
            {name : "Gift", id:"GIFT", width:'100px'},
            {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px'},
            {name : "Person Code (L9)", id:"PERSONCODE", width:'144px'},
            {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px'},
            {name : "Item Code", id:"PRD_B_ITEM_CODE", width:'122px', dataFormat:"validatedata"},
            {name : "GL Description (GL Code)", id:"PRD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.CBG_B_GL_DESC + ' (' + row.PRD_B_GL_CODE + ')'
                )
            }},
            {name : "Category Code", id:"PRD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'150px'},
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"PRD_UOM", width:'100px'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'100px'},
            {name : "Last Txn. Price", id:"PRD_UNIT_COST", width:'120px', dataFormat:"number"},
            {name : "Sub Total", id:"PRD_ORDERED_QTY", width:'100px', formatter: (cellContent, row) => {
                let _sub_total = parseFloat(row.PRD_ORDERED_QTY * row.PRD_UNIT_COST).toFixed(2);
                return <div className="text-right">{(_sub_total && _sub_total>0) ? NumberFormate(_sub_total) : '0.00' }</div>
            }},
            {name : "SST Rate", id:"GST_RATE", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-left">{row.GST_RATE === 'N/A' ? 'N/A' : row.GST_RATE}</div>
            }},
            {name : "SST Amount", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                    return ((row.PRD_GST) ? ((row.PRD_ORDERED_QTY * row.PRD_UNIT_COST) * (row.PRD_GST/100)) : 0).toFixed(2)
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Cost Centre Code (L7)", id:"STATUS_DESC", width:'100px',formatter: (cellContent, row) => {
                return row.CDM_DEPT_CODE + "- " + row.AM_ACCT_DESC
            }},
            {name : "Delivery Address", id:"PRD_D_ADDR_CODE", width:'160px',formatter: (cellContent, row) => {
                return row.PRD_D_ADDR_LINE1 +' '+ row.PRD_D_ADDR_LINE2 +' '+  ((row.PRD_D_ADDR_LINE3) ? row.PRD_D_ADDR_LINE3 : '')
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


        if(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Type=='cc'){
            _table_data_header.forEach((list_details, index)=>{
                if(list_details.name=="Last Txn. Price"){
                    _table_data_header[index].name  = "Contract Price"
                }
            })
        }

        if(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Type!='cc'){
            _table_data_header.forEach((list_details, index)=>{
                if(list_details.name=="Vendor Name"){
                    delete _table_data_header[index]
                }
            })
        }
        
        let _sub_total  = this.props.search_result  && this.props.search_result.itemDetails ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a += val.PRD_ORDERED_QTY * val.PRD_UNIT_COST, 0).toFixed(2): '0.00';
        let _sub_gst  = this.props.search_result && this.props.search_result.itemDetails  ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a  += (val.PRD_GST) ? (val.PRD_ORDERED_QTY * val.PRD_UNIT_COST) * (val.PRD_GST/100) : 0 , 0).toFixed(2) :  '0.00';
        let _total  = (parseFloat(_sub_total)+parseFloat(_sub_gst)).toFixed(2)

        
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.props.fue_loading) ? <Loader /> : '' }
              {(this.props.fd_loading) ? <Loader /> : '' }
              {(this.props.pdf_loading) ? <Loader /> : '' }
              
              {((this.props.file_delete && this.props.file_delete.loading)) ? <Loader /> : '' }
              {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             
            
            <PageHeading 
                    heading="" 
                    subheading={(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? 'Click the Approve PR button to approve the PR or Reject PR button to reject the PR ' : 'Click the Approve PR button to approve the PR or Reject PR button to reject the PR.' }
                />
                <TabHeading color={'bg-info text-white'}>Purchase Request Header</TabHeading>             
                            <div className="row" >
                                <div className="col-md-12 col-12 col-lg-2"><label>PR Number : </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_NO: '' }  {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_URGENT==1) ? '(Urgent)'  : '' }  </p></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>Status : </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? AppendPrStatus(this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC, this.props.search_result.itemDetails.PR_MSTR[0]) : '' }</p></div>
        
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Requester Name : </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_REQ_NAME: '' }</p></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>Attention To :  </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_S_ATTN: '' }</p></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Requester Contact : </label></div>
                                  <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_REQ_PHONE: '' }</p></div>

                            </div>

                            

                            
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Internal Remarks : </label></div>
                                <div className="col"><div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_INTERNAL_REMARK: '' }</div></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>External Remarks : </label></div>
                                <div className="col"><div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_External_Remark: '' }
                                </div></div>
                            </div>

                        
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                                <div className="col">
                                    {this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                        if (list.CDA_TYPE == 'I') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                        }
                                    })}
                                    
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                                <div className="col">
                                    {this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                        if (list.CDA_TYPE == 'E') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u></p>
                                        }
                                    })}
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
                                                <td>{(data.AAO_NAME) ? data.AAO_NAME : '-'}</td>
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
                            footer={false}
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
                    {!this.state.hidden_submit && 
                    <Fragment>
                    <div className="mt-2 row">
                        <div className="col-12" style={{padding:'0px'}}>  
                               <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks :"  onChange={(e)=>this.setState({
                                   remarks : e.target.value
                               })}/>
                               <div className="col-12 col-sm-6">
                               <div className="row mt-2">
                                    <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Internal Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                                </div> 
                                <div className="row">
                                    <div className="col-3"><label></label></div>
                                    <div className="col-7">Recommended file size is 10240 KB</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                  
                        <div className="mt-2 row">
                            <div className="col-lg-2 col-md-2 col-12">
                                <label className="auto_width">Internal File Attached : </label>
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">
                                <div className="col_details">
                                    {(this.state.attachment && this.state.attachment.length > 0 && this.state.attachment[0].Text!=='No Files Attached') ? this.state.attachment.map((list, index) => {
                                        if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => this.delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }) : <div className="auto_width">No files attached</div>}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                            }
                    <div className="mt-2 mb-5 row">
                            {!this.state.hidden_submit && 
                                <Fragment>
                                    <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.confirm_function('approve', (this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow) ?  (this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.filter(list => (list.PRA_AO == _user_details.UM_USER_ID.trim() || list.PRA_A_AO == _user_details.UM_USER_ID.trim()) && (list.PRA_APPROVAL_TYPE.trim()=="2")).length > 0 ? 'endorse this PR' : 'approve this PR') : '')}>{(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow) ?  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.filter(list => (((list.PRA_AO.trim() ==_user_details.UM_USER_ID.trim() || list.PRA_A_AO == _user_details.UM_USER_ID.trim()) && (list.PRA_APPROVAL_TYPE.trim()=="2")))).length > 0 ? 'Endorse PR' : 'Approve PR' : ''}</button> </div>
                                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>this.confirm_function('reject', 'reject this PR')}>Reject PR</button></div>
                                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-info btn-sm" onClick={()=>this.confirm_function('hold', 'hold this PR')}>Hold PR</button></div>
                                    <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm" onClick={(e)=>this.ClearAll()}>Clear</button></div>
                                </Fragment>
                            }
                            {(this.state.hidden_submit) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.prpdf()}>View PR PDF</button></div>  : ''}
                            <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm" onClick={()=>{ this.props.history.push({pathname : '/approvepr'})}}>Back</button></div>
                    </div>
                </form>

                <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />

                <Alert 
                    title="" 
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
               
               
        </Fragment>
    }
}

export default reduxForm({
    form:'ApprovalItems',
})(ApprovalRejectList);
