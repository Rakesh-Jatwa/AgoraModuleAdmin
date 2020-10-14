import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate, FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import {UserDetails} from '../../../../Common/LocalStorage'
import {FromInputsParallel, FormDatePickerParallel, CheckBoxInline, FromCheckBoxFullWidth} from '../../../../Component/From/FromInputs'
import Alert from '../../../../Component/Modal/alert'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.HandleCheckbox = this.HandleCheckbox.bind(this)
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
            IncludeHold: true,
            Include:true,
            modal:false,
            AOAction_Rejected : false,
            AOAction_Approved : false,
        }
    }
    closemodel = () => {
        this.setState({
            modal : false
        })
    }



   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
    }

    HandleCheckbox(details){
        let _details = details.target
        if(_details.name == "ApproveDto.AOAction_Approved"){
            this.setState({
                AOAction_Approved : (this.state.AOAction_Approved ? false: true )
            })
        }
        else if(_details.name == "ApproveDto.AOAction_Rejected"){
            this.setState({
                AOAction_Rejected : (this.state.AOAction_Rejected ? false: true )
            })
        }

        else if(_details.name == "ApproveDto.Include"){
            this.setState({
                Include : (this.state.Include ? false: true )
            })
        }

        else if(_details.name == "ApproveDto.IncludeHold"){
            this.setState({
                IncludeHold : (this.state.IncludeHold ? false: true )
            })
        }
    }



    async get_details(details, type){
        
        let _user_details = UserDetails()
        let _send_details = { "POM_PO_NO": details.POM_PO_No, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.POM_S_Coy_ID , "PRM_PO_INDEX": details.POM_PO_Index, STATUS: details.STAT, PR_NO: details.PRM_PR_No, ...details}
        _send_details.frm_page = "SearchPO_AO"
        console.log('get_details__send_details')
        this.props.history.push({
            pathname : '/view_po_approval',
            datas : _send_details,
            redirect_to_tab : 'ApprovedRejectedListing',
            redirect_to_page : 'SearchPO_AO',
        })
    }

    get_vendor(details){
        var data = { "v_com_id": details.POM_S_Coy_ID}
        this.props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
            redirect_to_tab : 'ApprovedRejectedListing',
            redirect_to_page : 'SearchPO_AO',
        })
    }

    handlefromsubmit(values){
        let _form_value = values;
       

       
     
        let _initial_obj = {
            AOAction_Approved: "",
            AOAction_Rejected: "",
            DateFrom: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            DateTo: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            IncludeHold: true,
            Include: true,
            PO_NO: "",
            ReliefOn : "",
            Vendor_Name:"",
            isRejectedApprovedList:"1",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.DateFrom = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.DateTo = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"";
        _form_value.AOAction_Approved = this.state.AOAction_Approved
        _form_value.AOAction_Rejected = this.state.AOAction_Rejected
        _form_value.IncludeHold = this.state.IncludeHold
        _form_value.Include = this.state.Include
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.get_search_list(_form_value)
        }
      
    }

    ClearAll  = () =>{
        this.setState({
            start_data : '',
            end_data : '',
            AOAction_Rejected : '',
            AOAction_Approved : '',
        })
        this.props.reset('RejectListDetails')
    }

    SelectAll = () =>{
        this.setState({
            start_data : '',
            end_data : '',
            AOAction_Rejected : true,
            Include : true,
            AOAction_Approved : true,
            IncludeHold : true
        })
       
        this.props.reset('RejectListDetails')
    }



    viewPrDetails(details){
        let _details = details
        _details.PRM_PR_Index = _details.PRM_PR_INDEX
        _details.PRM_PR_No = _details.PRM_PR_NO
        _details.PRNumber = _details.PRM_PR_NO
        _details.from_page = "pr_listing"
        this.props.history.push({
            pathname:"/approvepr_details",
            selected_items: '',
            datas: _details,
            type:'listing',
            redirect_to_tab : 'ApprovalRejected',
            redirect_to_page : 'approvepr',
        })
    }

    render(){
       
        let { handleSubmit,search_result } = this.props
        let _user_details = UserDetails()
        if(_user_details.ROLE_NAME=="vendor" || _user_details.ROLE_NAME=="null"){
            search_result = search_result
        }
        else{
            search_result = search_result.filter((list_details)=>(list_details.STAT=="Approved" || list_details.STAT=="Rejected" || list_details.STAT=="Rejected By"))
        }
       
        const _table_header = [
            {name : "PO Number", id:"POM_PO_No", width:'171px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.get_details(row, 'POM_PO_No')}>
                          {row.POM_PO_No} 
                          <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>
                          {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                    </button>
                )
            }},
            {name : "Creation Date", id:"POM_SUBMIT_DATE", width:'144px', dataFormat:'date'},
            {name : "Purchaser", id:"UM_USER_NAME", width:'144px'},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'210px',formatter: (cellContent, row) => {
                return (row.POM_S_COY_NAME) ? <button className="btn btn-small btn-outline-info" variant="primary" onClick={() => this.get_vendor(row)}>{row.POM_S_COY_NAME}</button> : ''
            }},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'144px'},
            {name : "Amount", id:"PO_AMT", width:'144px',formatter: (cellContent, row) => {
            return <div className="text-right">{(row.PO_AMT) ? parseFloat(row.PO_AMT).toFixed(2): '0.00'}</div>
            }},
            
            {name : "Status", id:"STATUS_DESC", width:'110px',formatter: (cellContent, row) => {
                if(row.STAT=="Rejected By"){
                    return 'Rejected'
                }
                else if(row.STATUS_DESC=="Rejected By" || row.STATUS_DESC=="Rejected" ){
                    return 'Rejected'
                }
                else{
                    return row.STAT
                }
            }},
            {name : "PR No", id:"PRM_PR_NO", width:'144px' , formatter: (cellContent, row) => {
                return ((row.PRM_PR_NO) ? 
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.viewPrDetails(row)}>
                          {row.PRM_PR_NO} 
                    </button> : ''
                )
            }},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant approved or rejected PO. " 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="ApproveDto.PO_NO" component={FromInputsParallel} className="form-control" placeholder="PO No. " label="PO No. :" />
                            <Field type="text" name="ApproveDto.Vendor_Name" component={FromInputsParallel} className="form-control" placeholder="Vendor Name " label="Vendor Name :" />
                        </div>
                        <div className="row">
                            <Field type="text" name="ApproveDto.StartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')} clear={true}/>
                            <Field type="text" name="ApproveDto.EndDate" selected={this.state.end_data}  component={FormDatePickerParallel} minDate={this.state.start_data} className="form-control" placeholder="End Date " label="End Date:" onChange={this.handleDate.bind(this, 'end_date')} clear={true}/>
                        </div>

                        
                        
                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">My Approval Status  : </label>
                            </div>
                            <div className="">
                                <Field type="text" name="ApproveDto.AOAction_Approved" onClick={this.HandleCheckbox} component={FromCheckBoxFullWidth} label="Approved" checkvalue="Approved" checked={(this.state.AOAction_Approved==true) ? true : false}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.AOAction_Rejected" onClick={this.HandleCheckbox} component={FromCheckBoxFullWidth} label="Rejected"  checkvalue="Rejected"  checked={this.state.AOAction_Rejected}/> 
                            </div>
                        </div>
                       

                       
                        <div className="row mt-2">    
                        <div className="col-12 col-sm-4">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <p>Include Rejected PO ? :</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxFullWidth} onClick={this.HandleCheckbox} type="checkbox" name="ApproveDto.Include" label="(Tick to include)"  checked={this.state.Include}/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4">
                                <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <p>Include PO On Hold ? :</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxFullWidth} onClick={this.HandleCheckbox} type="checkbox" name="ApproveDto.IncludeHold" label="(Tick to include)" checked={this.state.IncludeHold}/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4">
                                <div className="text-right row">
                                    <div className="col-12">
                                        <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                        <button type="button" className="ml-4 btn btn-sm btn-outline-primary"  onClick={()=>this.SelectAll()}>Select All</button>
                                        <button type="button" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
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
                            table_body={search_result} 
                            products={this.get_details} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                        />
                    </div>
                </div>
                </form>

                <Alert 
                    title="" 
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.modal} 
                    confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'RejectListDetails',
})(ApprovalRejectList);
