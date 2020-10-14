import React, {Component, Fragment} from 'react'
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {GetQuotationPDFGenerate, GetDownloadFile} from '../../../../../Actions/Approver'
import {GetViewQuotation} from '../../../../../Actions/Vendor'
import Loader from '../../../../../Component/Loader'
import {TodayDateSalash} from '../../../../../Component/Dates'
import {connect} from 'react-redux';
import {UserDetails} from '../../../../../Common/LocalStorage'
import Alert from '../../../../../Component/Modal/alert'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {round_decimal} from '../../../../../Actions/Common/Functions'

class ViewRFQNumber extends Component{

    constructor(props){
        super(props);
        this.state = {
            products:[],
            all_products:[],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status : false, 
            loading: false, 
            checked_initial : [0,1,2],
            checked_details:[],
            details : {},
            vendor_details : {},
            all_ship_term : [],
            all_ship_mode : [],
            GstQuo : {},
            quotaion_details : [],
            rendered : false,
            upload_details:false,
            external_file : '',
            external_file_name : '',
            attachments : [],
            delete:false,
            loading:false,
        }
    }

    componentDidMount(){
        console.log('RM_RFQ_No', this.props.location)
        if(this.props.location && this.props.location.datas){
            this.props.GetViewQuotation(this.props.location.datas)
        }

      

       
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.length > 0){
            return {
                details: props.search_result[0],
                attachments :  (props.search_result && props.search_result.length && props.search_result[0].displayAttachFile && props.search_result[0].displayAttachFile.attachFileList) ? props.search_result[0].displayAttachFile.attachFileList : {},
                vendor_details : (props.search_result && props.search_result.length && props.search_result[0]) ? props.search_result[0] : {},
                vendor_details : (props.search_result && props.search_result.length && props.search_result[0]) ? props.search_result[0] : {},
                quotaion_details :  (props.search_result && props.search_result[0].taxds) ? props.search_result[0].taxds : [],
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false
        })

        if(this.state.status){
            this.props.history.push({
                pathname:'/VendorRFQList'
            })
        }
    }



    checkUnitPrice = (quotaion_details) => {
        let status = true;
        for (let index = 0; index < quotaion_details.length; index++) {
            const element = quotaion_details[index];
            if (element.RRDT_Unit_Price === "0" || element.RRDT_Unit_Price === null || element.RRDT_Unit_Price === "") {
                status = false;
                break;
            }
        }
        return status;
    }

    update_qunatity = (e, index) => {
        let _details  = this.state.quotaion_details
        let _value = e.target.value
        let _temp_details = _details;
        _temp_details[index].RRDT_Amount = _value * _temp_details[index].RRDT_Quantity;
        _temp_details[index].RRDT_Unit_Price = _value;
        this.setState({
            quotaion_details : _temp_details
        })
    }

    file_upload = (e, index) => {
        let _details  = this.state.quotaion_details
        let _value = e.target.value
        let _temp_details = _details;
        _temp_details[index].RRDT_Amount = _value * _temp_details[index].RRDT_Quantity;
        _temp_details[index].RRDT_Unit_Price = _value;
        this.setState({
            quotaion_details : _temp_details
        })
    }

    SendUpload = (e) => {
        if(e.target.files && e.target.files.length){
            this.setState({
                external_file : e.target.files[0],
                external_file_name :(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
            })
        }
    }

    download_pdf = () => {
        let _user_details = UserDetails();
        if((this.state.details && this.state.details.RM_RFQ_No)){
            
            let _pdf_datas = { "RFQId": parseInt(this.state.details.RRM_RFQ_ID), "SCoyID":(this.props.location && this.props.location.datas) ? this.props.location.datas.vcomid : _user_details.UM_COY_ID, "Quo_no": this.state.details.RRM_Actual_Quot_Num.trim(), "Rfq_no": this.state.details.RM_RFQ_No.trim() ,BCoyID:this.state.details.RM_COY_ID}
            this.props.GetQuotationPDFGenerate(_pdf_datas)
        }
      
    }

    download_files = (alter_details) =>{
        let requestParam = { 
            'strFile': alter_details.strFile, 
            'strFile1': alter_details.strFile1, 
            'Text': alter_details.Text, 
            'ID': alter_details.ID, 
            'CDA_TYPE': alter_details.CDA_TYPE, 
            'CDA_DOC_TYPE': alter_details.CDA_DOC_TYPE, 
            'pEnumDownloadType': alter_details.pEnumDownloadType, 
        };
        this.props.GetDownloadFile(requestParam)
    }

   

    render(){
        let _UserDetails = UserDetails();
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              {(this.props.download_file) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }

           
               
                    <PageHeading heading="Quotation Info" subheading=""  />               
                 
                    <div>
                        <strong>Quotation  Number</strong> : {this.state.details != '' ? this.state.details.RRM_Actual_Quot_Num : ""} <br/>
                    </div>
                    <div className="row mt-2">
                        <div className="col-12">
                            <TabHeading color={'bg-info text-white '}>Quotation Details</TabHeading> 
                          
                        </div>

                            <div className="col-12 col-sm-6">
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Date Created :</td>
                                        <td>{TodayDateSalash(this.state.details.RRM_Created_On)}</td>
                                    </tr>
                                    <tr>
                                        <td>Quotation Validity : </td>
                                        <td>{TodayDateSalash(this.state.details.RRM_Offer_Till)}</td>
                                    </tr>

                                    <tr>
                                        <td>From :</td>
                                        <td>{this.state.details.CM_COY_NAME}</td>
                                    </tr>

                                    <tr>
                                        <td>Physical Address :</td>
                                        <td><address>{this.state.details.CM_ADDR_LINE1+', '+this.state.details.CM_ADDR_LINE2+', '+((this.state.details.CM_ADDR_LINE3) ? this.state.details.CM_ADDR_LINE3+', ' : ' ')+this.state.details.CM_CITY+', '+this.state.details.state+', '+this.state.details.country}</address></td>
                                    </tr>
                                    <tr>
                                        <td>File Attachment(s) :</td>
                                        <td>{(this.state.attachments && this.state.attachments.length > 0 && this.state.attachments[0].Text!="No Files Attached") ? this.state.attachments.map((list, index) => {
                                                if (list.Text !== 'No Files Attached') {
                                                    return <p className="download-files"><u><span onClick={() => this.download_files(list)}>{list.CDA_ATTACH_FILENAME} ({list.strFile} KB) &nbsp;&nbsp;</span></u> <span onClick={() => this.delete_file(list, 'I')}><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                                }
                                            }) : 'No Files Attached'}</td>
                                    </tr>

                                    
                                    
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 col-sm-6">
                       
                        <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td> Contact Person :</td>
                                        <td>{this.state.details.RRM_Contact_Person}</td>
                                    </tr>
                                    <tr>
                                        <td>Contact Number :</td>
                                        <td>{this.state.details.RRM_Contact_Number}</td>
                                    </tr>
                                    <tr>
                                        <td> Email :</td>
                                        <td>{this.state.details.RRM_Email}</td>
                                    </tr>
                                    <tr>
                                        <td> Remarks :</td>
                                        <td>{this.state.details.RRM_Remarks}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <table className="table table-striped table-bordered text-right-input">
                    <thead>
                        <tr>
                            <th style={{width:'47px'}}>No </th>
                            <th style={{width:'109px'}}>Item Name</th>
                            <th style={{width:'64px'}}>UOM</th>
                            <th style={{width:'64px'}}>QTY</th>
                            <th style={{width:'64px'}}>Unit Price</th>
                            <th style={{width:'64px'}}>Amount</th>
                            <th style={{width:'64px'}}>SST Rate</th>
                            <th style={{width:'64px'}}>SST Amount</th>
                            <th style={{width:'64px'}}>Pack Qty</th>
                            <th style={{width:'64px'}}>MOQ</th>
                            <th style={{width:'109px'}}>Delivery Lead Time(days)</th>
                            <th style={{width:'109px'}}>Warranty Terms (mths) </th>
                            <th style={{width:'109px'}}>Remarks </th>
                        </tr>
                    </thead>
                    <tbody>     
                        {this.state.quotaion_details.map((val, index) => {
                            return (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{val.RRD_Product_Desc}</td>
                                        <td>{val.RRD_UOM}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Quantity) ? parseFloat(val.RRD_Quantity).toFixed(2): '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Unit_Price) ? parseFloat(val.RRD_Unit_Price).toFixed(4): '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Quantity * val.RRD_Unit_Price) ? parseFloat(val.RRD_Quantity * val.RRD_Unit_Price).toFixed(2): '0.00'}</td>
                                        <td>{(val.GSTRATE)  ? val.GSTRATE : 'N/A'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_GST)  ?  round_decimal((val.RRD_Quantity * val.RRD_Unit_Price) * parseFloat(val.RRD_GST/100).toFixed(2)) : '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Min_Pack_Qty) ? parseFloat(val.RRD_Min_Pack_Qty).toFixed(2): '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Min_Order_Qty) ? parseFloat(val.RRD_Min_Order_Qty).toFixed(2): '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Delivery_Lead_Time) ? val.RRD_Delivery_Lead_Time : '0'}</td>
                                        <td style={{textAlign:'right'}}>{(val.RRD_Warranty_Terms) ? val.RRD_Warranty_Terms : '0'}</td>
                                        <td>{val.RRD_Remarks}</td>
                                    </tr>
                                )
                            })}

                      
                                <tr>
                                    <td className="text-right" colSpan={12}>Sub Total :</td>
                                    <td style={{width:'109px'}}> {this.state.quotaion_details.reduce((a, val) => a += (val.RRD_Quantity * val.RRD_Unit_Price), 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={12}>SST Amount :</td>
                                    <td style={{width:'109px'}}>{this.state.quotaion_details.reduce((a, val) => a += (val.RRD_GST ? (val.RRD_Quantity * val.RRD_Unit_Price) * parseFloat(val.RRD_GST/100).toFixed(2)  : 0 ), 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={12}>Grand Total :</td> 
                                    <td style={{width:'109px'}}>{this.state.quotaion_details.reduce((a, val) => a += (val.RRD_Quantity * val.RRD_Unit_Price) + (val.RRD_GST ? (val.RRD_Quantity * val.RRD_Unit_Price) * parseFloat(val.RRD_GST/100).toFixed(2) : 0 ), 0).toFixed(2)}</td>
                                </tr>
                         
                       
                    </tbody>
                    </table>
                    <div className="mt-2 mt-5 row">
                        <div className="col-lg-auto col-md"><button type="button" className="btn btn-outline-danger btn-sm mr-2" onClick={()=>this.props.history.goBack()} >Back</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={()=>{this.download_pdf()}} >View Quotation</button>
                        </div>
                   </div>
              
                
             
               
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}


const mapStateToProps = state => ({
    search_result : state.view_quotation.responseList,
    loading : state.view_quotation.loading,
    download_file : state.file_download.loading,
})
  
const mapDispatchToProps = dispatch => ({

    GetViewQuotation  : (values) => dispatch(GetViewQuotation(values)),
    GetQuotationPDFGenerate : (values) => dispatch(GetQuotationPDFGenerate(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
})
  

  
const ViewRFQNumberHolder = connect(mapStateToProps, mapDispatchToProps)(ViewRFQNumber);
export default ViewRFQNumberHolder;