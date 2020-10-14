import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputs, FromCheckBox, FormDatePicker,FromSelect } from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {FromateDate, convertDateToYear} from '../../../../Component/Dates';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import GrnDetails from '../GrnDetails'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class GRNListing extends Component {

    constructor(props){
        super(props)
        this.get_details = this.get_details.bind(this)
        this.state = {
            SubmissionUIDate: '',
            SubmissionDate : '',
            CreationUIDate: '',
            CreationDate : '',
            checked_initial : [0,1,2,3,4,5],
            checked_details:[],
            show_grn:false,
            details :{},
            select_all:false
        }
    }

    componentDidMount(){
        this.props.change('DoListing.DocumentType', 'DO')
    }

    handlefromsubmit(values){
        let _form_value = values;
        
        let _initial_obj = {
            DocumentType: "DO",
            No: "",
            CreationDate: (this.state.CreationUIDate) ? convertDateToYear(this.state.CreationDate) : '',
            CreationUIDate: this.state.CreationUIDate,
            OurRefNo: "",
            BuyerCompany: "",
            ItemCode: "",
            SubmissionDate: (this.state.SubmissionUIDate) ? convertDateToYear(this.state.SubmissionDate) : '',
            SubmissionUIDate:this.state.SubmissionUIDate,
            Status:[],
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.DoListing) ? _form_value.DoListing : _form_value );
        _form_value.Status = ((this.state.select_all) ? [] : this.state.checked_details);
        _form_value.CreationDate = (this.state.CreationUIDate) ? convertDateToYear(this.state.CreationDate) : '';
        _form_value.SubmissionDate = (this.state.SubmissionUIDate) ? convertDateToYear(this.state.SubmissionDate) : '';
        // _form_value = RemoveSpecialCharacter(_form_value)

        this.props.post_issue_grn({DoListing:_form_value});
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
        console.log('_checked_value', details.target.checked)
        let {checked_details} = this.state
        let _checked_value = details.target.getAttribute('data-value')
        if(details.target.checked) {
            checked_details.push(_checked_value)
            this.setState({ checked_details : checked_details,select_all : false })
        }
        else{
            let _un_check_details = checked_details.filter((checkd_details)=>checkd_details!=_checked_value)
            console.log('_un_check_details', _un_check_details)
            this.setState({ checked_details : _un_check_details ,select_all : false  })
        }
       
    }

    get_details(details){
        this.props.history.push({
            pathname : '/deliveryorderview',
            datas : details,
        })
    }
    

    SelectAll = () =>{

        this.setState({
            checked_details : ["1", "2", "3", "4", "5", "6","1,2","3,6"],
            select_all : true
        })
     
    }

    ClearAll = () => {
        this.props.reset('GRNListing')
        this.setState({
            checked_details : [],
            SubmissionUIDate: '',
            SubmissionDate : '',
            CreationUIDate: '',
            CreationDate : ''
        })
    }

    ViewDoDetails = (_details) =>{
        let _tem_details = {"DOM_DO_NO":_details.DOM_DO_NO,"DOM_S_COY_ID":_details.DOM_S_Coy_ID, ..._details}
        this.props.history.push({
            pathname : 'view_do',
            datas : _tem_details,
            redirect_to_tab : 'DOListing',
            redirect_to_page : 'deliveryorder',
        })
    }

    ViewDoList(details){
        let _details_update = Object.assign({}, details);
        let _temp_details = {
            POM_PO_Index : _details_update.POM_PO_Index,
            POM_PO_No : _details_update.POM_PO_No,
            POM_B_COY_ID:  _details_update.POM_B_Coy_ID,
            POD_D_ADDR_CODE:  _details_update.DOM_D_ADDR_CODE,
            DOM_DO_NO: _details_update.DOM_DO_NO,
            DOM_D_Addr_Code : _details_update.DOM_D_ADDR_CODE,
        }
        this.setState({
            details : _temp_details,
            show_grn : true
        })
    }

    CloseGrn = () =>{
        this.props.post_issue_grn({"DoListing":{"DocumentType":"DO","No":"","CreationDate":"","CreationUIDate":"","OurRefNo":"","BuyerCompany":"","ItemCode":"","SubmissionDate":"","SubmissionUIDate":"","Status":[]}})
        this.setState({
            show_grn : false
        })
    }

    goBack = () =>{
        this.setState({
            show_grn : false
        })
    }

    ChangeStatus = (targer) =>{
        this.setState({
            select_all : (targer.checked) ? true : false
        })
    }

    render(){
        
        const _table_header = [
            {name : "DO Number", id:"DOM_DO_NO", width:'154px', key:true, formatter: (cellContent, row) => {
                if(row.Status_Desc!="Open"){
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.ViewDoDetails(row)}>{row.DOM_DO_NO} 
                        <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''} {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button>
                    )
                }
                else{
                    return (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => this.ViewDoList(row)}>{row.DOM_DO_NO} 
                        <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''} {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button>
                    )
                }
                
            }},
            {name : "Our Ref. No.", id:"DOM_S_Ref_No", width:'107px'},
            {name : "DO Creation Date", id:"DOM_Created_Date", width:'92px',dataFormat:'date'},
            {name : "DO Submitted On", id:"DOM_DO_Date", width:'102px',dataFormat:'date'},
            {name : "PO Number", id:"POM_PO_No", width:'160px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGeneratePRPDF({POM_B_Coy_ID:row.POM_B_Coy_ID, POM_PO_No:row.POM_PO_No})}>{row.POM_PO_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "PO Date", id:"POM_PO_Date", width:'84px',dataFormat:'date'},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'132px'},
            {name : "Item Code", id:"POD_VENDOR_ITEM_CODE", width:'98px'},
            {name : "Status", id:"Status_Desc", width:'77px', formatter: (cellContent, row) => {
                return (
                    (row.Status_Desc === 'Invoiced' || row.Status_Desc === 'invoiced') ? 'Fully Delivered' : row.Status_Desc
                )
            }},
        ];
        const { handleSubmit } = this.props
        
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.do_loading) ? <Loader /> : '' }
                {(this.props.gdopdf_loading) ? <Loader /> : '' }
                {(this.props.gprpdf_loading) ? <Loader /> : '' }
                {(this.props.pol_loading) ? <Loader /> : '' }
                {(!this.state.show_grn) ? 
                <Fragment> 
                <PageHeading 
                    heading="" 
                    subheading="Fill in the search criteria and click Search button to list the relevant DO." 
                />
                <TabHeading color={'bg-info active text-white'}>Search Criteria</TabHeading> 
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

                                <Field type="text" name="DoListing.CreationDate" selected={this.state.CreationDate} component={FormDatePicker} className="form-control" placeholder="Creation Date " label="Creation Date :" onChange={this.handleDate.bind(this, 'creation_date')} clear={true}/>
                            </div>
                            <div className="row mt-2">   
                                <Field type="text" name="DoListing.OurRefNo" component={FromInputs} className="form-control" placeholder="Our Ref. No. " label="Our Ref. No. :" />
                            </div>  
                            <div className="row mt-2">   
                                <Field type="text" name="DoListing.ItemCode" component={FromInputs} className="form-control" placeholder="Item Code" label="Item Code :" />
                            </div>  
                        </div>  
                        <div className='col-12 col-md-6'>   
                            <div className="row">   
                                <Field type="text" name="DoListing.No" component={FromInputs} className="form-control" placeholder="No. " label="No. :" />
                            </div>  
                            <div className="row mt-2">
                                <Field type="text" name="DoListing.SubmissionDate" selected={this.state.SubmissionDate} component={FormDatePicker} className="form-control" placeholder="Submission Date " label="Submission Date :" onChange={this.handleDate.bind(this, 'submission_date')} clear={true}/>
                            </div>
                            
                            <div className="row mt-2">   
                                <Field type="text" name="DoListing.BuyerCompany" component={FromInputs} className="form-control" placeholder="Buyer Company " label="Buyer Company :" />
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
                                                <Field  id="Open" component={FromCheckBox} type="checkbox" name="issueGrnListing.Open[0]" label="Open" inputvalue="1" value="1"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('1')} />
                                                <Field  id="Issued" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[1]" label="Issued" inputvalue="2" value="2"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('2')} />
                                                <Field  id="Partially Rejected" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[2]" label="Partially Rejected" inputvalue="4" value="4"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('4')} />
                                                <Field  id="Fully Delivered" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[3]" label="Fully Delivered" inputvalue="3,6" value="3,6"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('3,6')} />
                                                <Field  id="Fully Rejected" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[4]" label="Fully Rejected" inputvalue="5" value="5"  onClick={this.handleCheckbox} checked={this.state.checked_details.includes('5')} />
                                                {/* <Field  id="All" component={FromCheckBox} type="checkbox" name="issueGrnListing.Issued[5]" label="All" inputvalue="1,2" value="1,2"  onClick={(e)=>this.ChangeStatus(e.target)} checked={this.state.select_all} /> */}
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
                                    <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={this.SelectAll}>Select All</button>
                                    <button type="reset" className="ml-4 btn btn-outline-danger btn-sm" onClick={this.ClearAll}>Clear</button>
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
                </Fragment> :''}
                {(this.state.show_grn) ? 
                    <GrnDetails
                        location={this.props.location}
                        history={this.props.history}
                        datas= {this.state.details}
                        CloseGrn = {this.CloseGrn}
                        goBack= {this.goBack}
                        clear_download = {this.props.clear_download}
                    />
                :''}
        </Fragment>
    }
}

export default reduxForm({
    form:'GRNListing',
})(GRNListing);