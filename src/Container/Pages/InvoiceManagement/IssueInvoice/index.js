import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate} from '../../../../Component/Dates'
import {UserDetails} from '../../../../Common/LocalStorage'
import {FromInputsParallel, FormDatePickerParallel, FormRadioButton, FromCheckBoxparallel} from '../../../../Component/From/FromInputs'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovalRejectList extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
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
            checked_details:[]
        }
    }

    componentDidMount(){
        this.props.get_search_list()
    }

    closemodel = () => {
        this.setState({
            model : false
        })
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
        _form_value.vendorInvoiceMagtReq = Object.assign({}, _initial_obj,(_form_value.vendorInvoiceMagtReq) ? _form_value.vendorInvoiceMagtReq : _form_value )
        _form_value.vendorInvoiceMagtReq = RemoveSpecialCharacter(_form_value.vendorInvoiceMagtReq)
        this.props.get_search_list(_form_value)
    }

    get_details(details, from_location){
        console.log('get_details', details)
        details.from_location = from_location
        this.props.history.push({
            pathname : '/VendorInvoiceViewDetails',
            datas : details,
        })
    }


    get_details_po(details){
        let _user_details = UserDetails();
        let _send_details = { "POM_PO_NO": details.POM_PO_NO, "POM_B_COY_ID": details.POM_B_COY_ID, "POM_S_COY_ID": _user_details.UM_COY_ID , "PRM_PO_INDEX": details.POM_PO_INDEX, STATUS: '', from_page:"invoice_listing", frm_page:"pr_listing"}
        details.STATUS = details.STATUS_DESC;
        console.log('_send_details', _send_details, details, _user_details)
       
        this.props.history.push({
            pathname : '/VendorPOListPop',
            datas : _send_details,
        })
    }

    render(){
        const _user_details = UserDetails();
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Invoice On", id:"POM_BILLING_METHOD", width:'100px', key:true},
            {name : "PO Number", id:"POM_PO_NO", width:'164px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details_po(row, 'po_number')}>{row.POM_PO_NO} <span style={{ color: 'red' }}>{row.has_attachment === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "DO Number", id:"DO_Number", width:'164px',  formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGenerateDOPDF({DOM_S_COY_ID: _user_details.UM_COY_ID, DOM_DO_NO: row.DO_Number})}>{row.DO_Number} <span style={{ color: 'red' }}>{row.DO_Number === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "GRN Number", id:"GRN_Number", width:'173px',  formatter: (cellContent, row) => {
                return (
                    (row.GRN_Number) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetViewGRNPDF({...row, USER_ID: row.CM_COY_ID, POM_B_COY_ID: row._user_details})}>{row.GRN_Number} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button> : ''
                )
            }},
            {name : "Purchaser Company", id:"CM_COY_NAME", width:'155px'},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'88px'},
            {name : "Amount", id:"TotalAmount", width:'84px', dataFormat:'number'},
            {name : "Actions", id:"EditBtn", width:'80px',  formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row, 'do_number')}>Next</button>
                )
            }},

        ];

        

      

        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.gpdf_loading) ? <Loader /> : '' }
              {(this.props.gdopdf_loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Please select the documents to create an invoice to Purchaser. Click 'Next' to proceed." 
            />
             <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_result && this.props.search_result.get_unInvItemEn) ? this.props.search_result.get_unInvItemEn : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
                            button_text="Next"
                            table_name="issue_grn"
                            get_details = {this.get_details}
                        />

                    </div>
                </div>
                </form>
        </Fragment>
    }
}

export default reduxForm({
    form:'RejectList',
})(ApprovalRejectList);
