import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDateUtc, CompareDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RaisePO, RaiseRFQ} from '../../../../Apis/Approver'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'

class ApprovalRejectList extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.getProducts = this.getProducts.bind(this)
        this.state = {
            products:[],
            all_products:[],
            start_data:'',
            PRNumber : ["1,2", "3", "4,5", "6,3"],
            Fulfilment : ["0", "1", "4,5,0", "3"],
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            model:false,
            status : false, 
            loading: false, 
            checked_initial : [0,1,2],
            checked_details:[],
        }
    }

    static getDerivedStateFromProps(props, state){
     
        if(props.search_result && props.search_result.convertPRListingSearch && props.search_result.convertPRListingSearch && props.search_result.convertPRListingSearch.PRListForPORFQ){
            console.log('getDerivedStateFromProps', (props.search_result.convertPRListingSearch && props.search_result.convertPRListingSearch.PRListForPORFQ && props.search_result.convertPRListingSearch.PRListForPORFQ.length>0) ? props.search_result.convertPRListingSearch.PRListForPORFQ : [])
            return {
                all_products: (props.search_result.convertPRListingSearch && props.search_result.convertPRListingSearch.PRListForPORFQ && props.search_result.convertPRListingSearch.PRListForPORFQ.length>0) ? props.search_result.convertPRListingSearch.PRListForPORFQ : []
            }
        }
    }

    closemodel = () => {
        this.setState({
            model : false
        })
    }

    get_details(details){
        let _details = {
            PRM_PR_Index :  details.PRM_PR_Index,
            PRM_PR_No :  details.PRM_PR_NO,
            page_name : 'convert_pr'
        }
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: _details,
            type:'ConvertPRListing',
            redirect_to_tab : 'ConvertPRListing',
            redirect_to_page : 'ConvertPr',
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date,
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
       
        let _initial_obj = {
            PRNo: "",
            CommodityType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            StartDate: (this.state.start_data) ? FromateDateUtc(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDateUtc(this.state.end_data ) :"",
            ConvertedDocNo : "",
            Status : this.state.checked_details
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPRListing) ? _form_value.ConvertPrSearch : {} )
        _form_value.PoStatus =  ""
        _form_value.Status =  this.state.checked_details
        _form_value.StartDate = (this.state.start_data) ? FromateDateUtc(this.state.start_data)  :"";
        _form_value.EndDate = (this.state.end_data) ? FromateDateUtc(this.state.end_data ) :"";
        _form_value.ConvertPRListing = RemoveSpecialCharacter(_form_value.ConvertPRListing)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_list({ConvertPRListing : _form_value})
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    model : true
                })
            }

        }
        else{
            this.props.get_search_list({ConvertPRListing : _form_value})
        }
        
    }

    getProducts (values, details){
        let _all_products = this.state.products;
        if(details){
            values.checked = "false"
            _all_products.push(values)
            this.setState({
                products : _all_products
            })
        }
        else{
             let products = this.state.products.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE !== values.CDI_PRODUCT_CODE);
             this.setState({
                products : products
            })
        }
    }

     RaisePODetails = async(details) =>{
        let _details = new Array();
        let _all_products = this.state.products;
        if(_all_products.length==1){
            this.setState({loading:true})
            _all_products.forEach((list_details)=>{
                _details.push({
                    "lblBill": "",
                    "lblAtt": list_details.PRM_S_ATTN,
                    "icBuyer": list_details.PRM_REQ_NAME,
                    "icVendor": list_details.PRM_S_COY_NAME,
                    "icCurrency": list_details.PRD_CURRENCY_CODE,
                    "icCost": list_details.PRD_UNIT_COST,
                    "lblPRLine": list_details.PRD_PR_LINE,
                    "lblPRNo": list_details.PRM_PR_NO,
                    "lblPRIndex": list_details.PRM_PR_Index,
               })
           })
           _all_products = _all_products[0]
           _details = (_details.length) ? _details[0] : []
           _details = {strDocNo : _details}
            let _status = await ApiExtract(RaisePO, _details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                model : true,
                message : "Select One Purchase Order",
                status : false,
            })
        }
    }

    RaiseRFQDetails = async (details) =>{
        let _details = new Array();
        let _all_products = this.state.products;
        if(_all_products.length>=1){
            this.setState({loading:true})
            _all_products.forEach((list_details)=>{
                 _details.push({
                       "PRLine": list_details.PRD_PR_LINE, 
                       "lblPRNo": list_details.PRM_PR_NO, 
                       "lblPRIndex": list_details.PRM_PR_Index
                })
            })

            _details = (_details.length) ? _details : []
            _details = {strDocNo : _details}
            let _status = await ApiExtract(RaiseRFQ, _details);
            if(_status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body: _status.message,
                    loading:false,
                })
            }
        }
        else{
            this.setState({
                model : true,
                message : "Select Atleast One Purchase Order",
                status : false,
            })
        }
    }

    handleCheckbox = (details) =>{
        let all_check_value = this.state.checked_details;
        let _checked =  (details.target.name).replace (/[^\d.]/g, '' );
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            if(_checked)
            _checked = parseInt(_checked)
            all_check_value.push((_checked==1) ? 'PO':'RFQ')
        }
        else{
            _checked = parseInt(_checked)
            _checked= (_checked==1) ? 'PO':'RFQ'
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
          
        }
        this.setState({checked_details:all_check_value})
       
    }


    view_rfq = (row) => {
       console.log('view_rfq', row)
       if(row.PRD_CONVERT_TO_DOC.includes("RFQ")){
            let _details = UserDetails();
            this.props.history.push({
                pathname : '/view_rfq',
                datas : {
                    vcomid :  _details.UM_COY_ID,
                    rfq_id :  row.RFQ_ID,
                    rfq_no :  row.PRD_CONVERT_TO_DOC,
                },
            })
       }
       else if(row.PRD_CONVERT_TO_DOC.includes("PO")){
            let _user_details = UserDetails();
            let _send_details =  {
                "POM_PO_NO":row.PRD_CONVERT_TO_DOC,
                "POM_B_COY_ID": _user_details.UM_COY_ID,
                "POM_S_COY_ID":row.POM_S_COY_ID,
                "STATUS":row.STATUS_DESC,
                "PR_NO":row.PRM_PR_NO,
                "PRM_PO_INDEX":row.PRM_PO_INDEX,
                poIndex:row.PRM_PO_INDEX,
                page_name : 'ConvertPRListing'
            }
            
            this.props.history.push({
                pathname : '/VendorPOListPop',
                datas : _send_details,
                redirect_to_tab : 'ConvertPRListing',
                redirect_to_page : 'ConvertPr',
                page_name : 'ConvertPRListing'
            })      
       }
     
   }

    SelectAll = () =>{
        this.setState({
            checked_details : [1,2,3]
        })
        this.props.change('ConvertPrSearch.Spot', true)
        this.props.change('ConvertPrSearch.Stock', true)
        this.props.change('ConvertPrSearch.MRO', true)
    }

    ClearAll = () =>{
        this.props.reset('ConverPRListing')
        this.setState({
            checked_details : []
        })
    }

    render(){
     
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "PR Number", id:"PRM_PR_NO", width:'200px', key:true, type:"index" , key:true,
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.PRM_PR_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            {name : "Item Code", id:"PRD_VENDOR_ITEM_CODE", width:'100px'},
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'100px'},
            {name : "Converted Date", id:"PRD_CONVERT_TO_DATE", width:'144px', dataFormat:"converted_date"},
            {name : "Converted Doc No", id:"PRD_CONVERT_TO_DOC", width:'180px',formatter: (cellContent, row) => {
               return <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.view_rfq(row, 'without_total')}>{row.PRD_CONVERT_TO_DOC} </button>
            }},
            {name : "Vendor", id:"PM_LAST_TXN_S_COY_NAME", width:'89px'},
        
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'92px'},
            {name : "Last Txn. Price", id:"PM_LAST_TXN_TAX", width:'120px', dataFormat:"number"},
            {name : "Amount", id:"PRD_UNIT_COST", width:'100px' ,formatter: (cellContent, row) => {
                return <div className="text-right">{(row.PRD_UNIT_COST) ? parseFloat(row.PRD_UNIT_COST).toFixed(2) : '0.00'}</div>
            }},
            {name : "SST Amount", id:"PRD_GST", width:'120px' ,formatter: (cellContent, row) => {
                return <div className="text-right">{(row.PRD_GST) ? parseFloat(row.PRD_GST).toFixed(2) : '0.00'}</div>
            }},
            {name : "Budget Account", id:"BUDGET_ACC", width:'100px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <Filters 
                            start_data = {this.state.start_data}
                            end_data = {this.state.end_data}
                            handleDate = {this.handleDate}
                            handleCheckbox = {this.handleCheckbox}
                            checked_details = {this.state.checked_details}
                            type="conver_pr_listing"
                        />
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
                            table_header={_table_data_header} 
                            table_body={this.state.all_products} 

                            selectname={'itemcode'} 
                            responsive={true} 
                            table_name="issue_grn"
                        />

                    </div>
                </div>
                {/* <div className="row mt-2">
                    <div className='col-12'>   
                        <button  className="btn btn-sm btn-outline-primary" type="button" onClick={this.RaisePODetails}>Raise PO</button> &nbsp;&nbsp;<button  className="btn btn-sm btn-outline-primary" type="button" onClick={this.RaiseRFQDetails}>Raise RFQ</button>
                    </div>
                </div> */}
                </form>
                <Alert 
                         title="Validation" 
                         message={this.state.modal_body} 
                         status={this.state.status} 
                         show={this.state.model} 
                         confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'ConverPRListing',
})(ApprovalRejectList);
