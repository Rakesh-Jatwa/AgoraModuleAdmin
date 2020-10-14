import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import InvoiceViewDetails from '../../RequesterVerificationInvoice/cndn_view'
import ViewCNDN from '../../RequesterVerificationInvoice/cndn_index'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel,FromSelectParallel, FormDatePickerParallel} from '../../../../Component/From/FromInputs'
class NewCreditNote extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.state = {
            products:[],
            start_data:new Date(),
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:new Date(),
            check_value:false,
            model:false,
            view_cndn :false,
            checked_initial : [0,1,2,3],
            checked_details:[],
            show_result : false, 
            cndn_details : {
                "Cn_No":"",
                "invoiceNo":"",
                "Vcom_id":"",
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
        // this.props.change('PurchaseRequestListing.UIStartDate', new Date());
        // this.props.change('PurchaseRequestListing.UIEndDate', new Date());
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

    handlefromsubmit(values){
        let _form_value = values;
        
        let _initial_obj = {
            strCnNo: "",
            strVendor: "",
            strCurr: "",
            strInvNo: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestListing) ? _form_value.PurchaseRequestListing : {} )
        _form_value = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list(_form_value)
    }

    handleParentupdate = () =>{ 
        let _initial_obj = {
            strCnNo: "",
            strVendor: "",
            strCurr: "",
            strInvNo: "",
        }
      
        this.props.get_search_list(_initial_obj)
    }

    view_cndn_details = (details)=>{
        let _temp_details = this.state.cndn_details;
        _temp_details.Cn_No = details.CNM_CN_NO
        _temp_details.invoiceNo = details.CNM_INV_NO
        _temp_details.Vcom_id = details.CNM_CN_S_COY_ID
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

    ClearAll = () =>{
        this.props.reset('NewCreditNote')
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

    render(){
        
       
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Credit Note Number", id:"CNM_CN_NO", width:'200px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => this.view_cndn_details(row)}>{row.CNM_CN_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Creation Date", id:"CNM_CREATED_DATE", width:'118px', dataFormat:'date'},
            {name : "Invoice Number", id:"POM_PO_NO", width:'200px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.ViewInvoice(row)}>{row.CNM_INV_NO}</button>
                )
            }},
            {name : "Vendor Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Currency", id:"CNM_CURRENCY_CODE", width:'122px'},
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
                subheading="Fill in the search criteria and click Search button to list the relevant Credit Note." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="PurchaseRequestListing.strCnNo" component={FromInputsParallel} className="form-control" placeholder="Credit Note No. " label="Credit Note No. : " />
                            <Field type="text" name="PurchaseRequestListing.strVendor" component={FromInputsParallel} className="form-control" placeholder="Vendor " label="Vendor : " />
                            {/* <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Document Start Date  " label="Document Start Date "    onChange={this.handleDate.bind(this, 'start_date')} />
                            <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="Document End Date " label="Document End Date" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> */}
                            <Field type="text" name="e2psearch.strCurr" component={FromSelectParallel} className="form-control cur_details" placeholder="Currency  : "  label="Currency : ">
                                    <option value="">--Select Currency--</option>
                                    {(this.props.gl_code && this.props.gl_code.vendorDetails && this.props.gl_code.vendorDetails.VendorList) ? this.props.gl_code.vendorDetails.VendorList.map((list_details)=>{
                                            return <option value={list_details.value}>{list_details.label}</option>
                                    }) :''}
                                
                            </Field> 
                            <div className="col-6">
                                <div className="text-right mt-2 row">
                                    <div className="col-12 mt-2">
                                        <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                        {/* <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Select All</button> */}
                                        <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                    
                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result) ? this.props.search_result : [] } 
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
            </form>: ''}
            {(this.state.show_result) ? <InvoiceViewDetails   handleParentupdate = {this.handleParentupdate} {...this.state.cndn_details} close={this.hide_view}  hide_button={false}/> : ''}
            {(this.state.view_cndn) ? <ViewCNDN type="credit" datas={this.state.invoice_details} close={this.hide_view}  /> : ''}
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
    form:'NewCreditNote',
})(NewCreditNote);
