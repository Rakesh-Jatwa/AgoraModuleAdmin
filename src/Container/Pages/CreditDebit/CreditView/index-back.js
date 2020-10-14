import React,{useEffect,useState, Fragment} from 'react'
import {useSelector, useDispatch, } from "react-redux";
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {reduxForm, Field } from 'redux-form';
import {TodayDateSalash} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {FromTextareaParallel, FromUplodsParallel} from '../../../../Component/From/FromInputs'
let ConverPRListing = props => {
    const { handleSubmit } = props
    let _dispatch = useDispatch();
    let [slectedProducts, setSelectedProducts] = useState([])
    let [showModel, setShowModel] = useState(false);
    let [loading, SetLoading]= useState(false);
    let [alertLoader, setAlertLoader] = useState(false);
    let [poresponse, setPoResponse]= useState([])
    let [attachments, setAttachments]= useState([])
    let [internal_file, setInternalFile]= useState([])
    let [external_file, setExternalFile]= useState([])
    let [table_inputs, setTableInputs]= useState([])
    let [remark, setRemark]= useState('')
    
    let [alertDetails, setAlertDetails] = useState({
        title : '',
        message : 'Test ',
        status : false,
        show  :  false 
    })

   
    let closemodel =  async () =>{
        await setAlertDetails({ status: false,
            model:true,
            message: "",
            show:false});

    }
    let getSelectedProduct = (values, details) => {
        let _all_products = slectedProducts
        setSelectedProducts(values)
    }

    let FileUpload = (attachment) => {
        let _get_details  = attachment.target;
        let _file_name ='';
        _file_name =  _get_details.getAttribute('data-name');
        let req = {
            "pEnumUploadType":"10",
            "strDocType":"CN",
            "pEnumUploadForm": "0",
            "strDocNo":"",
            "blnTemp":"false",
            "strIndex":"",
            "seq":"",
            "pFrontOfficeSite":"",
            "AttachType":"I",
            "ItemCode":"",
            "LineNo":"",
            "POLine":"",
            "modeType":"New"
        }
       
        if(_file_name == "ApproveDto.internalAttachment" && internal_file){
            req.AttachType = 'I';
            props.UploadDocuments(internal_file, req)
            setInternalFile('')
            attachment.target.value = "";
        }
        else{

            setAlertDetails({
                status: false,
                model:true,
                message: "Select a file to upload",
                show:true,
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

    let delete_file = (data, type) =>{
        data.AttachType = "E";
        data.modeType = "New";
        data.strIndex = "PO";
        props.delete_file(data);
    }

    let handleTableInputs = (details, names, new_details) => {
        console.log('handleTableInputs', details, names, new_details)
        props.handle_inputs(details, names, new_details)
    }

    let  _table_data_header = [
        {name : "Item Name", id:"CM_COY_NAME", width:'100px', key:true, type:"index"},
        {name : "UOM", id:"ID_UOM", width:'100px'},
        {name : "Qty", id:"ID_RECEIVED_QTY_1", width:'100px', dataFormat:"cn_input"},
        {name : "Unit Price", id:"ID_UNIT_COST_1", width:'100px', dataFormat:"cn_input"},
        {name : "Amount	", id:"Amount_1", width:'100px', dataFormat:"cn_input"},
        {name : "SST Rate", id:"ID_GST_RATE", width:'100px', dataFormat:"price"},
        {name : "SST Amount", id:"ID_GST_VALUE", width:'170px', dataFormat:"cndn_input_disabled"},
        {name : "SST Tax Code (Supply)", id:"SSTTaxCode", width:'170px', dataFormat:"pricena"},
        {name : "Remarks", id:"RRM_TotalValue", width:'144px', dataFormat:"textarea"},
    ];


    return <Fragment> 
            {(loading) ? <Loader /> : '' }
            {(alertLoader) ? <Loader /> : '' }
            <form >
           
                <PageHeading 
                    heading="Raise Credit Note" 
                    subheading="Fill in the relevant info and click the Submit button to submit the debit note to the selected buyer." 
                />
                <TabHeading color={'bg-info text-white'}> Credit Note</TabHeading> 
              

                <div className="row mt-2">
                    <div className="col-md-12">
                        <div className="row" >
                            <div className="col-md-12 col-12 col-lg-2"><label>Credit Note Number :</label></div>
                            <div className="col"><p>To Be Allocated By System</p></div>.
                            <div className="col-md-12 col-12 col-lg-2"><label>	Invoice No. :</label></div>
                            <div className="col"><p>{(props.invoice_number) ? props.invoice_number : ''}</p></div>
                          
                        </div>
                        <div className="row" >
                         
                            <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                            <div className="col"><p>{(props.invDetails) ? TodayDateSalash() : ''}</p></div>
                            <div className="col-md-12 col-12 col-lg-2"><label>Date  : </label></div>
                            <div className="col"><p>{(props.invDetails) ? TodayDateSalash(props.invDetails.POM_SUBMIT_DATE) : ''}</p></div>
                          

                        </div>
                        <div className="row" >
                            <div className="col-12 col-sm-12 col-md-6">
                                <div className="row">
                                    <div className="col-md-12 col-12 col-lg-4"><label>Bill To : </label></div>
                                    <div className="col">
                                        <p>{(props.invDetails) ? <div className="user_address">
                                            {(props.invDetails.POM_S_ADDR_LINE1) ?  props.invDetails.POM_S_ADDR_LINE1+','+'\n' : ''} 
                                            {(props.invDetails.POM_S_ADDR_LINE2) ?  props.invDetails.POM_S_ADDR_LINE2+','+'\n' : ''} 
                                            {(props.invDetails.POM_S_ADDR_LINE3) ?  props.invDetails.POM_S_ADDR_LINE3+','+'\n' : ''} 
                                            {(props.invDetails.POM_S_CITY) ?  props.invDetails.POM_S_CITY+','+'\n' : ''} 
                                            {(props.invDetails.POM_S_POSTCODE) ?  props.invDetails.POM_S_POSTCODE+','+'\n' : ''} 
                                            {(props.invDetails.POM_S_COUNTRY) ?  props.invDetails.POM_S_COUNTRY+'\n' : ''} 
                                        </div> : ''}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6">
                                <div className="row">
                                    <div className="col-md-12 col-12 col-lg-4"><label>Currency  : </label></div>
                                    <div className="col"><p> {(props.invDetails) ? props.invDetails.POM_S_COUNTRY : ''}</p></div>
                                </div>
                                <div className="row" >
                                    <div className="col-md-12 col-12 col-lg-4"><label>Invoice Amount : </label></div>
                                    <div className="col"><p> {(props.invDetails && props.invDetails.IM_INVOICE_TOTAL) ? parseFloat(props.invDetails.IM_INVOICE_TOTAL).toFixed(2) : ''}</p></div>
                                </div>
                                <div className="row" >
                                    <div className="col-md-12 col-12 col-lg-4"><label>Related Debit Note : </label></div>
                                    <div className="col"><p> {(props.relatedCreditNotes && props.relatedCreditNotes.length > 0) ? props.relatedCreditNotes[0].CNM_INV_NO : ''} </p></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-12 col-lg-4"><label>Total Related Debit Note Amount: </label></div>
                                    <div className="col"><p>{(props.relatedCreditNotes && props.relatedCreditNotes.length > 0) ? parseFloat(props.relatedCreditNotes[0].CNM_CN_TOTAL).toFixed(2) : ''}</p></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-12 col-lg-4"><label>Net Amount  : </label></div>
                                    <div className="col"><p> {(props.invDetails && props.invDetails.IM_INVOICE_TOTAL) ? parseFloat(props.invDetails.IM_INVOICE_TOTAL).toFixed(2) : ''}</p></div>
                                </div>
                            </div>
                            
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
                                {(props.attachments) ? props.attachments.map((list, index) => {
                                    if (list.Text !== 'No Files Attached') {
                                        return <p className="download-files"><u><span onClick={() => props.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                }) : 'No files attached'}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
            <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
            <div className="row">
                <div className="col-md-12">
                    <BootstrapCustomTable 
                        table_header={_table_data_header} 
                        table_body={props.lineItems} 
                        mode={'radio'}
                        select={false} 
                        change={true}
                        products = {getSelectedProduct}
                        getInputs = {handleTableInputs}
                        input_values = {props.table_inputs}
                        selectname={'pr_no'} 
                        responsive={true} 
                    />
                </div>
                <div className="col-md-12 mt-2 mb-2 sub_total_main text-right">
                    <div className="sub_total"> <strong>Sub Total</strong> : <span className="sub_text">0.00</span></div>
                    <div className="sub_total"> <strong>SST Amount</strong> : <span className="sub_text">0.00</span></div>
                    <hr></hr>
                    <div className="sub_total"> <strong>Grand Total</strong> : <span className="sub_text">0.00</span></div>
                </div>
            </div>
            <div className="mt-2 mb-5 row">
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-success btn-sm" > Submit</button> </div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-secondary btn-sm" >Reset</button></div>
                <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-primary btn-sm" >View</button></div>
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
        </Fragment>

}   

let ConverPRListingHolder = reduxForm({
    form: 'ConverPRListing'
})(ConverPRListing)
export default ConverPRListingHolder

