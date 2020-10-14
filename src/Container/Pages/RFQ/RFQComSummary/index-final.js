import React,{Fragment, Component, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {connect} from 'react-redux';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {reduxForm } from 'redux-form';
import {TodayDateSalash} from '../../../../Component/Dates'
import {CompareDateQut} from '../../../../Component/Dates/TimeZone'
import Alert from '../../../../Component/Modal/alert'
import {GetViewResponseRFQComSummary, GetEmptyViewResponseRFQComSummary} from '../../../../Actions/Approver'
import {DeliveryAddressAction, GetFillAddress} from '../../../../Actions/Requester'
import {RfqRaisePO} from '../../../../Apis/Approver'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UserDetails} from '../../../../Common/LocalStorage'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {Indicator, QuoteRange, NumberFormate, NumberFormateEmpty} from '../../../../Actions/Common/Functions'
import BackButton from '../../../../Component/Buttons/Back'
class RFQComSummary extends Component {
    constructor(props){
      
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.get_details = this.get_details.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.getProducts = this.getProducts.bind(this)
        this.state = {
            products:[],
            checkeddetails_main:[],
            table_alter_status: false,
            table_alter_value:[],
            slectedProducts:[],
            showModel:false,
            alertLoader : false,
            all_products:[],
            altered : false,
            poresponse :[],
            alertDetails : {
                title : '',
                message : 'Test ',
                status : false,
                show  :  false 
            },
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

            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            table_ref : '',
            table_datas : [],
            quotation_details : [],
            vendor_quotation_result : [],
            vendor_quotation_top : [],
            quotation_item_more_details : [],
            render:false,
            tot_details : {},
            initallize:false,
            checked_all :true,
            redirect_path : '',
        }
    }


    componentDidMount(){
        console.log('componentDidMount',this.props)
        if(this.props.location && this.props.location.reload){
            window.location.reload()
        }
        let _details = localStorage.getItem('rfq_details');
        // localStorage.removeItem('po_from_rfq')
        // if(this.props.location && this.props.location.datas){
        //     let _details = this.props.location.datas
        //     let _inputReq = { "RFQ_ID": _details.RM_RFQ_ID, "RFQ_No": _details.RM_RFQ_No };
        //     localStorage.setItem('rfq_details',JSON.stringify(_inputReq));
        //     this.props.GetViewResponseRFQComSummary(_inputReq)
        //     this.props.DeliveryAddressAction()
        //     this.props.GetFillAddress()
        // }else
        if(_details){

            _details = JSON.parse(_details)
            let _inputReq = { "RFQ_ID": _details.RFQ_ID, "RFQ_No": _details.RFQ_No };
            this.props.GetViewResponseRFQComSummary(_inputReq)
            this.props.DeliveryAddressAction()
            this.props.GetFillAddress()
        }
        else{
            
        }
    }

    static getDerivedStateFromProps(props, state){
      if((!state.render) && props.view_response_rfq_Summary){
            return {
                tot_details :  (props.view_response_rfq_Summary ) ? Object.assign({}, props.view_response_rfq_Summary) : {},
                render :  (props.view_response_rfq_Summary && props.view_response_rfq_Summary.itemRankDetails ) ? true : false,
                table_datas :  (props.view_response_rfq_Summary && props.view_response_rfq_Summary.itemRankDetails ) ? [...props.view_response_rfq_Summary.itemRankDetails] : [],
                quotation_details : (props.view_response_rfq_Summary && props.view_response_rfq_Summary.quotationItemDetails) ? props.view_response_rfq_Summary.quotationItemDetails : [],
                checked_details  : (props.view_response_rfq_Summary && props.view_response_rfq_Summary.quotationItemDetails) ? props.view_response_rfq_Summary.quotationItemDetails : [],
                vendor_quotation_top : (props.view_response_rfq_Summary && props.view_response_rfq_Summary.itemRankDetails ) ? Object.assign([],props.view_response_rfq_Summary.vendorQuotationResultDisplay) : [],
                vendor_quotation_result : (props.view_response_rfq_Summary && props.view_response_rfq_Summary.vendorQuotationResult ) ? Object.assign([],props.view_response_rfq_Summary.vendorQuotationResult) : [],
                quotation_item_more_details : (props.view_response_rfq_Summary && props.view_response_rfq_Summary.quotationItemMoreDetails ) ? props.view_response_rfq_Summary.quotationItemMoreDetails : [],
            }
        }
        else{
            return null
        }
        return null
    }

    setShowModel = (details) =>{
        this.setState({
            showModel : details
        })
    }

    closemodel =  async () =>{
        let {poresponse, slectedProducts, alertDetails, redirect_path,quotation_details} = this.state
        if(alertDetails.status){
            let _respone = {}
            _respone =  poresponse.response;
            _respone.pro_count =  quotation_details.length;
            _respone.po_number = slectedProducts.RRM_Actual_Quot_Num;

            this.props.history.push({
                pathname: redirect_path,
                datas: poresponse.response,
                datas : _respone
            })
        }
        this.setState({ 
            alertDetails : {
                title : '',
                message : '',
                show  :  false
            }
        })

    }


    get_details(details){
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                PRM_PR_Index :  details.PRM_PR_Index,
                PRM_PR_No :  details.PRM_PR_NO,
            },
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
             let products = this.state.products.filter((fieldValue, index) =>fieldValue.RM_RFQ_ID !== values.RM_RFQ_ID);
             this.setState({
                products : products
            })
        }
    }

  

 

    ViewDetails = (row) => {
        this.props.history.push({
            pathname : 'RFQComSummary',
            datas:row
        })
    }

      
    download_pdf = (details) => {
      let _user_details = UserDetails();
      let _pdf_datas = { "VendorRequired": "F", "prmVCoyID": _user_details.UM_COY_ID, "RFQ_No": details.RM_RFQ_No, "BCOY_ID": details.RM_Coy_ID };
      this.props.downlod_pdf(_pdf_datas)
    }

    confirm_function = (type, text) => {
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            modal_body: `Are you sure that you want to ${text} ?`,
        })
    }

    onCancel  = () =>{
        this.setState({
            confimation_pop: false,
        })
    }

  

    HandleChange = (selectedOption) =>{
        this.setState({
            vendor_details : selectedOption
        })
    }

    view_rfq = (row) => {
        if(row.length > 0){
            let _details = UserDetails();
            let _temp_details =  {
                vcomid :  _details.UM_COY_ID,
                rfq_id :  row[0].RM_RFQ_ID,
                rfq_no :  row[0].RM_RFQ_No,
            }
            this.props.history.push({
                pathname : '/view_rfq',
                datas : _temp_details
            })
        }
    }


    setAlterstatus = () => {
        this.setState({
            table_alter_status : false
        })
    }

    setAltervalue = () => {
        this.setState({
            table_alter_value : false
        })
    }


    scrolltotop = () =>{

        let {table_datas, table_ref, quotation_details, checked_details, vendor_quotation_result, quotation_item_more_details} = this.state
        let _checked_details = [];
        if(checked_details.length<=0){
            table_datas = table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
            _checked_details = checked_details
            if(_checked_details.length){
                this.setAltervalue(_checked_details)
            }
            window.scrollTo(0, 0)

            vendor_quotation_result.map((val, index) => {
                table_datas.forEach((element, index) => {
                    if(element.CM_COY_NAME === val.CM_COY_NAME) {
                        let _details = Object.assign({}, element, {RRM_TotalValue:val.RRM_TotalValue})
                        table_datas[index] = _details;
                    }
                });
            })
            table_datas.sort(function(a, b) {
                return a.RRM_TotalValue - b.RRM_TotalValue;
            });
            this.setState({
                table_datas : table_datas
            })
        }
        else{
            let _temp_quote = checked_details
            if(_temp_quote && _temp_quote.length){
                let _temp_qute_details = [...vendor_quotation_result];
                _temp_qute_details.forEach((list_quet, index)=>{
                    let _temp_details = quotation_item_more_details.filter((list_details,index)=> list_details.RRM_V_COMPANY_ID == list_quet.RRM_V_Company_ID)
                    if(_temp_quote.length){
                        _temp_qute_details[index].RRM_TotalValue = 0;
                        _temp_quote.forEach((list_details_sub)=>{
                            let _temp_qts = _temp_details.filter((list_details,index)=> list_details.RD_RFQ_Line == list_details_sub.RD_RFQ_Line)
                            if(_temp_qts.length){
                                _temp_qute_details[index].RRM_TotalValue += (_temp_qts[0].RRDT_Unit_Price_Total)
                            }
                        })
                    }
                })


                vendor_quotation_result.map((val, index) => {
                    table_datas.forEach((element, index) => {
                        if(element.CM_COY_NAME === val.CM_COY_NAME) {
                            let _details = Object.assign({}, element, {RRM_TotalValue:val.RRM_TotalValue})
                            table_datas[index] = _details;
                        }
                    });
                })
                table_datas.sort(function(a, b) {
                    return a.RRM_TotalValue - b.RRM_TotalValue;
                });
                this.setState({
                    table_datas : table_datas,
                    vendor_quotation_result : _temp_qute_details
                })

            }
        }

        if(table_ref && table_ref.current){
            table_ref.current.handleSort('asc', 'RRM_TotalValue')
        }
    }

    RisePo = async  () => {
        let {slectedProducts, altered, table_datas, vendor_quotation_result, checked_details} = this.state
        if(slectedProducts && slectedProducts.CM_COY_NAME){
            table_datas = table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
            let _checked_details = checked_details
            if(slectedProducts){
                let _vendor_details = vendor_quotation_result[0];
                let req = {
                    "RaisePOData": {
                        "viewMode": "rfq",
                        "viewType": "new",
                        "RFQ_ID": _vendor_details.RM_RFQ_ID,
                        "RFQ_No": _vendor_details.RM_RFQ_No,
                        "RFQ_NAME": _vendor_details.RM_RFQ_Name,
                        "Vendors": slectedProducts,
                        "quotationItemDetails":_checked_details
                    }
                }

                this.setState({loading:true})
                let _status =  await ApiExtract(RfqRaisePO, req)
                if(_status){
                    if(_status.status){
                        localStorage.removeItem('po_form')
                        this.setState({
                            alertDetails:{
                                title : '',
                                message : _status.message,
                                status : _status.status,
                                show  :  true 
                            },
                            poresponse : _status,
                            loading:false,
                            redirect_path : (_status.response && _status.response.path) ? _status.response.path : 'raise_po_rfq_vendor'
                        })    
                    }
                    else if(!_status.status){
                        this.setState({
                            alertDetails:{
                                title : '',
                                message : _status.message,
                                status : _status.status,
                                show  :  true 
                            },
                            loading:false
                        })  
                    }
                }
            }
            else{
               this.setState({ alertDetails : {title : 'Validation',
                    message : 'Please select atleast one product to Raise PO',
                    status : false,
                    show  :  true }
                })
            }
        }
        else{

            this.setState({ alertDetails : {
                    title : 'Validation',
                    message : 'Please select atleast one vendor to Raise PO',
                    status : false,
                    show  :  true
                }
            })
        }
       
    }

     getSelectedProduct = (values, details) => {
        if(values){
            this.setState({
                slectedProducts : values
            })
        }
    }

    HandleClick = async (main_details, details, main_index) =>{
        let {checked_details} = this.state
        let _main_details  = main_details.target
        if(_main_details.checked){
            checked_details.push(details)
        }
        else{
            checked_details = checked_details.filter((list, index) => list.RD_RFQ_Line != details.RD_RFQ_Line)
        }

        this.setState({
            checked_details : checked_details
        })

        
    }

    get_vendor = (details) => {
        var data = { "v_com_id": details.RVM_V_Company_ID}
        this.props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
    }

    view_quotation = (details) => {
        this.props.history.push({
            pathname : '/view_quotation',
            datas : {
                vcomid :  details.RVM_V_Company_ID,
                rfq_id :  details.RM_RFQ_ID,
                rfq_no :  details.RM_RFQ_No,
            },
        })
    }

    CheckedAll = (target) =>{
        let {quotation_details}  = this.state
        if(target.checked){
            this.setState({
                checked_details : quotation_details,
                checked_all : true
            })
        }
        else{
            this.setState({
                checked_details : [],
                checked_all : false
            })
        }

       
    }

    PrevUrl = () =>{
        this.props.GetEmptyViewResponseRFQComSummary()
        this.props.history.push({
            pathname :'rfq',
            redirect_to_tab : (this.props.location.redirect_to_tab ) ? this.props.location.redirect_to_tab : '',
            redirect_to_page : 'rfq'
        })
        localStorage.removeItem('rfq_details')
        localStorage.removeItem('po_from_rfq')
    }
   

    render(){
        
        let { handleSubmit} = this.props
        let {table_ref, table_alter_value,tot_details,checked_details,vendor_quotation_top, quotation_item_more_details,alertDetails, table_alter_status, altered, checkeddetails_main, quotation_details, vendor_quotation_result, table_datas} = this.state
        let  _table_data_header = [
            {name : "Rank", id:"CM_COY_NAME", width:'50px', key:true, type:"index"},
            {name : "Vendor Name", id:"CM_COY_NAME", width:'150px',formatter: (cellContent, row) => {
                return <div className=" btn btn-sm btn-outline-primary">{row.CM_COY_NAME}</div>
            }},
            {name : "Quotation Number", id:"RRM_Actual_Quot_Num", width:'100px'},
            {name : "Total Value", id:"RRM_TotalValue", width:'144px',formatter: (cellContent, row) => {
                return <div className="text-right">{row.RRM_TotalValue===null && row.RRM_TotalValue=='' && row.RRM_TotalValue==0 ?'N/A':`MYR ${NumberFormateEmpty(row.RRM_TotalValue)}`}</div>
            }},
        ];
        
        
        let _updated_details_price = (vendor_quotation_top) ? vendor_quotation_top.filter((list)=>list.RRM_TotalValue!=null && list.RRM_TotalValue!=0  && list.RRM_Indicator!=1) : [];
        let minRow = (_updated_details_price.length) ? _updated_details_price.reduce(function(prev, current) { return (  CompareDateQut(current.RM_Reqd_Quote_Validity, prev.RRM_Offer_Till) && CompareDateQut(prev.RM_Reqd_Quote_Validity, current.RRM_Offer_Till)  && prev.RRM_Indicator!=1 && prev.RRM_TotalValue && current.RRM_TotalValue && (prev.RRM_TotalValue < current.RRM_TotalValue)) ? prev : current }) : {}; 
        let maxRow = (_updated_details_price.length) ? _updated_details_price.reduce(function(prev, current) { return ( CompareDateQut(prev.RM_Reqd_Quote_Validity, current.RRM_Offer_Till) && CompareDateQut(current.RM_Reqd_Quote_Validity, prev.RRM_Offer_Till)  && prev.RRM_Indicator!=1 && prev.RRM_TotalValue && current.RRM_TotalValue && (prev.RRM_TotalValue > current.RRM_TotalValue)) ? prev : current }) : {}; 
        if(minRow){
            minRow = (typeof minRow.RRM_TotalValue !=='undefined' && minRow.RRM_TotalValue!=0 &&  maxRow.RRM_TotalValue!=null) ? minRow.RRM_TotalValue : 0
        }
        if(maxRow){
            maxRow = (typeof maxRow.RRM_TotalValue !=='undefined' && maxRow.RRM_TotalValue!=0 && CompareDateQut(maxRow.RM_Reqd_Quote_Validity, maxRow.RRM_Offer_Till) && maxRow.RRM_TotalValue!=null) ? maxRow.RRM_TotalValue : 0 
        }
        

        if(minRow==maxRow){
            maxRow = 0
        }
    
        let _table_datas = table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
        vendor_quotation_top = vendor_quotation_top.sort(function(a, b) {
          
            return ((b.RRM_Indicator!=null)  ? b.RRM_Indicator  : -1)  - ((a.RRM_Indicator!=null)  ? a.RRM_Indicator  : 0)
        });
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              
              {(this.state.loading) ? <Loader /> : '' }
              <form>
                <PageHeading 
                    heading="" 
                    subheading="All Quotation Response Summary" 
                />
                <TabHeading color={'bg-info text-white'}>Quotation Result</TabHeading> 
                <p>
                    <b>RFQ Number :</b>  <button type="button" onClick={()=>this.view_rfq(vendor_quotation_result, 'without_total')} className="btn btn-sm btn-outline-primary ml-2 mr-2">{vendor_quotation_result.length > 0 ? vendor_quotation_result[0].RM_RFQ_No : ''}</button> 
                    <b>RFQ Name : </b> {vendor_quotation_result.length > 0 ? vendor_quotation_result[0].RM_RFQ_Name : ''}
                </p>
                <div className="row mt-2">
                    <div className="col-md-9">
                        <table className="table table-bordered table-striped">
                            <thead className="bg-info">
                                <tr>
                                    <th style={{width:'209px'}}>Quotation Number </th>
                                    <th>Quotation Validity </th>
                                    <th style={{width:'200px'}}>Vendor (s)</th>
                                    <th>Quotation Value</th>
                                    <th style={{width:'68px'}}>Indicator </th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {(vendor_quotation_top) ? vendor_quotation_top.map((val, index) => {
                                    return (<tr key={index}>
                                        <td>{val.RRM_Actual_Quot_Num === null || '' ? 'N/A' : <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.view_quotation(val)} variant="primary">{val.RRM_Actual_Quot_Num}</button>} </td>
                                        <td>{val.RRM_Actual_Quot_Num === null || '' ? 'N/A' : TodayDateSalash(val.RRM_Offer_Till)}</td>
                                        <td><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.get_vendor(val)} className="btn btn-outline-primary btn-sm">{val.CM_COY_NAME}</button></td>
                                        <td><div className="text-right">{val.RRM_TotalValue==null || val.RRM_TotalValue=='' || val.RRM_TotalValue==0 ? 'N/A':`MYR ${NumberFormateEmpty(val.RRM_TotalValue)}`}</div></td>
                                        <td>{Indicator(val)} 
                                            {(minRow!=0 && val.RRM_TotalValue!==null && minRow==val.RRM_TotalValue && val.RRM_Indicator!=1) ?  <i style={{ color: "green", fontSize: "20px", margin: "3px" }} className='fa fa-arrow-circle-down'></i>:'' }
                                            {(maxRow!=0 && val.RRM_TotalValue!==null && maxRow==val.RRM_TotalValue && val.RRM_Indicator!=1) ?  <i style={{ color: "red", fontSize: "20px", margin: "3px" }} className='fa fa-arrow-circle-up'></i>  :'' }
                                        </td>
                                    </tr>)
                                }) : ''}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-header">Featured</div>
                            <p><i style={{ color: "blue", fontSize: "20px", margin: "12px" }} className='fa fa-thumbs-up'></i> Complete Quote</p>
                            <p><i style={{ color: "burlywood", fontSize: "20px", margin: "12px" }} className='fa fa-hand-o-right'></i> InComplete Quote</p>
                            <p><i style={{ color: "red", fontSize: "20px", margin: "12px" }} className='fa fa-thumbs-down'></i> No Quote</p>
                            <p><i style={{ color: "green", fontSize: "20px", margin: "12px" }} className='fa fa-arrow-circle-down'></i> Lowest Overall</p>
                            <p><i style={{ color: "red", fontSize: "20px", margin: "12px" }} className='fa fa-arrow-circle-up'></i> Highest Overall</p>
                            <p><i style={{ color: "blue", fontSize: "20px", margin: "12px" }} className='fa fa-calendar-o'></i> Quote Date Non-Compliance</p>
                            <p><i style={{ color: "#000", fontSize: "20px", margin: "12px" }} className='fa fa-flag-o'></i> Unable to Supply</p>
                        </div>
                    </div>
                </div>
            <TabHeading color={'bg-info text-white'}> Detailed Quotation Response Comparison </TabHeading> 
            <p>Step 1: Review details quotation response. Select item(s) for comparison in Step 2.</p>
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-bordered table-striped">
                        <thead className="bg-info">
                            <tr>
                                <th style={{width:'50px'}}> <input type="checkbox" checked={this.state.checked_all} onClick={(e)=>this.CheckedAll(e.target)} /> </th>
                                <th style={{width:'160px'}}>Item Description</th>
                                <th style={{width:'100px'}}>UOM</th>
                                <th style={{width:'100px'}}>QTY</th>
                                {vendor_quotation_result.map((val, index) => {
                                    return (
                                        <th>{val.CM_COY_NAME}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                        {quotation_details.map((val, index) => {
                            let _details = (checked_details.length > 0) ? checked_details.filter((list_details, index_sub) => list_details.RD_RFQ_Line == val.RD_RFQ_Line ) : [];
                            if(_details && _details.length && checked_details.length > 0){
                                _details = true
                            }
                           
                            else {
                                _details = false
                            }

                            console.log('_details',_details)
                            return (<tr key={index}>
                                <td><input type="checkbox" className value={index} onClick={(e)=>this.HandleClick(e, val, index)} checked={(_details) ? "checked" : false} /></td>
                                <td>{val.RD_Product_Desc}</td>
                                <td>{val.RD_UOM}</td>
                                <td>{val.RD_Quantity}</td>
                                {vendor_quotation_result.length > 0 ? vendor_quotation_result.map((val1, index) => {
                                    let _details_name = quotation_item_more_details.filter((list_details) => (list_details.RRM_V_COMPANY_ID==val1.RVM_V_Company_ID || list_details.RRDT_V_Company_ID==val1.RVM_V_Company_ID )&& list_details.RD_RFQ_Line==val.RD_RFQ_Line )
                                    if(_details_name && _details_name.length > 0){
                                        if(_details_name[0].RRDT_Unit_Price_Total > 0){
                                            let minRow = 0;
                                            let _filter_details = quotation_item_more_details.filter((prev)=> prev.RD_RFQ_Line == _details_name[0].RD_RFQ_Line && (prev.RRDT_Unit_Price_Total!=null) && (prev.RRDT_Unit_Price_Total!=0))
                                            if(_filter_details.length){
                                                let _minRow = (_filter_details.length) ? _filter_details.reduce(function(prev, current) { return (prev.RRDT_Unit_Price_Total && current.RRDT_Unit_Price_Total && (prev.RRDT_Unit_Price_Total!=null) && (current.RRDT_Unit_Price_Total!=null) && ((prev.RRDT_Unit_Price_Total) < (current.RRDT_Unit_Price_Total))) ? prev : current }) : {};
                                                minRow = _minRow.RRDT_Unit_Price_Total
                                            }
                                            return <td className="text-right" style={(minRow == (_details_name[0].RRDT_Unit_Price_Total)) ? { background: "#C0C0FF" } : { background: "#fff" } }>{(_details_name[0].RRDT_Unit_Price_Total>=0) ? NumberFormate(_details_name[0].RRDT_Unit_Price_Total) : '0.00'}</td>
                                        }
                                        else{
                                            return  <td >No Quote</td>
                                        }
                                    }
                                    else{
                                        return  <td >No Quote</td>
                                    }
                                    
                                }) : ""}
                            </tr>)
                        })}
                    </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-3">Step 2: Click Compare button to display total value on selected item(s) by vendor 'Compare' button. </p> 
            <button className="btn btn-sm btn-outline-primary mt-1 mb-2"  onClick={()=>this.scrolltotop()} type="button">Compare</button>
            
            <BootstrapCustomTable 
                table_header={_table_data_header} 
                table_body={table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)} 
                mode={'radio'}
                table_ref={table_ref}
                select={true} 
                products = {this.getSelectedProduct}
            />

            <p className="mt-3">Step 3: Select vendor and click Raise PO button to continue.</p> 
            <div className="row mt-4">
                <div className="col-12">
                    <div className="display_inline">
                        <button type="button" class="btn btn-outline-danger btn-sm mr-2" onClick={()=>this.PrevUrl()}>Back</button>
                        <button type="button" className="btn btn-sm btn btn-outline-success" onClick={()=>this.RisePo()}>Raise PO</button>
                    </div>
                </div>
            </div>
            

        </form>
        <Alert 
            title={alertDetails.title} 
            message={alertDetails.message} 
            status={alertDetails.status} 
            show={alertDetails.show} 
            confirm={this.closemodel}
        />
            
        </Fragment>
    }
}



const mapStateToProps = state => ({
    loading : state.view_response_rfq_Summary.loading,
    view_response_rfq_Summary : state.view_response_rfq_Summary.responseList
})

const mapDispatchToProps = dispatch => ({
    
    GetEmptyViewResponseRFQComSummary : () => dispatch(GetEmptyViewResponseRFQComSummary()),
    GetViewResponseRFQComSummary : (values) => dispatch(GetViewResponseRFQComSummary(values)),
    DeliveryAddressAction  : () => dispatch(DeliveryAddressAction()),
    GetFillAddress  : () => dispatch(GetFillAddress()),
})

const RFQComSummaryHolder = connect(mapStateToProps, mapDispatchToProps)(RFQComSummary);
export default RFQComSummaryHolder;