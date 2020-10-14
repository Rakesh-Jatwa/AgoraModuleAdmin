import React, {Component, Fragment} from 'react'
import TabHeading from '../../../../../Component/Heading/TabHeading';
import {GetviewRFQ} from '../../../../../Actions/Vendor'
import {GetRFQPDFGenerate} from '../../../../../Actions/Approver'
import Loader from '../../../../../Component/Loader'
import {TodayDateSalash} from '../../../../../Component/Dates'
import {connect} from 'react-redux';
import {UserDetails} from '../../../../../Common/LocalStorage'
import Alert from '../../../../../Component/Modal/alert'
import {HandlePaymentTerm} from '../../../../../Actions/Common/Functions'
import PageHeading from '../../../../../Component/Heading/PageHeading';
import {GetDownloadFile} from '../../../../../Actions/Approver'
import BackButton from '../../../../../Component/Buttons/Back'
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
        if(this.props.location && this.props.location.datas){
            this.props.GetviewRFQ(this.props.location.datas)
        }
        
    }

    static getDerivedStateFromProps(props, state){
       
        if(props.search_result && props.search_result.length > 0){
            return {
                details: props.search_result[0],
                vendor_details : (props.search_result && props.search_result.length && props.search_result[0]) ? props.search_result[0] : {},
                quotaion_details :  (props.search_result && props.search_result[0].items) ? props.search_result[0].items : [],
                attachments :  (props.search_result && props.search_result[0].displayAttachFile && props.search_result[0].displayAttachFile.attachFileList) ? props.search_result[0].displayAttachFile.attachFileList : [],
                rendered : (props.search_result && props.search_result[0].quotaion_details) ? true : false,
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

    download_files = (data, status) => {
        this.props.GetDownloadFile(data);
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
        if(_user_details.ROLE_NAME && ( _user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('Procurement  Officer') ||_user_details.ROLE_NAME.includes('Procurement Officer'))) {
            let _pdf_datas = {"RFQ_No": (this.state.details) ? this.state.details.RM_RFQ_No : '', "BCOY_ID": (this.state.details) ? this.state.details.RM_Coy_ID : '' };
            console.log('download_pdf', _user_details, _pdf_datas)
            this.props.GetRFQPDFGenerate(_pdf_datas)
        }
        else{
            let _pdf_datas = { "VendorRequired": "T", "prmVCoyID":_user_details.UM_COY_ID, "RFQ_No": (this.state.details) ? this.state.details.RM_RFQ_No : '', "BCOY_ID": (this.state.details) ? this.state.details.RM_Coy_ID : '' };
            console.log('download_pdf', _user_details, _pdf_datas)
            this.props.GetRFQPDFGenerate(_pdf_datas)
        }
       
    }
  

   
   

    render(){
        
        let _UserDetails = UserDetails();
        
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.vq_loading) ? <Loader /> : '' }
              {(this.props.qp_loading) ? <Loader /> : '' }
              {(this.props.rpdf_loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              
              
               
                    <PageHeading heading="RFQ Info" subheading=""  />               
                 
                    <div>
                        <strong>RFQ Number</strong> : {this.state.details != '' ? this.state.details.RM_RFQ_No : ""} <br/>
                        <strong>RFQ Description</strong> : {this.state.details != '' ? this.state.details.RM_RFQ_Name : ""} <br/>
                    </div>
                    <div className="row mt-2">
                        <div className="col-12 col-sm-6">
                            <TabHeading color={'bg-info text-white detail_top'}>Purchaser Details</TabHeading> 
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>RFQ Expiry Date :</td>
                                        <td>{TodayDateSalash(this.state.details.RM_Expiry_Date)}</td>
                                    </tr>

                                    <tr>
                                        <td>Currency</td>
                                        <td>{this.state.details.RM_Currency_Code}</td>
                                    </tr>
                                    
                                    <tr>
                                        <td> Contact Person :</td>
                                        <td>{this.state.details.RM_Contact_Person}</td>
                                    </tr>
                                    <tr>
                                        <td>Contact Number :</td>
                                        <td>{this.state.details.RM_Contact_Number}</td>
                                    </tr>
                                    <tr>
                                        <td> Email :</td>
                                        <td>{this.state.details.RM_Email}</td>
                                    </tr>
                                    <tr>
                                        <td> File(s) Attached :</td>
                                        <td>
                                            {(this.state.attachments.length && this.state.attachments.length > 0 && this.state.attachments[0].Text!="No Files Attached") ? this.state.attachments.map((list, index) => {
                                                if (list.CDA_TYPE == 'E') {
                                                    return <p className="download-files"><u><span onClick={() => this.download_files(list, 'reqDoc')}>{list.strFile} ({list.Text} KB)</span></u></p>
                                                }
                                            }): "No files attached"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 col-sm-6">
                        <TabHeading color={'bg-info text-white detail_top'}>Vendor Details</TabHeading> 
                        <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Quotation Validity Date :</td>
                                        <td>{TodayDateSalash(this.state.details.RM_Reqd_Quote_Validity)}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment Terms :</td>
                                        <td>{(this.state.details.RM_Payment_Term) ? HandlePaymentTerm((this.state.details.RM_Payment_Term) ? this.state.details.RM_Payment_Term.trim() : '') : ''}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment Method :</td>
                                        <td>{this.state.details.RM_Payment_Type}</td>
                                    </tr>
                                    

                                    <tr>
                                        <td>Shipment Mode :</td>
                                        <td>{this.state.details.RM_Shipment_Mode}</td>
                                    </tr>
                                    <tr>
                                        <td>Shipment Terms  :</td>
                                        <td>{this.state.details.RM_Shipment_Term}</td>
                                    </tr>
                                    <tr>
                                        <td>Remarks :</td>
                                        <td>{this.state.details.RM_Remark}</td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <table className="table table-striped table-bordered text-right-input">
                    <thead>
                        <tr>
                            <th style={{width:'47px'}}>S.no </th>
                            <th style={{width:'109px'}}>Item Name</th>
                            <th style={{width:'64px'}}>UOM</th>
                            <th style={{width:'64px'}}>Quantity</th>
                            <th style={{width:'109px'}}>Delivery Lead Time(days)</th>
                            <th style={{width:'109px'}}>Warranty Terms (mths) </th>
                        </tr>
                    </thead>
                    <tbody>     
                        {this.state.quotaion_details.map((val, index) => {
                            return (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{val.RD_Product_Desc}</td>
                                        <td style={{textAlign:'right'}}>{val.RD_UOM}</td>
                                        <td style={{textAlign:'right'}}>{(val.RD_Quantity) ? parseFloat(val.RD_Quantity).toFixed(2): '0.00'}</td>
                                        <td style={{textAlign:'right'}}>{val.RD_Delivery_Lead_Time}</td>
                                        <td style={{textAlign:'right'}}>{(val.RD_Warranty_Terms) ? val.RD_Warranty_Terms: '0'}</td>
                                    </tr>
                                )
                            })}

                          {this.props.type=="details" &&
                            <Fragment>
                                <tr>
                                    <td className="text-right" colSpan={4}>Sub Total :</td>
                                    <td style={{width:'109px'}}> {this.state.quotaion_details.reduce((a, val) => a += val.RRDT_Amount, 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={4}>SST Amount :</td>
                                    <td style={{width:'109px'}}>{this.state.quotaion_details.reduce((a, val) => a += val.RRDT_GST, 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right" colSpan={4}>Grand Total :</td> 
                                    <td style={{width:'109px'}}>{this.state.quotaion_details.reduce((a, val) => a += val.RRDT_Amount + val.RRDT_GST, 0).toFixed(2)}</td>
                                </tr>
                            </Fragment>
                        }
                       
                    </tbody>
                    </table>
                    <div className="mt-2 mt-5 row">
                          
                                <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                <button className="btn btn-sm btn-outline-primary" onClick={()=>this.download_pdf()} >View RFQ</button>
                       
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
    search_result : state.view_rfq.responseList,
    loading : state.view_rfq.loading,
    file_upload_loading : state.file_upload_external.loading,
    fd_loading : state.file_download.loading,
    fe_loading : state.file_delete_external.loading,
    file_delete : state.file_delete_external.responseList,
    file_upload : state.file_upload_external.responseList,
    generate_rfqpdf : state.generate_rfqpdf.responseList,
    fqpdf_loading : state.generate_rfqpdf.loading,
    vq_loading : state.view_quotation.loading,
    qp_loading : state.quote_pdf.loading,
    rpdf_loading : state.rfqpdf_generate.loading,
    dr_loading : state.file_download.loading,
    
    
  })
  
const mapDispatchToProps = dispatch => ({
    GetDownloadFile  : (values) => dispatch(GetDownloadFile(values)),
    GetviewRFQ  : (values) => dispatch(GetviewRFQ(values)),
    GetRFQPDFGenerate : (values) => dispatch(GetRFQPDFGenerate(values)),
    
})
  
  
const ViewRFQNumberHolder = connect(mapStateToProps, mapDispatchToProps)(ViewRFQNumber);
export default ViewRFQNumberHolder;
