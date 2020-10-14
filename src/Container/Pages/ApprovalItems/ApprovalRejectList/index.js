import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {UserDetails} from '../../../../Common/LocalStorage'
import Loader from '../../../../Component/Loader'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {FromateDate, DateMinus, convertDateToYear, TodayDateSalash, CompareDate} from '../../../../Component/Dates'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:"",
            end_data:"",
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:['0'],
            prType : '',
            MyApprovalStatus : '',
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
        this.props.change('ApproveDto.StartDate', DateMinus(6,"date"))
        this.props.change('ApproveDto.EndDate', TodayDateSalash())
        this.setState({
            start_data: new Date(),
            end_data: new Date(),
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
                start_data:(date) ? date : '',
                UIStartDate : (date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data: (date) ? date : '',
                UIEndDate :  (date) ? date : '',
            })
       }
    }

    viewPageDetails(details, cell, row){
        let _details = {};
        _details.ApproveDto = cell;
        _details.ApproveDto.PRNumber = _details.PRM_PR_No
        this.props.history.push({
            pathname:"/approvepr_details",
            selected_items: '',
            datas: cell,
            type:'listing'
        })
    }


    async get_details(details, type){
        if(type!=="vn_name"){
            let _user_details = UserDetails();
            let _send_details = { "POM_PO_NO": details.PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.SNAMEID}

            this.props.history.push({
                pathname : '/VendorPOListPop',
                datas : _send_details,
            })
        }
        else{
            let _send_details = { "v_com_id": details.SNAMEID}
            this.props.history.push({
                pathname : '/vendorDetailsPage',
                datas : _send_details,
            })
        }
        
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            PRNumber: "",
            MyApprovalStatus: this.state.MyApprovalStatus,
            prType: this.state.prType,
            VendorName: "",
            UIStartDate: new Date(TodayDateSalash(this.state.StartDate)),
            UIEndDate :new Date(TodayDateSalash(this.state.EndDate)),
            StartDate : (this.state.start_data) ? FromateDate(this.state.start_data) : DateMinus(6),
            EndDate: FromateDate(this.state.end_data),
            includedHold: true,
            included: true,
            PRNumber: "",
            VendorName : "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.UIStartDate = (_form_value.StartDate) ? new Date(TodayDateSalash(_form_value.StartDate)) : new Date()
        _form_value.UIEndDate = (_form_value.EndDate) ? new Date(TodayDateSalash(_form_value.EndDate)) : new Date()
        _form_value.StartDate = (_form_value.StartDate ) ? convertDateToYear(_form_value.StartDate) : new Date()
        _form_value.EndDate = (_form_value.EndDate && _form_value.EndDate!="Invalid date") ? convertDateToYear(_form_value.EndDate) : new Date()
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list({ApproveDto:_form_value})
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
            this.props.get_search_list({ApproveDto:_form_value})
        }
      
    }

    handleCheckBox = (e) =>{
        if(e.target.name == 'ApproveDto.prType'){
            this.setState({
                prType : e.target.value
            })
        }
        else if(e.target.name == 'ApproveDto.MyApprovalStatus'){
           
            this.setState({
                MyApprovalStatus : e.target.value
            })
        }
        else{

        }
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR Number", id:"PRM_PR_No", width:'187px', key:true, key:true,formatter: (cellContent, row) => {
                return (
                    row.STATUS_DESC === 'Draft' ? <button type="button" className="btn btn-sm btn-outline-info" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.PRM_PR_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button > : <button type="button" className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span></button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'75px',formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'cc' || row.PRM_PR_TYPE==='CC') ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Submitted Date", id:"PRM_SUBMIT_DATE", width:'120px',dataFormat:'date'},
            {name : "Buyer", id:"PRM_REQ_NAME", width:'144px'},
            {name : "Buyer Department", id:"CDM_DEPT_NAME", width:'122px'},
            {name : "Vendor Name", id:"CDM_DEPT_NAME", width:'122px',
                formatter: (cellContent, row) => {
                    return (
                        <span className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row, 'vn_name')} >{row.SNAME}</span>
                    )
                },
            },
            {name : "Status", id:"STAT", width:'90px'},
            {name : "PO Number", id:"CDM_DEPT_NAME", width:'160px',
                formatter: (cellContent, row) => {
                    return (row.PO_NO) ?  <span className="btn btn-outline-primary btn-sm" onClick={() => this.get_details(row, 'po_number')} >{row.PO_NO}</span> : ''
                    
                },
            },
        ];
        return <Fragment>
            {(this.props.loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR for approval. Click the PR Number to go to PR approval page." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="ApproveDto.PRNumber" component={FromInputsParallel} className="form-control" placeholder="PR No." label="PR No." />
                            <Field type="text" name="ApproveDto.VendorName" component={FromInputsParallel} className="form-control" placeholder="Vendor Name " label="Vendor Name :" />
                        </div>
                        <div className="row">
                            <Field type="text" name="ApproveDto.StartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')} />
                            <Field type="text" name="ApproveDto.EndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date:" onChange={this.handleDate.bind(this, 'end_date')}/>
                        </div>

                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">PR Type :</label>
                            </div>
                            <div className="col-12 col-lg-2"> 
                                <Field type="text" name="ApproveDto.prType"  component={FormRadioButton} label="Contract PR" checked={(this.state.prType=='CC') ? true : false } checkvalue="CC"  onClick={this.handleCheckBox} /> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.prType"  component={FormRadioButton} label="Non-Contract PR" checked={(this.state.prType=='NonCont') ? true : false }  checkvalue="NonCont"  onClick={this.handleCheckBox}/> 
                            </div>
                        </div>
                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">My Approval Status  :</label>
                            </div>
                            <div className="col-12 col-lg-2"> 
                                <Field type="text" name="ApproveDto.MyApprovalStatus" component={FormRadioButton} label="Approved" checked={(this.state.MyApprovalStatus=='Approved') ? true : false }  checkvalue="Approved" onClick={this.handleCheckBox}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.MyApprovalStatus"  component={FormRadioButton} label="Rejected" checked={(this.state.MyApprovalStatus=='Rejected') ? true : false }  checkvalue="Rejected"  onClick={this.handleCheckBox}/> 
                            </div>
                        </div>
                       

                       
                        <div className="row mt-2">    
                            <div className="col-12 col-sm-5">
                                <div className="row">
                                    <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                                        <p>Include Rejected PR ? :</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxparallel} type="checkbox" name="ApproveDto.included" label="(Tick to include)"  checked={this.state.checked_details.includes('0')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-5">
                                <div className="row">
                                <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                                        <p>Include PR On Hold ? :</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxparallel} type="checkbox" name="ApproveDto.includedHold" label="(Tick to include)"  checked={this.state.checked_details.includes('0')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      
                                           

                       
                       
                  
                    </div>  
                   
                       
                    <div className="col-12">
                        <div className="text-center mt-2 row">
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
                            table_body={(this.props.search_result && this.props.search_result.list) ? this.props.search_result.list : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                        />

                    </div>
                </div>
                </form>
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
    form:'RejectList',
})(ApprovalRejectList);
