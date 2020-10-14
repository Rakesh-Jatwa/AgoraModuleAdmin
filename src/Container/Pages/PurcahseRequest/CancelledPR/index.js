import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDateUtc,FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RaisePO, RaiseRFQ} from '../../../../Apis/Approver'
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
        if(props.search_result && props.search_result.cancelledPRListSearch){
            return {
                all_products: (props.search_result.cancelledPRListSearch) ? props.search_result.cancelledPRListSearch : []
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
            PRM_PR_No :  details.PRM_PR_No,
            page_name : 'convert_pr_cancel'
        }
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: _details,
            redirect_to_tab : 'CancelledPR',
            redirect_to_page : 'ConvertPr',
            type:'pr_cancel',
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
            })
       }
    }

    handlefromsubmit(values){
        let _form_value = values
        let _initial_obj = {
            PRNo: "",
            CommodityType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : '',
            UIEndDate: (this.state.end_date) ? this.state.end_date : '',
            StartDate: (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"",
            EndDate: (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"",
            ConvertedDocNo : "",
            Status : this.state.checked_details
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _form_value.PoStatus =  ""
        _form_value.StartDate = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.EndDate = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"";
        _form_value = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list({ConvertCancelledPR:_form_value})
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

    SelectAll = () =>{
        this.setState({
            checked_details : [1,2]
        })
        this.props.change('ConvertPrSearch.Spot', true)
        this.props.change('ConvertPrSearch.Stock', true)
        this.props.change('ConvertPrSearch.MRO', true)
    }

    ClearAll = () =>{
        this.props.reset('CancelledPR')
        this.setState({
            checked_details : []
        })
    }

    handleCheckbox = (details) =>{
        let all_check_value = this.state.checked_details;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            _checked = parseInt(_checked)
            all_check_value.push(_checked)
        }
        else{
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
          
        }
        this.setState({checked_details:all_check_value})
       
    }

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "PR No", id:"PRM_PR_No", width:'200px', key:true, type:"index" , key:true,
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>{row.PRM_PR_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button>
                )
            }},
            // {name : "Item Code", id:"PRD_VENDOR_ITEM_CODE", width:'100px'},
            // {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'100px'},
            // {name : "Converted Date", id:"PRM_CREATED_DATE", width:'144px'},
            // {name : "Converted Doc No", id:"PRD_CONVERT_TO_DOC", width:'144px'},
            // {name : "Vendor", id:"PM_LAST_TXN_S_COY_NAME", width:'89px'},
        
            // {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px'},
            // {name : "Currency", id:"PRD_CURRENCY_CODE", width:'92px'},
            // {name : "Last Txn. Price", id:"PM_LAST_TXN_TAX", width:'120px', dataFormat:"price"},
            // {name : "Amount", id:"PRD_UNIT_COST", width:'100px'},
            // {name : "SST Amount", id:"PRD_GST", width:'120px'},
            // {name : "Budget Account", id:"Status_Desc", width:'100px', dataFormat:"price"},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
                return (
                    (row.PRD_SOURCE === 'CC' || row.PRD_SOURCE === 'cc')? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Creation Date", id:"PRM_CREATED_DATE", width:'120px', dataFormat:"date"},
            {name : "Submitted Date", id:"PRM_SUBMIT_DATE", width:'100px', dataFormat:"date"},
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
                            type="conver_pr_listing_cancel"
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
                            products={this.getProducts} select={false} selectname={'itemcode'} 
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
                         message="Select Atleast Once Purchase Order" 
                         status={this.state.status} 
                         show={this.state.model} 
                         confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'CancelledPR',
})(ApprovalRejectList);
