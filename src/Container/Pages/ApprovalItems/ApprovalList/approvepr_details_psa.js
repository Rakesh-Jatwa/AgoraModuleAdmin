import React, {Component, Fragment} from 'react';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import PageHeading from '../../../../Component/Heading/PageHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../../Component/Loader'
import {addDate, TodayDateSalash} from '../../../../Component/Dates'
import { Tabs, Tab } from 'react-bootstrap';
import {GetViewSinglePr, GetDownloadFile, } from '../../../../Actions/Approver'
import {GetGeneratePRPDF} from '../../../../Actions/Requester'
import {NumberFormate, AppendStatus, AppendStatusApprover} from '../../../../Actions/Common/Functions'
import {UserDetails} from '../../../../Common/LocalStorage'
import BackButton from '../../../../Component/Buttons/Back'
class ApproveprDetails extends Component {
    constructor(props){
        super(props);
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
            active_key : 'ApprovalRejected',
        }
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


    download_files = (data, status) => {
        let requestParam = '';
        if (status === 'reqDoc') {
            requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': data.CDA_DOC_TYPE, 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': data.pEnumDownloadType };
        }
        else {
            requestParam = data;
        }
        this.props.GetDownloadFile(requestParam);
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
        let _user_Details = UserDetails()

        const _table_data_header = [
            {name : "Line", id:"PRD_CT_ID", width:'50px', key:true, type:"index"},
            {name : "Gift", id:"GIFT", width:'100px'},
            {name : "Fund Type (L1)", id:"FUNDTYPE", width:'117px'},
            {name : "Person Code (L9)", id:"PERSONCODE", width:'144px'},
            {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px'},
            {name : "Item Code", id:"PRD_B_ITEM_CODE", width:'122px'},
            {name : "GL Description (GL Code)", id:"PRD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.CBG_B_GL_DESC + ' (' + row.PRD_B_GL_CODE + ')'
                )
            }},
            {name : "Category Code", id:"PRD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'150px'},
            {name : "Converted", id:"icPONo", width:'150px'},
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"PRD_UOM", width:'100px'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'145px'},
            {name : "Last Txn. Price", id:"PRD_UNIT_COST", width:'130px', dataFormat:"number4"},
            {name : "Amount", id:"AMOUNT", width:'100px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.AMOUNT).toFixed(2)}</div>
            }},
            {name : "SST Rate", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                return <div className="text-left">{row.GST_RATE === 'N/A' ? 'N/A' : row.GST_RATE}</div>
            }},
            {name : "SST Amount", id:"PRD_GST", width:'100px',formatter: (cellContent, row) => {
                    return ((row.PRD_GST) ? ((row.PRD_ORDERED_QTY * row.PRD_UNIT_COST) * (row.PRD_GST/100)) : 0).toFixed(2)
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'112px', dataFormat:"validatedata"},
            {name : "Cost Centre Code (L7)", id:"STATUS_DESC", width:'100px',formatter: (cellContent, row) => {
                return row.CDM_DEPT_CODE + "- " + row.AM_ACCT_DESC
            }},
            {name : "Delivery Address", id:"PRD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                return row.PRD_D_ADDR_LINE1 + row.PRD_D_ADDR_LINE2 + row.PRD_D_ADDR_LINE3
            }},
            {name : "Est. Date of Delivery", id:"data.PRD_ETD", width:'120px',formatter: (cellContent, row) => {
                return addDate(this.props.search_result.itemDetails.PR_MSTR[0].PRM_SUBMIT_DATE, row.PRD_ETD)
            }},
            {name : "Warranty Terms (mths)", id:"PRD_WARRANTY_TERMS", width:'111px',formatter: (cellContent, row) => {
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
                if(list_details.id=="icPONo"){
                    _table_data_header[index].name  = "PO.No"
                    _table_data_header[index].id = 'PRD_CONVERT_TO_DOC'
                }
            })
        }


        let _sub_total  = this.props.search_result  && this.props.search_result.itemDetails ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a += val.PRD_ORDERED_QTY * val.PRD_UNIT_COST, 0).toFixed(2): '0.00';
        let _sub_gst  = this.props.search_result && this.props.search_result.itemDetails  ? this.props.search_result.itemDetails.PR_DETAILS.reduce((a, val) => a  += (val.PRD_GST) ? (val.PRD_ORDERED_QTY * val.PRD_UNIT_COST) * (val.PRD_GST/100) : 0 , 0).toFixed(2) :  '0.00';
        let _total  = (parseFloat(_sub_total)+parseFloat(_sub_gst)).toFixed(2)
 
        return <div id="tabs">
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
              this.setState({active_key:k})
              if(k=="ApprovalList"){
                  this.props.history.push({
                     pathname : 'approvepr',
                     redirect_to_tab : 'ApprovalList'
                  })
              }
           }
        }>
         <Tab eventKey="ApprovalList" title="Approval List">
            <div className="tab-content py-3 px-3 px-sm-0">
            </div>
          </Tab>
         <Tab eventKey="ApprovalRejected" title="Approved / Rejected Listing">
          <div className="tab-content py-3 px-3 px-sm-0">   
            <Fragment>
              
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.d_loading) ? <Loader /> : '' }
              
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.props.fue_loading) ? <Loader /> : '' }
              {(this.props.pdf_loading) ? <Loader /> : '' }
              {((this.props.file_delete && this.props.file_delete.loading)) ? <Loader /> : '' }
              {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
              
            {/* <h6>Click the Approve PR button to approve the PR or Reject PR button to reject the PR.</h6> */}
           
            <PageHeading 
                heading="" 
                subheading=" Click the Duplicate PR button to duplicate the PR or Cancel PR button to cancel the PR" 
            />
            <TabHeading color={'bg-info text-white'}>Purchase Request Header</TabHeading> 

                
            
            
                <div className="row" >
                    <div className="col-md-12 col-12 col-lg-2"><label>PR Number : </label></div>
                    <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_PR_NO: '' } {(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR[0].PRM_URGENT==1) ? '(Urgent)'  : '' } </p></div>
                    <div className="col-md-12 col-12 col-lg-2"><label>Status : </label></div>
                    {(_user_Details && _user_Details.ROLE_NAME &&( _user_Details.ROLE_NAME.includes('app') ||  _user_Details.ROLE_NAME.includes('App'))? 
                          <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? AppendStatusApprover(this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC, this.props.search_result.itemDetails.PR_MSTR[0]) : '' }</p></div> : <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? AppendStatus(this.props.search_result.itemDetails.PR_MSTR[0].STATUS_DESC, this.props.search_result.itemDetails.PR_MSTR[0]) : '' }</p></div>
                    )}
                  

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

                    {(this.state.products && this.state.products.from_page && this.state.products.from_page=="pr_listing") ?
                    <Fragment>
                        <div className="col-md-12 col-12 col-lg-2"><label>Submitted Date : </label></div>
                        <div className="col"><p>{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? TodayDateSalash(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_SUBMIT_DATE) : '' }</p></div>
                    </Fragment>
                     : ''}
                    

                </div>

                

                
                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>Internal Remarks : </label></div>
                    <div className="col"><div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_INTERNAL_REMARK: '' }</div></div>
                    <div className="col-md-12 col-12 col-lg-2"><label>External Remarks : </label></div>
                    <div className="col"><div className="remarks_holder">{(this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR  && this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR .length) ? this.props.search_result.itemDetails && this.props.search_result.itemDetails.PR_MSTR [0].PRM_External_Remark: '' }</div>
                    </div>
                </div>

            
                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                    <div className="col">
                        {(this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.length>0 && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT[0].text!='No Files Attached')  ? this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                            if (list.CDA_TYPE == 'I') {
                                return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u></p>
                            }
                        }): 'No Files Attached'}
                        
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                    <div className="col">
                    {(this.props.search_result &&  this.props.search_result.itemDetails && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.length>0 && this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT[0].text!='No Files Attached')  ?   this.props.search_result.itemDetails.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                            if (list.CDA_TYPE == 'E') {
                                return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u></p>
                            }
                        }): 'No Files Attached'}
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
                    <div className="row mt-2">    
                        <div className='col-12'>   
                            <BootstrapCustomTable 
                                table_header={_table_data_header} 
                                table_body={(this.props.search_result  && this.props.search_result.itemDetails &&  this.props.search_result.itemDetails.PR_DETAILS ) ?  this.props.search_result.itemDetails.PR_DETAILS : [] } 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={false}
                                table_name="issue_grn"
                            />
                           <table className="table table-striped">
                                <tr>
                                    <td className="text-right" colSpan={4}><strong>Sub Total :</strong></td>
                                    <td className="text-right" style={{width:'109px'}}> {(_sub_total && _sub_total>0) ? NumberFormate(_sub_total) : 0.00 } </td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={4}><strong>SST Amount :</strong></td>
                                    <td className="text-right"  style={{width:'109px'}}>{(_sub_gst && _sub_gst>0) ? NumberFormate(_sub_gst) : 0.00 }</td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={4}><strong>Grand Total :</strong></td> 
                                    <td className="text-right" style={{width:'109px'}}>{(_total && parseFloat(_total)>0) ? NumberFormate(_total) : 0.00 }</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2 mb-5 row">
                       
                        <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.prpdf()}>View PR PDF</button></div>
                    </div>

               
               
        </Fragment>
        </div>
      </Tab>
    </Tabs>
    </div>
    }
}




 const mapStateToProps = state => ({
        d_loading : state.view_single_pr.loading,
        loading : state.file_download.loading,
        search_result : state.view_single_pr.responseList,
        pdf_loading : state.generate_prpdf.loading
  })
  
  
const mapDispatchToProps = dispatch => ({
    get_search_list : (values) => dispatch(GetViewSinglePr(values)),
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetGeneratePRPDF  : (values) => dispatch(GetGeneratePRPDF(values)),
})
  
  
const ApproveprDetailsHolder = connect(mapStateToProps, mapDispatchToProps)(ApproveprDetails);
export default ApproveprDetailsHolder;
  
