import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate, CompareDate} from '../../../../Component/Dates'
import RfqButton from '../../../../Component/Buttons/RfqButton'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closeModel = this.closeModel.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.get_details = this.get_details.bind(this);
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
            modal : false,
            model : false
        })
    }

    componentDidMount(){
        this.props.get_search_list()
    }

  


   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
                end_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
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
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: this.state.start_data,
            UIEndDate: this.state.end_data,
            StartDate: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate(this.state.end_data ) :"",
            includedHold: false,
            included: false,
            
        }
        _form_value.PoListing = Object.assign({}, _initial_obj,(_form_value.PoListing) ? _form_value.PoListing : _form_value )
        _form_value.PoListing = RemoveSpecialCharacter(_form_value.PoListing)
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
        details.view_type='vendor_approve'
        this.props.history.push({
            pathname : '/purchaseorderDetails',
            datas : details,
        })
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PO Number", id:"POM_PO_NO", width:'140px', key:true,
            formatter: (cellContent, row) => {
                return (
                    <Fragment>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.POM_PO_NO} 
                    <span style={{ color: 'red' }}>{row.POM_URGENT == "1" ? ' U' : ''}</span>
                    {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                    </button>
                    <RfqButton {...this.props} {...row} datas={{ vcomid : row.POM_S_COY_ID, rfq_id : row.POM_RFQ_INDEX,rfq_no : row.RM_RFQ_No}}  pathname= 'view_quotation' redirect_to_tab='POListing' redirect_to_page='purchaseorder'/></Fragment>
                )
            }},
            {name : "PO Date", id:"POM_PO_DATE", width:'59px', dataFormat:'date'},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Purchaser", id:"POM_BUYER_NAME", width:'144px'},
            {name : "PO Status", id:"STATUS_DESC", width:'144px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="Pending Acceptance / Acknowledgement PO" 
                subheading="Click the PO Number to see the PO details" 
            />
             <hr></hr>
             {/* <div className='col-12 col-md-12'>   
                        <div className="row">
                            <Field type="text" name="PoListing.PO_NO" component={FromInputsParallel} className="form-control" placeholder="PO No." label="PO No." />
                            <Field type="text" name="PoListing.Vendor_name" component={FromInputsParallel} className="form-control" placeholder="Vendor Name" label="Vendor Name " />
                        </div>
                      
                        <div className="row">
                            <Field type="text" name="PoListing.UIStartDate" selected={this.state.start_data} component={FormDatePickerParallel} className="form-control" placeholder="Start Date" label="Start Date" onChange={this.handleDate.bind(this, 'start_date')} />
                            <Field type="text" name="PoListing.UIEndDate" selected={this.state.end_data}  component={FormDatePickerParallel} className="form-control" placeholder="End Date" label="End Date" onChange={this.handleDate.bind(this, 'end_date')}/>
                        </div>
                        
                    </div>  
                    */}
                  
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.getPOForAck) ? this.props.search_result.getPOForAck : [] } 
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
