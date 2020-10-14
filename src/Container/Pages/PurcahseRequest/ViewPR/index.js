import React,{useEffect,Fragment} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {GetViewSinglePr, GetDownloadFile} from '../../../../Actions/Approver'
import Loader from '../../../../Component/Loader'
import {TodayDateSalash, addDate} from '../../../../Component/Dates'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import {NumberFormate} from '../../../../Actions/Common/Functions'
import BackButton from '../../../../Component/Buttons/Back'

let VendorDetailsPage = (props) => {
    let _dispatch = useDispatch();

    let {loading, pr_master, pr_details, get_approval_flow, attachment, fd_loading} = useSelector(state => ({
        loading : state.view_single_pr.loading,
        fd_loading : state.file_download.loading,
        pr_master: (state.view_single_pr && state.view_single_pr.responseList && state.view_single_pr.responseList.itemDetails && state.view_single_pr.responseList.itemDetails.PR_MSTR) ? state.view_single_pr.responseList.itemDetails.PR_MSTR[0] : [],
        pr_details: (state.view_single_pr && state.view_single_pr.responseList && state.view_single_pr.responseList.itemDetails && state.view_single_pr.responseList.itemDetails.PR_DETAILS) ? state.view_single_pr.responseList.itemDetails.PR_DETAILS : [], 
        attachment: (state.view_single_pr && state.view_single_pr.responseList && state.view_single_pr.responseList.itemDetails && state.view_single_pr.responseList.itemDetails.COMPANY_DOC_ATTACHMENT) ? state.view_single_pr.responseList.itemDetails.COMPANY_DOC_ATTACHMENT : [], 
        get_approval_flow :(state.view_single_pr && state.view_single_pr.responseList && state.view_single_pr.responseList.itemDetails && state.view_single_pr.responseList.itemDetails.GET_APPROVAL_FLOW && state.view_single_pr.responseList.itemDetails.GET_APPROVAL_FLOW.getApprFlow) ? state.view_single_pr.responseList.itemDetails.GET_APPROVAL_FLOW.getApprFlow : [], 
    }));

    let download_files = (data, status) => {
        let requestParam = '';
        if (status === 'reqDoc') {
            requestParam = { 'strFile': data.CDA_ATTACH_FILENAME, 'strFile1': data.CDA_HUB_FILENAME, 'Text': data.CDA_FILESIZE + ' KB', 'ID': data.CDA_ATTACH_INDEX, 'CDA_TYPE': data.CDA_DOC_TYPE, 'CDA_DOC_TYPE': data.CDA_DOC_TYPE, 'pEnumDownloadType': data.pEnumDownloadType };
        }
        else {
            requestParam = data;
        }
        _dispatch(GetDownloadFile(requestParam));
    }

   

  

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
            return addDate(pr_master.PRM_SUBMIT_DATE, row.PRD_ETD)
        }},
        {name : "Warranty Terms (mths)", id:"PRD_WARRANTY_TERMS", width:'100px'},
        {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
        {name : "Remarks", id:"PRD_REMARK", width:'100px'},

    ];
   
    useEffect(() => {
        _dispatch(GetViewSinglePr((props.location && props.location.datas) ? props.location.datas : {}));
    }, []);
    

    let _sub_total  = pr_details ? pr_details.reduce((a, val) => a += val.PRD_ORDERED_QTY * val.PRD_UNIT_COST, 0).toFixed(2): '0.00';
    let _sub_gst  = pr_details  ? pr_details.reduce((a, val) => a += val.PRD_GST, 0).toFixed(2): '0.00';
    let _total  = pr_details ? pr_details.reduce((a, val) =>a += (val.PRD_ORDERED_QTY * val.PRD_UNIT_COST) + val.PRD_GST, 0).toFixed(2): '0.00'
 
    return <Fragment> 
        
            {(loading) ? <Loader /> : '' }
            {(fd_loading) ? <Loader /> : '' }
            <div className="container-fluid mt-3">
                <div className="d-flex bg-info text-white p-1 mt-2 mb-3">
                    <strong>Purchase Request Header</strong>
                </div>
                <div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  PR Number :	</label></div>
                    <div className="col-12 col-md-4 col-lg-4">{pr_master.PRM_PR_NO} {(pr_master.PRM_URGENT==1) ? '(Urgent)' : '' }</div>
                  
                    <div className="col-md-2 col-lg-2 col-12"><label>  Status :		</label></div>
                    <div className="col-md-4 col-lg-4 col-12"> {(pr_master.STATUS_DESC  === "Submitted" ) ? pr_master.STATUS_DESC + " " + "for approval" :  pr_master.STATUS_DESC === "Rejected By" ? pr_master.STATUS_DESC + " " + "management" : pr_master.STATUS_DESC}</div>
                </div>

                {(props.location && props.location.datas && props.location.datas.page_name!="convert_pr") ?
                <Fragment>
                <div className="row">
                    <div className="col-md-2 col-lg-2 col-12"><label>  Purchaser :	</label></div>
                    <div className="col-md-4 col-lg-4 col-12"> {pr_master.PRM_BUYER_NAME}</div>
                </div>
                </Fragment> : ''}
                
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  Requestor Name  :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {pr_master.PRM_REQ_NAME}</div>

                    <div className="col-12 col-md-2 col-lg-2"><label>  Submission Date :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {TodayDateSalash(pr_master.PRM_SUBMIT_DATE) }</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-2 col-lg-2"><label>  Requestor Contact  :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {pr_master.PRM_REQ_PHONE}</div>

                    <div className="col-12 col-md-2 col-lg-2"><label>  Attention To :		</label></div>
                    <div className="col-12 col-md-4 col-lg-4"> {pr_master.PRM_S_ATTN}</div>
                </div>
                  
                <div className="row">
                    <div className="col-md-2 col-lg-2 col-12"><label>   Billing Address :		</label></div>
                    <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_B_ADDR_LINE1}<br></br>{pr_master.PRM_B_ADDR_LINE2} <br></br>{pr_master.PRM_B_ADDR_LINE3}
                        <br></br>{pr_master.PRM_B_POSTCODE} <br></br>{pr_master.PRM_B_CITY} <br></br>{pr_master.STATE} {pr_master.CT}    
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 col-lg-2 col-12"><label>  Internal Remarks :		</label></div>
                    <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_INTERNAL_REMARK} </div>
                    <div className="col-md-2 col-lg-2 col-12"><label> 		</label></div>
                    <div className="col-md-4 col-lg-4 col-12"> </div>
                </div>
                     {(props.location && props.location.datas && props.location.datas.page_name!="convert_pr") ?
                        <div className="row">
                            <div className="col-md-2 col-lg-2 col-12"><label> Vendor :	</label></div>
                            <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_S_COY_NAME} </div>
                            <div className="col-md-2 col-lg-2 col-12"><label> 	Currency :	</label></div>
                            <div className="col-md-4 col-lg-4 col-12"> {pr_master.PRM_CURRENCY_CODE} </div>
                        </div>
                    : ''}
                    <div className="row">
                        <div className="col-md-2 col-lg-2 col-12"><label>External Remarks :</label></div>
                        <div className="col-md-4 col-lg-4 col-12"> {pr_master.PRM_External_Remark}</div>
                        <div className="col-md-2 col-lg-2 col-12"><label> 		</label></div>
                        <div className="col-md-4 col-lg-4 col-12"> </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12 col-12 col-lg-2"><label>Internal File(s) Attached : </label></div>
                        <div className="col">
                            {(attachment.length>0 && attachment[0].text!='No Files Attached')  ? attachment.map((list, index) => {
                                if (list.CDA_TYPE == 'I') {
                                    return <p className="download-files"><u><span onClick={() => download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB) </span></u></p>
                                }
                            }): 'No Files Attached'}
                            
                        </div>
               
                        <div className="col-md-12 col-12 col-lg-2"><label>External File(s) Attached  : </label></div>
                        <div className="col">
                        {(attachment.length>0 && attachment[0].text!='No Files Attached')  ?   attachment.map((list, index) => {
                                if (list.CDA_TYPE == 'E') {
                                    return <p className="download-files"><u><span onClick={() => download_files(list, 'reqDoc')}>{list.CDA_ATTACH_FILENAME} ({list.CDA_FILESIZE} KB)</span></u> </p>
                                }
                            }): 'No Files Attached'}
                        </div>
                    </div>
                    {(props.location && props.location.datas && props.location.datas.page_name!="convert_pr") ?
                     <Fragment>
                    <div className="row">
                        <div className="col-md-2 col-lg-2 col-12"><label> Payment Terms :</label></div>
                        <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_PAYMENT_TERM} </div>
                        <div className="col-md-2 col-lg-2 col-12"><label> Payment Method : </label></div>
                        <div className="col-md-4 col-lg-4 col-12"> {pr_master.PRM_PAYMENT_METHOD}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 col-lg-2 col-12"><label>  Shipment Terms :</label></div>
                        <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_SHIPMENT_TERM} </div>
                        <div className="col-md-2 col-lg-2 col-12"><label> Shipment Mode : </label></div>
                        <div className="col-md-4 col-lg-4 col-12">{pr_master.PRM_SHIPMENT_MODE} </div>
                    </div>
                    </Fragment> : ''}
                </div>
                <div className="d-flex bg-info text-white p-1 mt-2 mb-3"><strong>Approval Workflow</strong></div>
                <div className="row mt-2">
                    <div className='col-12'>
                        <table className="table table-hover table-stripe table-bordered">
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
                            {get_approval_flow.map((data, index) =>
                            <tr key={index}>
                                <td>{data.PRA_SEQ}</td>
                                <td>{data.AO_NAME}</td>
                                <td>{data.AAO_NAME}</td>
                                <td>{data.PRA_APPROVAL_TYPE === '2' ? 'Endorsement' : 'Approval'}</td>
                                <td>{data.PRA_ACTION_DATE !== null ? TodayDateSalash(data.PRA_ACTION_DATE) : ''}</td>
                                <td>{data.PRA_AO_REMARK}</td>
                                <td>
                                    {data.userAttachFileList.map((val, index) => {
                                    return <p><u><span onClick={() => download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
                                    })}
                                </td>
                            </tr>
                            )}
                            </tbody>
                        </table>
                       
                    </div>
                </div>

                <BootstrapCustomTable
                    table_header={_table_data_header} 
                    table_body={pr_details} 
                    select={false} 
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

                        <div className="mt-2 row">
                        <div className="col-12 col-sm-6 text-left go-back">
                            <BackButton back_data={(props.location  && props.location.redirect_to_page) ? true : false}  {...props.location} goBack={props.history} history={props.history}/>
                    </div>
                </div>
            </div>
        </Fragment>

}   
export default VendorDetailsPage;
