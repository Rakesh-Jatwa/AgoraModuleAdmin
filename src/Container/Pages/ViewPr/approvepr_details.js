import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import {GetSearchPurchaseReqApproval, GetViewSinglePr,  GetPurchaseReqRejectSearch, GetDownloadFile} from '../../../Actions/Approver'
import {GetGeneratePRPDF} from '../../../Actions/Requester'
import {addDate, TodayDateSalash} from '../../../Component/Dates'
import {FromTextareaParallel} from '../../../Component/From/FromInputs'
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import {ApiExtract} from '../../../Common/GetDatas'
import {getDuplicatePR, CancelPR} from '../../../Apis/RequesterServices'

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
        console.log('getDerivedStateFromProps', props)
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
            this.setState({loading:true})
            let _details = {
                lblPRNo: this.props.location.datas.PRM_PR_No,
                PRIndex: this.props.location.datas.PRM_PR_Index,
                CurrentAppSeq: "",
                strRemark: "",
                caller: ""
            }
            let _status = await ApiExtract(CancelPR, _details)
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
                return <div className="text-right">{parseFloat(row.PRD_ORDERED_QTY * row.PRD_UNIT_COST).toFixed(2) }</div>
            }},
            {name : "SST Rate", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-right">{row.GST_RATE === 'N/A' ? 'N/A' : parseFloat(row.GST_RATE).toFixed(2) }</div>
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
                return addDate(this.props.search_result.list.PR_MSTR[0].PRM_SUBMIT_DATE, row.PRD_ETD)
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
              {(this.props.sr_loading) ? <Loader /> : '' }
              {(this.props.pdf_loading) ? <Loader /> : '' }
              
              {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
              
           
            <TabHeading color={'bg-info text-white'}>Purchase Request Header</TabHeading> 
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  PR Number :	</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_PR_NO : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label>  Purchaser :	</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_BUYER_NAME : '' }</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  Submission Date :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  TodayDateSalash(this.props.search_result.list.PR_MSTR[0].PRM_SUBMIT_DATE) : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label>  Status :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].STATUS_DESC : '' }</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>   Billing Address :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_B_ADDR_LINE1 : '' }<br></br>{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_B_ADDR_LINE2  : '' } <br></br>{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_B_ADDR_LINE3  : '' }
                        <br></br>{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_B_POSTCODE  : '' }<br></br>{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_B_CITY  : '' } <br></br>{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].STATE  : '' } {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].CT : '' }   </div>

                </div>

                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  Internal Remarks :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_INTERNAL_REMARK : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label> 		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label> Vendor :	</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_S_COY_NAME : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label> 	Currency :	</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_CURRENCY_CODE : '' }</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>External Remarks :</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_External_Remark : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label> 		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> </div>
                </div>
               
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label> Payment Terms :</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_PAYMENT_TERM : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label>	 Payment Method :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_PAYMENT_METHOD : '' }</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  Shipment Terms :</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_SHIPMENT_TERM : '' }</div>
                    <div className="col-12 col-md-2 col-lg-2"><label>	 Shipment Mode :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{(this.props.search_result.list && this.props.search_result.list.PR_MSTR  && this.props.search_result.list && this.props.search_result.list.PR_MSTR.length) ?  this.props.search_result.list.PR_MSTR[0].PRM_SHIPMENT_MODE : '' }</div>
                </div>

                        
                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                    <div className="col">
                        {this.props.search_result &&  this.props.search_result.list && this.props.search_result.list.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.list.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                            if (list.CDA_TYPE == 'I') {
                                return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                            }
                        })}
                        
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                    <div className="col">
                        {this.props.search_result &&  this.props.search_result.list && this.props.search_result.list.COMPANY_DOC_ATTACHMENT &&  this.props.search_result.list.COMPANY_DOC_ATTACHMENT.map((list, index) => {
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
                                        {this.props.search_result && this.props.search_result.list && this.props.search_result.list.GET_APPROVAL_FLOW &&  this.props.search_result.list.GET_APPROVAL_FLOW.getApprFlow &&  this.props.search_result.list.GET_APPROVAL_FLOW.getApprFlow.map((data, index) =>
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
                            table_body={(this.props.search_result  && this.props.search_result.list &&  this.props.search_result.list.PR_DETAILS ) ?  this.props.search_result.list.PR_DETAILS : [] } 
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
                              
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-5 row">
                       <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button></div>
                       {(this.props.location && this.props.location.type && this.props.location.type=="listing") ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.DuplicatePr()}>Duplicate PR</button></div> : '' }
                       {(this.props.location && this.props.location.type && this.props.location.type=="cancel") ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.CancelPr()}>Cancel PR</button></div> : '' }
                       {(this.props.location && this.props.location.type && this.props.location.type=="cancel") ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.prpdf()}>View PR PDF</button></div> : '' }
                    </div>
              

                <Alert 
                    title="" 
                    message={this.state.modal_body} 
                    status={this.state.status} show={this.state.model} confirm={this.closemodel}
                />
               
               
        </Fragment>
    }
}




const mapStateToProps = state => ({
  purchase_reqest_approval : state.purchase_request_items.responseList,
  pr_details : state.approver_pr,
  purchase_reqest_reject : state.purchase_request_items.responseList,
  pr_loading:state.purchase_reqest_reject.loading,
  loading:state.purchase_reqest_approval.loading,
  search_result : state.purchase_reqest_approval.responseList,
  fue_loading : state.file_upload_external.loading,
  form_details : state.form.ApprovalItems,
  dr_loading : state.file_delete_external.loading,
  pdf_loading : state.generate_prpdf.loading,
  
})


const mapDispatchToProps = dispatch => ({
  ResetApprovalFrom  : () => dispatch(reset('ApprovalItems')),
  ResetRejectFrom  : () => dispatch(reset('RejectList')),
  get_search_list : (values) => dispatch(GetSearchPurchaseReqApproval(values)),
  GetViewSinglePr : (values) => dispatch(GetViewSinglePr(values)),
  GetPurchaseReqRejectSearch : (values) => dispatch(GetPurchaseReqRejectSearch(values)),
  download_file  : (values) => dispatch(GetDownloadFile(values)),
  GetGeneratePRPDF  : (values) => dispatch(GetGeneratePRPDF(values)),

})


const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(ApprovalRejectList);
export default reduxForm({
    form:'PurchaseHolder',
})(PurchaseHolder);
