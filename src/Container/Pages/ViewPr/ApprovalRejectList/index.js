import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate, CompareDate} from '../../../../Component/Dates'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[],
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
    closemodel = () => {
        this.setState({
            model : false
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
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            includedHold: true,
            included: true,
            PRNumber: "",
            VendorName : "",
        }
        _form_value.ApproveDto = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.ApproveDto = RemoveSpecialCharacter(_form_value.ApproveDto)
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

    render(){
       
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR Number", id:"PRM_PR_No", width:'200px', key:true, dataFormat:'button'},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
                return (
                    row.PRM_PR_TYPE === 'cc' || 'CC' ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Submitted Date", id:"PRM_SUBMIT_DATE", width:'144px', dataFormat:'date'},
            {name : "Buyer", id:"PRM_REQ_NAME", width:'144px'},
            {name : "Buyer Department", id:"CDM_DEPT_NAME", width:'122px'},
            {name : "Vendor Name", id:"ALLV", width:'144px'},
            {name : "Status", id:"STAT", width:'110px'},
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
                            <Field type="text" name="ApproveDto.StartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')}  clear={true}/>
                            <Field type="text" name="ApproveDto.EndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date:" onChange={this.handleDate.bind(this, 'end_date')} clear={true}/>
                        </div>

                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">PR Type :</label>
                            </div>
                            <div className="col-12 col-lg-2"> 
                                <Field type="text" name="ApproveDto.prType" selected={this.state.end_data} component={FormRadioButton} label="Contract PR" checkvalue="CC" selected={false} /> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.prType" selected={this.state.end_data} component={FormRadioButton} label="Non-Contract PR"  checkvalue="NonCont"  selected={false}/> 
                            </div>
                        </div>
                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">My Approval Status  :</label>
                            </div>
                            <div className="col-12 col-lg-2"> 
                                <Field type="text" name="ApproveDto.MyApprovalStatus" selected={this.state.end_data} component={FormRadioButton} label="Approved" checkvalue="Approved" selected={false}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.MyApprovalStatus" selected={this.state.end_data} component={FormRadioButton} label="Rejected"  checkvalue="Rejected"  selected={false}/> 
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
                            click={false}
                            table_name="issue_grn"

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
