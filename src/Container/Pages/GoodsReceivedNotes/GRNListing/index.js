import React, {Component, Fragment } from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import {FromInputs, FromCheckBox, FormDatePicker,FromSelect } from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate_YY_MM_DD, FromateDateUtc} from '../../../../Component/Dates'
import {UserDetails} from '../../../../Common/LocalStorage'
import Alert from '../../../../Component/Modal/alert'
import {EscapeQuotes} from '../../../../validation/TableValidation'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class GRNListing extends Component {

    constructor(props){
        super(props)
        this.selectedall = this.selectedall.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.state = {
            CreationUIDate:  new Date(),
            CreationDate : '',
            checked_initial : [1,2,3],
            all_check_value:[],
            checked_details:[1,2,3],
            modal:false,
            modal_title:'',
            modal_body:'',
        }
    }

    

    
    closeModel (details){
        this.setState({
            modal : false,
        })
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            DocumentType: "",
            No: "",
            CreationUIDate: this.state.CreationUIDate,
            VendorName: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.issueGrnListing) ? _form_value.issueGrnListing : _form_value )
        _form_value.CreationUIDate = this.state.CreationUIDate
        _form_value.CreationDate = (this.state.CreationDate) ? FromateDate_YY_MM_DD(this.state.CreationDate) : '';
        _form_value.Status = ((this.state.checked_details.length > 0)? this.state.all_check_value : this.state.checked_initial)
        _form_value = RemoveSpecialCharacter(_form_value)
        if(_form_value.DocumentType && _form_value.No){
            this.props.post_issue_grn({issueGrnListing:_form_value});
        }
        else if (_form_value.DocumentType && (!_form_value.No)){
            this.setState({
                modal:true,
                modal_title:'',
                modal_body:`Please Enter ${_form_value.DocumentType} Number`,
            })
        }
        else if(!_form_value.DocumentType && (!_form_value.No)){
            this.props.post_issue_grn({issueGrnListing:_form_value});
        }
       
    }

    handleDate = (name, details) =>{
        this.setState({
            CreationUIDate: details,
            CreationDate : details
        })
    }

    handleCheckbox = (details) =>{
        let all_check_value = this.state.all_check_value;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            _checked = parseInt(_checked)
            all_check_value.push(_checked)
        }
        else{
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
          
        }
        this.setState({all_check_value:all_check_value})
       
    }

    selectedall = () => {
        this.setState({ all_check_value : [1,2,3]})
    }
    
    viewPo(row){
        let _user_details = UserDetails();
        row.POM_S_COY_ID = row.POM_S_Coy_ID;
        row.POM_B_COY_ID = _user_details.UM_COY_ID;
        row.PRM_PO_INDEX = row.DOM_PO_Index;
        row.STATUS_DESC = row.Status_Desc
        row.frompage = "issueGrn"
        this.props.history.push({
            pathname: '/purchaseorderDetails',
            datas: row,
            redirect_to_tab : 'GRNListing',
            redirect_to_page : 'issueGrn',
        });
    }

    viewDo(row){
        let _user_details = UserDetails();
        row.DOM_DO_NO = row.DOM_DO_NO;
        row.POM_PO_Index = row.DOM_PO_Index;
        row.DOM_S_COY_ID = row.POM_S_Coy_ID;
        row.POM_PO_No = row.POM_PO_NO;
        row.CM_COY_NAME = row.POM_S_Coy_Name;
        row.rompage = "issueGrn"


        console.log('_details', row)
        this.props.history.push({
            pathname: '/view_do',
            datas: row,
            redirect_to_tab : 'GRNListing',
            redirect_to_page : 'issueGrn',
        });
    }

    
    viewGRN(row){
        let _user_details = UserDetails();
        row.frompage = "issueGrn"
        this.props.history.push({
            pathname: '/view_grn',
            datas: row,
            redirect_to_tab : 'GRNListing',
            redirect_to_page : 'issueGrn',
        });
    }

    ClearAll = () => {
        this.setState({
            all_check_value : [],
            CreationUIDate:  '',
            CreationDate : '',
        })
        this.props.reset('GRNListing')
    }

    render(){
        let _user_details = UserDetails();
        const _table_header = [
            {name : "PO Number", id:"POM_PO_NO", width:'184px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.viewPo(row)}>{row.POM_PO_NO}{row.PRM_URGENT === "1" ? ' U' : ''} {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""} <span style={{ color: 'red' }}></span></button>
                )
            }},
            
            {name : "PO Creation Date", id:"POM_PO_DATE", width:'92px'},
            {name : "DO Number", id:"DOM_DO_NO", width:'160px',formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.viewDo(row)}>{row.DOM_DO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "DO Creation Date", id:"DOM_DO_DATE", width:'92px'},
            {name : "GRN Number", id:"GM_GRN_NO", width:'173px',formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.viewGRN({...row,GRN_Number:row.GM_GRN_NO,DO_Number:row.DOM_DO_NO, POM_B_COY_ID:row.POM_B_COY_ID, USER_ID:_user_details.UM_COY_ID})}>{row.GM_GRN_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "GRN Date", id:"GM_CREATED_DATE", width:'93px'},
            {name : "GRN Received Date", id:"GM_DATE_RECEIVED", width:'111px'},
            {name : "Vendor Name", id:"POM_S_Coy_Name", width:'131px'},
            {name : "Status", id:"Status_Desc", width:'72px'},
        ];
        const { handleSubmit } = this.props
        return <Fragment>
                {(this.props.loading) ? <Loader /> : '' }
                {(this.props.gr_loading) ? <Loader /> : '' }
                {(this.props.po_loading) ? <Loader /> : '' }
                {(this.props.do_loading) ? <Loader /> : '' }
                <PageHeading 
                    heading="" 
                    subheading="Select/fill in the search criteria and click Search button to list the relevant PO/DO/GRN." 
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className="row mt-2">    
                        <div className='col-12 col-md-6'>   
                            <div className="row">     
                                <Field name="issueGrnListing.DocumentType" className="form-control mb-3" component={FromSelect} label={"Document Type :"}>
                                    <option  value="">--Select--</option>
                                    <option value="DO">DO</option>
                                    <option value="PO">PO</option>
                                    <option  selected value="GRN">GRN</option>
                                </Field>
                            </div> 
                            <div className="row mt-2">
                                <Field type="text" name="issueGrnListing.CreationDate" selected={this.state.CreationDate} component={FormDatePicker} className="form-control" placeholder="Creation Date " label="Creation Date : " onChange={this.handleDate.bind(this, 'creation_date')} clear={true}/>
                            </div>
                        </div>  
                        <div className='col-12 col-md-6'>   
                            <div className="row">   
                                <Field normalize={EscapeQuotes} type="text" name="issueGrnListing.No" component={FromInputs} className="form-control" placeholder="No. " label="No. :" />
                            </div>  
                            <div className="row mt-2 parallel-label">   
                                <Field type="text" name="issueGrnListing.VendorName" component={FromInputs} className="form-control" placeholder="Vendor Name " label="Vendor Name :" />
                            </div>  
                        </div>
                        <div className="col-12"> 
                            <div className="row mt-2">    
                                <div className="col-12 col-md-10"> 
                                    <div className="row">
                                        <div className="col-12 col-md-2 mt-2">
                                            <p>Status :</p>
                                        </div>
                                        <div className="col-12 col-md-10 grn_listing">
                                            <div className="row mt-2">
                                                <Field  id="Uninvoiced" component={FromCheckBox} type="checkbox" name="issueGrnListing.Status[1]" label="Uninvoiced" inputvalue="1" value="1"  onClick={this.handleCheckbox} checked={this.state.all_check_value.includes(1)} />
                                                <Field  id="Invoiced" component={FromCheckBox} type="checkbox" name="issueGrnListing.Status[2]" label="Invoiced" inputvalue="2" value="2" onClick={this.handleCheckbox}  checked={this.state.all_check_value.includes(2)}/>
                                                <Field  id="Pending" component={FromCheckBox} type="checkbox" name="issueGrnListing.Status[3]" label="Pending Acknowledgement" inputvalue="3" value="3" onClick={this.handleCheckbox} checked={this.state.all_check_value.includes(3)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="text-right mt-2 row">
                                <div className="col-12 mt-2">
                                    <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                    <button type="button" className="ml-4 btn btn-sm btn-outline-primary" onClick={()=>this.selectedall()}>Select All</button>
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
                            table_body={(this.props.get_issue_grn) ? this.props.get_issue_grn.grnListing: [] } 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                        />

                    </div>
                </div>
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
    form:'GRNListing',
})(GRNListing);