import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import {FromInputsParallel, FromCheckBoxparallel, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
class ApprovalRejectList extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.getTypeChecked = this.getTypeChecked.bind(this)
        this.state = {
            products:[],
            checkbox : [],
            start_data:'',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            checked_initial : [0,1,2,3],
            checked_details:[]
        }
    }

    handleCheckboxClick(event, details){
        let {checkbox} = this.state
        let _value = `${event.target.value}`
        if(event.target.checked){
            checkbox.push(_value);
            this.setState({checkbox:checkbox})
        }
        else{
            let checkbox_filter = this.state.checkbox.filter((fieldValue, index) => fieldValue !== _value);
            this.setState({
                checkbox : checkbox_filter
           })
        }
    }

    getTypeChecked(details){
        let strPRType = this.state.checkbox;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
      
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            strPRType.push(_checked)
        }
        else{
            strPRType= strPRType.filter((list)=>{return list != _checked})
          
        }

        console.log('getTypeChecked', this.state.checkbox)
        this.setState({checkbox:strPRType})
    }

    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        this.props.history.push({
            pathname : '/approvepr',
            datas : details.datas,
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
        let status = (values.vendorInvoiceMagtReq && values.vendorInvoiceMagtReq.PoStatus && values.vendorInvoiceMagtReq.PoStatus.length) ? Object.keys(values.vendorInvoiceMagtReq.PoStatus) : this.state.checked_initial;

        let _initial_obj = {
            invoiceNo: "",
            bComId: "",
            status: [],
            strStatus: "1",
        }
        _form_value.vendorInvoiceMagtReq = Object.assign({}, _initial_obj,(_form_value.vendorInvoiceMagtReq) ? _form_value.vendorInvoiceMagtReq : {} )
        _form_value.vendorInvoiceMagtReq.status =  (this.state.checkbox && this.state.checkbox.length > 0 ) ? this.state.checkbox :[];
        _form_value.vendorInvoiceMagtReq.strStatus =  (this.state.checkbox && this.state.checkbox.length > 0 ) ? this.state.checkbox.toString() :[1,2,3,4].toString();
        _form_value.vendorInvoiceMagtReq = RemoveSpecialCharacter(_form_value.vendorInvoiceMagtReq)
        this.props.get_search_list(_form_value)
    }

    Checkall = () =>{
        let   {checked_details} = this.state
        this.setState({
          checkbox : [1,2,3,4]
        })
      }
  
      ClearAll = () =>{
          this.props.reset('RejectList')
          this.setState({
            checkbox:[],
          })
      }
  

    render(){
        
       
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Invoice Number", id:"IM_INVOICE_NO", width:'200px', key:true, formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetInvoicePDF(row)}>{row.IM_INVOICE_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Creation Date", id:"IM_CREATED_ON", width:'110px', dataFormat:'created_date'},
            {name : "PO Number", id:"POM_PO_NO", width:'200px', formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.props.GetGeneratePOPDF({POM_B_Coy_ID:row.POM_B_COY_ID, POM_PO_No: row.POM_PO_NO})}>{row.POM_PO_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Buyer Company", id:"CM_COY_NAME", width:'144px'},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'122px'},
            {name : "Amount", id:"IM_INVOICE_TOTAL", width:'122px', dataFormat:'number'},
            {name : "Status", id:"STATUS_DESC", width:'110px'},
        ];



       
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.gpopdf_loading) ? <Loader /> : '' }
              {(this.props.ipdf_loading) ? <Loader /> : '' }
             
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant Invoice." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12 vendor_invoice_listing_search'>   
                        <div className="row">
                            <Field type="text" name="vendorInvoiceMagtReq.PRNumber" component={FromInputsParallel} className="form-control" placeholder="Invoice No. " label="Invoice No. :" />
                            <Field type="text" name="vendorInvoiceMagtReq.BuyerCompany" component={FromInputsParallel} className="form-control" placeholder="Buyer Company " label="Buyer Company :" />
                        </div>
                        

                        <div className="row mt-2 vendor_invoice_listing">    
                                <div className="col-lg-1 col-md-2 col-12">
                                    <p>Status :</p>
                                </div>
                                <div className="col-lg-11 col-md-10 col-12 vendor_invoice_checkbox">
                                
                                        <Field  id="New" component={FormRadioButtonSpan} type="New" name="vendorInvoiceMagtReq.PoStatus[1]" label="New" onChange={this.getTypeChecked}  checked={this.state.checkbox.includes('1')} />
   
                                    
                                        <Field  id="PendingApproval" component={FormRadioButtonSpan} type="New" name="vendorInvoiceMagtReq.PoStatus[2]" label="Pending Approval" onChange={this.getTypeChecked}  checked={this.state.checkbox.includes('2')} />
                                    
                                        <Field  id="Approved" component={FormRadioButtonSpan} type="Approved" name="vendorInvoiceMagtReq.PoStatus[3]" label="Approved" onChange={this.getTypeChecked}  checked={this.state.checkbox.includes('3')} />
                                   
                                        <Field  id="Paid" component={FormRadioButtonSpan} type="Paid" name="vendorInvoiceMagtReq.PoStatus[4]" label="Paid" onChange={this.getTypeChecked}  checked={this.state.checkbox.includes('4')} />
                                </div>  
                        </div>
                    </div>  
                   
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                {/* <button type="button" className="ml-4 btn btn-sm btn-outline-primary">Select All</button> */}
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
                            table_body={(this.props.search_result) ? this.props.search_result : [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={true}
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
