import React,{useEffect,useState, Fragment} from 'react'
import {useSelector, useDispatch, } from "react-redux";
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {reduxForm, Field } from 'redux-form';
import {TodayDateSalash} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {GetViewResponseRFQComSummary} from '../../../../Actions/Approver'
import {RfqRaisePO} from '../../../../Apis/Approver'
import {ApiExtract} from '../../../../Common/GetDatas'
import {FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'
import Enum from '../../../../Common/GlobalEnum'
let InvoiceViewDetails = props => {
    const { handleSubmit } = props
    let _dispatch = useDispatch();
    let [slectedProducts, setSelectedProducts] = useState([])
    let [showModel, setShowModel] = useState(false);
    let [alertLoader, setAlertLoader] = useState(false);
    let [poresponse, setPoResponse]= useState([])
    let [attachments, setAttachments]= useState([])
    let [internal_file, setInternalFile]= useState([])
    let [external_file, setExternalFile]= useState([])
    let [table_inputs, setTableInputs]= useState([])
    let [get_approval_flow, setApprovalFlow]= useState([])
    let [pr_details, setPrdetails]= useState([])
    
    let [remark, setRemark]= useState('')
    
    let [alertDetails, setAlertDetails] = useState({
        title : '',
        message : 'Test ',
        status : false,
        show  :  true 
    })
    let {loading, table_datas, quotation_details, vendor_quotation_result} = useSelector(state => ({
        loading : state.view_response_rfq_Summary.loading,
        table_datas :  (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.itemRankDetails ) ? state.view_response_rfq_Summary.responseList.itemRankDetails : [],
        quotation_details : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.quotationItemDetails) ? state.view_response_rfq_Summary.responseList.quotationItemDetails : [],
        vendor_quotation_result : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.vendorQuotationResult ) ? state.view_response_rfq_Summary.responseList.vendorQuotationResult : [],
    }));
   
    let closemodel =  async () =>{
        await setShowModel(false);
        if(poresponse.status){
            let _respone = {}
            _respone =  poresponse.response;
            _respone.po_number = slectedProducts.RRM_Actual_Quot_Num;

            props.history.push({
                pathname: '/RaisePO',
                datas: poresponse.response,
                datas : _respone
            })
        }

    }
    let getSelectedProduct = (values, details) => {
        let _all_products = slectedProducts
        setSelectedProducts(values)
       
    }

    let FileUpload = (attachment) => {
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
        if(_file_name == "ApproveDto.internalAttachment" && internal_file){
            req.AttachType = 'E';
            props.UploadDocuments(internal_file, req)
            setInternalFile('')
            attachment.target.value = "";
                
        }
        else{
            setAlertDetails({
                status: false,
                model:true,
                modal_body: "Select a file to upload",
                loading:false,
            })
        }
       
    }

    let SendUpload = (e) => {
        if(e.target.name=="ApproveDto.internalAttachment"){
            setInternalFile(e.target.files[0])
        }
        else if(e.target.name=="prDto.externalAttachment"){
            setExternalFile(e.target.files[0])
        }
        else{

        }
    }

    let RisePo = async  () => {
        if(vendor_quotation_result.length > 0 && slectedProducts.CM_COY_NAME){
            let _vendor_details = vendor_quotation_result[0];
            let req = {
                "RaisePOData": {
                    "viewMode": "rfq",
                    "viewType": "new",
                    "RFQ_ID": _vendor_details.RM_RFQ_ID,
                    "RFQ_No": _vendor_details.RM_RFQ_No,
                    "RFQ_NAME": _vendor_details.RM_RFQ_Name,
                    "Vendors": slectedProducts,
                    "quotationItemDetails":quotation_details
                }
            }
            setAlertLoader(true)
            let _status =  await ApiExtract(RfqRaisePO, req)
            if(_status){
                if(_status.status){
                    setAlertDetails({
                        title : '',
                        message : _status.message,
                        status : _status.status
                    })    
                    setPoResponse(_status)
                   
                }
                setAlertLoader(false)
                setShowModel(true);
                
            }
        }
        else{
            setAlertDetails({
                title : 'Validation',
                message : 'Select atlease one vendor to Raise PO',
                status : false,
                show  :  true 
            })
            await setShowModel(true);
        }
       
    }

    let handleTableInputs = (details, names, new_details) => {
        let _table_inputs = table_inputs
        let _empty_details = new Array();
        let _new_details = new Array()
        _empty_details[`${new_details}`] = {
            [names] :  (details.target.value) ? details.target.value : 0
        };
        _new_details[`${new_details}`] = Object.assign({}, _table_inputs[`${new_details}`],  _empty_details[`${new_details}`])
        _table_inputs[`${new_details}`] = _new_details[`${new_details}`]
        setTableInputs(_table_inputs)
    }
    

    let  _table_data_header = [
        {name : "Item Name", id:"CM_COY_NAME", width:'100px', key:true, type:"index"},
        {name : "UOM", id:"UOM", width:'100px'},
        {name : "Qty", id:"Qty", width:'100px', dataFormat:"input"},
        {name : "Unit Price	", id:"UnitPrice", width:'100px', dataFormat:"input"},
        {name : "Total	", id:"Amount", width:'100px', dataFormat:"input"},
        {name : "SST Rate", id:"SSTRate", width:'100px', dataFormat:"price"},
        {name : "SST Amount", id:"SSTAmount", width:'170px', dataFormat:"input"},
        {name : "SST Tax Code (Purchase)", id:"SSTTaxCode", width:'170px', dataFormat:"price"},
        {name : "Remarks", id:"RRM_TotalValue", width:'144px', dataFormat:"textarea"},
    ];

   
    useEffect(() => {
        if(props.location && props.location.datas){
            let _details = props.location.datas
            let _inputReq = { "RFQ_ID": _details.RM_RFQ_ID, "RFQ_No": _details.RM_RFQ_No };
            _dispatch(GetViewResponseRFQComSummary(_inputReq))
        } 
       
    }, []);

   
    // console.log('alertDetails', showModel)
    return <Fragment> 
            {(loading) ? <Loader /> : '' }
            {(alertLoader) ? <Loader /> : '' }
            <form >
           
                <PageHeading 
                    heading="Raise Credit Note" 
                    subheading="Fill in the relevant info and click the Submit button to submit the debit note to the selected buyer." 
                />
                <TabHeading color={'bg-info text-white'}>  Credit Note Header</TabHeading> 
              

                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Debit Note Number :</label></div>
                            <div className="col"><p>POSB/DN/000007</p></div>.
                            <div className="col-md-12 col-12 col-lg-2"><label>	Invoice No. :</label></div>
                            <div className="col"><p>POSB/INV/000344</p></div>
                          
                        </div>
                        <div className="row" >
                         

                            <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                            <div className="col"><p>27/02/2020</p></div>
                            <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                            <div className="col"><p>27/02/2020</p></div>

                        </div>
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Bill To : </label></div>
                            <div className="col"><p>Level 15,
                                        Menara Prudential,
                                        Jalan Sultan Ismail
                                        50250
                                        KL
                                        Kuala Lumpur
                                        Malaysia</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Currency  : </label></div>
                            <div className="col"><p>MYR</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Invoice Amount : </label></div>
                            <div className="col"><p>	15.60</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Related Debit Note : </label></div>
                            <div className="col"><p> - </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Total Related Debit Note Amount: </label></div>
                            <div className="col"><p>0.00 </p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Net Amount  : </label></div>
                            <div className="col"><p>15.60</p></div>
                        </div>

                       
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>File Attached  : </label></div>
                            <div className="col"><p>No Files Attached</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor Remarks  : </label></div>
                        
                        </div>

                        <div className="mt-2 row view_remark">
                        <div className="col-12 " style={{padding:'0px'}}>  
                               <Field type="text" name="ApproveDto.strRemark" component={FromTextareaParallel} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>setRemark(e.target.value)}/>
                               <div className="col-12 col-sm-6 ">
                               <div className="row mt-2 ">
                                    <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment" label="Internal Attachment :" buttontext="upload" FileUpload={FileUpload} SendUpload={SendUpload} filename={external_file}/>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 row view_remark">
                        <div className="col-lg-2 col-md-2 col-12">
                            <label>Internal File Attached : </label>
                        </div>
                         <div className="col-lg-6 col-md-4 col-12">
                            <div className="col_details">
                                {attachments.map((list, index) => {
                                    if (list.Text !== 'No Files Attached') {
                                        return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => this.delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
            <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
           
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
                                    return <p><u><span onClick={() => this.download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
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
                
                <div className="col-md-12 mt-2 mb-2 sub_total_main text-right">
                    <div className="sub_total"> <strong>Sub Total</strong> : <span className="sub_text">0.00</span></div>
                    <div className="sub_total"> <strong>SST Amount</strong> : <span className="sub_text">0.00</span></div>
                    <hr></hr>
                    <div className="sub_total"> <strong>Grand Total</strong> : <span className="sub_text">0.00</span></div>
                </div>
         
            <div className="mt-2 mb-5 row">
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" > Submit</button> </div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" >Acknowledge Credit Note</button></div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" >View Credit Note</button></div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>this.props.history.goBack()} >Back</button></div>
            </div>
        </form>
        <Alert 
            confirm={closemodel} 
            title={alertDetails.title}
            message={alertDetails.message}
            status={alertDetails.status}
            show={showModel}
         />
        </Fragment>

}   

let InvoiceViewDetailsHolder = reduxForm({
    form: 'ConverPRListing'
})(InvoiceViewDetails)
export default InvoiceViewDetailsHolder

