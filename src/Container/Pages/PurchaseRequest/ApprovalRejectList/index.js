import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {UserDetails} from '../../../../Common/LocalStorage'
import Alert from '../../../../Component/Modal/alert'
import Loader from '../../../../Component/Loader'
import {FromateDate, DateMinus, convertDateToYear, TodayDateSalash, CompareDate} from '../../../../Component/Dates'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:"",
            end_data:"",
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2],
            checked_details:[0,1],
            prType : [],
            MyApprovalStatus : [],
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }




    componentDidMount(){
        this.props.change('ApproveDto.StartDate', DateMinus(6,"date"))
        this.props.change('ApproveDto.EndDate', TodayDateSalash())
        this.props.change('ApproveDto.included', true)
        this.props.change('ApproveDto.includedHold', true)
        
        this.setState({
            start_data: new Date(),
            end_data: new Date(),
        })
    }
    
    closeModel (details){
        this.setState({
            model:false,
            modal:false
        })
        
    }

   

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data: (date) ? date : '',
                UIStartDate : (date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
                UIEndDate : (date) ? date : '',
            })
       }
    }

    

    viewPageDetails(details, cell, row){
        let _details = {};
        _details.ApproveDto = cell;
        _details.ApproveDto.PRNumber = _details.PRM_PR_No
        cell.from_page = "pr_listing"
        this.props.history.push({
            pathname:"/approvepr_details_psa",
            selected_items: '',
            datas: cell,
            type:'listing',
            redirect_to_tab : 'ApprovalRejected',
            redirect_to_page : 'approvepr',
        })
    }

    

    async get_details(details, type){
        if(type!=="vn_name"){
            let _user_details = UserDetails();
            let _send_details = { "POM_PO_NO": details.PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.SNAMEID , "PRM_PO_INDEX": details.PRM_PO_INDEX, STATUS: details.STAT, PR_NO: details.PRM_PR_No, from_page:"pr_listing", frm_page:"pr_listing"}
            console.log('_send_details', details)
            this.props.history.push({
                pathname : '/vendor_details_psa',
                datas : _send_details,
                page_name:'pos_listing',
                redirect_to_tab : 'ApprovalRejected',
                redirect_to_page : 'approvepr',
            })
        }
        else{
            let _send_details = { "v_com_id": details.SNAMEID}
            _send_details.Status = details.Status
            this.props.history.push({
                pathname : '/vendorDetailsPage',
                datas : _send_details,
                redirect_to_tab : 'ApprovalRejected',
                redirect_to_page : 'approvepr',
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
            includedHold: true,
            included: true,
            PRNumber: "",
            VendorName : "",
            strAOAction : "",
        }

        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.UIStartDate = (_form_value.StartDate) ? TodayDateSalash(this.state.StartDate) : "";
        _form_value.UIEndDate = (_form_value.EndDate) ? TodayDateSalash(_form_value.EndDate) :"";
        _form_value.StartDate = (_form_value.StartDate ) ? convertDateToYear(_form_value.StartDate ) :"";
        _form_value.EndDate = (_form_value.EndDate ) ? convertDateToYear(_form_value.EndDate) : "";
        _form_value.prType = (this.state.prType) ? this.state.prType.toString() : '' ;
        _form_value.MyApprovalStatus = (this.state.MyApprovalStatus && this.state.MyApprovalStatus!='') ? this.state.MyApprovalStatus.toString() : "Approved,Rejected" ;
        _form_value.strAOAction = (this.state.MyApprovalStatus && this.state.MyApprovalStatus!='' && this.state.MyApprovalStatus.length==1) ? this.state.MyApprovalStatus.toString() : "" ;
        _form_value = RemoveSpecialCharacter(_form_value)
        

        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list({ApproveDto:_form_value})
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
            this.setState({
                modal_body : 'Choose Start Date and End Date',
                status :false,
                model : true
            })
        }
       
    }

    

    SelectAll =() =>{
        this.setState({
            MyApprovalStatus : ['Approved','Rejected'],
            prType : ['CC','NonCont'],
            checked_details : [0,1]
        })
        this.props.change('ApproveDto.prType', true)
        this.props.change('ApproveDto.MyApprovalStatus', true)
    }

    handleCheckBox = (e) =>{
        let _value = e.target.getAttribute('data-value');
        if(e.target.name == 'ApproveDto.prType'){
            if(e.target.checked){
                let _details = this.state.prType
                _details.push(_value);
                console.log('_details', _details)
                this.setState({
                    prType : _details
                })
            }
            else{
                let checkbox_filter = this.state.prType.filter((fieldValue, index) => fieldValue !== _value);
                this.setState({
                    prType : checkbox_filter
               })  
            }
           
        }
        else if(e.target.name == 'ApproveDto.MyApprovalStatus'){
            if(e.target.checked){
                let _details = this.state.MyApprovalStatus
                _details.push(_value);
                this.setState({
                    MyApprovalStatus : _details
                })
            }
            else{
                let checkbox_filter = this.state.MyApprovalStatus.filter((fieldValue, index) => fieldValue !== _value);
                this.setState({
                    MyApprovalStatus : checkbox_filter
               })  
            }

        }
        else{

        }
    }

    ClearAll = () => {
        this.props.change('ApproveDto.PRNumber', '')
        this.props.change('ApproveDto.VendorName', '')
        this.props.change('ApproveDto.StartDate', '')
        this.props.change('ApproveDto.EndDate', '')
        this.setState({
            prType : [],
            MyApprovalStatus : [], 
            start_data:'',
            end_date:'',
        })
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR Number", id:"PRM_PR_No", width:'187px', key:true, key:true,formatter: (cellContent, row) => {
                return (
                    row.STATUS_DESC === 'Draft' ?  <button type="button" className="btn btn-sm btn-outline-info" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.PRM_PR_No} 
                            <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                            {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                        </button > :  <button type="button" className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} >
                            <span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                            {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                        </button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'75px',formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'cc' || row.PRM_PR_TYPE==='CC') ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Submitted Date", id:"PRM_SUBMIT_DATE", width:'120px',dataFormat:'date'},
            {name : "Purchaser", id:"UM_USER_NAME", width:'144px',formatter: (cellContent, row) => {
                return (
                   (row.UM_USER_NAME)  ?  row.UM_USER_NAME : ''
                )
            },
        },
            {name : "Buyer Department", id:"CDM_DEPT_NAME", width:'122px'},
            {name : "Vendor Name", id:"CDM_DEPT_NAME", width:'122px',
                formatter: (cellContent, row) => {
                    return (
                       (row.SNAME)  ? <span className="btn btn-outline-primary btn-small" onClick={() => this.get_details(row, 'vn_name')} >{row.SNAME}</span> : ''
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
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))} autoComplete="off">
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant approved or rejected PR." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="ApproveDto.PRNumber" component={FromInputsParallel} className="form-control" placeholder="PR No. " label="PR No. :" />
                            <Field type="text" name="ApproveDto.VendorName" component={FromInputsParallel} className="form-control" placeholder="Vendor Name " label="Vendor Name :" />
                        </div>
                        <div className="row">
                            <Field type="text" name="ApproveDto.StartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date " label="Start Date : " onChange={this.handleDate.bind(this, 'start_date')}   clear={true}/>
                            <Field type="text" name="ApproveDto.EndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date : " onChange={this.handleDate.bind(this, 'end_date')}  clear={true}/>
                        </div>

                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">PR Type :</label>
                            </div>
                            <div className=""> 
                                <Field type="text" name="ApproveDto.prType"  component={FromCheckBoxparallel} label="Contract PR" checked={(this.state.prType.includes('CC')) ? true : false } inputvalue="CC"  onClick={this.handleCheckBox} /> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.prType"  component={FromCheckBoxparallel} label="Non-Contract PR" checked={(this.state.prType.includes('NonCont')) ? true : false }  inputvalue="NonCont"  onClick={this.handleCheckBox}/> 
                            </div>
                        </div>
                        <div className="row  mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                <label htmlFor="PRType">My Approval Status  :</label>
                            </div>
                            <div className=""> 
                             
                                <Field type="text" name="ApproveDto.MyApprovalStatus" component={FromCheckBoxparallel} label="Approved" checked={(this.state.MyApprovalStatus.includes('Approved')) ? true : false }  inputvalue="Approved" onClick={this.handleCheckBox}/> 
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6 col-4">  
                                <Field type="text" name="ApproveDto.MyApprovalStatus"  component={FromCheckBoxparallel} label="Rejected" checked={(this.state.MyApprovalStatus.includes('Rejected')) ? true : false }  inputvalue="Rejected"  onClick={this.handleCheckBox}/> 
                            </div>
                        </div>
                       

                       
                        <div className="row mt-2">    
                            <div className="col-12 col-sm-4">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <p>Include Rejected PR ? : </p>
                                    </div>
                                    <div className="col-12 col-md-5">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxparallel} type="checkbox" name="ApproveDto.included" label="(Tick to include)"  checked={this.state.checked_details.includes(0)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4">
                                <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <p>Include PR On Hold ? :</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row">
                                            <Field  id="included" component={FromCheckBoxparallel} type="checkbox" name="ApproveDto.includedHold" label="(Tick to include)"  checked={this.state.checked_details.includes(1)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4">
                                <div className="text-center row">
                                    <div className="col-12">
                                        <button type="submit" className="ml-4 btn btn-sm btn-outline-success" >Search</button>
                                        <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={(e)=>{this.SelectAll(e)}}>Select All</button>
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
                            table_body={(this.props.search_result && this.props.search_result.list) ? this.props.search_result.list : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                        />

                    </div>
                </div>
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closeModel}
                />
                </form>
        </Fragment>
    }
}

export default reduxForm({
    form:'RejectList',
})(ApprovalRejectList);
