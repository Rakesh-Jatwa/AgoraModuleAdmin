import React,{useEffect,useState, Fragment} from 'react'
import {useSelector, useDispatch, } from "react-redux";
import TabHeading from '../../../../../Component/Heading/TabHeading';
import Loader from '../../../../../Component/Loader'
import BootstrapCustomTable from '../../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {reduxForm, Field } from 'redux-form';
import {TodayDateSalash, FromateDate_YY_MM_DD} from '../../../../../Component/Dates'
import Alert from '../../../../../Component/Modal/alert'
import ConfirmationModel from '../../../../../Component/Modal/ConfirmationModel'
import {GetViewResponseRFQComSummary} from '../../../../../Actions/Approver'
import {E2PApprovalReject, E2PApprovalSubmit} from '../../../../../Apis/Approver'
import {ApiExtract} from '../../../../../Common/GetDatas'
import {FromTextareaTable, FromUplodsParallel} from '../../../../../Component/From/FromInputs'
import Enum from '../../../../../Common/GlobalEnum'
import {NumberFormateEmpty, HandleStatus, HandleDocType, HandleCategoryType, HandlePayment} from '../../../../../Actions/Common/Functions'
import {CheckFileDetails} from '../../../../../Actions/Common/Functions'
import TotalGrid from '../../../../../Component/Table/TotalGridHorizontal'
import TotalGridSub from '../../../../../Component/Table/TotalGrid'

let ConverPRListing = props => {
    const { handleSubmit } = props
    let _inv_no=0
    let _dispatch = useDispatch();
    let [slectedProducts, setSelectedProducts] = useState([])
    let [block_process, setBlockProcess] = useState(false)
    let [alertLoader, setAlertLoader] = useState(false);
    let [attachments, setAttachments]= useState([])
    let [internal_file, setInternalFile]= useState([])
    let [external_file, setExternalFile]= useState([])
    let [remarks, setRemarks]= useState('')
    let [alertDetails, setAlertDetails] = useState({
        title : '',
        message : 'Test ',
        status : false,
        show  :  false 
    })
    let [confirmationDetails, setConfirmationDetails] = useState({
        status: false,
        confimation:true,
        confimation_pop:false,
        confimation_type : '',
        status_text : '',
        modal_body: '',
    })
   
    let closemodel =  async () =>{
        if(alertDetails.status==true){
           props.close()
        }
        setAlertDetails({show:false, status:false});
        
    }

    let getSelectedProduct = (values, details) => {
        let _all_products = slectedProducts
        setSelectedProducts(values, alertDetails)
       
    }

    let FileUpload = (attachment) => {

        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":"8",
            "strDocType": "IPP",
            "pEnumUploadForm": "0",
            "strDocNo":(props.details) ? props.details.IM_INVOICE_NO : '',
            "blnTemp": "false",
            "strIndex":"",
            "seq":"",
            "pFrontOfficeSite":"",
            "AttachType":"I",
            "ItemCode":"",
            "LineNo":"",
            "POLine":"",
            "modeType": (props.details) ? "Mod" : "New",
            "frm": "IPPAO",
        }
        if(_file_name == "ApproveDto.internalAttachment" && internal_file){
            req.AttachType = 'I';
            props.UploadDocuments(internal_file, req)
            setInternalFile('')
            attachment.target.value = "";
                
        }
        else{
            let _details  = {
                status: false,
                model:true,
                modal_body: "Select a file to upload",
                loading:false,
            }
            setAlertDetails(_details)
        }
       
    }

    let SendUpload = (e) => {
        let _details  = CheckFileDetails(e);
        if(_details.status){
            if(e.target.name=="ApproveDto.internalAttachment"){
                setInternalFile(e.target.files[0])
            }
            else if(e.target.name=="prDto.externalAttachment"){
                setExternalFile(e.target.files[0])
            }
            else{

            }
        }
        else{
            const _details = {
                title : '',
                message :_details.message,
                status : false,
                show  :  true 
            }
            setAlertDetails(_details)
        }
        
    }


    let onConfirm = () => {
        let _confimation = confirmationDetails
        const _details = {
            title : '',
            message : '',
            status : false,
            show : false 
        }
        setConfirmationDetails(_details)
        if(_confimation.confimation_type=="approve"){
            Approve()
        }
        else if(_confimation.confimation_type=="reject"){
            Reject()
        }

    }

    let confirm_function = (type, text) => {
        const _details = {
            status: true,
            confimation:false,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        }
        setConfirmationDetails(_details)
    
    }

    let  _approver_header = [
        {name : "S No", id:"FA_ACTIVE_AO", width:'85px', key:true, type:"index"},
        {name : "Performed By", id:"AO_NAME", width:'85px', key:false},
        {name : "User ID", id:"FA_AO", width:'150px'},
        {name : "Date Time", id:"FA_ACTION_DATE", width:'100px', dataFormat:"datetime"},
        {name : "Remarks", id:"FA_AO_REMARK", width:'144px',formatter: (cellContent, row) => {
            return (
                (row.FA_AO_REMARK) ? row.FA_AO_REMARK : ' - '
            )
        }}
    ];

   let onCancel  = () =>{
        const _details = {
            title : '',
            message : '',
            status : false,
            show : false 
        }
        setConfirmationDetails(_details)
    }




    let Reject = async() => {
       if(remarks){
            setAlertLoader(true)
            let _final_datas = {
                strIPPDocIdx:(props.details && props.details.IM_INVOICE_INDEX) ? props.details.IM_INVOICE_INDEX : 0,
                strRemark:remarks,
                "frm":"IPPAO",
            }
            let _status =  await ApiExtract(E2PApprovalReject, _final_datas)
            if(_status){
                const _details = {
                    title : '',
                    message : _status.message,
                    status : _status.status,
                    show  :  true 
                }
                if(_status.status){
                    setBlockProcess(true)
                }   
                setAlertLoader(false)
                setAlertDetails(_details)
            }
       }
       else{
           const _details = {
                title : '',
                message : 'Please Enter Remarks',
                status : false,
                show  :  true 
            }
            setAlertDetails(_details)
       }
    }

    let Approve = async() => {
       
            let _final_datas = {
                "strIPPDocIdx":(props.details && props.details.IM_INVOICE_INDEX) ? props.details.IM_INVOICE_INDEX : 0,
                "strRemark":(remarks) ? remarks : '',
                "approvalType":"single",
                "strAction":"verify",
                "frm":"IPPAO",
                "paymentmethod":(props.details && props.details.IM_PAYMENT_TERM) ? props.details.IM_PAYMENT_TERM : 0,
                "paymentAmount":(props.details && props.details.IM_INVOICE_TOTAL) ? props.details.IM_INVOICE_TOTAL : 0,
                "currentStatus":(props.details && props.details.IM_INVOICE_STATUS) ? props.details.IM_INVOICE_STATUS : 0,
            }
            setAlertLoader(true)
            let _status =  await ApiExtract(E2PApprovalSubmit, _final_datas)
            if(_status){
                const _details = {
                    title : '',
                    message : _status.message,
                    status : _status.status,
                    show  :  true 
                }
                if(_status.status){
                    setBlockProcess(true)
                }   
                setAlertLoader(false)
                setAlertDetails(_details)
            }
      
        
    }

  

   let  delete_alter = (alter_details) =>{
    console.log('alter_details', alter_details)
    let _temp_details = {
        strFile: alter_details.ATTACH_FILENAME,
        strFile1: alter_details.HUB_FILENAME,
        pEnumDownloadType: alter_details.pEnumDownloadType,
        Text: alter_details.Text+'KB',
        ID: alter_details.ATTACH_INDEX,
        CDA_DOC_TYPE: "IPP"
    }
    props.download_files(_temp_details)
}


    const _table_data_header = [
        {name : "S No", id:"FA_ACTIVE_AO", width:'46px', key:true, type:"index"},
        {name : "Pay For", id:"payfor", width:'81px',dataFormat:'validatedata'},
        {name : "Disb./Reimb", id:"ID_GST_REIMB", width:'134px',formatter: (cellContent, row) => {
            return HandleCategoryType(row.ID_GST_REIMB)
        }},
        {name : "Description", id:"ID_PRODUCT_DESC", width:'150px'},
        {name : "Amount (FCY) (excl. SST)", id:"exchangeRate", width:'125px',formatter: (cellContent, row) => {
            return <div class="text-right">{(row.ID_UNIT_COST) ? parseFloat(row.ID_UNIT_COST).toFixed(2) : '0.00'}</div>
        }},
        {name : "Amount (MYR) (excl. SST)", id:"ID_UNIT_COST", width:'125px',formatter: (cellContent, row) => {
            if(props.details && props.details.IM_CURRENCY_CODE=="MYR"){
                return <div class="text-right">{(row.ID_UNIT_COST) ? parseFloat(row.ID_UNIT_COST).toFixed(2) : '0.00'}</div>
            }
            else{
                return <div class="text-right">{(_exchange_rate) ? parseFloat(row.ID_UNIT_COST * _exchange_rate).toFixed(2) : row.ID_UNIT_COST}</div>
            }
        
        }},
        {name : "SST Amount", id:"ID_GST_VALUE", width:'83px',dataFormat:'price'},
        {name : "Input Tax Code", id:"inputTax", width:'90px',formatter: (cellContent, row) => {
            return <div>{(row.inputTax) ? row.inputTax : row.ID_GST_INPUT_TAX_CODE+'('+row.ID_GST+'%)'} </div>
        }},
        {name : "Output Tax Code", id:"ID_GST_OUTPUT_TAX_CODE", width:'90px',dataFormat:'validatedata'},
        {name : "GL Code", id:"ID_B_GL_CODE_CONCAT", width:'130px'},
        {name : "Cost Centre(L7)", id:"ID_COST_CENTER_2", width:'130px',dataFormat:'validatedata'},
        {name : "Category", id:"ID_CATEGORY", width:'130px',dataFormat:'validatedata'},
        {name : "Fund Type(L1)", id:"analysis1", width:'130px',dataFormat:'validatedata'},
        {name : "Product Type(L2)", id:"analysis2", width:'110px',dataFormat:'validatedata'},
        {name : "Channel(L3)", id:"analysis3", width:'130px',dataFormat:'validatedata'},
        {name : "Reinsurance Comp.(L4) ", id:"analysis4", width:'127px',dataFormat:'validatedata'},
        {name : "Asset Code(L5)", id:"analysis5", width:'98px',dataFormat:'validatedata'},
        {name : "Project Code(L8)", id:"analysis8", width:'100px',dataFormat:'validatedata'},
        {name : "Person Code(L9)", id:"analysis9", width:'100px' ,dataFormat:'validatedata'},
        {name : "Withholding Tax (%)", id:"ID_WITHHOLDING_TAX", width:'89px' ,dataFormat:'price'},
    ]

   
    if(props && props.details && props.details.IM_INVOICE_TYPE=="CN" || props.details.IM_INVOICE_TYPE=="DN"){
        _table_data_header.splice(2, 0,   {name : "Invoice Number", id:"ID_REF_NO", width:'167px'}); 
        _table_data_header.join()
        _inv_no = _inv_no+1
    }

    if(props.details && props.details.IM_CURRENCY_CODE=="MYR"){
        _table_data_header.forEach((list,key)=>{
            if(list.id=='exchangeRate'){
                delete _table_data_header[key]
            }
        })
    }
   
    useEffect(() => {
        if(props.location && props.location.datas){
            let _details = props.location.datas
            let _inputReq = { "RFQ_ID": _details.RM_RFQ_ID, "RFQ_No": _details.RM_RFQ_No };
            _dispatch(GetViewResponseRFQComSummary(_inputReq))
        } 
       
    }, [alertDetails.status, confirmationDetails.status]);

    let _sub_total = (props.line_item) ? props.line_item.reduce((a, val) => a += parseFloat(val.ID_UNIT_COST) + parseFloat(val.ID_GST_VALUE), 0): '0.00'
    let _exchange_rate = ((props.details && props.details.exchangeRate) ? parseFloat(props.details.exchangeRate) : 0)
    _sub_total = Math.round(_sub_total * 10) / 10;
    _exchange_rate = Math.round(_exchange_rate * 10) / 10;
    let _sub_total_main = _sub_total * _exchange_rate
    _sub_total = (_sub_total) ? parseFloat(_sub_total).toFixed(2) : '0.00'
    _sub_total_main = (_sub_total_main) ? parseFloat(_sub_total_main).toFixed(2) : '0.00'
    return <Fragment> 
            {(props.loading==1) ? <Loader /> : '' }
            {(alertLoader) ? <Loader /> : '' }
            <form >
           
            
            {(props.frompage!="req_listing" || props.frompage!="listing") ?
                <PageHeading 
                    heading="" 
                    subheading={(props.frompage!="req_listing") ? "Fill in the search criteria and click on Search button to list the relevant E2P document."  : "Click the Approve button to approve the E2P Document or Reject button to reject the E2P Document. Click the No. to go to E2P document approval page"}
                />
            :  <PageHeading 
                    heading="" 
                    subheading={(props.frompage!="approve") ? "Click the Approve button to approve the E2P Document or Reject button to reject the E2P Document. "  : "Click the Approve button to approve the E2P Document or Reject button to reject the E2P Document. Click the No. to go to E2P document approval page"}
                /> }

                <TabHeading color={'bg-info text-white'}>Document Header </TabHeading> 
              

                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Master Document  : </label></div>
                            <div className="col"><p>No</p></div>
                          
                        </div>
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Type : </label></div>
                            <div className="col"><p>{(props.details) ? HandleDocType(props.details.IM_INVOICE_TYPE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Status : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.STATUS_DESC : ''}</p></div>

                        </div>
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document No : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_INVOICE_NO : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Currency : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_CURRENCY_CODE : ''}</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Date : </label></div>
                            <div className="col"><p>{(props.details) ? TodayDateSalash(props.details.IM_DOC_DATE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Total Amount (excl. SST) : </label></div>
                            <div className="col"><p>{(props.details) ? NumberFormateEmpty(props.details.IM_INVOICE_EXCL_GST) : ''}</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Document Due Date : </label></div>
                            <div className="col"><p>{(props.details) ? TodayDateSalash(props.details.IM_DUE_DATE) : ''}</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>SST Amount  : </label></div>
                            <div className="col"><p>{(props.details) ? NumberFormateEmpty(props.details.IM_INVOICE_GST) : ''}</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Credit Term  : </label></div>
                            <div className="col"><p>{(props.line_item && props.line_item.length>0) ? props.line_item[0].ic_credit_terms : 0 } Days</p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Payment Amount  : </label></div>
                            <div className="col"><p>{(props.details) ? NumberFormateEmpty(props.details.IM_INVOICE_TOTAL) : 0 }</p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Manual PO No  : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_IPP_PO : '' } </p></div>

                            <div className="col-md-12 col-12 col-lg-2"><label>Payment Mode : </label></div>
                            <div className="col"><p>{(props.details) ? HandlePayment(props.details.IM_PAYMENT_TERM) : '' } </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_S_COY_NAME : ''} </p></div>

                            {(props.frompage!="listing" || props.frompage!="ao1_approve") ? 
                            <Fragment>
                                <div className="col-md-12 col-12 col-lg-2"><label>Bank Code[Bank A/C No.] : </label></div>
                                <div className="col"><p> {(props.details) ?  props.details.im_bank_code+'['+props.details.ic_bank_acct+']' : ''}  </p></div>
                            </Fragment> : ''}
                           
                        </div>

                        

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Vendor Address  : </label></div>
                            <div className="col"><address className="e2p_address">{(props.details) ? <Fragment>
                             {(props.details.IM_ADDR_LINE1) ? props.details.IM_ADDR_LINE1+'\n' : ''}
                             {(props.details.IM_ADDR_LINE2) ? props.details.IM_ADDR_LINE2+'\n' : ''}
                             {(props.details.IM_ADDR_LINE3) ? props.details.IM_ADDR_LINE3+'\n' : ''}
                             {(props.details.IM_POSTCODE && props.details.IM_POSTCODE!="undefined") ? props.details.IM_POSTCODE+'\n' : ''}
                             {(props.details.IM_CITY) ? props.details.IM_CITY+'\n' : ''}
                             </Fragment>
                            : ''}</address></div>

                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Internal Remarks : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_REMARK : ''} </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Beneficiary Details : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_REMARKS2 : ''}  </p></div>
                        </div>

                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Late Submission Reason : </label></div>
                            <div className="col"><p>{(props.details) ? props.details.IM_LATE_REASON : ''} </p></div>
                        </div>

                        {(props.frompage=="approve" || props.frompage=="ao1_approve") ? 
                        <div className="mt-2">
                            <div className="col-12" style={{padding:'0px'}}>  
                              
                                <div className="row">
                                    <div className="col-12 col-md-8">
                                        <div className="row mt-2">
                                            <FromUplodsParallel name="ApproveDto.internalAttachment" id ="external_attachment"  decs=" Recommended file size is 10240 KB"  label="Attachment :" buttontext="upload" FileUpload={FileUpload} SendUpload={SendUpload} filename={external_file}/>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>:''}
                        
                        <div className="mt-2 row">
                            <div className="col-lg-2 col-md-2 col-12">
                                {/* <label>Internal File Attached : </label> */}
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">
                            {((props.frompage=="approve" || props.frompage=="ao1_approve")&& (block_process==false)) ? 
                                <div className="col_details">
                                    {((props.from_page!="listing" || props.from_page!="req_listing") &&  props.attachments && props.attachments[0]!== 'No Files Attached' && props.attachments.length>=1) ? props.attachments.map((list, index) => {
                                    
                                        if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => props.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span className={(!props.delete) ? 'd-none' : ''} onClick={() => props.delete_file({...list, modeType:'Mod', AttachType:'I', "frm": "IPPAO",CDA_DOC_NO:props.details.IM_INVOICE_NO}, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }):  ''}
                                    {/* {((props.from_page=="listing" || props.from_page!="req_listing") &&  props.attachments && props.attachments[0]!== 'No Files Attached' && props.attachments.length>=1) ? props.attachments.map((list, index) => {
                                    
                                       if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() =>  props.download_files(list)}>{list.UA_ATTACH_FILENAME} ({list.UA_FILESIZE} KB) &nbsp;&nbsp;</span></u> <span className={(!props.delete) ? 'd-none' : ''} onClick={() => props.delete_file({...list, modeType:'Mod', AttachType:'I', "frm": "IPPAO",CDA_DOC_NO:props.details.IM_INVOICE_NO}, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                        }
                                    }): ''} */}
                                </div>
                                : ''}
                            </div>
                        </div>
                        
                        <div className="mt-2 row">
                            <div className="col-lg-2 col-md-2 col-12">
                                <label>File(s) Attached : </label>
                            </div>
                            <div className="col-lg-6 col-md-4 col-12">

                                <div className="col_details">
                                    
                                    {( props.docAttachment && props.docAttachment[0]!== 'No Files Attached' && props.docAttachment.length>=1) ? props.docAttachment.map((list, index) => {
                                        if (list.Text !== 'No Files Attached') {
                                            return <p className="download-files"><u><span onClick={() => delete_alter(list)}>{list.ATTACH_FILENAME}</span></u> </p>
                                        }
                                    }): 'No FIles Attached'}
                                    
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            
            <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
        
            <div className="row">
                <div className="col-md-12">
                    <BootstrapCustomTable 
                        table_header={_approver_header} 
                        table_body={props.approval} 
                        mode={'radio'}
                        select={false} 
                    />
                   
                </div>
            </div>
            <TabHeading color={'bg-info text-white margin-botton-none'}>  Document Line Detail </TabHeading> 
            <BootstrapCustomTable 
                table_header={_table_data_header} 
                table_body={props.line_item} 
                mode={'radio'}
                select={false} 
            />
            {(_exchange_rate && _exchange_rate!='0.00') ? 
              <TotalGrid
                table_header = {_table_data_header}
                body_text={['Total']}
                body_value={[_sub_total, _sub_total_main]}
                body_type={['text']}
                text_grid={3+_inv_no}
                total={4+_inv_no}
                total_td={2}
                body_loop={1}
                adjust={25}
            /> : <TotalGridSub
                table_header = {_table_data_header}
                body_text={['Total']}
                body_value={[_sub_total]}
                body_type={['text']}
                text_grid={3+_inv_no}
                total={5+_inv_no}
                total_td={3}
                body_loop={4}
                adjust={11}
            />

           
            
            }
        
            {(props.frompage=="approve") ? 
            <div className="row mt-2">
                <div className="col-md-12 col-12 col-lg-2"><label>Remarks <span className="text-danger">*</span>:</label></div>
                <div className="col"><Field type="text" name="ApproveDto.strRemark" rem={true} component={FromTextareaTable} className="form-control" placeholder=" Remarks" label=" Remarks"  onChange={(e)=>setRemarks(e.target.value)}/></div>
            </div>:''}

            {(props.frompage=="ao1_approve") ? 
                <div className="row mt-2">
                    <div className="col-md-12 col-12 col-lg-2"><label>Remarks <span className="text-danger">*</span>:</label></div>
                    <div className="col"><Field type="text" name="ApproveDto.strRemark" rem={true} component={FromTextareaTable} className="form-control" placeholder=" Approved Remarks" label=" Approved Remarks"  onChange={(e)=>setRemarks(e.target.value)}/></div>
                </div>:''}
          
            <div className="mt-2 mb-5 row">
              {((props.frompage=="approve" ||props.frompage=="ao1_approve" ) && (block_process==false)) ? 
                <Fragment>
                    {(props.button_details && props.button_details.hasOwnProperty('canApprove') && props.button_details.canApprove) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>confirm_function('approve','to approve this Document')}> Approve</button> </div> : '' }
                    {(props.button_details && props.button_details.hasOwnProperty('canApprove') && !props.button_details.canApprove) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>confirm_function('approve','to endorse this Document')}> Endorse</button> </div> : '' }
                    {(!props.button_details && !props.button_details.hasOwnProperty('canApprove')) ? <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" onClick={()=>confirm_function('approve','to endorse this Document')}> Endorse</button> </div> : '' }
                    <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>confirm_function('reject','to reject this Document')} >Reject</button></div> 
                </Fragment>
                : ''}
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-info btn-sm" onClick={()=>{props.setInvoiceIndex((props.details) ? props.details.IM_INVOICE_INDEX : '', (props.details) ? props.details.IM_INVOICE_NO : '' , (props.details) ? HandleStatus(props.details.IM_INVOICE_STATUS) : '')}}>View Audit</button></div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>props.close()} >Back</button></div>
            </div>
        </form>
        <Alert 
            confirm={closemodel} 
            title={alertDetails.title}
            message={alertDetails.message}
            status={alertDetails.status}
            show={alertDetails.show}
         />

         <ConfirmationModel
                title="" 
                confimation = {true}
                message={confirmationDetails.modal_body} 
                status={confirmationDetails.confimation} 
                show={confirmationDetails.status} 
                onConfirm={onConfirm}
                onCancel = {onCancel}
         />
        </Fragment>

}   

let ConverPRListingHolder = reduxForm({
    form: 'ConverPRListing'
})(ConverPRListing)
export default ConverPRListingHolder