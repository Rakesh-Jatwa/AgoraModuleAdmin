import React, {Component, Fragment} from 'react';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';                                                                              
import {reduxForm, reset } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTableStatic'
import Loader from '../../../Component/Loader'
import {ddmmyy, addDate} from '../../../Component/Dates'
import Alert from '../../../Component/Modal/alert'
import ConfirmationModel from '../../../Component/Modal/ConfirmationModel'
import {GetViewPOClick, GetGeneratePOPDF, GetAcceptReject, GetDownloadFile, GetPoListDetails} from '../../../Actions/Vendor';
import {GetGenerateDOPDF} from '../../../Actions/Requester'
import {GetPolineDetails, GetViewGRNPDF} from '../../../Actions/Vendor';
import {ApiExtract} from '../../../Common/GetDatas'
import {AcceptReject, DODetails} from '../../../Apis/Vendor'
import {PoAcknowledgement} from '../../../Apis/Vendor'
import ViewPoLine from '../../Pages/ViewPoLine'
import BackButton from '../../../Component/Buttons/Back'
import {HandlePaymentTerm, FileNotFound, get_po_status_int} from '../../../Actions/Common/Functions'
import {GetGenerateCRPDF} from '../../../Actions/Vendor';
import {UserDetails} from '../../../Common/LocalStorage'
import DliveryOrder from '../DeliveryOrder/DeliveryOrderDetails'
import Modal from '../../../Component/Modal'


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
            status:false,
            checked_initial : [0,1,2],
            checked_details:[],
            updated:true,
            addressCode: true,
            loading:false,
            show_details : true,
            confimation_pop:false ,
            modal_popup : false,
            do_pop_up_details : {},
            active_key : 'PurchaseOrder',
        }
    }


    componentDidMount(){
        var _details = this.props.location.datas
        console.log('componentDidMount', _details)
        this.setState({
            products: _details,
        })
        this.props.GetViewPOClick(_details)
        this.props.GetPoListDetails({poIndex : (_details && _details.PRM_PO_INDEX) ? _details.PRM_PO_INDEX : 0 })
    }

 

    closemodel = () => {
        this.setState({
            model : false,
            modal_popup : false
        })
        if(this.state.status){
            this.props.history.push({
                pathname : '/purchaseorder'
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

    confirm_function = (type, text) => {
        
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })

    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="accept"){
            this.AcceptPo(3)
        }
        else if(_confimation_type=="reject"){
            this.AcceptPo(4)
        }
       

    }

    async AcceptPo(status){
        let obj = {
            "submitPODataList": [{
                "status": status,
                "BCoyID": this.state.products.POM_B_COY_ID,
                "datakey": this.state.products.POM_PO_NO,
                "remark": (this.state.remark) ? this.state.remark : "",
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

    async Acknowledge(status){
        let _temp = (this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getCancelLineitem && this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails) ? this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails : [] 
        let obj =  []

        _temp.forEach((list)=>{
            obj.push({
                "bcomid":list.POD_COY_ID,
                "cr_num":list.PCM_CR_NO,
                "po_no":list.POM_PO_NO,
            })
        })
        
        if(obj.length){
            this.setState({loading:true})
            let _status = await ApiExtract(PoAcknowledgement, obj);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                status: false,
                model:true,
                modal_body: 'No Request To Acknowledge',
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
        let inputData = { 'POM_B_Coy_ID': data.POM_B_COY_ID, 'POM_PO_No': data.POM_PO_NO }
        
        this.props.GetGeneratePOPDF(inputData);
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

    get_dopdf_details(details){
        let temp_details = UserDetails();
        let inputData = { 'DOM_S_COY_ID': (this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_COY_ID:'', 'DOM_DO_NO': details.DOM_DO_NO }
        console.log('get_dopdf_details', details, inputData, temp_details)
        this.props.GetGenerateDOPDF(inputData);
    }

     do_pop_up = async(details) =>{
        if(details.DOM_DO_NO){
            let _details = {
                strDONo:details.DOM_DO_NO,
                IntPOIdx:(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_INDEX  : '',
                strSCoyID:(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CM_COY_ID  : '',
                PONo:(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_NO  : ''
            }

            this.setState({loading:true})
            let _status = await ApiExtract(DODetails, _details);
            if(_status && _status.status){
               this.setState({loading:false})
               this.setState({
                    modal_popup : true,
                    do_pop_up_details : _status.response
               })
            }
        }
    }

    view_pdf = (details) =>{
        console.log('view_pdf', details)
        let _user_details = UserDetails();
        let _details = {}
        _details.DO_Number = details.DOM_DO_NO;
        _details.POM_PO_NO = this.state.products.POM_PO_NO;
        _details.GRN_Number = details.GM_GRN_NO;
        _details.USER_ID = details.GM_B_COY_ID;
        _details.POM_B_COY_ID = details.DOM_S_COY_ID;
        console.log('view_pdf', _details)
        this.props.ViewGRNPDF(_details)
    }

    render(){
        const { handleSubmit } = this.props
        let  _table_header = [
            {name : "Line", id:"POD_PO_LINE", width:'60px' , formatter: (cellContent, row) => {
                return (
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>  </button>
                )
            }},
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'100px', dataFormat:'validatedata'},
            {name : "Item Name", id:"POD_PRODUCT_DESC", width:'144px',key:true},
            {name : "UOM", id:"POD_UOM", width:'80px'},
            {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number"},
            {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
            {name : "SST Amount", id:"POD_GST", width:'110px',formatter: (cellContent, row) => {
                return <div className="text-right">{((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
            }},
            {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'100px', dataFormat:"validatedata"},
           
            {name : "EDD (Date)", id:"POM_PO_DATE", width:'150px',
            formatter: (cellContent, row) => {
                return   (row.POM_PO_DATE) ? addDate(row.POM_PO_DATE, row.POD_ETD) : ''
            }},
            {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'97px',dataFormat:'price'},
            {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'120px', formatter: (cellContent, row) => {
                return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
            }},
            {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
            {name : "Outstd Qty", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
            }},
            {name : "GRN Qty", id:"POD_RECEIVED_QTY",  width:'92px',dataFormat:'price'},
            {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'112px', dataFormat:'price'},
            
           
           
            
            {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ row.POD_D_ADDR_LINE3
            }}
        ];


        const _table_header_do_summary = [
            {name : "DO NO", id:"DOM_DO_NO", width:'125px', formatter: (cellContent, row) => {
                return (
                   (row.DOM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.do_pop_up(row)}>{row.DOM_DO_NO}</button> : ''
                )
            }},
            {name : "DO Creation Date", id:"CREATIONDATE", width:'70px',dataFormat:'date'},
            {name : "DO Submission Date", id:"SUBMITIONDATE", width:'78px',dataFormat:'date'},
            {name : "DO Created By", id:"DOM_CREATED_BY", width:'92px'},
            {name : "GRN No", id:"GM_GRN_NO", width:'125px', key:true, formatter: (cellContent, row) => {
                return (
                    (row.GM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.view_pdf(row)}>{row.GM_GRN_NO}</button>: ''
                )
            }},
            {name : "GRN Date", id:"GM_CREATED_DATE", width:'92px',dataFormat:'date'},
            {name : "GRN Received Date", id:"GM_DATE_RECEIVED", width:'110px',dataFormat:'date'},
            {name : "GRN Created by", id:"GM_CREATED_BY", width:'73px'},
        ];
        

        const _table_header_cancel_summary = [
            {name : "CR NO", id:"PCM_CR_NO", width:'60px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.props.GetGenerateCRPDF({CR_NO:row.PCM_CR_NO, po_no:row.POM_PO_NO, strBCoyID:row.POD_COY_ID})}>{row.PCM_CR_NO}</button>
                )
            }},
            {name : "CR Creation Date", id:"DOM_CREATED_DATE", width:'100px',dataFormat:'date', key:true},
            {name : "CR Created By", id:"DOM_DO_DATE", width:'70px',dataFormat:'date'},
        ];


        if(this.state.products && this.state.products.view_type=='vendor_approve'){
            _table_header = [
                {name : "Line", id:"POD_PO_LINE", width:'60px' ,  formatter: (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>  </button>
                    )
                }},
                {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'100px', dataFormat:'validatedata'},
                {name : "Item Name", id:"POD_PRODUCT_DESC", width:'144px',key:true},
                {name : "UOM", id:"POD_UOM", width:'144px'},
                {name : "EDD (Date)", id:"POM_PO_DATE", width:'150px',
                formatter: (cellContent, row) => {
                    return   (row.POM_PO_DATE) ? addDate(row.POM_PO_DATE, row.POD_ETD) : ''
                }},
                {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'100px',dataFormat:'price'},
                {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'180px', formatter: (cellContent, row) => {
                    return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
                }},
                {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
            ];
        }

        return  <div id="tabs">
        <Tabs defaultActiveKey="PurchaseOrder" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
            if(k=='POListing'){
                this.props.history.push({
                    pathname : 'purchaseorder',
                    redirect_to_tab : 'POListing'
                })
            }
               
        }}>
          <Tab eventKey="PurchaseOrder" title="Purchase Order">
            <div className="tab-content py-3 px-3 px-sm-0">
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.dr_loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.popdf_loading) ? <Loader /> : '' }
                {(this.props.loading_details) ? <Loader /> : '' }
                {(this.props.generate_CRPDF) ? <Loader /> : '' }
                {(this.props.dopdf_loading) ? <Loader /> : '' }
                {(this.props.gpdf_loading) ? <Loader /> : '' }
                
                {(this.state.show_details) ?  
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                <PageHeading 
                    heading="" 
                    subheading="Click the Accept PO button to accept the selected PO. To reject the selected PO, click the Reject PO button" 
                />
                    <TabHeading color={'bg-info text-white'}>Purchase Order Header</TabHeading> 
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PO Number : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_NO  : 'To be Allocated'}  <span>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_URGENT === "1" ? '(Urgent)' : '') :''}</span> </p> </div>
                <div className="col-12 col-md-2 col-lg-2"><label>Status : </label></div>
                            <div className="col"><p> { ((this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length )) ? get_po_status_int(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].STATUS_DESC, this.props.purchase_reqest_approval.get_PODetail.poDEtails[0]) :  (this.state.products) ? get_po_status_int(this.state.products.STATUS_DESC, this.state.products) : ''}</p></div>
                        </div>

                        {(this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="GRNListing") ? 
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PR Number : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].PRNo  : 'To be Allocated'} </p> </div>
                        </div>
                        : ''}

                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Order Date : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval  &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_DATE) ? ddmmyy(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_DATE) :""}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Currency Code : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CM_CURRENCY_CODE:''}</p></div>
                        </div>
                    
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PO Accepted Date : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_ACCEPTED_DATE) ? ddmmyy(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_ACCEPTED_DATE):'To be Allocated by the system'}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Delivery Term : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? ((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME) ?  this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_DEL_CODE+'('+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME+')' : '') :''}</p></div>
                        </div>


                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CM_COY_NAME:''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Ship Via : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIP_VIA) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIP_VIA:'Not Applicable'}</p></div>
                        </div>
                        
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor Address : </label></div>
                            <div className="col"><address>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE1 +" \n"+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE2+" \n"+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE3) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE3 +" \n") : '')+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_POSTCODE+" \n"+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_CITY) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_CITY + " \n") : '')+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorState) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorState+" \n") : '')+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorCountry) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorCountry : ''):''}  </address></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Ship To : </label></div>
                            <div className="col"><address>{this.state.addressCode === true ? (this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_CODE + " \n" + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE1) ? (this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE1+ "\n") : '') + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE2) ? (this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE2+ "\n") : '') + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE3) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE3+ " \n"  : '') + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_POSTCODE + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_CITY + " \n" + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].STATE) ? (this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].STATE + " \n") : '') + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].CT) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].CT : '') : "" : "See Details"}</address></div>
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
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? HandlePaymentTerm(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_TERM):''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Payment Method :    </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_METHOD:''}</p></div>
                        </div>
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Shipment Terms :</label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_TERM:''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Shipment Mode : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_MODE:''}</p></div>
                        </div>
                
                        {(this.state.products && this.state.products.view_type!='vendor_approve') ?
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Internal Remarks : </label></div>
                            <div className="col"><div className="remarks_holder">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_INTERNAL_REMARK:''}</div></div>
                
                            <div className="col-12 col-md-2 col-lg-2"><label>External Remarks : </label></div>
                            <div className="col"><div className="remarks_holder">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</div></div>
                        </div>
                        : ''}

                        
                        {(this.state.products && this.state.products.view_type!='vendor_approve') ?
                        <Fragment>
                            <div  className="row mt-2">
                                <div className="col-12 col-md-2 col-lg-2"><label>Internal Attachment : </label></div>
                                <div className="col">
                                <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile.length >0  && this.props.purchase_reqest_approval.displayAttachFile[0].Text!="No Files Attached") ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                    if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="I") {
                                        return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u><span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                }) : 'No Files Attached'}</p>
                                </div>
                            </div>
                            <div  className="row mt-2">
                                <div className="col-12 col-md-2 col-lg-2"><label>External Attachment : </label></div>
                                <div className="col">
                                <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile.length >0  && this.props.purchase_reqest_approval.displayAttachFile[0].Text!="No Files Attached") ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                    if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="E") {
                                        return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u><span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                }) : 'No Files Attached'}</p>
                                </div>
                            </div>
                        </Fragment>
                        : 
                        <Fragment>
                            <div  className="row mt-2">
                                <div className="col-12 col-md-2 col-lg-2"><label>Remark : </label></div>
                                <div className="col">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</div>
                        
                                <div className="col-12 col-md-2 col-lg-2"><label>Files Attached  : </label></div>
                                <div className="col">
                                <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile.length >0  && this.props.purchase_reqest_approval.displayAttachFile[0].Text!="No Files Attached") ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                    if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="E") {
                                        return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u><span ><i className="fa fa-trash" aria-hidden="true"></i></span></p>
                                    }
                                }) : 'No Files Attached'}</p>
                                </div>
                            </div>
                            </Fragment> }
                            {(this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="GRNListing") ? 
                            <div  className="row mt-2">
                                <div className="col-12 col-md-2 col-lg-2"><label>Vendor's Remarks : </label></div>
                                <div className="col-12 col-md-6 col-lg-6"><textarea disabled={true} as="textarea"  rows="1" className="textarea" onChange={(e)=>{
                                    this.setState({
                                        remark:e.target.value
                                    })
                                }}/></div>
                            </div>
                            :  <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor's Remarks : </label></div>
                            <div className="col-12 col-md-6 col-lg-6"><textarea as="textarea"  rows="1" className="textarea" onChange={(e)=>{
                                this.setState({
                                    remark:e.target.value
                                })
                            }}/></div>
                        </div> }

                        <div className='col-12' className="mb-2 mt-2">
                            <a onClick={FileNotFound} target="_blank" style={{textDecoration:'underline', color:'blue'}}>Click here</a> to download the Term & Conditions document</div> 
                            <TabHeading color={'bg-info text-white margin-bottom-none'}>Purchase Order Line Details</TabHeading>
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

                            {(this.props.location && this.props.location.datas && this.props.location.datas.frompage=="issueGrn") ? <Fragment>
                            <TabHeading color={'bg-info text-white margin-bottom-none'}>DO And GRN Summary</TabHeading> 
                            <BootstrapCustomTable 
                                table_header={_table_header_do_summary} 
                                table_body={(this.props.po_line_details && this.props.po_line_details.length >0) ? this.props.po_line_details : [] } 
                                products={this.getProducts} 
                                select={false} 
                                selectname={'pr_no'} 
                                responsive={true} 
                                click={true}
                                search={false}
                                table_name="issue_grn"
                                get_details = {this.get_details}
                            />
                        </Fragment> : '' }

                            {(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getCancelLineitem && this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails && this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails.length>0) ?
                            <Fragment>
                                <TabHeading color={'bg-info text-white margin-bottom-none'}>Cancellation Request Summary</TabHeading> 
                                <BootstrapCustomTable 
                                    table_header={_table_header_cancel_summary} 
                                    table_body={(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getCancelLineitem && this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails) ? this.props.purchase_reqest_approval.getCancelLineitem.cancelLineitemDetails : [] } 
                                    products={this.getProducts} 
                                    select={false} 
                                    selectname={'pr_no'} 
                                    responsive={true} 
                                    click={true}
                                    search={false}
                                    table_name="issue_grn"
                                    get_details = {this.get_details}
                                />
                            </Fragment>
                            : ''}
                        

                        
                            <div className="mt-2 row">
                            <div className="col-12 col-sm-6 text-left go-back">
                                <div className="row">
                                    <BackButton back_data={(this.props.location  && this.props.location.redirect_to_page) ? true : false}  {...this.props.location} goBack={this.props.history} history={this.props.history}/>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="mt-2 mb-5 justify-content-end row">
                                    {(this.props.location && this.props.location.datas && this.props.location.datas.frompage!=="issueGrn" && (this.state.products!="" && this.state.products.STATUS_DESC!="Cancelled")) ? <Fragment>
                                        <div className="col-lg-auto col-md"> <button type="button" className="btn btn-outline-info btn-sm" onClick={()=>this.AcceptPo(3)} >Accept PO</button></div>
                                        <div className="col-lg-auto col-md-auto"><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.confirm_function('reject', 'reject this PO')} >Reject PO</button></div>
                                    </Fragment> : '' }
                                    {(this.props.location && this.props.location.datas && this.props.location.datas.frompage!=="issueGrn" && (this.state.products!="" && this.state.products.STATUS_DESC=="Cancelled")) ? <Fragment>
                                    <div className="col-lg-auto col-md-auto"><button type="button" className="btn btn-outline-primary btn-sm" onClick={() => this.Acknowledge()} >Acknowledge</button></div>
                                    </Fragment> : '' }
                                    <div className="col-lg-auto col-md-auto"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>this.GetGeneratePOPDF((this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0] : [])}>View PO</button></div>
                                
                                </div>       
                            </div>    
                        </div>   
                    </form> : <ViewPoLine search_list={this.props.search_list} close_view ={this.close_details} />}
                    <Alert 
        
                        message={this.state.modal_body} 
                        status={this.state.status} 
                        show={this.state.model} 
                        confirm={this.closemodel}
                    />
                    <ConfirmationModel
                        title="" 
                        confimation = {true}
                        message={this.state.modal_body} 
                        status={this.state.status} 
                        show={this.state.confimation_pop} 
                        onConfirm={(e)=>this.onConfirm()}
                        onCancel = {this.onCancel}
                    />
                    <Modal size="xl" open={this.state.modal_popup} header ={true} title ={'Delivery Order Details'} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                        <button type='button' size={this.state.pop_size} className='btn btn-outline-primary btn-sm' onClick={ this.emptyPopupSelectedProduct }>Save</button>
                        <button type='button' size={this.state.pop_size} className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                        <Fragment>
                            <DliveryOrder 
                                 DOAttachment = {(this.state.do_pop_up_details && this.state.do_pop_up_details.DOAttachment) ? this.state.do_pop_up_details.DOAttachment : []}
                                 dsAllInfo = {(this.state.do_pop_up_details && this.state.do_pop_up_details.dsAllInfo && this.state.do_pop_up_details.dsAllInfo.DOReport) ? this.state.do_pop_up_details.dsAllInfo.DOReport : []}
                                 dsDOSumm  = {(this.state.do_pop_up_details && this.state.do_pop_up_details.dsDOSumm) ? this.state.do_pop_up_details.dsDOSumm : []}
                            />
                        </Fragment>
                    </Modal>
                </div>
            </Tab>
            <Tab eventKey="POListing" title="PO Listing">
                 <div className="tab-content py-3 px-3 px-sm-0"></div>
            </Tab>
        </Tabs>
      </div>
    }
}





 const mapStateToProps = state => ({
    status_props : state.view_po_click.status,
    purchase_reqest_approval : state.view_po_click.responseList,
    loading:state.view_po_click.loading,
    dr_loading : state.file_download.loading,
    popdf_loading : state.generate_popdf.loading,
    search_list : state.po_line_item.responseList,
    loading_details : state.po_line_item.loading,
    po_line_details : state.po_line_details.responseList,
    generate_CRPDF : state.generate_CRPDF.loading,
    dopdf_loading : state.generate_dopdf.loading,
    gpdf_loading : state.generate_grnpdf.loading,
  })

  
  
  const mapDispatchToProps = dispatch => ({
    ResetApprovalFrom  : () => dispatch(reset('PurchaseOrderDetails')),
    GetViewPOClick : (values) => dispatch(GetViewPOClick(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    GetDownloadFile : (values) => dispatch(GetDownloadFile(values)),
    GetPolineDetails : (values) => dispatch(GetPolineDetails(values)),
    GetPoListDetails : (values) => dispatch(GetPoListDetails(values)),
    GetGenerateCRPDF : (values) => dispatch(GetGenerateCRPDF(values)),
    GetGenerateDOPDF  : (values) => dispatch(GetGenerateDOPDF(values)),
    ViewGRNPDF  : (values) => dispatch(GetViewGRNPDF(values)),
  })
  
  
const PurchaseHolder = connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderDetails);
export default reduxForm({
    form:'PurchaseOrderDetails',
})(PurchaseHolder);
