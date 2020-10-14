import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm, change } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import NewInvoiceFilter from '../Filters/NewInvoiceFilter'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class PurchaseOrder extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.state = {
            products:[],
            start_data:'',
            end_data : '',
            paymentUIDueDate :'',
            paymentDueDate : '',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "3", "4,5,0", "3"],
            checked_initial : [0,1,2],
            checked_details:[],
            vendor_details : '',
            initial_object:{
                invoiceDto:{
                    "docNumber":"",
                    "doctype":"",
                    "vendorName":"",
                    "dteDateFr":"",
                    "dteDateTo":"",
                    "currency":"",
                    "IPPstatus":"4",
                    "status":"4"
                }
            }
        }
    }


    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        let _details = details.datas;
        _details.invoiceNo =  _details.IM_INVOICE_NO
        _details.vendorId =  _details.CDM_S_COY_ID
        this.props.history.push({
            pathname : '/RequesterVerificationInvoice',
            datas : _details,
        })
    }

    componentDidMount(){
        this.props.dispatch(change('invoice_filter_form','invoiceDto.fundType','ITNP'))
        this.props.dispatch(change('invoice_filter_form','invoiceDto.doctype','INV'))
        // this.handlefromsubmit()
    }
   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : ''
            })
       }
       else if(name=="payment_date"){
        this.setState({
            paymentUIDueDate :(date) ? date : '', 
            paymentDueDate : (date) ? date : ''
        })
   }
    }

    handlefromsubmit(values){
        let _form_value = values;
        if(_form_value &&_form_value.PoListing && _form_value.PoListing.StartDate){
            delete  _form_value.ApproveDto.StartDate
        }
        if(_form_value && _form_value.ApproveDto && _form_value.ApproveDto.EndDate){
            delete  _form_value.ApproveDto.EndDate
        }
     
        let _initial_obj = {
            PoNo: "",
            BuyerCompany: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"",
            PoStatus:'',
            Fulfilment:'',
            PoStatus: ["1,2", "3", "4,5", "6,3"],
            Fulfilment : this.state.Fulfilment,
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value && _form_value.PoListing) ? _form_value.PoListing : {} )
        
        _form_value.PoStatus =  ["1,2", "3", "4,5", "6,3"]
        this.props.get_search_list(_form_value)
    }

    handlefiltersubmit = (details) => {
        let initial_object = this.state.initial_object.invoiceDto;
        let invoiceDto = details.invoiceDto
        let _final_object = Object.assign({}, initial_object, invoiceDto)
        if(_final_object){
            _final_object.paymentUIDueDate = this.state.paymentUIDueDate;
            _final_object.paymentDueDate =  this.state.paymentDueDate ? FromateDate_YY_MM_DD(this.state.paymentDueDate) : '';
            _final_object.dteDateFr = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
            _final_object.dteDateTo = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"";
            _final_object = RemoveSpecialCharacter(_final_object)
            
            this.props.get_search_list({invoiceDto:_final_object})
        }
      
    }

    handleSelect = (details) =>{
        this.setState({
            vendor_details : (details && details.label ) ? details.label  : ''
        })
    }

    ClearAll = () =>{
        this.setState({
            end_data:'',
            start_data:'',
        })
        this.props.reset('PaidInvoice')
    }

    ViewPo = (row) =>{
        let _user_details = UserDetails();
        row.POM_S_COY_ID = row.CDM_S_COY_ID;
        row.POM_B_COY_ID = _user_details.UM_COY_ID;
        row.PRM_PO_INDEX = row.POM_PO_INDEX;
        row.STATUS_DESC = row.STATUS_DESC
        row.frompage = "issueGrn"
        this.props.history.push({
            pathname: '/purchaseorderDetails',
            datas: row,
            redirect_to_tab : 'PaidInvoice',
            redirect_to_page : 'RequesterInvoiceManagement',
        });
    }

    ViewPR = (row) =>{

        row.PRM_PR_Index =  row.PRM_PR_INDEX;
        row.PRM_PR_No =  row.PRM_PR_NO;
        this.props.history.push({
            pathname: '/ViewPRDetails',
            datas: row,
            redirect_to_tab : 'PaidInvoice',
            redirect_to_page : 'RequesterInvoiceManagement',
        });

        this.props.history.push({
            pathname : '/ViewPRDetails',
            
        })
    }

    ViewDo = (row) =>{
        let _user_details = UserDetails();
        row.DOM_DO_NO = row.CDM_DO_NO;
        row.POM_PO_Index = row.POM_PO_INDEX;
        row.DOM_S_COY_ID = row.CDM_S_COY_ID;
        row.POM_PO_No = row.POM_PO_NO;
        row.CM_COY_NAME = row.POM_S_COY_NAME;
        row.Status_Desc = row.STATUS_REMARK;
        row.frompage = "issueGrn"

        console.log('ViewDo', row)


        

        this.props.history.push({
            pathname: '/view_do',
            datas: row,
            redirect_to_tab : 'PaidInvoice',
            redirect_to_page : 'RequesterInvoiceManagement',
        });
    }

    viewGRN(row){

        let _user_details = UserDetails();
      
        row.USER_ID = _user_details.UM_USER_ID;
        row.POM_B_COY_ID = _user_details.POM_S_COY_NAME;
        row.DO_Number = row.CDM_DO_NO;
        row.POM_PO_NO = row.POM_PO_NO;
        row.GRN_Number = row.CDM_GRN_NO;
        row.frompage = "issueGrn"

        row.frompage = "issueGrn"
        this.props.history.push({
            pathname: '/view_grn',
            datas: row,
            redirect_to_tab : 'PaidInvoice',
            redirect_to_page : 'RequesterInvoiceManagement',
        });
    }


    render(){
        
        let _detail_table = (this.props.search_result && this.props.search_result.ReqInvoiceSearchResult) ? this.props.search_result.ReqInvoiceSearchResult : []
        _detail_table = _detail_table.filter((list)=>list.IM_FM_APPROVED_DATE!=null)
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Document No", id:"IM_INVOICE_NO", width:'200px', key:true, dataFormat:'button'},
            {name : "Document Type", id:"INVOICE", width:'100px',formatter: (cellContent, row) => {
                return (
                    <div>
                        <label>Invoice</label>
                    </div>
                )
            }},
            {name : "Due Date", id:"IM_PAYMENT_DATE", width:'100px',dataFormat:"date"},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'144px'},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'90px'},
            {name : "Amount", id:"IM_INVOICE_TOTAL", width:'90px',dataFormat:"number"},
            {name : "Related Document", id:"IM_INVOICE_TOTAL", width:'151px',formatter: (cellContent, row) => {
                return <Fragment>
                    {(row.PRM_PR_NO) ? <span className="text-underline" onClick={()=>this.ViewPR(row)}>{row.PRM_PR_NO+"\n"}</span> : ''}
                    {(row.CDM_PO_NO) ? <span className="text-underline" onClick={()=>this.ViewPo(row)}>{row.CDM_PO_NO+"\n"}</span> : ''}
                    {(row.CDM_DO_NO) ?  <span className="text-underline" onClick={()=>this.ViewDo(row)}>{row.CDM_DO_NO+"\n"}</span> : ''}
                    {(row.CDM_GRN_NO) ? <span className="text-underline" onClick={()=>this.ViewDo(row)}>{row.CDM_GRN_NO+"\n"}</span> : ''}
                </Fragment>
            }},
            {name : "Payment Mode", id:"POM_PAYMENT_METHOD", width:'144px'},
            {name : "Approval Remarks", id:"price", width:'144px',dataFormat:"inv_mass_all"},
            {name : "Approved Payment Date", id:"IM_FM_APPROVED_DATE", width:'100px',dataFormat:"date"},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant Invoice." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <NewInvoiceFilter
                 handleDate = {this.handleDate}
                 start_data={this.state.start_data}
                 end_data={this.state.end_data}
                 invoice_fund_type = {this.props.invoice_fund_type} 
                 handle_options={this.handleSelect} handlefiltersubmit = {this.handlefiltersubmit} handledate = {this.handleDate} date = {this.state.paymentDueDate} clear ={this.ClearAll} inv_type="paid"/>
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={_detail_table} 
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
                
        </Fragment>
    }
}

export default reduxForm({
    form:'PaidInvoice',
})(PurchaseOrder);
