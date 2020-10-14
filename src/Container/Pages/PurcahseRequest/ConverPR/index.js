import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm,Field } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromInputsParallel, FormDatePickerParallel, FromCheckBoxparallel} from '../../../../Component/From/FromInputs';
import {FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {RaisePO, RaiseRFQ} from '../../../../Apis/Approver'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovalRejectList extends Component {
    bootstrapTableRef ='';
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.RaisePODetails = this.RaisePODetails.bind(this);
        this.getProductsall = this.getProductsall.bind(this);
        this.cleanTable = this.cleanTable.bind(this);
        this._child = React.createRef();
        this.state = {
            products:[],
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
            responce :{},
            type:'',
            checked_initial : [0,1,2],
            checked_details:[],
        }
    }

    componentDidMount(){
        if(localStorage.getItem('rfq_from')){
            this.props.history.push({
                pathname : '/rfq',
            })
        } 
        let _initial_obj = {
            PRNo: "",
            CommodityType: "",
            UIStartDate: "",
            UIEndDate:"",
            PoStatus: "",
            PoNo :"a"
        }
        
        this.props.GetCommodityTypeList()
        if(this.props.location && this.props.location.page_name=="dashboard"){
            this.props.get_search_list({ConvertPrSearch:this.props.location.datas})
        }
        else{
            this.props.get_search_list({ConvertPrSearch:_initial_obj})
        }
       
    }

    closemodel = () => {
        this.setState({
            model : false
        })
       
        if(this.state.status && this.state.type=="RFQ"){
            localStorage.removeItem('rfq_from')
            this.handlefromsubmit({})
            this.clearSelectedRow()
            let {responce} = this.state
            let _details = {
                rfq_num :  responce.RM_RFQ_No,
                rfq_id :  responce.RM_RFQ_ID,
                rfq_name : responce.RM_RFQ_Name,
                page_name : 'convert_pr',
                status : 'Draft',
                rerender : false, 
                render : false, 
            }
            localStorage.setItem('rfq_from',JSON.stringify(_details))
            window.location.reload();
        }
        else if(this.state.status && this.state.type=="PO"){
            this.handlefromsubmit({})
        }
        else{

        }
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
            redirect_to_tab : 'ConvertOrder',
            redirect_to_page : 'ConvertPr',
            type:'cancel',
            show_details:'convert_pr_req_1'
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
        this.clearSelectedRow()
        let _form_value = values;
        let _initial_obj = {
            PRNo: "",
            CommodityType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data : null,
            UIEndDate: (this.state.end_date) ? this.state.end_date : null,
            PoStatus: "",
            PoNo :"a"
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _form_value.StartDate = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.EndDate = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data ) :"";
        _form_value = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list({ConvertPrSearch:_form_value})
    }

    clearSelectedRow() {
        let _details =  this._child.current;
        if(_details){
            console.log('_details.refs[""]', _details.refs[""])
            _details.refs[""].setState({
                selectedRowKeys :[1]
            })
            _details.refs[""].store.selected = []
            // _details.refs[""].table.onreset
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
             let products = this.state.products.filter((fieldValue, index) => fieldValue.PRD_PR_LINE_INDEX !== values.PRD_PR_LINE_INDEX);
             console.log('getProducts', products)
             this.setState({
                products : products
            })
        }
    }

     RaisePODetails = async(details) =>{
        let _details = new Array();
        let _final_details = {}
        let _status = true
        let _all_products = [...this.state.products]
        console.log('_all_products',_all_products)
        let _initial_vendor = '';
        let _pro_array = new Array();
        _all_products.some((list,index)=>{
            if(index==0){
                _initial_vendor = list.PM_LAST_TXN_S_COY_NAME
            }

            if(!list.PM_LAST_TXN_S_COY_NAME){

                this.setState({
                    model : true,
                    modal_body : "Selected items do not have vendor",
                    status : false,
                })
                _status = false;
                return false
            }

           
            
             if(_initial_vendor!=list.PM_LAST_TXN_S_COY_NAME){
                this.setState({
                    model : true,
                    modal_body : "Selected items do not have same vendor",
                    status : false,
                })
                _status = false;
                return false
            }
            
            // _pro_array[list.PRM_PR_NO]=list.PM_LAST_TXN_S_COY_NAME
        })

        console.log('_all_products', _all_products)
     
       
        if(_status){
            if(_all_products.length>0){
                console.log('_all_products', _all_products, _all_products.length)
                await _all_products.forEach((list_details)=>{
                    if((!list_details.PM_LAST_TXN_PRICE) || (!list_details.PM_LAST_TXN_S_COY_NAME) ){
                        _status = false;
                    }
                })

                if(_status){
                    this.setState({loading:true})
                    _all_products.forEach((list_details)=>{
                        _details.push({
                            "lblBill":list_details.PRM_B_ADDR_CODE,
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
                    // _details = (_details.length) ? _details[0] : []
                    _final_details.strDocNo = [];
                    _final_details.strDocNo = _details
                    console.log('_final_details', _final_details)
                    let _status = await ApiExtract(RaisePO, _final_details);
                    if(_status){
                        this.setState({
                            status: _status.status,
                            model:true,
                            modal_body: _status.message,
                            responce : _status.response,
                            loading:false,
                            type:'PO'
                        })
                        if(_status.status){
                            this.setState({
                                products : []
                            })
                        }
                    }
                }
                else{
                    this.setState({
                        model : true,
                        modal_body : "Selected item do not have vendor",
                        status : false,
                    })
                }
            }
            else{
                this.setState({
                    model : true,
                    modal_body : "Please make at least one selection!",
                    status : false,
                })
            }
        } 
    }

    RaiseRFQDetails = async (details) =>{
        let _details = new Array();
        let _all_products = this.state.products;
        console.log('_all_products', _all_products)
        if(_all_products.length>=1){
            this.setState({loading:true})
            _all_products.forEach((list_details)=>{
                 _details.push({
                       "PRLine": list_details.PRD_PR_LINE, 
                       "lblPRNo": list_details.PRM_PR_NO, 
                       "lblPRIndex": list_details.PRM_PR_Index,
                      
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
                    responce : _status.response,
                    loading:false,
                    type:'RFQ'
                })
            }
        }
        else{
            this.setState({
                model : true,
                modal_body : "Please make at least one selection!",
                status : false,
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
        this.clearSelectedRow()
        this.props.reset('ConverPR')
        this.setState({
            checked_details : []
        })
    }

    async  getProductsall (_products, details){
        let _all_products = this.state.products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    _products.checked = "false"
                    _all_products.push(_products[i])
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                 
                        _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.CDI_PRODUCT_CODE != _products[i].CDI_PRODUCT_CODE);
                    
                        if (i != _products.length) {
                             this.setState({products : _temp_query})
                        }
                   
                }
                
            }
        }
        
    }

 
     cleanTable(instance) {
         console.log('cleanTable', instance)
        this.bootstrapTableRef = instance;
     }

    render(){
        
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "Buyer Name",id:"PRD_PR_LINE_INDEX", key:true,hidden:true, width:'110px'},
            {name : "PR Number", id:"PRM_PR_NO", width:'200px', 
            formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => this.get_details(row)}>
                        {row.PRM_PR_NO} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                        {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                    </button>
                )
            }},
            {name : "Buyer Name", id:"PRM_REQ_NAME", width:'110px'},
            {name : "Item Code", id:"PRD_B_ITEM_CODE", width:'144px'},
            {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'144px'},
            {name : "Approval Date", id:"PRM_PR_DATE", width:'144px', dataFormat:'date'},
            {name : "Vendor", id:"PM_LAST_TXN_S_COY_NAME", width:'144px'},
            {name : "Quantity", id:"PRD_ORDERED_QTY", width:'89px',dataFormat:'price'},
            {name : "Currency", id:"PRD_CURRENCY_CODE", width:'93px', formatter: (cellContent, row) => {
                return (row.PM_LAST_TXN_S_COY_NAME)  ? row.PRD_CURRENCY_CODE : ''
            }},
            {name : "Last Txn. Price", id:"PM_LAST_TXN_PRICE", width:'127px', dataFormat:'price4'},
            {name : "Amount", id:"PRD_UNIT_COST", width:'86px', dataFormat:'number'},
            {name : "SST Amount", id:"PRD_GST", width:'112px', dataFormat:'number'},
            {name : "Budget Account", id:"BUDGET_ACC", width:'132px'},

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
                            checked_details = {this.state.checked_details}
                            commodity_list = {this.props.commodity_list}
                            type="conver_pr"
                            {...this.props}
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
                            table_header={_table_header} 
                            selectall={this.getProductsall}
                            table_body={(this.props.search_result && this.props.search_result.PRListForConvertPO) ? this.props.search_result.PRListForConvertPO : [] } 
                            products={this.getProducts} 
                            select={true} 
                            selectname={'itemcode'} 
                            responsive={true} 
                            selectRow ={this.state.products}
                            select = {true}
                            table_name="issue_grn"
                            ref={this._child}
                        />

                    </div>
                </div>
                <div className="row mt-2">
                    <div className='col-12'>   
                        <button  className="btn btn-sm btn-outline-primary" type="button" onClick={this.RaisePODetails}>Raise PO</button> &nbsp;&nbsp;
                        <button  className="btn btn-sm btn-outline-primary" type="button" onClick={this.RaiseRFQDetails}>Raise RFQ</button>
                    </div>
                </div>
                </form>
                <Alert 
                         message={this.state.modal_body} 
                         status={this.state.status} 
                         show={this.state.model} 
                         confirm={this.closemodel}
                />
        </Fragment>
    }
}

export default reduxForm({
    form:'ConverPR',
})(ApprovalRejectList);
