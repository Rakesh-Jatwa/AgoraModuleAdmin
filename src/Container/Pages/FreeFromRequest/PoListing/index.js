import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import {getstrStatus} from '../../../../Actions/Common/Functions'
import {UserDetails} from '../../../../Common/LocalStorage';
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.get_details = this.get_details.bind(this);
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
            PO_NO: "",
            Vendor_name: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
          
            POStatus: "",
            PoNo : "",
            Item_code:"",
            type: "MyPO",
            Fulfilment : "",
            search_type: "cancel"
           
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : _form_value )
        _form_value.StartDate = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.EndDate = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"";
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

    get_details(details){
        this.props.history.push({
            pathname : '/purchaseorderDetails',
            datas : details,
            
        })
    }

    viewPageDetails(details, cell, row){
        let _details = {...cell}
        _details.PRM_PR_No = _details.PR_NO
        _details.PRM_PR_Index = _details.PR_INDEX
        console.log('_details',_details)
        this.props.get_pr_details(_details)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: _details,
            type:'listing',
            redirect_to_tab : 'profile',
            redirect_to_page : 'raiseFFPO'
        })
    }


     view_po = (details) =>{
        let _details = {
            "POM_B_COY_ID":details.POM_B_COY_ID,
            "POM_S_COY_ID":details.POM_S_COY_ID,
            "POM_PO_NO":details.POM_PO_NO,
            ...details
        }

        this.props.history.push({
            pathname : 'po_cancellation',
            datas : _details,
            redirect_to_tab : 'profile',
            redirect_to_page : 'raiseFFPO',
        })
    }

    ClearAll = () => {
        this.setState({
            checked_details:  [],
            start_data:'',
            end_data:''
        })
        this.props.reset('PoCancellation')
    }


    render(){
        const _user_details = UserDetails();
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PO Number", id:"POM_PO_NO", width:'200px', key:true,
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>this.view_po(row)}>{row.POM_PO_NO}  <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "PO Creation Date", id:"POM_CREATED_DATE", width:'100px', dataFormat:'date'},
            {name : "PO Date", id:"POM_PO_DATE", width:'100px', dataFormat:'date'},
           
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'144px'},
            {name : "PO Accepted Date", id:"POM_CREATED_DATE", width:'144px', dataFormat:'date'},
   
            {name : "PO Status", id:"STATUS_DESC", width:'142px',   formatter: (cellContent, row) => {
                return (
                    getstrStatus(row.STATUS_DESC)
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
                heading={(_user_details.ROLE_NAME=="Vendor") ? "Pending Acceptance / Acknowledgement PO" : ''}
                subheading="Fill in the search criteria and click Search button to list the relevant PO. Click the PO No. to go to PO Cancellation page." 
            />
             <hr></hr>
             <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="PoListing.PO_NO" component={FromInputsParallel} className="form-control" placeholder="PO No." label="PO No. :" />
                            <Field type="text" name="PoListing.Vendor_name" component={FromInputsParallel} className="form-control" placeholder="Vendor Name" label="Vendor Name :" />
                        </div>
                      
                        <div className="row">
                            <Field type="text" name="PoListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date :" onChange={this.handleDate.bind(this, 'start_date')} clear={true}/>
                            <Field type="text" name="PoListing.UIEndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date :" onChange={this.handleDate.bind(this, 'end_date')} clear={true}/>
                        </div>
                        
                    </div>  
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
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
    form:'PoCancellation',
})(ApprovalRejectList);
