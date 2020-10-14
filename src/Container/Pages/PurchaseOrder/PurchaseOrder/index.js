import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate, FromateDate_YY_MM_DD, CompareDate} from '../../../../Component/Dates'
import {getPOStatusLsiting, getPOFullFillment,RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import RfqButton from '../../../../Component/Buttons/RfqButton'
import Alert from '../../../../Component/Modal/alert'
import {UserDetails} from '../../../../Common/LocalStorage'
import {FromInputsParallel, FormDatePickerParallel, FromCheckBoxFullWidth} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:'',
            PRNumber : ["1,2", 3, "4,5", "5"],
            // Fulfilment : [1, "4,5,0", 3],
            Fulfilment : [0, 4, 5, 0, 3, 1, 2],
            end_data:'',
            check_value:false,
            checked_initial : [0,1,2],
            checked_details:[],
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closemodel = () => {
        this.setState({
            modal : false
        })
    }

    get_details(details){
        let _details = Object.assign({}, details)
        _details.STATUS = details.STATUS_DESC;
        _details.page_name = "vendor_po_listing"
        console.log('_details',_details)
        this.props.history.push({
            pathname : '/VendorPOListPop',
            datas : _details,
            redirect_to_tab : 'POListing',
            redirect_to_page : 'purchaseorder',
            page_name:"poslisting"
        })
    }

    handleCheckbox = (details, target) =>{
        let {checked_details} = this.state
        let _checked_value = details.target.getAttribute('data-value')
        if(details.target.checked && details.target.value=="false" || details.target.value==""){
            checked_details.push(_checked_value)
            this.setState({ checked_details : checked_details })
        }
        else{
            checked_details = checked_details.filter((list)=>list!=_checked_value)
            this.setState({ checked_details : checked_details })
        }
       
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
            })
            this.props.change('PoListing.UIEndDate', date)
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
    }

    componentDidMount(){
        let _initial_obj = {
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            PoStatus: ["1,2", "3", "4,5", "3,6"],
            Fulfilment : this.state.Fulfilment
        }
        

        this.props.get_search_list({PoListing:_initial_obj})
    }

    handlefromsubmit(values){
        let _form_value = values;
        console.log('_form_value', _form_value)
        if(_form_value && _form_value.PoListing && _form_value.PoListing.StartDate){
            delete  _form_value.PoListing.StartDate
        }
        if(_form_value && _form_value.PoListing && _form_value.PoListing.EndDate){
            delete  _form_value.PoListing.EndDate
        }
     
        let _initial_obj = {
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            PoStatus: ["1,2", "3", "4,5", "3,6"],
            Fulfilment : this.state.Fulfilment,
        }
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : {} )
        _form_value.PoListing.PoStatus = ( this.state.checked_details && this.state.checked_details.length > 0 ) ? this.state.checked_details : ["1,2", 3, "4,5", "5"];
       
        _form_value.PoListing.StartDate =  (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.PoListing.EndDate =  (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"";
        _form_value.PoListing = RemoveSpecialCharacter(_form_value.PoListing)
        if(_form_value.PoListing.PoStatus && _form_value.PoListing.PoStatus.length >=1 ){
            _form_value.PoListing.Fulfilment = getPOFullFillment(_form_value.PoListing.PoStatus)
        }
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

    SelectAll = () =>{
        this.setState({
            checked_details:  ["1,2", "3", "4,5", "3,6"]
        })
    }

    ClearAll = () => {
        this.setState({
            checked_details:  []
        })
        this.props.reset_form()
    }

    render(){
        let _user_details = UserDetails();
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PO Number", id:"POM_PO_NO", width:'200px', key:true,
            formatter: (cellContent, row) => {
                return (
                    <Fragment> 
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POM_PO_NO}  
                        <span style={{ color: 'red' }}>{row.POM_URGENT === "1" ? ' U' : ''}</span>
                        {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                      
                    </button>
                    <RfqButton {...this.props} {...row} datas={{ vcomid : row.POM_S_COY_ID, rfq_id : row.POM_RFQ_INDEX,rfq_no : row.RM_RFQ_No}}  pathname= 'view_quotation' redirect_to_tab='POListing' redirect_to_page='purchaseorder'/></Fragment>
                )
            }},
            {name : "PO Date", id:"POM_PO_DATE", width:'100px', dataFormat:'date'},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Buyer", id:"POM_BUYER_NAME", width:'144px'},
            {name : "PO Status", id:"STATUS_DESC", width:'110px',
                formatter: (cellContent, row) => {
                    if(_user_details && _user_details.UM_COY_ID && (_user_details.UM_COY_ID.match(/^\d/))) {
                        return (getPOStatusLsiting(row))
                    }
                    else{
                        return (getPOStatusLsiting(row))
                       
                    }
                }
            },
            
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PO. Click the PO Number to see the PO details." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="PoListing.PoNo" component={FromInputsParallel} className="form-control" placeholder="PO No." label="PO No." />
                            <Field type="text" name="PoListing.BuyerCompany" component={FromInputsParallel} className="form-control" placeholder="Buyer Company" label="Buyer Company" />
                        </div>
                        <div className="row">
                            <Field type="text" name="PoListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')} clear={true}/>
                            <Field type="text" name="PoListing.UIEndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date" onChange={this.handleDate.bind(this, 'end_date')} minDate={this.state.start_data} clear={true}/>
                        </div>

                        <div className="row mt-2">    
                                <div className="col-lg-2 col-md-2 col-12">
                                    <p>PO Status :</p>
                                </div>
                                <div className="col-12 col-md-1">
                                    <div className="row">
                                        <Field  id="New" component={FromCheckBoxFullWidth} type="New" name="PoListing.PoStatus" label="New" name="issueGrnListing.PoStatus[1]"  inputvalue="1,2" value="1,2"  checked={this.state.checked_details.includes('1,2')} onClick={this.handleCheckbox} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-2">
                                    <div className="row">
                                        <Field  id="OutStanding" component={FromCheckBoxFullWidth} type="New" name="PoListing.PoStatus" label="OutStanding" name="issueGrnListing.PoStatus[2]"  inputvalue="3" value="3"  checked={this.state.checked_details.includes('3')} onClick={this.handleCheckbox} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-2">
                                    <div className="row">
                                        <Field  id="Cancelled" component={FromCheckBoxFullWidth} type="New" name="PoListing.PoStatus" label="Cancelled" name="issueGrnListing.PoStatus[3]"  inputvalue="4,5" value="4,5"  checked={this.state.checked_details.includes('4,5')} onClick={this.handleCheckbox} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-1">
                                    <div className="row">
                                        <Field  id="Closed" component={FromCheckBoxFullWidth} type="New" name="PoListing.PoStatus" label="Closed"  name="issueGrnListing.PoStatus[4]" inputvalue="3,6" value="3,6" checked={this.state.checked_details.includes('3,6')} onClick={this.handleCheckbox} />
                                    </div>
                                </div>
                        </div>
                    </div>  
                   
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.SelectAll()}>Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.ClearAll()}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.po_List) ? this.props.search_result.po_List : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
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
    form:'RejectList',
})(ApprovalRejectList);
