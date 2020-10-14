import React, {Component, Fragment} from 'react';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RejectPR, ApprovePR, HoldPR} from '../../../../Apis/Approver'
import {addDate, TodayDateSalash} from '../../../../Component/Dates'
import {UserDetails} from '../../../../Common/LocalStorage'
import Enum from '../../../../Common/GlobalEnum'
import {FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'
import {CheckUpload} from '../../../../Actions/Common/Functions'
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
        }
    }
    
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/approvepr'
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
        this.props.get_search_list(_form_value)
    }

    FileUpload = (attachment) => {
        this.setState({delete:false})
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":Enum.EnumUploadType.UserAttachment,
            "strDocType": "PR",
            "pEnumUploadForm": "0",
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
        if(_file_name == "ApproveDto.internalAttachment"){
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
            req.AttachType = '';
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
                status: false,
                model:true,
                modal_body:_details.message,
                loading:false,
            })
        }

    }

    async RejectPr(){
        let {values} =  this.props.form_details
        if(values  && values.ApproveDto && values.ApproveDto.strRemark){
            let details = this.process_details();
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
            let details = this.process_details();
            let _status = await ApiExtract(HoldPR, details);
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

    process_details() {
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
                    "strRemark": this.state.remarks,
                    "CurrentAppSeq": 1,
                    "ISHighestLevel":"",
                    "Consolidator": "",
                    "relief": false,
                    "ApprType": "",
                    "AO": "",
                    "txtRemark": "tereff"
                }
            }

            for (let index = 0; index < _final_details.length; index++) {
                const val = _final_details[index];
                if ((val.PRA_APPROVAL_TYPE === "2") && (val.PRA_ACTION_DATE === "" || val.PRA_ACTION_DATE === null)) {
                    _get_result = val;
                    break;
                } else if ((val.PRA_APPROVAL_TYPE != "2") && (val.PRA_ACTION_DATE !== "" || val.PRA_ACTION_DATE !== null)) {
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
                _get_result_initial.AO = _get_result.PRA_AO;
                _get_result_initial.txtRemark = this.state.remarks;
               
            }
        }

        
        return _get_result_initial;
    }

    async ApprovePr(){
        let details =  this.process_details()
        let _status =  await ApiExtract(ApprovePR, details);
        if(_status){
            this.setState({
                status: _status.status,
                model:true,
                modal_body: _status.message,
                loading:false,
            })
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


    delete_file = (data, type) =>{
        data.CDA_DOC_TYPE = "AO";
        data.AttachType = "E";
        let _token_details = UserDetails();

        if( this.props.search_result && this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Index){
            data.CDA_DOC_NO = this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_Index;
        }
        
        if(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.length){
            for (let i = 0; i < this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.length;  i++) {
                const _getApprFlow = this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow[i];
                if (_getApprFlow.PRA_AO == _token_details.UM_USER_ID || _getApprFlow.PRA_A_AO == _token_details.UM_USER_ID) {
                    data.seq = _getApprFlow.PRA_SEQ;
                }
            }
        }
        
        this.props.delete_file(data);
        this.setState({
            delete : true
        })
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
            {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px'},
            {name : "Person Code (L9)", id:"PERSONCODE", width:'144px'},
            {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px'},
            {name : "Item Code", id:"PRD_B_ITEM_CODE", width:'122px'},
            {name : "GL Description (GL Code)", id:"PRD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.CBG_B_GL_DESC + ' (' + row.PRD_B_GL_CODE + ')'
                )
            }},
            {name : "Category Code", id:"PRD_B_CATEGORY_CODE", width:'100px'},
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'150px'},
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"PRD_UOM", width:'100px'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'100px'},
            {name : "Last Txn. Price", id:"PRD_UNIT_COST", width:'100px', dataFormat:"number"},
            {name : "Sub Total", id:"PRD_ORDERED_QTY", width:'100px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.PRD_ORDERED_QTY * row.PRD_UNIT_COST).toFixed(2)}</div>
            }},
            {name : "SST Rate", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-left">{row.GST_RATE === 'N/A' ? 'N/A' : row.GST_RATE}</div>
            }},
            {name : "SST Amount", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                return ((row.PRD_GST) ? ((row.PRD_ORDERED_QTY * row.PRD_UNIT_COST) * (row.PRD_GST/100)) : 0).toFixed(2)
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'100px'},
            {name : "Cost Centre Code (L7)", id:"STATUS_DESC", width:'100px',formatter: (cellContent, row) => {
                return row.CDM_DEPT_CODE + "- " + row.AM_ACCT_DESC
            }},
            {name : "Delivery Address", id:"PRD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                return row.PRD_D_ADDR_LINE1 + row.PRD_D_ADDR_LINE2 + row.PRD_D_ADDR_LINE3
            }},
            {name : "Est. Date of Delivery", id:"data.PRD_ETD", width:'100px',formatter: (cellContent, row) => {
                return addDate(this.props.search_result.itemDetails.PR_MSTR[0].PRM_SUBMIT_DATE, row.PRD_ETD)
            }},
            {name : "Warranty Terms (mths)", id:"PRD_ETD", width:'100px'},
            {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
            {name : "Remarks", id:"PRD_REMARK", width:'100px'},

        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.props.fue_loading) ? <Loader /> : '' }
              {((this.props.file_delete && this.props.file_delete.loading)) ? <Loader /> : '' }
              {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <h6>Click the Approve PR button to approve the PR or Reject PR button to reject the PR.</h6>
            
            <TabHeading color={'bg-info text-white'}>Purchase Request Header</TabHeading> 
            
            
                            <div className="row" >
                                <div className="col-md-12 col-12 col-lg-2"><label>PR Number : </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_NO: '' }</p></div>
                                <div className="col-md-12 col-12 col-lg-2"><label>Status : </label></div>
                                <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].STATUS_DESC: '' }</p></div>
        
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
                                <div className="col">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_INTERNAL_REMARK: '' }</div>
                                <div className="col-md-12 col-12 col-lg-2"><label>External Remarks : </label></div>
                                <div className="col">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_External_Remark: '' }
                                </div>
                            </div>

                        
                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                                <div className="col">
                                    {this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                        if (list.CDA_TYPE == 'I') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    })}
                                    
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                                <div className="col">
                                    {this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                        if (list.CDA_TYPE == 'E') {
                                            return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    })}
                                </div>
                            </div>

                <TabHeading color={'bg-info text-white'}>Approval Workflow</TabHeading> 
                <div className="row mt-2">    
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
                    <div className="row mt-2">    
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

                        </div>
                    </div>
                    <div className="mt-2 row">
                        <div className="col-12" style={{padding:'0px'}}>  
                               <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>this.setState({
                                   remarks : e.target.value
                               })}/>
                               <div className="col-12 col-sm-6">
                               <div className="row mt-2">
                                    <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Internal Attachment :" buttontext="upload" FileUpload={this.FileUpload} SendUpload={this.SendUpload} filename={this.state.external_file_name}/>
                                </div> 
                            </div>
                            
                        </div>
                    </div>
                    <div className="mt-2 row">
                        <div className="col-lg-2 col-md-2 col-12">
                            <label>Internal File Attached : </label>
                        </div>
                         <div className="col-lg-6 col-md-4 col-12">
                            <div className="col_details">
                                {this.state.attachment.map((list, index) => {
                                    if (list.Text !== 'No Files Attached') {
                                        return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => this.delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                })}
                            </div>
                        </div>
                      
                    </div>
                    <div className="mt-2 mb-5 row">
                        
                        <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-success btn-sm" onClick={()=>this.ApprovePr()}>{(this.props.search_result && this.props.search_result.itemDetails && this.props.search_result.itemDetails.GET_APPROVAL_FLOW && this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow) ?  this.props.search_result.itemDetails.GET_APPROVAL_FLOW.getApprFlow.filter(list => (list.PRA_APPROVAL_TYPE === "2") && (list.PRA_ACTION_DATE === "" || list.PRA_ACTION_DATE === null)).length > 0 ? 'Endorse PR' : 'Approve PR' : ''}</button> </div>
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>this.RejectPr()}>Reject PR</button></div>
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-info btn-sm" onClick={()=>this.HoldPr()}>Hold PR</button></div>
                        <div className="col-lg-auto col-md"><button type="reset" className="btn btn-outline-danger btn-sm">Clear</button></div>
                         <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button></div>
                    </div>
                </form>

                <Alert 
                    title="" 
                    message={this.state.modal_body} 
                    status={this.state.status} show={this.state.model} confirm={this.closemodel}
                />
               
               
        </Fragment>
    }
}

export default reduxForm({
    form:'ApprovalItems',
})(ApprovalRejectList);
