import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';

import {reduxForm, reset } from 'redux-form';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {ddmmyy} from '../../../Component/Dates'
import Alert from '../../../Component/Modal/alert'
import {GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetViewPOClick, GetGeneratePOPDF, GetAcceptReject, GetDownloadFile, GetPoListDetails} from '../../../Actions/Vendor'
import {addDate, TodayDateSalash} from '../../../Component/Dates'
import {ApiExtract} from '../../../Common/GetDatas'
import {AcceptReject} from '../../../Apis/Vendor'
import {UserDetails} from '../../../Common/LocalStorage'
import ViewPoLine from '../../Pages/ViewPoLine'
import {GetPolineDetails} from '../../../Actions/Vendor';

class PurchaseOrderDetails extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.AcceptPo = this.AcceptPo.bind(this);
        this.download_files = this.download_files.bind(this)
        this.state = {
            products:[],
            start_data:'',
            remark:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status:true,
            checked_initial : [0,1,2],
            checked_details:[],
            updated:true,
            addressCode: true,
            loading:false,
            show_details : true,
        }
    }


    componentDidMount(){
        var _details = this.props.location.datas
        this.setState({
            products: this.props.location.datas,
        })
        let _get_details  = { 'POM_B_COY_ID': 'pamb', 'POM_PO_NO': (this.props.location && this.props.location.datas) ? this.props.location.datas.POM_PO_NO : '', 'POM_S_COY_ID': (this.props.location && this.props.location.datas) ? this.props.location.datas.POM_S_COY_ID : '' }
        // this.props.GetViewPOClick(this.props.location.datas)
        this.props.GetViewPOClick({POM_PO_NO: "PAMB/PO/1806899", POM_B_COY_ID: "pamb", POM_S_COY_ID: "339201P160", frm_page: "app_rej"})
        this.props.GetPoListDetails({poIndex : (_details && _details.PRM_PO_INDEX) ? _details.PRM_PO_INDEX : 0 })
    }
    closemodel = () => {
        this.setState({
            model : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/deliveryorder'
            })
        }
    }


    download_files = (data, status) => {
        data.CDA_DOC_TYPE = 'PR';
        this.props.GetDownloadFile(data);
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

    get_details(details){
        let _details = { 'BCoyID': details.POD_COY_ID, 'PO_NO': details.POD_PO_NO, 'PO_LINE': details.POD_PO_LINE, 'v_comid': '339201P160' }
        this.props.GetPolineDetails(_details)
        this.setState({
            show_details : false
        })
    }

    close_details = () =>{
        this.setState({
            show_details : true
        })
    }

    async AcceptPo(status){
        let obj = {
            "submitPODataList": [{
                "status": status,
                "BCoyID": this.state.products.POM_B_COY_ID,
                "datakey": this.state.products.POM_PO_NO,
                "remark": (this.state.remark) ? this.state.remark : "Test 1"
            }]
         
        };

        this.setState({loading:true})
        let _status = await ApiExtract(AcceptReject, obj);
        if(_status){
            this.setState({
                status: _status.status,
                model:true,
                modal_body: _status.message,
                loading:false,
            })
        }

    }


    handlefromsubmit(values){
        let _form_value = values;
        if(_form_value.ApproveDto && _form_value.ApproveDto.StartDate){
            delete  _form_value.ApproveDto.StartDate
        }
        if(_form_value.ApproveDto && _form_value.ApproveDto.EndDate){
            delete  _form_value.ApproveDto.EndDate
        }
     
        let _initial_obj = {
            PRNumber: "",
            MyApprovalStatus: "",
            prType: "",
            VendorName: "",
            UIStartDate: this.state.start_data,
            UIEndDate: this.state.end_data,
            includedHold: false,
            included: false,
            PRNumber: "",
            VendorName : "",
        }
        _form_value.ApproveDto = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
     
        this.props.get_search_list(_form_value)
    }

    GetGeneratePOPDF(data){
        let _data = { 'POM_B_Coy_ID': this.state.products.POM_B_COY_ID, 'POM_PO_No': this.state.products.POM_PO_NO }
        this.props.GetGeneratePOPDF(_data);
    }

    componentDidUpdate(){
        if(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length){
            let _store_data  = this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_CODE;
            for (let index = 0; index < this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length; index++) {
                let _final_details = this.props.purchase_reqest_approval.getlineitem.lineitemDetails[index];
                if (_final_details.POD_D_ADDR_CODE !== _store_data && this.state.updated) {
                    this.setState({ 
                        updated:false,
                        addressCode: false 
                    });
                    break;
                }
            }
        }
        
    }

   
    render(){
        console.log('this.props.purchase_reqest_approval',(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length >0) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails: [])
         const { handleSubmit } = this.props
         let _user_details = UserDetails()

         const _table_header_do_summary = [
            {name : "Line", id:"POD_PO_LINE", width:'50px', key:true, type:"index"},
            {name : "Gift", id:"GIFT", width:'100px'},
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
            {name : "SST Rate", id:"POD_GST_RATE", width:'100px', dataFormat:"price"},
            {name : "SST Amount", id:"POD_GST", width:'100px', dataFormat:"number"},
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
        
        const _table_header = [
            {name : "Line", id:"POD_PO_LINE", width:'60px' ,  formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE",key:true, width:'100px', dataFormat:'validatedata'},
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'144px'},
            {name : "UOM", id:"POD_UOM", width:'144px'},
            {name : "EDD (Date)", id:"POM_PO_DATE", width:'150px', dataFormat:'date'},
            {name : "MPQ", id:"POD_ORDERED_QTY", width:'144px',dataFormat:'price'},
            {name : "Warranty Terms", id:"POD_WARRANTY_TERMS", width:'150px', dataFormat:'price'},
            {name : "PO Qty", id:"POD_ORDERED_QTY", width:'110px',dataFormat:'price'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.dr_loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.popdf_loading) ? <Loader /> : '' }
              {(this.props.loading_details) ? <Loader /> : '' }
              
              
              {(this.state.show_details) ?  
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Click the Accept PO button to accept the selected PO. To reject the selected PO, click the Reject PO button" 
            />
            <TabHeading color={'bg-info text-white'}>Purchase Order Header</TabHeading> 

           
         

                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>PO Number : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_NO : ''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Status :  </label></div>
                        <div className="col"><p> {(this.state.products) ? this.state.products.STATUS : ''} {"by management (Official)"}</p></div>
                    </div>

                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>PR Number : </label></div>
                        <div className="col"><p> {(this.state.products) ? this.state.products.PR_NO : ''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label> </label></div>
                        <div className="col"><p></p></div>
                    </div>

                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Order Date : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval  &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_DATE) ? ddmmyy(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_DATE) :""}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Currency Code : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CM_CURRENCY_CODE:''}</p></div>
                        
                    </div>
                   
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>PO Accepted Date : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_ACCEPTED_DATE) ? ddmmyy(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_ACCEPTED_DATE):'To be Allocated by the system '}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Delivery Term : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_TERM:''}</p></div>
                    </div>


                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_COY_NAME:''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Ship Via : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_MODE:''}</p></div>
                    </div>
                    
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor Address : </label></div>
                        <div className="col"><address>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE1 :''} <br />{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE2  :''} {(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_POSTCODE:''} {(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_CITY:""}</address></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Ship To : </label></div>
                        <div className="col"><address>{this.state.addressCode === true ? (this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_CODE + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE1 + "\n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE2 + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE3 + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_POSTCODE + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_CITY : "" : "See Details"}</address></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor Tel : </label></div>
                        <div className="col">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_PHONE:''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Tel :</label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_PHONE:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor Fax : </label></div>
                        <div className="col">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_FAX:''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>	 Fax : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_BUYER_FAX:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor Email : </label></div>
                        <div className="col">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_EMAIL:''}</div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Contact  : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_BUYER_NAME:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-6 col-lg-6"></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Email :</label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].UM_EMAIL:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Payment Terms : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_TERM:''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Payment Method :    </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_METHOD:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Shipment Terms :</label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_TERM:''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>Shipment Mode : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_MODE:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Internal Remarks :</label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_INTERNAL_REMARK:''}</p></div>
                        <div className="col-12 col-md-2 col-lg-2"><label>External Remarks : </label></div>
                        <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</p></div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Remarks : </label></div>
                        <div className="col-12 col-md-6 col-lg-6">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>File Attached : </label></div>
                        <div className="col">
                        <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile[0] && this.props.purchase_reqest_approval.displayAttachFile[0].Text !== 'No Files Attached') ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                            if (list.Text !== 'No Files Attached') {
                                return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u><span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                            }
                        }) : 'No files attached'}</p>
                        </div>
                    </div>
                    <div  className="row mt-2">
                        <div className="col-12 col-md-2 col-lg-2"><label>Vendor's Remarks : </label></div>
                        <div className="col-12 col-md-6 col-lg-6">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_REMARK:''}</div>
                        
                      
                    </div>
                    <div className='col-12' className="mb-2 mt-2">Click here to download the Term & Conditions document</div> 
                        <TabHeading color={'bg-info text-white'}>Purchase Order Line Detail</TabHeading>
                        <BootstrapCustomTable 
                                table_header={_table_header} 
                                table_body={(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails : [] } 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={false}
                                table_name="issue_grn"
                        />

                     
                        <TabHeading color={'bg-info text-white'}>DO And GRN Summary</TabHeading> 
                        <BootstrapCustomTable 
                            table_header={_table_header_do_summary} 
                            table_body={(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length >0) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails: [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            search={false}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />
                      

                         
                      
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
  })

  
  
  const mapDispatchToProps = dispatch => ({
    ResetApprovalFrom  : () => dispatch(reset('PurchaseOrderDetails')),
    GetViewPOClick : (values) => dispatch(GetViewPOClick(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetPolineDetails : (values) => dispatch(GetPolineDetails(values)),
    GetPoListDetails : (values) => dispatch(GetPoListDetails(values)),
  })
  
  
const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetails);
export default reduxForm({
    form:'PurchaseOrderDetails',
})(PurchaseHolder);
