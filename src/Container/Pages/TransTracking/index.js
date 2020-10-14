import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTable'
import {GetTransTrackingList, GetGeneratePOPDF, GetViewGRNPDF} from '../../../Actions/Vendor'
import {GetGenerateDOPDF, GetInvoicePDF,GetGenerateDEBITPDF, GetGenerateCREDITPDF,} from '../../../Actions/Requester'
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import {FromInputsParallel, FormDatePickerParallel, FromSelectParallel, FromSelect} from '../../../Component/From/FromInputs'
import {FromateDate, DateMinus, convertDateToYear, TodayDateSalash, CompareDate, FromateDate_YY_MM_DD} from '../../../Component/Dates'
import {RemoveSpecialCharacter} from '../../../Actions/Common/Functions'
import {UserDetails} from '../../../Common/LocalStorage'
import {get_po_status_int} from '../../../Actions/Common/Functions'
import DliveryOrder from '../DeliveryOrder/DeliveryOrderDetails'
import Modal from '../../../Component/Modal'
import {ApiExtract} from '../../../Common/GetDatas'
import { DODetails} from '../../../Apis/Vendor'

class TransTracking extends Component {
    constructor(props){
        var _date = new Date();
        _date.setMonth(_date.getMonth() - 6);
        super(props);
        this.closemodel = this.closemodel.bind(this);
      
       
    
        this.state = {
            products:[],
            start_data:_date,
            render:false,
            end_data:new Date(),
            title:'',
            view_by : 'RFQ',
            message:'',
            status:false,
            show:false,
            checked_initial : [0,1,2],
            checked_details:[],
            list: [],
            submit_type:'',
            show_details : '',
            confimation_pop:false ,
            country : [],
            modal_title:'',
            modal_body:'',
            model:false,
            status:true,
            show_table :false,
            edit_details : {},            
            country_name : '',
            state_name : '',
            approve_type: '',
            hm_country:'MY',
            modal_popup : false,
            search_object : {
                hm_country: "",
                hm_state: "All",
                hm_year:new Date().getFullYear()
            },
            modify_details : {}
            
          
        }
    }

    componentDidMount(){
        let _user_details = UserDetails();
        this.props.GetTransTrackingList()
        this.props.reset('TransTracking')
        var _date = new Date();
        _date.setMonth(_date.getMonth() - 6);
        this.props.change('dteDateFr', _date);
        this.props.change('dteDateTo', new Date()); 
        if(_user_details.ROLE_NAME=="Vendor" || _user_details.ROLE_NAME=="vendor" || _user_details.ROLE_NAME=="VENDOR"){
            this.setState({
                approve_type:'vendor',
                view_by : 'PO'
            })
        }
    }

    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status && this.state.submit_type=="delete"){
            this.handlefromsubmit()
        }
    }

    handleDate = (name, date) =>{
        if(name=="start_date"){
             this.setState({
                 start_data: (date) ? date : '',
             })
        }
        else if(name=="end_date"){
             this.setState({
                 end_data: (date) ? date : '',
             })
        }
     }

     get_details = (details) =>{
     
        let _user_details = UserDetails();
        let _send_details = { "POM_PO_NO": details.POM_PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.POM_S_COY_ID , "PRM_PO_INDEX": details.POM_PO_INDEX, STATUS: details.STATUS_DESC, PR_NO: details.PRM_PR_No, page_name:"poslisting"}           
        this.props.history.push({
            pathname : '/po_tracking_details',
            datas : _send_details,
            page_name : 'pos_listing',
        })
     }

    handlefromsubmit(values){
        let _user_details = UserDetails()
        let _form_value = values;
        let _initial_obj = {
            coyType:"BUYER",
            viewBy:this.state.view_by,
            strDocNo:"",
            strVendor:"",
            dteDateFr:"",
            dteDateTo:"",
            strBuyer:"",
            strDept:""
        }
       
        if(_user_details.ROLE_NAME=="Vendor" || _user_details.ROLE_NAME=="vendor" || _user_details.ROLE_NAME=="VENDOR"){
            _initial_obj.coyType="VENDOR"
        }


        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.startDate = (_form_value.startDate  && _form_value.startDate!="Invalid date") ? convertDateToYear(_form_value.startDate) : ''
        _form_value.endDate = (_form_value.endDate && _form_value.endDate!="Invalid date") ? convertDateToYear(_form_value.endDate) : ''
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetTransTrackingList(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.GetTransTrackingList(_form_value)
        }
      
    }


    ClearAll = () => {
        this.setState({
            start_data:'',
            end_data : ''
        })
        this.props.reset('PoTrackingHolder')
    } 

    handleSelectChange = (value) =>{
      this.setState({
        view_by : value
      })
    }

    view_do_pdf = (details) =>{
        let inputData = { 'DOM_S_COY_ID': details.CDM_S_COY_ID, 'DOM_DO_NO': details.CDM_DO_NO }
        this.props.get_generate_dopdf(inputData);
    }

    view_po_pdf = (details) =>{
        let _data = { 'POM_B_Coy_ID': details.POM_B_COY_ID, 'POM_PO_No': details.CDM_PO_NO }
        this.props.GetGeneratePOPDF(_data);
    }

    view_inv_pdf = (details) =>{
        let _data = { 'POM_S_COY_ID': (details.CDM_S_COY_ID) ? details.CDM_S_COY_ID : details.IM_S_COY_ID, 'POM_B_COY_ID': details.POM_B_COY_ID, 'IM_INVOICE_NO': details.CDM_INVOICE_NO }
    
        this.props.GetInvoicePDF(_data)
    }

    view_grn_pdf = (details) =>{
        let _temp_details = {POM_B_COY_ID: (details.CDM_S_COY_ID) ? details.CDM_S_COY_ID : details.IM_S_COY_ID, USER_ID: details.CDM_B_COY_ID ? details.CDM_B_COY_ID : details.POM_B_COY_ID, DO_Number:details.CDM_DO_NO, POM_PO_NO:details.CDM_PO_NO, GRN_Number:details.CDM_GRN_NO}
        console.log('view_inv_pdf',_temp_details, details)
        this.props.GetViewGRNPDF(_temp_details)
    }

    get_details(details){
        details.view_type='vendor_approve'
        this.props.history.push({
            pathname : '/purchaseorderDetails',
            datas : details,
        })
    }

    do_pop_up = async(details) =>{
       
        if(details.CDM_DO_NO){
            let _details = {
                strDONo:details.CDM_DO_NO,
                IntPOIdx:details.DOC_INDEX,
                strSCoyID:details.VEN_ID,
                PONo:details.CDM_PO_NO
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

    get_generate_debit_pdf = (details) =>{
        let _details = {"DN_NO":details.DNM_DN_NO, "DN_SCoyID": details.VEN_ID, "DN_BCoyID":details.POM_B_COY_ID}
        this.props.GetGenerateDEBITPDF(_details)
    }

    get_generate_credit_pdf = (details) =>{
        let _details = {'CN_NO': details.CNM_CN_NO, 'CN_BCoyID': details.POM_B_COY_ID, 'CN_SCoyID':  details.VEN_ID}
        this.props.GetGenerateCREDITPDF(_details)
    }

    view_pr_details = (details) =>{
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                PRM_PR_Index :  details.DOC_INDEX,
                PRM_PR_No :  details.DOC_NO,
            },
        })
    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_body:'',
            modal_popup : false,
        })
    }

    get_po_details = (details) => {
        let _user_details = UserDetails();
        let _send_details = { "POM_PO_NO": details.DOC_NO, "POM_B_COY_ID": details.POM_B_COY_ID, "POM_S_COY_ID": details.VEN_ID , "PRM_PO_INDEX": details.DOC_INDEX, STATUS: details.STATUS_DESC, PR_NO:'', page_name:"poslisting"}           
        console.log('_user_details', _send_details)
        this.props.history.push({
            pathname : '/po_tracking_details',
            datas : _send_details,
            page_name : 'pos_listing',
        })
    }
   
    render(){
        let {approve_type} = this.state
        const { handleSubmit } = this.props
        let _table_header = [
            {name : "PO No", id:"POM_PO_NO", type:"button", width:'30px',key:true,
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POM_PO_NO} </button>
                )
            }},
            {name : "PO Creation Date", id:"POM_CREATED_DATE", width:'30px', dataFormat:'date'},
            {name : "PO Date", id:"POM_PO_DATE", width:'30px', dataFormat:'date'},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'30px', dataFormat:'text'},
            {name : "PO Accepted Date", id:"POM_ACCEPTED_DATE", width:'30px', dataFormat:'date'},
            {name : "Converted By", id:"NAME1", width:'30px'},
            {name : "PO Status", id:"hm_date", width:'30px',
            formatter: (cellContent, row) => {
                return (
                    <div>{get_po_status_int(row.STATUS_DESC, row)}</div>
                )
            }},
           
            {name : "PR No.", id:"PR_NO", width:'30px'},
        ];
        if(this.state.view_by=="PO"){
            if(approve_type=='vendor'){
                _table_header = [
                    {name : "PO Number", id:"POM_PO_NO", type:"button", width:'40px',key:true,
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_PO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.CDM_PO_NO} </button> :''
                        )
                    }},
                    {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
                    {name : "Buyer Company", id:"COY_NAME", width:'30px'},
                    {name : "Amount", id:"COST", width:'30px', dataFormat:'price'},
                    {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
                    {name : "CR Number", id:"PCM_CR_NO", width:'30px'},
                    {name : "DO Number", id:"CDM_DO_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_do_pdf(row)}>{row.CDM_DO_NO} </button> : ''
                        )
                    }},
                    {name : "GRN Number", id:"CDM_GRN_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button>: ''
                        )
                    }},
                    {name : "INV Number", id:"CDM_INVOICE_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_inv_pdf(row)}>{row.CDM_INVOICE_NO} </button>: ''
                        )
                    }},
                    {name : "DN / DA Number", id:"DNM_DN_NO", width:'35px' ,
                    formatter: (cellContent, row) => {
                        return (
                            (row.DNM_DN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_debit_pdf(row)}>{row.DNM_DN_NO} </button>: ''
                        )
                    }},
                    {name : "CN / CA Number", id:"CNM_CN_NO", width:'35px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CNM_CN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_credit_pdf(row)}>{row.CNM_CN_NO} </button>: ''
                        )
                    }},
                ]; 
            }
            else{
                _table_header = [
                    {name : "PO Number", id:"DOC_NO", type:"button", width:'40px',key:true,
                    formatter: (cellContent, row) => {
                        return (
                            (row.DOC_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_po_details(row)}>{row.DOC_NO} </button> :''
                        )
                    }},
                    {name : "PR No.", id:"PR_NO", width:'30px'},
                    {name : "Buyer Name", id:"PR_NO", width:'30px'},
                    {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
                    {name : "Vendor Company", id:"COY_NAME", width:'35px'},
                    
                    {name : "Amount", id:"COST", width:'30px', dataFormat:'price'},
                    {name : "Purchaser Name", id:"BUYER", width:'35px'},
                    {name : "Dept.", id:"DEPT", width:'30px'},
                    {name : "CR Number", id:"PCM_CR_NO", width:'30px'},
                    {name : "DO Number", id:"CDM_DO_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.do_pop_up(row)}>{row.CDM_DO_NO} </button> : ''
                        )
                    }},
                    {name : "GRN Number", id:"CDM_GRN_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button>: ''
                        )
                    }},
                    {name : "INV Number", id:"CDM_INVOICE_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" >{row.CDM_INVOICE_NO} </button>: ''
                        )
                    }},
                ]; 
            }
        }
        else if(this.state.view_by=="DO"){
            _table_header = [
               {name : "DO Number", id:"POM_PO_NO", type:"button", width:'40px',key:true,
                formatter: (cellContent, row) => {
                    return (
                        (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_do_pdf(row)}>{row.CDM_DO_NO} </button> : ''
                    )
                }},
               {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
               {name : "Buyer Company", id:"COY_NAME", width:'30px'},
               {name : "Amount", id:"COST", width:'30px', dataFormat:'price'},
               {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
               {name : "PO Number", id:"POM_PO_NO", type:"button", width:'40px',
                formatter: (cellContent, row) => {
                   return (
                       <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.CDM_PO_NO} </button>
                   )
               }},
               
               {name : "GRN Number", id:"CDM_GRN_NO", width:'40px',
               formatter: (cellContent, row) => {
                   return (
                       (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button>: ''
                   )
               }},
               {name : "INV Number", id:"CDM_INVOICE_NO", width:'40px',
               formatter: (cellContent, row) => {
                   return (
                       (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_inv_pdf(row)}>{row.CDM_INVOICE_NO} </button>: ''
                   )
               }},
               {name : "DN / DA Number", id:"DNM_DN_NO", width:'35px' ,
               formatter: (cellContent, row) => {
                   return (
                       (row.DNM_DN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_debit_pdf(row)}>{row.DNM_DN_NO} </button>: ''
                   )
               }},
               {name : "CN / CA Number", id:"CNM_CN_NO", width:'35px',
               formatter: (cellContent, row) => {
                   return (
                       (row.CNM_CN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_credit_pdf(row)}>{row.CNM_CN_NO} </button>: ''
                   )
               }},
           ]; 
        }
        else if(this.state.view_by=="GRN"){
            if(approve_type=='vendor'){ 
                _table_header = [
                    {name : "GRN Number", id:"POM_PO_NO", type:"button", width:'40px',key:true,
                        formatter: (cellContent, row) => {
                            return (
                                (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button> : ''
                            )
                        }},
                    {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
                    {name : "Buyer Company", id:"COY_NAME", width:'30px'},
                    {name : "Amount", id:"COST", width:'30px', dataFormat:'price'},
                    {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
                    {name : "PO Number", id:"POM_PO_NO", type:"button", width:'40px',
                        formatter: (cellContent, row) => {
                        return (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.CDM_PO_NO} </button>
                        )
                    }},
                    
                    {name : "DO Number", id:"CDM_DO_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_do_pdf(row)}>{row.CDM_DO_NO} </button> : ''
                        )
                    }},
                    {name : "INV Number", id:"CDM_INVOICE_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_inv_pdf(row)}>{row.CDM_INVOICE_NO} </button>: ''
                        )
                    }},
                    {name : "DN / DA Number", id:"DNM_DN_NO", width:'35px' ,
                            formatter: (cellContent, row) => {
                                return (
                                    (row.DNM_DN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_debit_pdf(row)}>{row.DNM_DN_NO} </button>: ''
                                )
                    }},
                    {name : "CN / CA Number", id:"CNM_CN_NO", width:'35px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CNM_CN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_credit_pdf(row)}>{row.CNM_CN_NO} </button>: ''
                        )
                    }},
                ]; 
        
            }
            else{
                _table_header = [
                    {name : "GRN Number", id:"POM_PO_NO", type:"button", width:'40px',key:true,
                        formatter: (cellContent, row) => {
                            return (
                                (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button> : ''
                            )
                        }},
                    {name : "PR No.", id:"PR_NO", width:'30px'},
                    {name : "Buyer Name", id:"COY_NAME", width:'30px'},
                    {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
                    {name : "Vendor Company", id:"POM_S_COY_NAME", width:'30px', dataFormat:'text'},
                    {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
                    {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
                    {name : "Dept.", id:"DEPT", width:'30px', dataFormat:'text'},
                    {name : "PO Number", id:"POM_PO_NO", type:"button", width:'40px',
                        formatter: (cellContent, row) => {
                        return (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.CDM_PO_NO} </button>
                        )
                    }},
                    
                    {name : "DO Number", id:"CDM_DO_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.do_pop_up(row)}>{row.CDM_DO_NO} </button> : ''
                        )
                    }},
                    {name : "INV Number", id:"CDM_INVOICE_NO", width:'40px',
                    formatter: (cellContent, row) => {
                        return (
                            (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_inv_pdf(row)}>{row.CDM_INVOICE_NO} </button>: ''
                        )
                    }},
                   
                ]; 
            }
        }
        else if(this.state.view_by=="NPR"){
            _table_header = [
                {name : "PR Number", id:"DOC_NO", type:"button", width:'40px',key:true,
                    formatter: (cellContent, row) => {
                        return (
                            (row.DOC_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_pr_details(row)}>{row.DOC_NO} </button> : ''
                        )
                }},
                {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
                {name : "Buyer Company", id:"BUYER", width:'30px'},
                {name : "Dept.", id:"DEPT", width:'30px', dataFormat:'text'},
                {name : "RFQ Number", id:"RFQ_NO", width:'35px',formatter: (cellContent, row) => {
                    return (
                       (row.RFQ_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.RFQ_NO} </button> : ''
                    )
                }},
                {name : "PO Number", id:"PO_NUMBER", type:"button", width:'40px',
                    formatter: (cellContent, row) => {
                    return (
                       (row.PO_NUMBER) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.PO_NUMBER} </button> : ''
                    )
                }},
            ]; 
        }

   else if(this.state.view_by=="INV"){
    _table_header = [
       {name : "Invoice Number", id:"POM_PO_NO", type:"button", width:'40px',key:true,
        formatter: (cellContent, row) => {
            return (
                (row.CDM_INVOICE_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_inv_pdf(row)}>{row.CDM_INVOICE_NO} </button>: ''
            )
        }},
       {name : "Creation Date", id:"DOC_DATE", width:'30px', dataFormat:'date'},
       {name : "Buyer Company", id:"COY_NAME", width:'30px'},
       {name : "Amount", id:"COST", width:'30px', dataFormat:'price'},
       {name : "Purchaser Name", id:"VEN_NAME", width:'35px'},
       {name : "PO Number", id:"POM_PO_NO", type:"button", width:'40px',
        formatter: (cellContent, row) => {
           return (
               <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_po_pdf(row)}>{row.CDM_PO_NO} </button>
           )
       }},
       
       {name : "DO Number", id:"CDM_DO_NO", width:'40px',
       formatter: (cellContent, row) => {
           return (
               (row.CDM_DO_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_do_pdf(row)}>{row.CDM_DO_NO} </button> : ''
           )
       }},
       {name : "GRN Number", id:"CDM_GRN_NO", width:'40px',
       formatter: (cellContent, row) => {
           return (
               (row.CDM_GRN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.view_grn_pdf(row)}>{row.CDM_GRN_NO} </button>: ''
           )
       }},
       {name : "DN / DA Number", id:"DNM_DN_NO", width:'35px' ,
            formatter: (cellContent, row) => {
                return (
                    (row.DNM_DN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_debit_pdf(row)}>{row.DNM_DN_NO} </button>: ''
                )
            }},
            {name : "CN / CA Number", id:"CNM_CN_NO", width:'35px',
            formatter: (cellContent, row) => {
                return (
                    (row.CNM_CN_NO) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_generate_credit_pdf(row)}>{row.CNM_CN_NO} </button>: ''
                )
        }},
   ]; 
}


        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }
              {(this.props.popdf_loading) ? <Loader /> : '' }
              {(this.props.dopdf_loading) ? <Loader /> : '' }
              {(this.props.gpdf_loading) ? <Loader /> : '' }
              {(this.props.ipdf_loading) ? <Loader /> : '' }
              {(this.props.credit_pdf_loading) ? <Loader /> : '' }
              {(this.props.debit_pdf_loading) ? <Loader /> : '' }
              
              
          
                <PageHeading  heading="Transaction Tracking" subheading="This list provides a summary of the purchasing activity in your company."  />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div>
                    <div className="col-12 col-sm-12">
                            <div class="row mt-2">
                                <div class="col-12 col-md-6">
                                    <div class="row mt-2">
                                        <div class="col-12 col-md-3 "><label>View By :</label></div>
                                            <div class="col-12 col-md-9">
                                                <div class="row updated_selectby">
                                                    {(approve_type=='vendor') ?   
                                                        <Field type="text" name="viewBy" select_value={(this.state.view_by) ? this.state.view_by: 'RFQ'} component={FromSelect} change_detuct={(e)=>this.handleSelectChange(e)}  className="form-control" placeholder="PO Status" label="" >
                                                            <option selected="selected" value="PO">Purchase Order</option>
                                                            <option value="DO">Delivery Order</option>
                                                            <option value="GRN">Goods Receipt Note</option>
                                                            <option value="INV">Invoice</option>
                                                        </Field> : ''
                                                    }

                                                    
                                                    {(approve_type!='vendor') ?   
                                                        <Field type="text" name="viewBy" select_value={(this.state.view_by) ? this.state.view_by: 'RFQ'} component={FromSelect} change_detuct={(e)=>this.handleSelectChange(e)}  className="form-control" placeholder="PO Status" label="" >
                                                            <option selected="selected" value="RFQ">Request For Quotation</option>
                                                            <option value="PR">Contract PR</option>
                                                            <option value="NPR">Non Contract PR</option>
                                                            <option value="PO">Purchase Order</option>
                                                            <option value="GRN">Goods Receipt Note</option>
                                                        </Field> : ''
                                                    }

                                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'> 
                                    <Field type="text" name="strDocNo" component={FromInputsParallel} className="form-control" placeholder={''} label="Document No.:"/>
                                </div>
                                <div className='row'> 
                                <Field type="text" name="strBuyer" component={FromInputsParallel} className="form-control" placeholder={''} label="Buyer Name  :"/>
                                <Field type="text" name="vendorName" component={FromInputsParallel} className="form-control" placeholder={''} label="Dept :"/>
                                <Field type="text" name="dteDateFr" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date " label="Start Date :" onChange={this.handleDate.bind(this, 'start_date')}  clear={true}/>
                                <Field type="text" name="dteDateTo" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date :" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')}  clear={true}/>
                              
                                <div className="col-md-12 col-lg-12 text-right mt-3">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>  
                </form>
               
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header}  
                            table_body={this.props.po_tracking} 
                            products={this.getProducts}
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true}  
                            click={false}
                            table_name="issue_grn"
                            selectall={this.getProductsall} 
                        />
                    </div>
                 
                </div> 
               
              
           
               
                <Alert 
                    confirm={this.closemodel} 
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
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
        </Fragment>
    }
}

const mapStateToProps = state => ({
    po_tracking : state.trans_tracking.responseList,
    loading: state.trans_tracking.loading,
    popdf_loading : state.generate_popdf.loading,
    dopdf_loading : state.generate_dopdf.loading,
    gpdf_loading : state.generate_grnpdf.loading,
    ipdf_loading : state.generate_ipdf.loading,
    credit_pdf_loading : state.generate_credit_pdf.loading,
    debit_pdf_loading : state.generate_debit_pdf.loading
})

const mapDispatchToProps = dispatch => ({
    GetTransTrackingList : (values) => dispatch(GetTransTrackingList(values)),
    GetGeneratePOPDF : (values) => dispatch(GetGeneratePOPDF(values)),
    get_generate_dopdf :  (values) => dispatch(GetGenerateDOPDF(values)),
    GetViewGRNPDF :  (values) => dispatch(GetViewGRNPDF(values)),
    GetInvoicePDF :  (values) => dispatch(GetInvoicePDF(values)),
    GetGenerateDEBITPDF  : (values) => dispatch(GetGenerateDEBITPDF(values)),
    GetGenerateCREDITPDF  : (values) => dispatch(GetGenerateCREDITPDF(values)),
    
})


const TransTrackingHolder = connect(mapStateToProps, mapDispatchToProps)(TransTracking);
export default reduxForm({
    form:'TransTracking',
})(TransTrackingHolder);