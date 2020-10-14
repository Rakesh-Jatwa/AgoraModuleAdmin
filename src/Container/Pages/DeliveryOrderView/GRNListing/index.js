import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputs, FromCheckBox, FormDatePicker,FromSelect } from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {FromateDate, convertDateToYear} from '../../../../Component/Dates';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class GRNListing extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.state = {
            SubmissionUIDate: '',
            SubmissionDate : new Date(),
            CreationUIDate: '',
            CreationDate : new Date(),
            checked_initial : [0,1,2,3,4,5],
            checked_details:[]
        }
    }

    componentDidMount(){

    }

    handlefromsubmit(values){
        let _form_value = values;
        if(_form_value.hasOwnProperty('DoListing') && _form_value.DoListing.hasOwnProperty('Status')){
            delete _form_value.DoListing.Status;
        }
        if(_form_value.hasOwnProperty('DoListing') && _form_value.DoListing.hasOwnProperty('CreationDate')){
            delete _form_value.DoListing.CreationDate;
        }
        if(_form_value.hasOwnProperty('DoListing') && _form_value.DoListing.hasOwnProperty('SubmissionDate')){
            delete _form_value.DoListing.SubmissionDate;
        }
        let _initial_obj = {
            DocumentType: "DO",
            No: "",
            CreationDate: convertDateToYear(this.state.CreationDate),
            CreationUIDate: this.state.CreationUIDate,
            OurRefNo: "",
            BuyerCompany: "",
            ItemCode: "",
            SubmissionDate: convertDateToYear(this.state.SubmissionDate),
            SubmissionUIDate:this.state.SubmissionUIDate,
            Status:[],
        }
        _form_value.DoListing = Object.assign({}, _initial_obj,(_form_value.DoListing) ? _form_value.DoListing : _form_value )
        _form_value.DoListing = RemoveSpecialCharacter( _form_value.DoListing )
        this.props.post_issue_grn(_form_value);
    }

    handleDate = (name, details) =>{
        if(name=="submission_date"){
            this.setState({
                SubmissionUIDate: details,
                SubmissionDate : details
            })
        }
        else{
            this.setState({
                CreationUIDate: details,
                CreationDate : details
            })
        }
       
       
    }

    handleCheckbox = (details) =>{
        let {checked_details} = this.state
        let _checked_value = details.target.getAttribute('data-value')
        if(details.target.value=="false" || details.target.value==""){
            checked_details.push(_checked_value)
            this.setState({ checked_details : checked_details })
        }
        else{
            delete checked_details[_checked_value]
            this.setState({ checked_details : checked_details })
        }
       
    }

    get_details(details){
        this.props.history.push({
            pathname : '/deliveryorder',
            datas : details.datas,
        })
    }
    

    render(){
        
        const _table_header = [
            {name : "DO Number", id:"DOM_DO_NO", width:'150px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGenerateDOPDF({DOM_S_COY_ID: row.DOM_S_Coy_ID, DOM_DO_NO: row.DOM_DO_NO})}>{row.DOM_DO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Our Ref. No.", id:"DOM_S_Ref_No", width:'114px'},
            {name : "DO Creation Date", id:"DOM_Created_Date", width:'116px',dataFormat:'date'},
            {name : "DO Submitted On", id:"DOM_DO_Date", width:'116px',dataFormat:'date'},
            {name : "PO Number", id:"POM_PO_No", width:'180px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGeneratePRPDF({POM_B_Coy_ID:row.POM_B_Coy_ID, POM_PO_No:row.POM_PO_No})}>{row.POM_PO_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "PO Date", id:"POM_PO_Date", width:'116px',dataFormat:'date'},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'132px'},
            {name : "Item Code", id:"POM_PO_DATE", width:'88px'},
            {name : "Status", id:"Status_Desc", width:'200px', formatter: (cellContent, row) => {
                return (
                    row === 'Invoiced' ? 'Fully Delivered' : row.Status_Desc
                )
            }},
        ];
        const { handleSubmit } = this.props
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.do_loading) ? <Loader /> : '' }
                {(this.props.gdopdf_loading) ? <Loader /> : '' }
                {(this.props.gprpdf_loading) ? <Loader /> : '' }

                <PageHeading 
                    heading="" 
                    subheading="Fill in the search criteria and click Search button to list the relevant DO." 
                />
                <TabHeading color={'bg-info'}>Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">    
                        <div className='col-12 col-md-6'>   
                            <div className="row">     
                                <Field name="DoListing.DocumentType" className="form-control mb-3" component={FromSelect} label={"Document Type :"}>
                                    <option value="">--Select--</option>
                                    <option value="DO">DO</option>  
                                    <option value="PO">PO</option>
                                </Field>
                            </div> 
                            <div className="row mt-2">
                                <Field type="text" name="DoListing.CreationDate" selected={this.state.CreationDate} component={FormDatePicker} className="form-control" placeholder="Creation Date " label="Creation Date" onChange={this.handleDate.bind(this, 'creation_date')} clear={true}/>
                            </div>
                            <div className="row mt-2">   
                                <Field type="text" name="DoListing.OurRefNo" component={FromInputs} className="form-control" placeholder="Our Ref. No " label="Our Ref. No :" />
                            </div>  
                        </div>  
                        <div className='col-12 col-md-6'>   
                            <div className="row">   
                                <Field type="text" name="DoListing.No" component={FromInputs} className="form-control" placeholder="No " label="No :" />
                            </div>  
                            <div className="row mt-2">
                                <Field type="text" name="DoListing.SubmissionDate" selected={this.state.SubmissionDate} component={FormDatePicker} className="form-control" placeholder="Submission Date " label="Submission Date" onChange={this.handleDate.bind(this, 'submission_date')} clear={true}/>
                            </div>
                            <div className="row mt-2">   
                                <Field type="text" name="DoListing.BuyerCompany" component={FromInputs} className="form-control" placeholder="Buyer Company" label="Buyer Company:" />
                            </div>  
                        </div>
                        <div className="col-12"> 
                            <div className="row mt-2">    
                                <div className="col-12 col-md-10"> 
                                    <div className="row">
                                        <div className="col-12 col-md-2 mt-2">
                                            <p>Status :</p>
                                        </div>
                                        <div className="col-12 col-md-10">
                                            <div className="row mt-2">
                                                <Field  id="Open" component={FromCheckBox} type="checkbox" name="issueGrnListing.Status[0]" label="Uninvoiced" inputvalue="0" value="0"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('0')} />
                                                <Field  id="Issued" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[1]" label="Issued" inputvalue="1" value="1"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('1')} />
                                                <Field  id="Partially Rejected" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[2]" label="Partially Rejected" inputvalue="2" value="2"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('2')} />
                                                <Field  id="Fully Delivered" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[3]" label="Fully Delivered" inputvalue="3" value="3"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('3')} />
                                                <Field  id="Fully Rejected" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[4]" label="Fully Rejected" inputvalue="4" value="4"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('4')} />
                                                <Field  id="All" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[5]" label="All" inputvalue="5" value="5"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('5')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12 mt-2">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-primary">Search</button>
                                    <button type="reset" className="ml-4 btn btn-outline-danger btn-sm" >Clear</button>
                                </div>
                            </div>
                         </div>  
                    </div>  
                </form>
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.get_issue_grn && this.props.get_issue_grn.DoListing) ? this.props.get_issue_grn.DoListing: [] } 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />

                    </div>
                </div>
        </Fragment>
    }
}

export default reduxForm({
    form:'issuegrn',
})(GRNListing);