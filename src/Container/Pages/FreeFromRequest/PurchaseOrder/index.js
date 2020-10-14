import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import {get_po_status_int} from '../../../../Actions/Common/Functions'
import {UserDetails} from '../../../../Common/LocalStorage'
import Alert from '../../../../Component/Modal/alert'
import RfqButton from '../../../../Component/Buttons/RfqButton'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import {FromInputsParallel, FormDatePickerParallel, FromCheckBoxFullWidth, FromSelectParallel} from '../../../../Component/From/FromInputs'

class ApprovalRejectList extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:'',
            PRNumber : ["0","1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "1", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            modal_title:'',
            modal_body:'',
            modal:false,
            disable_input:true,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }


    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        this.props.history.push({
            pathname : '/VendorPOListPop',
            datas : details,
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
                //end_data:date
            })
            this.props.change('PoListing.UIEndDate',(date) ? date : '',)
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
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
            PO_NO: "",
            Vendor_name: "",
            POStatus: "",
            PoNo : "",
            Item_code:"",
            type: "MyPO",
            Fulfilment : "",
            search_type: "list"
        }

        console.log('checked_details', this.state.checked_details)
        _form_value = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.StartDate =  (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.EndDate =  (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"";
        _form_value.POStatus =  (_form_value.POStatus) ? parseInt(_form_value.POStatus) : "";
        _form_value.Fulfilment = this.state.checked_details
        _form_value = RemoveSpecialCharacter(_form_value)
        if(_form_value.Fulfilment && _form_value.Fulfilment.length > 0 && _form_value.POStatus!=4){
            this.setState({
                modal_body : 'If you choose fulfilment. PO Status shuld be "Accepted by vendor" ',
                model : true
            })
        }
        else if(this.state.start_data && this.state.end_data){
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

    handleCheckbox = (details, target) =>{
      
        let {checked_details} = this.state
        let _checked_value = details.target.getAttribute('data-value')
        console.log('details.target.checked', details.target.checked)
        if(details.target.checked){
            checked_details.push(_checked_value)
            this.setState({ checked_details : checked_details })
        }
        else{
            checked_details = checked_details.filter((list)=>list!=_checked_value)
            this.setState({ checked_details : checked_details })
        }
        console.log('handleCheckbox', this.state.checked_details)
    }

    SelectAll = () =>{
        this.setState({
            checked_details:  ["Open", "Partially Delivered", "Uninvoice / Unpaid Completed Delivery"]
        })
    }

    ClearAll = () => {
        this.setState({
            checked_details:  []
        })
        this.props.reset('RejectList')
    }

    viewPageDetails(details, cell, row){
        cell.PRM_PR_Index = cell.PR_INDEX
        cell.PRM_PR_No = cell.PR_NO
        
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'polisting'
        })
     
    }

    get_details = (details) =>{
        console.log('get_details',details);
        if((!details.PR_NO) && details.STATUS_DESC=="Draft"){
            this.props.change_tab('contact')
            this.props.update_details({POM_PO_NO:details.POM_PO_NO,POM_PO_INDEX:details.POM_PO_INDEX})
            localStorage.setItem('free_from', JSON.stringify({POM_PO_NO:details.POM_PO_NO,POM_PO_INDEX:details.POM_PO_INDEX}))
            if( localStorage.getItem('free_from')){
                window.location.reload()
            }
        }
        else if((details.PR_NO) && details.STATUS_DESC=="Draft"){
            this.props.change_tab('contact')
            this.props.update_details({POM_PO_NO:details.POM_PO_NO,POM_PO_INDEX:details.POM_PO_INDEX, from_page:'raiseFFPO'})
            localStorage.setItem('po_from', JSON.stringify({POM_PO_NO:details.POM_PO_NO,POM_PO_INDEX:details.POM_PO_INDEX}))
            if( localStorage.getItem('po_from')){
                this.props.history.push({
                    pathname : 'RaisePO',
                    redirect_to_tab:'PurchaseOrder',
                    redirect_to_page:'raiseFFPO'
                })
            }
        }
        else{
            let _user_details = UserDetails()
            let _send_details = { "POM_PO_NO": details.POM_PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.POM_S_COY_ID , "PRM_PO_INDEX": details.POM_PO_INDEX, STATUS: details.STATUS_DESC, PR_NO: details.PRM_PR_No, page_name:"poslisting"}           
            if(_user_details.ROLE_NAME.includes('Procurement  Officer') || _user_details.ROLE_NAME.includes('Procurement Officer') || _user_details.ROLE_NAME.includes('Officer') || _user_details.ROLE_NAME.includes('REQUESTER') || _user_details.ROLE_NAME.includes('requester') || _user_details.ROLE_NAME.includes('Requester')){
                this.props.history.push({
                    pathname : '/verify_po',
                    datas : _send_details,
                    page_name : 'pos_listing',
                })
            }
            else{
                this.props.history.push({
                    pathname : '/VendorPOListPop',
                    datas : _send_details,
                    page_name : 'pos_listing',
                })
            }
           
            
        }
      
    }

    HandleChange = (e) =>{
        let _updated_details = (e.target && e.target.value) ? e.target.value : 0
        if(_updated_details==4){
            this.setState({
                disable_input : false
            })
        }
        else{
            this.setState({
                disable_input : true,
                checked_details : []
            })
        }
    }


    render(){
        console.log('search_result', this.props.search_result)
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PO Number", id:"POM_PO_NO", width:'200px', key:true,
            formatter: (cellContent, row) => {
                return (
                    <Fragment>   
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={(e)=>this.get_details(row)}>{row.POM_PO_NO}  <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                    <RfqButton {...this.props} {...row} datas={{ vcomid : row.POM_S_COY_ID, rfq_id : row.POM_RFQ_INDEX,rfq_no : row.RM_RFQ_No}}  pathname= '  ' pathname='view_quotation' redirect_to_tab='PurchaseOrder' redirect_to_page='raiseFFPO'/>
                    </Fragment>
                )
            }},
            {name : "PO Creation Date", id:"POM_CREATED_DATE", width:'100px', dataFormat:'date'},
            {name : "PO Date", id:"POM_PO_DATE", width:'100px', dataFormat:'date'},
           
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'144px'},
            {name : "PO Accepted Date", id:"POM_ACCEPTED_DATE", width:'144px', dataFormat:'date'},
   
            {name : "PO Status", id:"STATUS_DESC", width:'110px',   formatter: (cellContent, row) => {
                return (
                    <div>{get_po_status_int(row.STATUS_DESC, row)}</div>
                )
            }},
            
            {name : "Fulfilment Status", id:"REMARK1", width:'110px'},
            {name : "PR No.", id:"PR_NO", width:'144px', formatter: (cellContent, row) => {
                return (
                   row.PR_NO ? <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PR_NO}</span></button > : ''
                )
            }}
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PO." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="PoListing.PO_NO" component={FromInputsParallel} className="form-control" placeholder="PO No." label="PO No. :" />
                            <Field type="text" name="PoListing.Vendor_name" component={FromInputsParallel} className="form-control" placeholder="Vendor Name" label="Vendor Name :" />
                        </div>
                        <div className="row">
                            <Field type="text" name="PoListing.Item_code" component={FromInputsParallel} className="form-control" placeholder="Item Code" label="Item Code :" />
                        </div>
                        <div className="row">
                            <Field type="text" name="PoListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date :" onChange={this.handleDate.bind(this, 'start_date')} clear={true}/>
                            <Field type="text" name="PoListing.UIEndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date :" onChange={this.handleDate.bind(this, 'end_date')} clear={true}/>
                        </div>
                        <div className="row">

                            <Field type="text" name="PoListing.POStatus" component={FromSelectParallel} onChange={(e)=>{this.HandleChange(e)}} className="form-control" placeholder="PO Status" label="PO Status :" >
                            <option value="">---Select---</option>
                                <option value="1">Draft</option>
                                <option value="2">Submitted for approval (Internal)</option>
                                <option value="3">Approved by management (Official)</option>
                                <option value="4">Accepted by vendor</option>
                                <option value="5">Completed delivery and paid</option>
                                <option value="6">Cancelled by buyer</option>
                                <option value="7">Rejected by management / vendor</option>
                                <option value="8">Void draft PO</option>
                                <option value="9">Held by management</option>
                            </Field>
                        </div>
                        <div className="row mt-2">    
                                <div className="col-lg-2 col-md-2 col-12">
                                    <p>Fulfilment :</p>
                                </div>
                                <div className="col-12 col-md-1">
                                    <div className="row">

                                        <Field  id="Spot" disabled_input={this.state.disable_input} component={FromCheckBoxFullWidth} type="Spot" name="PoListing.Fulfilment" inputvalue="Open" value="Open" label="Open"  checked={this.state.checked_details.includes('Open')}  onClick={this.handleCheckbox}/>
                                    </div>
                                </div>
                                <div className="col-12 col-md-2">
                                    <div className="row">
                                        <Field  id="Stock" disabled_input={this.state.disable_input}  component={FromCheckBoxFullWidth} type="Stock" name="PoListing.Fulfilment" inputvalue="Partially Delivered" value="Partially Delivered" label="Partially Delivered"  checked={this.state.checked_details.includes('Partially Delivered')}  onClick={this.handleCheckbox}/>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="row">
                                        <Field  id="MRO" disabled_input={this.state.disable_input} component={FromCheckBoxFullWidth} type="MRO" name="PoListing.Fulfilment" inputvalue="Uninvoice / Unpaid Completed Delivery" value="Uninvoice / Unpaid Completed Delivery" label="Uninvoice / Unpaid Completed Delivery"  checked={this.state.checked_details.includes('Uninvoice / Unpaid Completed Delivery')}  onClick={this.handleCheckbox}/>
                                    </div>
                                </div>
                        </div>
                    </div>  
                   
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.SelectAll()}>Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm"  onClick={()=>this.ClearAll()}>Clear</button>
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
                            table_name="issue_grn"
                        />

                        

                    </div>
                </div>
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
                </form>
        </Fragment>
    }
}

export default reduxForm({
    form:'RejectList',
})(ApprovalRejectList);
