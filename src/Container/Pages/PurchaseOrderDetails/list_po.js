import React, {Component, Fragment} from 'react';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';

import {reduxForm, reset } from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import { GetGeneratePOPDF, GetDownloadFile, GetPoListDetails} from '../../../Actions/Vendor'
import {GetApppoDetails} from '../../../Actions/Approver'
import {addDate, TodayDateSalash} from '../../../Component/Dates'
import {UserDetails} from '../../../Common/LocalStorage'
import ViewPoLine from '../../Pages/ViewPoLine'
import {GetPolineDetails} from '../../../Actions/Vendor';
import {NumberFormate, HandlePaymentTerm} from '../../../Actions/Common/Functions'
import BackButton from '../../../Component/Buttons/Back'
class PurchaseOrderDetails extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
      
   
    
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
            req_data:{},
            dto_data:{},
            loading:false,
            status :false, 
            attachment : [],
            delete : false, 
            rendered:false,
            pom_details : {},
            pod_details : [],
            approval_flow_table : [],
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            show_view : true,
            upload_status : false,
            show_details : true
        }
    }
    
    closemodel = () => {
        this.setState({
            model : false,
            modal_error : false
        })
        if(this.state.status){
           
            this.props.get_search_list(this.props.location.datas)
            this.setState({ rendered:false})
        }
    }

 

    get_details(details){
      
        let _details = { 'BCoyID': details.POD_COY_ID, 'PO_NO': details.POD_PO_NO, 'PO_LINE': details.POD_PO_LINE, 'v_comid': '339201P160' }
        this.props.GetPolineDetails(_details)
        this.setState({
            show_details : false
        })
    }

    static getDerivedStateFromProps(props, state){
        if((!state.rendered) &&  (props.search_result) &&  (!state.upload_status)){
            return {
                rendered:(props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? true : false,
                pom_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POM_DETAILS.length > 0 ) ? props.search_result.allInfo.POM_DETAILS[0] : {},
                pod_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.POD_DETAILS : [],
                approval_flow_table : (props.search_result && props.search_result.apprFlow && props.search_result.apprFlow.getApprFlow) ? props.search_result.apprFlow.getApprFlow: [],
                attachment:[]
            }
        }

       

        else if((!state.delete) && (state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile)){
            return {
                rendered:false ,
                attachment:props.upload_document.displayAttachFile
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
        else{
            return {
                pom_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POM_DETAILS.length > 0 ) ? props.search_result.allInfo.POM_DETAILS[0] : {},
                pod_details : (props.search_result && props.search_result.allInfo && props.search_result.allInfo.POM_DETAILS && props.search_result.allInfo.POD_DETAILS.length > 0 ) ? props.search_result.allInfo.POD_DETAILS : [],
                approval_flow_table : (props.search_result && props.search_result.apprFlow && props.search_result.apprFlow.getApprFlow) ? props.search_result.apprFlow.getApprFlow: [],
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



    componentDidMount(){
        
        if(this.props.location && this.props.location.datas){
            this.setState({
                products : this.props.location.datas,
                model:false,
                model_body:false
            })
            if(this.props.location.datas && this.props.location.datas.from_page=="listing"){
                this.setState({
                    show_details : false
                })
            }
            this.props.get_search_list(this.props.location.datas)
        }
        
    }

    

    close_details = () =>{
        this.setState({
            show_details : true
        })
    }

    GetGeneratePOPDF(){
        let _user_details = UserDetails()
        let _data = { 'POM_B_Coy_ID': _user_details.UM_COY_ID, 'POM_PO_No': this.state.pom_details.POM_PO_NO }
        this.props.GetGeneratePOPDF(_data);
    }




    render(){
      
        const { handleSubmit } = this.props
        const _table_data_header = [
            {name : "Line", id:"POD_PO_LINE", width:'60px' ,  formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Gift", id:"GIFT", width:'100px', key:true},
            {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px'},
            {name : "Person Code (L9)", id:"PERSONCODE", width:'144px'},
            {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px'},
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata"},
            {name : "GL Description (GL Code)", id:"POD_B_GL_CODE", width:'144px',formatter: (cellContent, row) => {
                return (
                    row.POD_B_GL_CODE + ' (' + row.GLDESCRIPTION + ')'
                )
            }},
            {name : "Category Code", id:"POD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'150px', dataFormat:"price"},
            {name : "Quantity", id:"POD_ORDERED_QTY", width:'100px', dataFormat:"price"},
            {name : "UOM", id:"POD_UOM", width:'100px'},
            {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number"},
            {name : "Sub Total", id:"POD_PO_LINE", width:'100px', dataFormat:"price"},
            {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
            {name : "SST Amount", id:"POD_GST", width:'110px',formatter: (cellContent, row) => {
                return <div className="text-right">{((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'100px', dataFormat:"validatedata"},
            {name : "Cost Centre Code (L7)", id:"costCentre", width:'100px',formatter: (cellContent, row) => {
                return 'DP0112-Dept-Compliance:HCM'
            }},
            {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ row.POD_D_ADDR_LINE3
            }},
            {name : "Est. Date of Delivery", id:"POD_D_ADDR_CODE", width:'100px',formatter: (cellContent, row) => {
                return addDate(this.state.pom_details.POM_SUBMIT_DATE, row.POD_ETD)
            }},
            {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'100px', dataFormat:"price"},
            {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
            {name : "Test", id:"POD_WARRANTY_TERMS", width:'100px',formatter: (cellContent, row) => {
                return '10'
            }},
            {name : "Remarks", id:"POD_REMARK", width:'100px'},

        ];
       
        let _sub_total  = this.state.pod_details ? this.state.pod_details.reduce((a, val) => a += val.POD_ORDERED_QTY * val.POD_UNIT_COST, 0): 0;
        let _sub_gst  = this.state.pod_details ? this.state.pod_details.reduce((a, val) => a += val.POD_GST_RATE, 0): 0;
        let _total  = this.state.pod_details ? this.state.pod_details.reduce((a, val) =>a += (val.POD_ORDERED_QTY * val.POD_UNIT_COST), 0): 0
        _sub_gst = _sub_gst+_total;
        return <Fragment>
        {(this.props.loading) ? <Loader /> : '' }
        {(this.state.loading) ? <Loader /> : '' }
        {(this.props.dr_loading) ? <Loader /> : '' }
        {(this.props.fue_loading) ? <Loader /> : '' }
        {(this.props.fd_loading) ? <Loader /> : '' }
        {(this.props.popdf_loading) ? <Loader /> : '' }
        {((this.props.file_delete && this.props.file_delete.loading)) ? <Loader /> : '' }
        {((this.props.pr_details && this.props.pr_details.loading)) ? <Loader /> : '' }
        {(this.state.show_details) ?    
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            {/* <h6>Click the Approve PR button to approve the PR or Reject PR button to reject the PR.</h6> */}
                  <TabHeading color={'bg-info text-white'}>Purchase Order Header </TabHeading> 
                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label>  PO Number :	</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_PO_NO} {(this.state.pom_details.POM_URGENT==1) ? '(Urgent)' : ''}</div>
                      <div className="col-12 col-md-2 col-lg-2"><label>  Purchaser :	</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_BUYER_NAME}</div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label>  Submission Date :	</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {TodayDateSalash(this.state.pom_details.POM_SUBMIT_DATE)}	</div>
                      <div className="col-12 col-md-2 col-lg-2"><label>  Status :		</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.STATUS_DESC}</div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label>   Billing Address :		</label></div>
                      <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_B_ADDR_LINE1}<br></br>{this.state.pom_details.POM_B_ADDR_LINE2} <br></br>{this.state.pom_details.POM_B_ADDR_LINE3}
                          <br></br>{this.state.pom_details.POM_B_POSTCODE} <br></br>{this.state.pom_details.POM_B_CITY} <br></br>{this.state.pom_details.STATE} {this.state.pom_details.CT}    </div>

                  </div>

                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label>  Internal Remarks :		</label></div>
                      <div className="col-12 col-md-4 col-lg-4"><div className="remarks_holder">{this.state.pom_details.POM_INTERNAL_REMARK} </div></div>
                      <div className="col-12 col-md-2 col-lg-2"><label>External Remarks :</label></div>
                      <div className="col-12 col-md-4 col-lg-4"><div className="remarks_holder">{this.state.pom_details.POM_External_Remark} </div></div>
                  </div>

                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label> Vendor :	</label></div>
                      <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_S_COY_NAME} </div>
                      <div className="col-12 col-md-2 col-lg-2"><label> 	Currency :	</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_CURRENCY_CODE} </div>
                  </div>
                  <div className="row">
                     
                      <div className="col-12 col-md-2 col-lg-2"><label></label></div>
                      <div className="col-12 col-md-4 col-lg-4"></div>
                  </div>
              
                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label> Payment Terms :</label></div>
                      <div className="col-12 col-md-4 col-lg-4">{(this.state.pom_details.POM_PAYMENT_TERM) ? HandlePaymentTerm(this.state.pom_details.POM_PAYMENT_TERM) : ''} </div>
                      <div className="col-12 col-md-2 col-lg-2"><label>	 Payment Method :		</label></div>
                      <div className="col-12 col-md-4 col-lg-4"> {this.state.pom_details.POM_PAYMENT_METHOD}</div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-md-2 col-lg-2"><label>  Shipment Terms :</label></div>
                      <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_SHIPMENT_TERM} </div>
                      <div className="col-12 col-md-2 col-lg-2"><label>	 Shipment Mode :		</label></div>
                      <div className="col-12 col-md-4 col-lg-4">{this.state.pom_details.POM_SHIPMENT_MODE} </div>
                  </div>

                  
                      <div className="row mt-2">
                          <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                          <div className="col">
                              {(this.props.search_result &&  this.props.search_result.allInfo && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT  && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.length>0 &&   this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT[0].text!="No Files Attached") ? this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT .map((list, index) => {
                                  if (list.CDA_TYPE == 'I') {
                                      return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u></p>
                                  }
                              }): "No files attached"}
                              
                          </div>
                      </div>

                      <div className="row mt-2">
                          <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                          <div className="col">
                          {(this.props.search_result &&  this.props.search_result.allInfo && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.length>0 && this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT[0].text!="No Files Attached") ?  this.props.search_result.allInfo.COMPANY_DOC_ATTACHMENT.map((list, index) => {
                                  if (list.CDA_TYPE == 'E') {
                                      return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                  }
                              }): "No files attached"}
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
                                  
                                  {this.state.approval_flow_table && this.state.approval_flow_table.map((data, index) =>
                                      <tr key={index}>
                                          <td>{data.PRA_SEQ}</td>
                                          <td>{data.AO_NAME}</td>
                                          <td>{data.AAO_NAME}</td>
                                          <td>{data.PRA_APPROVAL_TYPE === '0' ? 'Endorsement' : 'Approval'}</td>
                                          <td>{data.PRA_ACTION_DATE !== null ? TodayDateSalash(data.PRA_ACTION_DATE) : ''}</td>
                                          <td>{data.PRA_AO_REMARK}</td>
                                          <td>{(data.userAttachFileList && data.userAttachFileList.length>0) ?  data.userAttachFileList.map((val, index) => {
                                              return <p><u><span onClick={() => this.download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
                                          }):'No Files Attached'}</td>
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
                      table_body={(this.state.pod_details) ?  this.state.pod_details : [] } 
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
                      

              <div className="mt-2 mb-5 justify-content-end row">
                <div className="col-lg-auto col-md"><button type="button" className="ml-4 btn btn-sm btn-outline-success" onClick={()=>this.GetGeneratePOPDF()}>View PO</button></div>
                <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
            </div>             
                      
                </form> : <ViewPoLine search_list={this.props.search_list} close_view ={this.close_details} />}

                


                <Alert 
     
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}





 const mapStateToProps = state => ({
    status_props : state.view_po_click.status,
    purchase_reqest_approval : state.view_po_click.responseList,
    loading:state.view_po_click.loading,
    dr_loading : state.file_download.loading,
    popdf_loading : state.generate_popdf.loading,
    dopdf_loading : state.generate_dopdf.loading,
    search_list : state.po_line_item.responseList,
    loading_details : state.po_line_item.loading,
    po_line_details : state.po_line_details.responseList,
    loading:state.po_approval_details.loading,
    search_result : state.po_approval_details.responseList,
  })

  
  
  const mapDispatchToProps = dispatch => ({
    ResetApprovalFrom  : () => dispatch(reset('PurchaseOrderDetails')),
    get_search_list : (values) => dispatch(GetApppoDetails(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetPolineDetails : (values) => dispatch(GetPolineDetails(values)),
    GetPoListDetails : (values) => dispatch(GetPoListDetails(values)),
  })
  
  
const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetails);
export default reduxForm({
    form:'PurchaseOrderDetails',
})(PurchaseHolder);
