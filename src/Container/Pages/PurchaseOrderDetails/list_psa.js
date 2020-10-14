import React, {Component, Fragment} from 'react';
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
import BackButton from '../../../Component/Buttons/Back'
import { Tabs, Tab } from 'react-bootstrap';
import {getPOStatus, getstrStatus, HandlePaymentTerm, getPOStatusLsiting} from '../../../Actions/Common/Functions'



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
            active_key:'ApprovalRejected',
        }
    }


    componentDidMount(){
        var _details = this.props.location.datas
        this.setState({
            products: this.props.location.datas,
        })
         this.props.GetViewPOClick(this.props.location.datas)
       
        if(_details && _details.POM_PO_INDEX){
            this.props.GetPoListDetails({poIndex : (_details && _details.POM_PO_INDEX) ? _details.POM_PO_INDEX : 0 })
        }
        else if(_details && _details.PRM_PO_INDEX){
            this.props.GetPoListDetails({poIndex : (_details && _details.PRM_PO_INDEX) ? _details.PRM_PO_INDEX : 0 })
        }
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
         const { handleSubmit } = this.props
         let _user_details = UserDetails()
         let _table_header = [];
         const _table_header_do_summary = [
            {name : "DO NO", id:"DOM_DO_NO", type:'index', width:'60px', key:true},
            {name : "DO Creation Date", id:"CREATIONDATE", width:'100px',dataFormat:'date'},
            {name : "DO Submission Date", id:"SUBMITIONDATE", width:'70px',dataFormat:'date'},
            {name : "DO Created By", id:"DOM_CREATED_BY", width:'60px'},
            {name : "GRN No", id:"GM_GRN_NO", width:'95px'},
            {name : "GRN Date", id:"GM_CREATED_DATE", width:'92px',dataFormat:'date'},
            {name : "GRN Received Date", id:"GM_DATE_RECEIVED", width:'110px',dataFormat:'date'},
            {name : "GRN Created by", id:"GM_CREATED_BY", width:'132px'},
        ];

        if(this.props && this.props.location && this.props.location.page_name=='ConvertPRListing'){
            _table_header = [
                {name : "Line", id:"POD_PO_LINE", width:'60px' , formatter: (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                    )
                }},
                {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata", key:true},
                {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
                {name : "UOM", id:"POD_UOM", width:'100px'},
                {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number"},
                {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
                {name : "SST Amount", id:"POD_GST", width:'110px',formatter: (cellContent, row) => {
                    return <div className="text-right">{((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
                }},
                {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'127px', dataFormat:"validatedata"},
                {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'150px', dataFormat:"price"},
                {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'110px', formatter: (cellContent, row) => {
                    return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
                }},
                {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
                {name : "Outstd Qty", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
                }},
                {name : "GRN Qty", id:"POD_RECEIVED_QTY",  width:'92px',dataFormat:'price', formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_RECEIVED_QTY - row.POD_REJECTED_QTY).toFixed(2)}</div>
                }},
                {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'119px', dataFormat:'price'},
                {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                    return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ row.POD_D_ADDR_LINE3
                }},
                {name : "Remarks", id:"POD_REMARK", width:'100px'},
            ]
           
        }


        else if(this.props && this.props.location && (this.props.location.page_name=='pos_listing')){
            _table_header = [
                {name : "Line", id:"POD_PO_LINE", width:'60px' ,  formatter: (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                    )
                }},
                {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata"},
                {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
                {name : "UOM", id:"POD_UOM", width:'100px'},
                {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number"},
                {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
                {name : "SST Amount", id:"POD_GST", width:'110px',formatter: (cellContent, row) => {
                    return <div className="text-right">{((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
                }},
                {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'127px', dataFormat:"validatedata"},

                {name : "Gift", id:"GIFT", width:'100px', key:true},
                {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px'},
                {name : "Person Code (L9)", id:"PERSONCODE", width:'144px',dataFormat:"validatedata"},
                {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px',dataFormat:"validatedata"},
               
                {name : "GL Description (GL Code)", id:"GL_CODE", width:'144px' },
                {name : "Category Code", id:"POD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
                {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'150px', dataFormat:"price"},
                {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'110px', formatter: (cellContent, row) => {
                    return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
                }},
                {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
                {name : "Outstd Qty", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
                }},
                {name : "GRN Qty", id:"POD_RECEIVED_QTY",  width:'92px',formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_RECEIVED_QTY - row.POD_REJECTED_QTY).toFixed(2)}</div>
                }},
                {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'119px', dataFormat:'price'},
                {name : "Cost Centre Code (L7)", id:"costCentre", width:'100px',formatter: (cellContent, row) => {
                    return 'DP0112-Dept-Compliance:HCM'
                }},
                {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                    return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ row.POD_D_ADDR_LINE3
                }},
                {name : "Remarks", id:"POD_REMARK", width:'100px'},

            ];
        }

        else if(this.props && this.props.location && (this.props.location.page_name!='poslisting')){
            _table_header = [
                {name : "Line", id:"POD_PO_LINE", width:'60px' ,  formatter: (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                    )
                }},
                {name : "Gift", id:"GIFT", width:'100px', key:true},
                {name : "Fund Type (L1)", id:"FUNDTYPE", width:'100px'},
                {name : "Person Code (L9)", id:"PERSONCODE", width:'144px',dataFormat:"validatedata"},
                {name : "Project / ACR (L8) Code", id:"PROJECTCODE", width:'144px',dataFormat:"validatedata"},
                {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata"},
                {name : "GL Description (GL Code)", id:"GL_CODE", width:'144px' },
                {name : "Category Code", id:"POD_B_CATEGORY_CODE", width:'100px', dataFormat:"validatedata"},
                {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
                {name : "UOM", id:"POD_UOM", width:'100px'},
                // {name : "Quantity", id:"POD_ORDERED_QTY", width:'100px', dataFormat:"price"},
               
    
                {name : "Unit Price", id:"POD_UNIT_COST", width:'100px', dataFormat:"number"},
                {name : "SST Rate", id:"GST_RATE", width:'100px', dataFormat:"validatedata"},
                {name : "SST Amount", id:"POD_GST", width:'110px',formatter: (cellContent, row) => {
                    return <div className="text-right">{((row.POD_GST) ? ((row.POD_ORDERED_QTY * row.POD_UNIT_COST) * (row.POD_GST/100)) : 0).toFixed(2)}</div>
                }},
                {name : "SST Tax Code (Purchase) (L6)", id:"PRD_GST_INPUT_TAX_CODE", width:'127px', dataFormat:"validatedata"},
                {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'150px', dataFormat:"price"},
                {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'110px', formatter: (cellContent, row) => {
                    return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
                }},
                {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
                {name : "Outstd Qty", id:"POD_ORDERED_QTY", width:'80px', formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_ORDERED_QTY - row.POD_DELIVERED_QTY - row.POD_CANCELLED_QTY).toFixed(2)}</div>
                }},
                {name : "GRN Qty", id:"POD_RECEIVED_QTY",  width:'92px',formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_RECEIVED_QTY - row.POD_REJECTED_QTY).toFixed(2)}</div>
                }},
                {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'119px', dataFormat:'price'},
                {name : "Cost Centre Code (L7)", id:"costCentre", width:'100px',formatter: (cellContent, row) => {
                    return 'DP0112-Dept-Compliance:HCM'
                }},
                {name : "Delivery Address", id:"POD_D_ADDR_CODE", width:'150px',formatter: (cellContent, row) => {
                    return row.POD_D_ADDR_LINE1 +' '+ row.POD_D_ADDR_LINE2 +' '+ row.POD_D_ADDR_LINE3
                }},
                // {name : "Est. Date of Delivery", id:"POD_D_ADDR_CODE", width:'100px',formatter: (cellContent, row) => {
                //     return addDate(this.state.products.POM_SUBMIT_DATE, row.POD_ETD)
                // }},
               
                // {name : "Segmentation", id:"PCD_FIELD_VALUE", width:'100px'},
                // {name : "Test", id:"POD_WARRANTY_TERMS", width:'100px',formatter: (cellContent, row) => {
                //     return '10'
                // }},
                {name : "Remarks", id:"POD_REMARK", width:'100px'},
            ];
        }
        else{
            _table_header = [
                {name : "Line", id:"POD_PO_LINE", width:'60px' , formatter: (cellContent, row) => {
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POD_PO_LINE} <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                    )
                }},
                {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'122px', dataFormat:"validatedata", key:true},
                {name : "Item Name", id:"POD_PRODUCT_DESC", width:'150px'},
                {name : "UOM", id:"POD_UOM", width:'100px'},
                {name : "Est. Date of Delivery", id:"POD_D_ADDR_CODE", width:'100px',formatter: (cellContent, row) => {
                    return addDate(this.state.products.POM_SUBMIT_DATE, row.POD_ETD)
                }},
                {name : "MPQ", id:"POD_MIN_PACK_QTY", width:'100px', dataFormat:"price"},
                {name : "Warranty Terms (mths)", id:"POD_WARRANTY_TERMS", width:'110px', formatter: (cellContent, row) => {
                    return <div className="text-right">{row.POD_WARRANTY_TERMS}</div>
                }},
                {name : "PO Qty", id:"POD_ORDERED_QTY", width:'84px', dataFormat:'price'},
                {name : "GRN Qty", id:"POD_RECEIVED_QTY",  width:'92px',formatter: (cellContent, row) => {
                    return <div className="text-right">{parseFloat(row.POD_RECEIVED_QTY - row.POD_REJECTED_QTY).toFixed(2)}</div>
                }},
                {name : "Rejected Qty", id:"POD_REJECTED_QTY", width:'119px', dataFormat:'price'},
            ]
        }
       
        
        
        
        return <div id="tabs">
        <Tabs defaultActiveKey="ApprovalList" transition={false} id="tabs" activeKey={this.state.active_key} onSelect={k => {
              this.setState({active_key:k})
              if(k=="ApprovalList"){
                  this.props.history.push({
                     pathname : 'approvepr',
                     redirect_to_tab : 'ApprovalList'
                  })
              }
           }
        }>
         <Tab eventKey="ApprovalList" title="Approval List">
            <div className="tab-content py-3 px-3 px-sm-0">
            </div>
          </Tab>
         <Tab eventKey="ApprovalRejected" title="Approved / Rejected Listing">
            <div className="tab-content py-3 px-3 px-sm-0">
                <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.dr_loading) ? <Loader /> : '' }
                {(this.state.loading) ? <Loader /> : '' }
                {(this.props.popdf_loading) ? <Loader /> : '' }
                {(this.props.loading_details) ? <Loader /> : '' }
                
                
                {(this.state.show_details) ?  
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                <TabHeading color={'bg-info text-white'}>Purchase Order Header</TabHeading> 
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PO Number : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PO_NO : ''} {(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length > 0 && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_URGENT==1 ) ? '(Urgent)' : ''}</p></div>
                            {((this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="POListing") ) ?<Fragment>
                                <div className="col-12 col-md-2 col-lg-2"><label>Status :  </label></div>
                                <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? getPOStatusLsiting(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0]) :''} </p></div>
                            </Fragment> : (this.props.location && this.props.location.redirect_to_tab && this.props.location.redirect_to_tab=="ApprovedRejectedListing") ? <Fragment>
                                <div className="col-12 col-md-2 col-lg-2"><label>Status :  </label></div>
                                <div className="col"><p>{(this.state.products) ? this.state.products.STATUS :''} </p></div>
                            </Fragment>  :<Fragment>
                                <div className="col-12 col-md-2 col-lg-2"><label>Status :  </label></div>
                                <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? getstrStatus(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].STATUS_DESC) :''} </p></div>
                            </Fragment>
                            }
                        </div>


                        
                        {(this.state.products && this.state.products.from_page && this.state.products.from_page=="pr_listing") ?  <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PR Number : </label></div>
                            <div className="col"><p>{this.state.products.PR_NO}</p></div>
                        </div> :''}


                        {(this.state.products && this.state.products.page_name && this.state.products.page_name=="ConvertPRListing") ?  <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>PR Number : </label></div>
                            <div className="col"><p>{this.state.products.PR_NO}</p></div>
                        </div> :''}

                        

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
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? ((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME && this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME) ?  this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_DEL_CODE+'('+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].CDT_DEL_NAME+')' : '') :''}</p></div>
                        </div>
                        


                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_COY_NAME:''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Ship Via : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_MODE:''}</p></div>
                        </div>
                        
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor Address : </label></div>
                            <div className="col"><address>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE1 +" \n"+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE2+" \n"+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE3) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_ADDR_LINE3 +" \n") : '')+this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_POSTCODE+" \n"+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_CITY) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_CITY + " \n") : '')+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorState) ? (this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorState+" \n") : '')+((this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorCountry) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].VendorCountry : ''):''}  </address></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Ship To : </label></div>
                            <div className="col"><address>{this.state.addressCode === true ? (this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem && this.props.purchase_reqest_approval.getlineitem.lineitemDetails && this.props.purchase_reqest_approval.getlineitem.lineitemDetails.length) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_CODE + " \n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE1 + "\n" + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE2 + " \n" + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE3) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_ADDR_LINE3+ " \n" : '')  + this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_POSTCODE + " \n" + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_CITY) ? (this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].POD_D_CITY+ " \n") : '') + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].STATE) ? (this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].STATE+ " \n") : "") + ((this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].CT) ? this.props.purchase_reqest_approval.getlineitem.lineitemDetails[0].CT : '') : "" : "See Details"}</address></div>
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
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? HandlePaymentTerm(this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_TERM) :''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Payment Method :    </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_PAYMENT_METHOD:''}</p></div>
                        </div>
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Shipment Terms :</label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_TERM:''}</p></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>Shipment Mode : </label></div>
                            <div className="col"><p>{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_SHIPMENT_MODE:''}</p></div>
                        </div>
                        {(this.state.products && this.state.products.page_name &&  (this.state.products.page_name=="vendor_po_listing" )) ?
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Remarks : </label></div>
                            <div className="col-12 col-md-6 col-lg-4">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</div>

                            <div className="col-12 col-md-2 col-lg-2"><label>Files Attached : </label></div>
                            <div className="col">
                            <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile[0] && this.props.purchase_reqest_approval.displayAttachFile[0].Text !== 'No Files Attached') ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="E") {
                                    return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u></p>
                                }
                            }) : 'No files attached'}</p>
                            </div>
                        </div>
                        
                        :
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Internal Remarks :</label></div>
                            <div className="col"><div className="remarks_holder">{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_INTERNAL_REMARK:''}</div></div>
                            <div className="col-12 col-md-2 col-lg-2"><label>External Remarks : </label></div>
                            <div className="col"><div className="remarks_holder" >{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_EXTERNAL_REMARK:''}</div></div>
                        </div>
                        }
                    
                    
                    {(this.state.products && this.state.products.page_name &&  this.state.products.page_name=="vendor_po_listing") ?
                        '' :
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Internal Files Attached : </label></div>
                            <div className="col">
                            <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile[0] && this.props.purchase_reqest_approval.displayAttachFile[0].Text !== 'No Files Attached') ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="I") {
                                    return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u></p>
                                }
                            }) : 'No files attached'}</p>
                            </div>

                            <div className="col-12 col-md-2 col-lg-2"><label>External Files Attached : </label></div>
                            <div className="col">
                            <p>{(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.displayAttachFile && this.props.purchase_reqest_approval.displayAttachFile[0] && this.props.purchase_reqest_approval.displayAttachFile[0].Text !== 'No Files Attached') ? this.props.purchase_reqest_approval.displayAttachFile.map((list, index) => {
                                if (list.Text !== 'No Files Attached' && list.CDA_TYPE=="E") {
                                    return <p className="download-files"><u><span onClick={()=>this.download_files(list)}>{list.strFile} &nbsp;&nbsp;</span></u></p>
                                }
                            }) : 'No files attached'}</p>
                            </div>
                        </div>
                        }
                        <div  className="row mt-2">
                            <div className="col-12 col-md-2 col-lg-2"><label>Vendor's Remarks : </label></div>
                            <div className="col-12 col-md-6 col-lg-6"><div className="remarks_holder" >{(this.props.purchase_reqest_approval &&  this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail && this.props.purchase_reqest_approval.get_PODetail.poDEtails.length ) ? this.props.purchase_reqest_approval.get_PODetail.poDEtails[0].POM_S_REMARK:''}</div></div>
                            
                        
                        </div>
                        <div className='col-12' className="mb-2 mt-2"><a target="_blank" style={{textDecoration:'underline', color:'blue'}}>Click here</a> to download the Term & Conditions document</div> 
                    
                            {(this.props.purchase_reqest_approval && this.props.purchase_reqest_approval.approvalFlow && this.props.purchase_reqest_approval.approvalFlow.approvalFlowDetails && this.props.purchase_reqest_approval.approvalFlow.approvalFlowDetails.length>0) ? 
                            <Fragment>
                            <TabHeading color={'bg-info text-white margin-botton-none'}> Approval Flow </TabHeading> 
                            <div className="row">    
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
                                            {this.props.purchase_reqest_approval.approvalFlow.approvalFlowDetails.map((data, index) =>
                                                <tr key={index}  className={(_user_details.UM_USER_NAME==data.AO_NAME  || _user_details.UM_USER_NAME==data.AAO_NAME) ? 'bold_row' : ''}>
                                                    <td>{data.PRA_SEQ}</td>
                                                    <td>{data.AO_NAME}</td>
                                                    <td>{(data.AAO_NAME) ? data.AAO_NAME : '-'}</td>
                                                    <td>{data.PRA_APPROVAL_TYPE === '2' ? 'Endorsement' : 'Approval'}</td>
                                                    <td>{data.PRA_ACTION_DATE !== null ? TodayDateSalash(data.PRA_ACTION_DATE) : ''}</td>
                                                    <td>{data.PRA_AO_REMARK}</td>
                                                    <td>{data.userAttachFileList && data.userAttachFileList.map((val, index) => {
                                                        return <p><u><span onClick={() => this.download_files(val, 'inter')}>{val.strFile} &nbsp;&nbsp;</span></u> </p>
                                                    })}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </Fragment> : ''}

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
                        
                            {(this.props.location && this.props.location.datas && this.props.location.datas.Status!="New" && this.props.location.page_name!='poslisting' && this.props.location.page_name!='pos_listing' && this.props.location.page_name!="ConvertPRListing" ) ? 
                            <Fragment>
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
                            </Fragment> : ''}



                            {(this.props.location && this.props.location.datas && this.props.location.page_name=='pos_listing' && (this.props.po_line_details && this.props.po_line_details.length >0)) ? 
                            <Fragment>
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
                            </Fragment> : ''}

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
            </div>
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
