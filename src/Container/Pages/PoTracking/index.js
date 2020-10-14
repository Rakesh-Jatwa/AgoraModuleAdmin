import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../Component/Heading/PageHeading';
import TabHeading from '../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../Component/Table/BootstrapCustomTable'
import {GetPoTrackingList} from '../../../Actions/Vendor'
import Loader from '../../../Component/Loader'
import Alert from '../../../Component/Modal/alert'
import {FromInputsParallel, FormDatePickerParallel, FromSelectParallel} from '../../../Component/From/FromInputs'
import {FromateDate, DateMinus, convertDateToYear, TodayDateSalash, CompareDate, FromateDate_YY_MM_DD} from '../../../Component/Dates'
import {RemoveSpecialCharacter} from '../../../Actions/Common/Functions'
import {UserDetails} from '../../../Common/LocalStorage'
import {get_po_status_int} from '../../../Actions/Common/Functions'

class PoTracking extends Component {
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
            show_table :false,
            edit_details : {},            
            country_name : '',
            state_name : '',
            hm_country:'MY',
            search_object : {
                hm_country: "",
                hm_state: "All",
                hm_year:new Date().getFullYear()
            },
            modify_details : {}
            
          
        }
    }

    componentDidMount(){
        this.props.GetPoTrackingList()
        var _date = new Date();
        _date.setMonth(_date.getMonth() - 6);
        this.props.change('startDate', _date);
        this.props.change('endDate', new Date()); 
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
        let _form_value = values;
        let _initial_obj = {
            poNo: "",
            VendorName: "",
            startDate : this.state.start_data,
            endDate: this.state.end_data,
            strStatus : ''
        }

        _form_value = Object.assign({}, _initial_obj,(_form_value.ApproveDto) ? _form_value.ApproveDto : _form_value )
        _form_value.startDate = (_form_value.startDate  && _form_value.startDate!="Invalid date") ? convertDateToYear(_form_value.startDate) : ''
        _form_value.endDate = (_form_value.endDate && _form_value.endDate!="Invalid date") ? convertDateToYear(_form_value.endDate) : ''
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.GetPoTrackingList(_form_value)
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
            this.props.GetPoTrackingList(_form_value)
        }
      
    }


    ClearAll = () => {
        this.setState({
            start_data:'',
            end_data : ''
        })
        this.props.reset('PoTrackingHolder')
    } 
   
    render(){
        const { handleSubmit } = this.props
        const _table_header = [
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

        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }
              
          
              
          
                <PageHeading  heading="Purchase Order Tracking" subheading="Fill in the search criteria and click Search button to list the relevant PO."  />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div>
                    <div className="col-12 col-sm-12">
                        <div className='row'> 
                                <Field type="text" name="poNo" component={FromInputsParallel} className="form-control" placeholder={''} label="PO No.:"/>
                                <Field type="text" name="vendorName" component={FromInputsParallel} className="form-control" placeholder={''} label="Vendor Name :"/>
                                <Field type="text" name="startDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date " label="Start Date :" onChange={this.handleDate.bind(this, 'start_date')}  clear={true}/>
                                <Field type="text" name="endDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePickerParallel} className="form-control" placeholder="End Date " label="End Date :" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')}  clear={true}/>
                                <Field type="text" name="strStatus" component={FromSelectParallel}  className="form-control" placeholder="PO Status" label="PO Status :" >
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
        </Fragment>
    }
}

const mapStateToProps = state => ({
    po_tracking : state.po_tracking.responseList,
    loading: state.po_tracking.loading,

})

const mapDispatchToProps = dispatch => ({
    GetPoTrackingList : (values) => dispatch(GetPoTrackingList(values))
})


const PoTrackingHolder = connect(mapStateToProps, mapDispatchToProps)(PoTracking);
export default reduxForm({
    form:'PoTrackingHolder',
})(PoTrackingHolder);