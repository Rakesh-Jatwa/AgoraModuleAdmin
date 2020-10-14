import React,{useEffect,useState, Fragment, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux";
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import {reduxForm } from 'redux-form';
import {TodayDateSalash} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {GetViewResponseRFQComSummary} from '../../../../Actions/Approver'
import {DeliveryAddressAction, GetFillAddress} from '../../../../Actions/Requester'
import {RfqRaisePO} from '../../../../Apis/Approver'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UserDetails} from '../../../../Common/LocalStorage'
import {Indicator, QuoteRange, NumberFormate, NumberFormateEmpty} from '../../../../Actions/Common/Functions'



let ConverPRListing = props => {
    const { handleSubmit } = props
    let _dispatch = useDispatch();
    let table_ref = useRef('react_table');
    let [checkeddetails_main, setCheckeddetails] = useState([])
    let [table_alter_status, setAlterstatus] = useState(false)
    let [table_alter_value, setAltervalue] = useState([])
    let [slectedProducts, setSelectedProducts] = useState([])
    let [showModel, setShowModel] = useState(false);
    let [alertLoader, setAlertLoader] = useState(false);
    let [altered, setAltered] = useState(false);
    let [poresponse, setPoResponse]= useState([])
    let [alertDetails, setAlertDetails] = useState({
        title : '',
        message : 'Test ',
        status : false,
        show  :  true 
    })
    let {loading, table_datas, quotation_details, checked_details, vendor_quotation_result,quotation_item_more_details} = useSelector(state => ({
        loading : state.view_response_rfq_Summary.loading,
        table_datas :  (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.itemRankDetails ) ? state.view_response_rfq_Summary.responseList.itemRankDetails : [],
        quotation_details : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.quotationItemDetails) ? state.view_response_rfq_Summary.responseList.quotationItemDetails : [],
        checked_details  : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.quotationItemDetails) ? state.view_response_rfq_Summary.responseList.quotationItemDetails : [],
        vendor_quotation_result : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.vendorQuotationResult ) ? state.view_response_rfq_Summary.responseList.vendorQuotationResult : [],
        quotation_item_more_details : (state.view_response_rfq_Summary && state.view_response_rfq_Summary.responseList && state.view_response_rfq_Summary.responseList.quotationItemMoreDetails ) ? state.view_response_rfq_Summary.responseList.quotationItemMoreDetails : [],
    }));


    let  checkeditem = []
    checkeditem = quotation_details.map((list_details, index)=>{
        return index;
    })

    let closemodel =  async () =>{
        await setShowModel(false);
        if(poresponse.status){
            let _respone = {}
            _respone =  poresponse.response;
            _respone.po_number = slectedProducts.RRM_Actual_Quot_Num;

            props.history.push({
                pathname: '/RaisePO',
                datas: poresponse.response,
                datas : _respone
            })
        }

    }
    let getSelectedProduct = (values, details) => {
        let _all_products = slectedProducts
        setSelectedProducts(values)
       
    }

    let view_quotation = (details) => {
        props.history.push({
            pathname : '/view_quotation',
            datas : {
                vcomid :  details.RVM_V_Company_ID,
                rfq_id :  details.RM_RFQ_ID,
                rfq_no :  details.RM_RFQ_No,
            },
        })
    }
    

    let get_vendor = (details) => {
        var data = { "v_com_id": details.RVM_V_Company_ID}
        props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
    }

    let  TableDetails = (instance) => {
        console.log('TableDetails', (instance) ? instance.refs : '')
    }

    let scrolltotop = () =>{
        
        let _checked_details = [];
        if(!altered){
            table_datas = table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
            _checked_details = checked_details
            if(_checked_details.length){
                setAlterstatus(false)
                setAltervalue(_checked_details)
            }
            window.scrollTo(0, 0)
        }
        else{
            let _temp_quote = checkeddetails_main
            if(_temp_quote && _temp_quote.length){
                let _temp_data = quotation_details
                let _temp_qute_details = vendor_quotation_result;
                setAlterstatus(false)
                vendor_quotation_result.forEach((list_quet, index)=>{
                    let _temp_details = quotation_item_more_details.filter((list_details,index)=> list_details.RRM_V_COMPANY_ID == list_quet.RRM_V_Company_ID)
                    if(_temp_quote.length){
                        _temp_qute_details[index].RRM_TotalValue = 0;
                        _temp_quote.forEach((list_details_sub)=>{
                            let _temp_qts = _temp_details.filter((list_details,index)=> list_details.RD_RFQ_Line == list_details_sub.RD_RFQ_Line)
                            if(_temp_qts.length){
                                _temp_qute_details[index].RRM_TotalValue += (_temp_qts[0].RRDT_Unit_Price * _temp_qts[0].RD_Quantity)
                            }
                        })
                    }
                })
                _temp_qute_details = _temp_qute_details.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
                if(_temp_qute_details.length && _temp_quote.length < _temp_data.length){
                    setAlterstatus(true)
                    setAltervalue(_temp_qute_details)
                }
                else{
                    setAlterstatus(false)
                }
            }
        }

        if(table_ref && table_ref.current){
            table_ref.current.handleSort('asc', 'RRM_TotalValue')
        }
    }

    let RisePo = async  () => {
        if(slectedProducts && slectedProducts.CM_COY_NAME){
            let _checked_details = [];
            if(!altered){
                _checked_details = checked_details
            }
            else{
                _checked_details = checkeddetails_main
            }

            if(_checked_details.length > 0 ){
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
                setAlertLoader(true)
                let _status =  await ApiExtract(RfqRaisePO, req)
                if(_status){
                    if(_status.response)
                    if(_status.status){
                        setAlertDetails({
                            title : '',
                            message : _status.message,
                            status : _status.status
                        })    
                        setPoResponse(_status)
                    
                    }
                    setAlertLoader(false)
                    setShowModel(true);
                    
                }
            }
            else{
                setAlertDetails({
                    title : 'Validation',
                    message : 'Please select atleast one product to Raise PO',
                    status : false,
                    show  :  true 
                })
                await setShowModel(true);
            }
        }
        else{
            setAlertDetails({
                title : 'Validation',
                message : 'Please select atleast one vendor to Raise PO',
                status : false,
                show  :  true 
            })
            await setShowModel(true);
        }
       
    }

    let HandleClick = async (main_details, details, main_index) =>{
        let _main_details  = main_details.target
        if(!altered){
            checked_details = checked_details
        }
        else{
            checked_details = checkeddetails_main
        }
        if(_main_details.checked){
            checked_details.push(details)
            setCheckeddetails(checked_details)
            setAltered(true)
            setAlterstatus(false)
        }
        else{
            checked_details = checked_details.filter((list, index) => list.RD_RFQ_Line != details.RD_RFQ_Line)
            setCheckeddetails(checked_details)
            setAltered(true)
            setAlterstatus(false)
        }
       
       
    }
    

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

    let view_rfq = (row) => {
        if(row.length > 0){
            let _details = UserDetails();
            let _temp_details =  {
                vcomid :  _details.UM_COY_ID,
                rfq_id :  row[0].RM_RFQ_ID,
                rfq_no :  row[0].RM_RFQ_No,
            }
            props.history.push({
                pathname : '/view_rfq',
                datas : _temp_details
            })
        }
       

    }
    
   
    useEffect(() => {
       
       
    }, []);

    
    table_datas = table_datas.filter((sub_list)=>sub_list.RRM_TotalValue!=0)
    let minRow = (vendor_quotation_result.length) ? vendor_quotation_result.reduce(function(prev, current) { return ( prev.RRM_Indicator!=1 && prev.RRM_TotalValue && current.RRM_TotalValue && (prev.RRM_TotalValue < current.RRM_TotalValue)) ? prev : current }) : {}; 
    let maxRow = (vendor_quotation_result.length) ? vendor_quotation_result.reduce(function(prev, current) { return ( prev.RRM_Indicator!=1 && prev.RRM_TotalValue && current.RRM_TotalValue && (prev.RRM_TotalValue > current.RRM_TotalValue)) ? prev : current }) : {}; 
    if(minRow){
        minRow = (typeof minRow.RRM_TotalValue !=='undefined' && minRow.RRM_TotalValue!=0) ? minRow.RRM_TotalValue : 0
    }
    if(maxRow){
        maxRow = (typeof maxRow.RRM_TotalValue !=='undefined' && maxRow.RRM_TotalValue!=0) ? maxRow.RRM_TotalValue : 0 
    }

    if(minRow==maxRow){
        maxRow = 0
    }
    return <Fragment> 
            {(loading) ? <Loader /> : '' }
            {(alertLoader) ? <Loader /> : '' }
            <form >
           
                <PageHeading 
                    heading="" 
                    subheading="All Quotation Response Summary" 
                />
                <TabHeading color={'bg-info text-white'}>Quotation Result</TabHeading> 
                <p>
                    <b>RFQ Number :</b>  <button type="button" onClick={()=>view_rfq(vendor_quotation_result, 'without_total')} className="btn btn-sm btn-outline-primary ml-2 mr-2">{vendor_quotation_result.length > 0 ? vendor_quotation_result[0].RM_RFQ_No : ''}</button> 
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
                                { 
                                vendor_quotation_result.map((val, index) => {
                                 
                                    table_datas.forEach((element, index) => {
                                        if(element.CM_COY_NAME === val.CM_COY_NAME) {
                                           let _details = Object.assign({}, element, {RRM_TotalValue:val.RRM_TotalValue})
                                           table_datas[index] = _details;
                                        }
                                    });

                                    return (<tr key={index}>
                                        <td><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>view_quotation(val)} variant="primary">{val.RRM_Actual_Quot_Num === null || '' ? 'N/A' : val.RRM_Actual_Quot_Num}</button></td>
                                        <td>{TodayDateSalash(val.RM_Reqd_Quote_Validity)}</td>
                                        <td><button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>get_vendor(val)} className="btn btn-outline-primary btn-sm">{val.CM_COY_NAME}</button></td>
                                        <td><div className="text-right">{val.RRM_TotalValue===null && val.RRM_TotalValue=='' && val.RRM_TotalValue==0?'N/A':`MYR ${NumberFormateEmpty(val.RRM_TotalValue)}`}</div></td>
                                        <td>{Indicator(val)} 
                                            {(val.RRM_TotalValue!==null && minRow==val.RRM_TotalValue && minRow==val.RRM_TotalValue!=0) ?  <i style={{ color: "green", fontSize: "20px", margin: "3px" }} className='fa fa-arrow-circle-down'></i>:'' }
                                            {(val.RRM_TotalValue!==null && maxRow==val.RRM_TotalValue && maxRow==val.RRM_TotalValue!=0) ?  <i style={{ color: "red", fontSize: "20px", margin: "3px" }} className='fa fa-arrow-circle-up'></i>  :'' }
                                        </td>
                                    </tr>)
                                })}
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
                                <th style={{width:'50px'}}></th>
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
                           
                          
                           
                            let _details = (checkeddetails_main.length > 0) ? checkeddetails_main.filter((list_details, index_sub) => list_details.RD_RFQ_Line == val.RD_RFQ_Line ) : [];
                            if(_details && _details.length && checkeddetails_main.length > 0){
                                _details = true
                            }
                            else if(_details.length==0 && checkeddetails_main.length == 0 && (!altered)){
                                _details = true
                            }
                            else {
                                _details = false
                            }
                            return (<tr key={index}>
                                <td><input type="checkbox" className value={index} onClick={(e)=>HandleClick(e, val, index)} defaultChecked={(_details) ? "checked" : ''} /></td>
                                <td>{val.RD_Product_Desc}</td>
                                <td>{val.RD_UOM}</td>
                                <td>{val.RD_Quantity}</td>
                                {vendor_quotation_result.length > 0 ? vendor_quotation_result.map((val1, index) => {
                                    let _details_name = quotation_item_more_details.filter((list_details) => (list_details.RRM_V_COMPANY_ID==val1.RVM_V_Company_ID || list_details.RRDT_V_Company_ID==val1.RVM_V_Company_ID )&& list_details.RD_RFQ_Line==val.RD_RFQ_Line )
                                    if(_details_name && _details_name.length > 0){
                                        if(_details_name[0].RRDT_Unit_Price > 0){
                                            let minRow = 0;
                                            let _filter_details = quotation_item_more_details.filter((prev)=> prev.RD_RFQ_Line == _details_name[0].RD_RFQ_Line)
                                            
                                            if(_filter_details.length){
                                               let _minRow = (_filter_details.length) ? _filter_details.reduce(function(prev, current) { return (prev.RRDT_Unit_Price && current.RRDT_Unit_Price && ((prev.RRDT_Unit_Price * prev.RD_Quantity) < (current.RRDT_Unit_Price * current.RD_Quantity))) ? prev : current }) : {};
                                                minRow = _minRow.RRDT_Unit_Price * _minRow.RD_Quantity
                                                
                                            }
                                            return <td className="text-right" style={(minRow == (_details_name[0].RRDT_Unit_Price * val.RD_Quantity)) ? { background: "#C0C0FF" } : { background: "#fff" } }>{(_details_name[0].RRDT_Unit_Price>=0) ? NumberFormate(_details_name[0].RRDT_Unit_Price * val.RD_Quantity) : '0.00'}</td>
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
            <button className="btn btn-sm btn-outline-primary mt-1 mb-2"  onClick={scrolltotop} type="button">Compare</button>
            {table_alter_status==false ? <BootstrapCustomTable 
                table_header={_table_data_header} 
                table_body={table_datas} 
                mode={'radio'}
                table_ref={table_ref}
                select={true} 
                products = {getSelectedProduct}
            /> :
            <BootstrapCustomTable 
                table_header={_table_data_header} 
                table_body={table_alter_value} 
                mode={'radio'}
                table_ref={table_ref}
                select={true} 
                products = {getSelectedProduct}
            />}

            <p className="mt-3">Step 3: Select vendor and click Raise PO button to continue.</p> 
            <button type="button" className="btn btn-sm mt-2 btn btn-outline-success" onClick={RisePo}>Raise PO</button>
           

        </form>
        <Alert 
            confirm={closemodel} 
            title={alertDetails.title}
            message={alertDetails.message}
            status={alertDetails.status}
            show={showModel}
         />
        </Fragment>

}   

let ConverPRListingHolder = reduxForm({
    form: 'ConverPRListing'
})(ConverPRListing)
export default ConverPRListingHolder

