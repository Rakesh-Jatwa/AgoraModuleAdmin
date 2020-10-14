import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {FromateDate, CompareDate} from '../../../Component/Dates'
import {connect} from 'react-redux';
import {InvoiceDetails} from '../../../validation'
import { GetProductDetail } from '../../../Actions/Requester'
import {UserDetails, GetLocalstorage} from '../../../Common/LocalStorage'
import Alert from '../../../Component/Modal/alert'
import {ApiExtract} from '../../../Common/GetDatas'
import {InvoiceSubmit} from '../../../Apis/Vendor'
import {getItemTypeName} from '../../../Actions/Common/Functions'

class InvoiceViewDetails extends Component {
    constructor(props){
       
        super(props);
        
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_pdf = this.view_pdf.bind(this);
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            files:[],
            file_name:'',
            checked_initial : [0,1,2],
            checked_details:[],
            status:true,
            loading:false,
            attachment : [],
            delete : false, 
            rendered:true,
            item_details : {},
            prefer_vednor: [],
            txn_price : [],
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


   static getDerivedStateFromProps(props, state){
       console.log('props.search_list', JSON.stringify(props.search_list))
        if((state.rendered) && (props.search_list)){
            return {
                item_details : (props.search_list && props.search_list.prodetails && props.search_list.prodetails.dsprodet)  ? props.search_list.prodetails.dsprodet[0] : {},
                prefer_vednor : (props.search_list && props.search_list.prodetails && props.search_list.prodetails.preferVednor)  ? props.search_list.prodetails.preferVednor[0] : {},
                rendered: (props.search_list && props.search_list.prodetails && props.search_list.prodetails.dsprodet && props.search_list.prodetails.dsprodet.length>0)  ? false : true,
                attachment:(props.search_list.displayAttachFile) && (props.search_list.displayAttachFile.attachFileList) ? props.search_list.displayAttachFile.attachFileList : [],
                contract_info : (props.search_list.contractInfo) ? props.search_list.contractInfo : [],
                txn_price :  (props.search_list.txnprice) ? props.search_list.txnprice : [],
                vendor_lead : (props.search_list && props.search_list.prodetails && props.search_list.prodetails.vendorLead)  ? props.search_list.prodetails.vendorLead : [],
            }
        }
        else if((!state.delete) && (!state.rendered) && (props.upload_document) && (props.upload_document.displayAttachFile) && (props.upload_document.displayAttachFile.attachFileList)){
            return {
                attachment:props.upload_document.displayAttachFile.attachFileList
            }
        }
        else if( (!state.rendered) && state.delete && (props.file_delete) && (props.file_delete.displayAttachFile) && (props.file_delete.displayAttachFile.attachFileList)){
            return {
                attachment:props.file_delete.displayAttachFile.attachFileList
            }
        }
        return {props, state}
    }


    componentDidMount(){
        let _local_details = localStorage.getItem('item_details')
        var _details = (this.props.location && this.props.location.datas) ? this.props.location.datas : []
        if(_local_details){
            _details = JSON.parse(_local_details)
        }
       
        this.setState({
            products: _details,
            model:false,
            model_body : '',
        })
      
        this.props.GetProductDetail(_details)
    }

   
    componentDidUpdate(){
        // localStorage.removeItem('item_details')
    }
    

    

    documentDownload(filePath){
        this.props.download_file(filePath)
    }


   

    get_details(details){
        this.props.history.push({
            pathname : '/approvepr',
            datas : details.datas,
        })
    }

    closemodel = () => {
        this.setState({
            model : false
        })
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

   async  submit_invoice(values_details){
        let {getUnInvoiceGRNLine, poMstrDetails} = this.props.search_list;
        let _stored_details = this.state.products
        if(getUnInvoiceGRNLine && poMstrDetails && _stored_details && values_details.Vendorinvoiceno){
            let reqData = [{
                "doc": _stored_details.POM_PO_NO + "," + _stored_details.DO_Number + "," + _stored_details.GRN_Number,//POM_PO_NO,GRN Number,DO Number
                "ref": values_details.Vendorinvoiceno, 
                "remark": values_details.remark,
                "amount": getUnInvoiceGRNLine.reduce((a, val) => a += (val.QTY * val.POD_UNIT_COST) + val.POD_TAX_VALUE, 0),
                "b_com_id": _stored_details.CM_COY_ID,
                "inv_status": "1",
                "bill_meth": _stored_details.POM_BILLING_METHOD,
                "po_no": _stored_details.POM_PO_NO,
                "grn_no": _stored_details.GRN_Number,
                "do_no": _stored_details.DO_Number,
                "pay_day": _stored_details.PAY_DAY,
                "tax": "0",
                "ShipAmt": _stored_details.BALSHIP,
                "pom_po_index": _stored_details.POM_PO_INDEX,
                "do_date": ""
            }];
        
            this.setState({loading:true})
            let _status = await ApiExtract(InvoiceSubmit, reqData)
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
        else{
            this.setState({
                model:true,
                modal_body :'Please Fill Mandatory Feild'
            })
        }

            
        
    }

    view_pdf = () =>{
        let _user_details = UserDetails();
        let _details = this.state.products;
        _details.USER_ID = _details.POM_B_COY_ID;
        _details.POM_B_COY_ID = _user_details.UM_COY_ID;
        this.props.ViewGRNPDF(_details)
    }

    handlefromsubmit(values){
        let _form_value = values;
        if(_form_value.PoListing && _form_value.PoListing.StartDate){
            delete  _form_value.ApproveDto.StartDate
        }
        if(_form_value.ApproveDto && _form_value.ApproveDto.EndDate){
            delete  _form_value.ApproveDto.EndDate
        }
     
        let _initial_obj = {
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            PoStatus:'',
            Fulfilment:'',
            PoStatus: ["1,2", "3", "4,5", "6,3"],
            Fulfilment : this.state.Fulfilment,
        }
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.PoListing.PoStatus =  ["1,2", "3", "4,5", "6,3"]
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    model : true
                })

            }
        }
        else{
            this.props.get_search_list(_form_value)
        }
       
    }

     close_window() {
        window.close();
      }

   

    render(){
        
        const { handleSubmit, submitting } = this.props
        const _table_header = [
            {name : "Vendor", id:"CM_COY_NAME", width:'150px'},
            {name : "Contract Ref. No.", id:"CDM_GROUP_CODE", width:'100px', key:true},
            {name : "Start Date", id:"CDM_START_DATE", width:'70px', dataFormat:"date"},
            {name : "End Date", id:"CDM_END_DATE", width:'70px', dataFormat:"date"},
            {name : "Currency", id:"CDI_CURRENCY_CODE", width:'60px'},
            {name : "Contract Price", id:"CDI_UNIT_COST", width:'100px', dataFormat:"number"},
            {name : "SST Rate", id:"GST_RATE", width:'92px'},
           
        ];

        const _vendor_details = [
            {name : "Vendor", id:"PREFER_VENDOR", width:'150px', formatter: (cellContent, row) => {
                if (row.PV_VENDOR_TYPE === 'P') {
                    return <div>Preferred Vendor : {(this.state.prefer_vednor) ? this.state.prefer_vednor.PREFER_VENDOR : ''}</div> 
                }
                else  if (row.PV_VENDOR_TYPE === '1') {
                    return <div>1st Alternative Vendor : {(this.state.prefer_vednor) ? this.state.prefer_vednor.FIRST_VENDOR : ''}</div>
                }

                else if (row.PV_VENDOR_TYPE === '2') {
                    return  <div>2st Alternative Vendor : {(this.state.prefer_vednor) ? this.state.prefer_vednor.SECOND_VENDOR : ''}</div>
                }

                else if (row.PV_VENDOR_TYPE === '3') {
                    return  <div>3st Alternative Vendor : {(this.state.prefer_vednor) ? this.state.prefer_vednor.THIRD_VENDOR : ''}</div>
                }
            }},
            {name : "Order Lead Time (Days)", id:"PV_LEAD_TIME", width:'100px', key:true},
            {name : "Vendor Item Code", id:"PV_VENDOR_CODE", width:'70px', dataFormat:"date"},
           
        ];

        const _table_header_details = [
            {name : "Vendor", id:"POM_S_COY_NAME", key:true},
            {name : "Unit Price", id:"POD_UNIT_COST", width:'150px', dataFormat:"price2"},
            {name : "PO Date", id:"POM_PO_DATE", width:'150px', dataFormat:"date"},
            {name : "Ordered Qty", id:"POD_ORDERED_QTY", width:'150px', dataFormat:"price2"},
        ];

       
        
        console.log('InvoiceViewDetails', this.props)
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.file_upload_ld) ? <Loader /> : '' }
                {(this.props.file_delete_ld) ? <Loader /> : '' }
                {(this.props.deliver_view_ld) ? <Loader /> : '' }
                {(this.props.save_loading) ? <Loader /> : '' }
                {(this.props.gpdf_loading) ? <Loader /> : '' }
                
            <form onSubmit={handleSubmit(this.submit_invoice.bind(this))}>
             <PageHeading 
                heading="Item Details" 
            />
            <TabHeading color={'bg-info text-white main_bold'}>Item Information</TabHeading> 
            <div className="" >
            <div className="row">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label> Item Code :	 </label></div>
                <div className="col"><p>{this.state.item_details.PM_VENDOR_ITEM_CODE}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Item Name : 	</label></div>
                <div className="col"><p>{this.state.item_details.PM_PRODUCT_DESC}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label> Item Description : 	 </label></div>
                <div className="col"><p>{this.state.item_details.PM_LONG_DESC}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Item Type :  </label></div>
                <div className="col"><p> <p>{getItemTypeName(this.state.item_details.PM_ITEM_TYPE)} </p></p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Commodity Type :</label></div>
                <div className="col">{this.state.item_details.CT_NAME}</div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>UOM : </label></div>
                <div className="col">{this.state.item_details.PM_UOM}</div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Account Code :</label></div>
                <div className="col"><p>{this.state.item_details.PM_ACCT_CODE}</p></div>

            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Category Code :</label></div>
                <div className="col"><p>{this.state.item_details.PM_CAT_CODE}</p></div>

            </div>
            <div className="row mt-2">  
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Order Quantity (Min) : </label></div>
                <div className="col"><p>{this.state.item_details.PM_ORD_MIN_QTY !== "" ? parseFloat(this.state.item_details.PM_ORD_MIN_QTY).toFixed(2) : "0.00"}</p></div>

            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Order Quantity (Max) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_ORD_MAX_QTY !== "" ? parseFloat(this.state.item_details.PM_ORD_MAX_QTY).toFixed(2) : "0.00"}</p></div>

            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Safety Level (Min Inventory) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_SAFE_QTY !== "" ? parseFloat(this.state.item_details.PM_SAFE_QTY).toFixed(2) : "0.00"}</p></div>

            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Max Inventory Quantity :</label></div>
                <div className="col"><p>{this.state.item_details.PM_MAX_INV_QTY !== "" ? parseFloat(this.state.item_details.PM_MAX_INV_QTY).toFixed(2) : "0.00"}</p></div>

            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 mb-2 main_bold">Item Specification</div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Brand:</label></div>
                <div className="col"><p>{this.state.item_details.PM_PRODUCT_BRAND}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label> Manufacturer Name : </label></div>
                <div className="col"><p>{this.state.item_details.PM_MANUFACTURER}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Drawing Number:</label></div>
                <div className="col"><p>{this.state.item_details.PM_DRAW_NO}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Model: </label></div>
                <div className="col"><p>{this.state.item_details.PM_PRODUCT_MODEL}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Gross Weight (kg) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_GROSS_WEIGHT}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Net Weight (kg) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_NET_WEIGHT}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Length (meter) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_LENGHT}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label> Version No. :</label></div>
                <div className="col"><p>{this.state.item_details.PM_VERS_NO}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Packing Specification:</label></div>
                <div className="col"><p>{this.state.item_details.PM_PACKING_REQ}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Width (meter) :</label></div>
                <div className="col"><p>{this.state.item_details.PM_WIDTH}</p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Color Info  : </label></div>
                <div className="col"><p>{this.state.item_details.PM_COLOR_INFO}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label> Volume (liter) : </label></div>
                <div className="col"><p>{this.state.item_details.PM_VOLUME} </p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>HS Code   : </label></div>
                <div className="col"><p>{this.state.item_details.PM_HSC_CODE}</p></div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>  Height (meter) : </label></div>
                <div className="col"><p>{this.state.item_details.PM_HEIGHT} </p></div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 col-12"><label>Remarks : </label></div>
                <div className="col"><p>{this.state.item_details.PM_REMARKS}</p></div>

            </div>
                   
            <hr></hr>
            <div className="d-flex bg-info text-white p-1 mt-2 main_bold">Contract Information</div>
            <div className="no-border-table">
                <BootstrapCustomTable 
                    table_header={_table_header} 
                    table_body={(this.state.contract_info) ? this.state.contract_info : [] } 
                    products={this.getProducts} 
                    select={false} 
                    selectname={'pr_no'} 
                    responsive={true} 
                    click={true}
                   
                    search={false}
                  
                    table_name="issue_grn"
                    get_details = {this.get_details}
                        
                />
            </div>

            
            <div className="d-flex bg-info text-white p-1 mt-2 main_bold">Vendor</div>
            <div className="no-border-table">
                <BootstrapCustomTable 
                        table_header={_vendor_details} 
                        table_body={(this.state.vendor_lead) ? this.state.vendor_lead: [] } 
                        products={this.getProducts} 
                        select={false} 
                        selectname={'pr_no'} 
                        responsive={true} 
                        click={true}
                        search={false}
                        table_name="issue_grn"
                        get_details = {this.get_details}
                        defaultsort = {true}
                        defaultSortName={'PV_LEAD_TIME'}
                        defaultSortOrder= {'desc'}
                        
                />
            </div>

            <div className="d-flex bg-info text-white p-1 mt-2 main_bold">Historical Transaction</div>
            <div className="no-border-table">
                <BootstrapCustomTable 
                        table_header={_table_header_details} 
                        table_body={(this.state.txn_price) ? this.state.txn_price : [] } 
                        products={this.getProducts} 
                        select={false} 
                        selectname={'pr_no'} 
                        responsive={true} 
                        click={true}
                        search={false}
                        table_name="issue_grn"
                        get_details = {this.get_details}
                        
                />
            </div>
            <div className="d-flex bg-info text-white p-1 mt-2 main_bold">File Attachments</div>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6"><label>File(s) Attached :</label></div>
                <div><p>No Files Attached </p></div>
            </div>
            <div className="mt-2">
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.close_window} >Close</button>
            </div>
        </div>
                
        
            
          
        </form>
        <Alert
            message={this.state.modal_body}
            status={this.state.status} 
            show={this.state.model} 
            confirm={this.closemodel}
        />
        
        </Fragment>
    }
}

const mapStateToProps = (state) =>({
    search_list : state.product_details.responseList,
    loading : state.product_details.loading,
    gpdf_loading : state.generate_grnpdf.loading,
    file_upload_ld : state.file_upload_external.loading,
    file_delete_ld : state.file_delete_external.loading,
    deliver_view_ld : state.deliveryorder_view.loading,
    
})
const mapDispatchToProps = (dispatch) =>({
    GetProductDetail : (values) => dispatch(GetProductDetail(values)),
})
const MainRoute = connect(mapStateToProps, mapDispatchToProps)(InvoiceViewDetails);
export default reduxForm({
    form:'InvoiceViewDetails',
    InvoiceDetails
})(MainRoute);

