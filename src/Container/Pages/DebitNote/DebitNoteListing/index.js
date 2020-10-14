import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import {FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromInputsParallel,FormDatePickerParallel} from '../../../../Component/From/FromInputs'
import InvoiceViewDetails from '../../RequesterVerificationInvoice/dn_view'
import ViewCNDN from '../../RequesterVerificationInvoice/cndn_index'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'

class DebitNoteListing extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.view_cndn_details = this.view_cndn_details.bind(this)
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.state = {
            products:[],
            start_data:new Date(),
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:new Date(),
            payment_start_date:new Date(),
            payment_end_date:new Date(),
            check_value:false,
            model:false,
            checked_initial : [0,1,2,3],
            checked_details:[],
            view_cndn:false,
            cndn_details : {
                "Dn_No":"",
                "strInvNo":"",
                "strSCoyId":"",
            },
            invoice_details : {
                "Inv_no":"",
                "Vcom_id":"",
            },
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }

    componentDidMount(){
        this.props.change('vendorInvoiceMagtReq.strStartDate', new Date());
        this.props.change('vendorInvoiceMagtReq.strEndDate', new Date());
        this.props.change('vendorInvoiceMagtReq.strPaySDate', new Date());
        this.props.change('vendorInvoiceMagtReq.strPayEDate', new Date());
    }

    handleCheckboxClick(details, name){
    }

    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        this.props.history.push({
            pathname : '/approvepr',
            datas : details.datas,
        })
    }

    ViewInvoice = (row) =>{
        let _temp_details  = {
            Inv_no:row.CNM_INV_NO,
            Vcom_id:row.CNM_CN_S_COY_ID,
        }
        this.setState({
            invoice_details : _temp_details,
            view_cndn : true
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

       else if(name=="payment_start_date"){
            this.setState({
                payment_start_date:date
            })
        }

        else if(name=="payment_end_date"){
            this.setState({
                payment_end_date:date
            })
        }

       
    }

    handlefromsubmit(values){
        let _form_value = values;
        let status = (values.vendorInvoiceMagtReq && values.vendorInvoiceMagtReq.PoStatus && values.vendorInvoiceMagtReq.PoStatus.length) ? Object.keys(values.vendorInvoiceMagtReq.PoStatus) : this.state.checked_initial;

        let _initial_obj = {
            frm:"paid",
            "strDnNo":"",
            "strVendor":"",
            "strCurr":"",
            "strInvNo":"",
            "strStartDate":"",
            "strEndDate":"",
            "strPaySDate":"",
            "strPayEDate":""
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.vendorInvoiceMagtReq) ? _form_value.vendorInvoiceMagtReq : {} )
        _form_value.strStartDate =  (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data): ''; 
        _form_value.strEndDate =  (this.state.end_data) ?FromateDate_YY_MM_DD(this.state.end_data): ''; 
        _form_value.strPaySDate =  (this.state.payment_start_date) ? FromateDate_YY_MM_DD(this.state.payment_start_date): ''; 
        _form_value.strPayEDate =  (this.state.payment_end_date) ?FromateDate_YY_MM_DD(this.state.payment_end_date): ''; 
        _form_value.status =  (status.length) ? status.toString(): ''; 
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list(_form_value)
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
            this.props.get_search_list(_form_value)
        }
        
    }

    ViewInvoice = (row) =>{
        let _temp_details  = {
            Inv_no:row.DNM_INV_NO,
            Vcom_id:row.DNM_DN_S_COY_ID,
        }
        this.setState({
            invoice_details : _temp_details,
            view_cndn : true
        })
    }

    view_cndn_details = (details)=>{
        let _temp_details = this.state.cndn_details;
        _temp_details.Dn_No = details.DNM_DN_NO
        _temp_details.strInvNo = details.DNM_INV_NO
        _temp_details.strSCoyId = details.DNM_DN_S_COY_ID
        this.setState({
            show_result : true,
            cndn_details : _temp_details
        })
    }

    hide_view =() =>{
   
        this.setState({
            show_result : false,
            view_cndn : false,
        })
    }

    

    handleParentupdate = () =>{
        let _initial_obj = {
            invoiceNo: "",
            bComId: "",
            strStatus: "",
        }
        this.props.get_search_list(_initial_obj)
    }

    render(){
        
       
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Debit Note Number", id:"IM_INVOICE_NO", width:'200px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.view_cndn_details(row)}>{row.DNM_DN_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Debit Note Date", id:"DNM_DN_DATE", width:'118px', dataFormat:'date'},
            {name : "Invoice Number", id:"DNM_INV_NO", width:'200px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button"  onClick={()=>this.ViewInvoice(row)}>{row.DNM_INV_NO}</button>
                )
            }},
            {name : "Vendor Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Currency", id:"DNM_CURRENCY_CODE", width:'122px'},
            {name : "Amount", id:"AMOUNT", width:'122px', dataFormat:'number'},
        ];



       
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.gpopdf_loading) ? <Loader /> : '' }
              {(this.props.ipdf_loading) ? <Loader /> : '' }
              {(!this.state.show_result && !this.state.view_cndn) ? 
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant paid Debit Note." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="vendorInvoiceMagtReq.strDnNo" component={FromInputsParallel} className="form-control" placeholder="Debit Note No. " label="Debit Note No. :" />
                            <Field type="text" name="vendorInvoiceMagtReq.strVendor" component={FromInputsParallel} className="form-control" placeholder="Vendor " label="Vendor : " />
                            <Field type="text" name="vendorInvoiceMagtReq.strStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date " label="Start Date : "    onChange={this.handleDate.bind(this, 'start_date')} />
                            <Field type="text" name="vendorInvoiceMagtReq.strEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date : " minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} />
                            <Field type="text" name="vendorInvoiceMagtReq.strPaySDate" selected={this.state.payment_start_date} component={FormDatePickerParallel} className="form-control" placeholder="Payment Start Date  " label="Payment Start Date : "    onChange={this.handleDate.bind(this, 'payment_start_date')} />
                            <Field type="text" name="vendorInvoiceMagtReq.strPayEDate" selected={this.state.end_data} value={this.state.payment_start_end} component={FormDatePickerParallel} className="form-control" placeholder="Payment End Date " label="Payment End Date  : " minDate={this.state.payment_start_end}  onChange={this.handleDate.bind(this, 'payment_end_date')} />
                           
                        </div>
                    </div>  
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.props.reset_form()}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.responseList) ? this.props.search_result.responseList.data : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />
                       
                    </div>
                </div>
                </form> :''}
                {(this.state.show_result) ? <InvoiceViewDetails handleParentupdate={this.handleParentupdate} {...this.state.cndn_details} close={this.hide_view}  hide_button={true}/> : ''}
            {(this.state.view_cndn) ? <ViewCNDN type="debit" datas={this.state.invoice_details} close={this.hide_view}  /> : ''}
            <Alert 
                            message={this.state.modal_body}
                            status={this.state.status} 
                            show={this.state.modal} 
                            confirm={this.closeModel}
                        />
        </Fragment>
    }
}

export default reduxForm({
    form:'DebitNoteListing',
})(DebitNoteListing);
