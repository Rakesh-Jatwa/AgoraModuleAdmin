import React,{useEffect,useState,Fragment} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {GetConvertPRListingSearch} from '../../../../Actions/Approver'
import TabHeading from '../../../../Component/Heading/TabHeading';
import Loader from '../../../../Component/Loader'
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTableStatic'
import PageHeading from '../../../../Component/Heading/PageHeading';
import Filters from '../Filters' 
import {FromateDate} from '../../../../Component/Dates'
import {reduxForm } from 'redux-form';

let ConverPRListing = props => {
    const { handleSubmit } = props
    let _dispatch = useDispatch();
    let [start_data, setStartDate] = useState([])
    let [end_data, setEndDate] = useState([])
    let [checked_details, setCheckedDetails] = useState([])
    let {loading, table_datas} = useSelector(state => ({
        loading : state.convert_pr_list_search.loading,
        table_datas: (state.convert_pr_list_search && state.convert_pr_list_search.responseList && state.convert_pr_list_search.responseList.PRListForConvertPO ) ? state.convert_pr_list_search.responseList.PRListForConvertPO : [],
    }));
    let _initial_state = {
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
            checked_initial : [0,1,2],
            checked_details:[],
        }

    let  handleDate = (name, date) =>{
        if(name=="start_date"){
            setStartDate(date)
            setEndDate(date)
        }
        else if(name=="end_date"){
            setEndDate(date)
        }
     }

    let handlefromsubmit = (values) => {
        let _form_value = values;
        if(_form_value.ConvertPrSearch && _form_value.ConvertPrSearch.StartDate){
            delete  _form_value.ConvertPrSearch.StartDate
        }
        if(_form_value.ConvertPrSearch && _form_value.ConvertPrSearch.EndDate){
            delete  _form_value.ConvertPrSearch.EndDate
        }
     
        let _initial_obj = {
            PRNo: "",
            CommodityType: "",
            UIStartDate: (start_data) ? start_data : null,
            UIEndDate: (end_data) ? end_data : null,
            StartDate: (start_data) ? FromateDate(start_data)  :"",
            EndDate: (end_data) ? FromateDate(end_data ) :"",
            PoStatus: "",
            PoNo :"a"
        }
        _form_value.ConvertPrSearch = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _form_value.ConvertPrSearch.PoStatus =  ""
        _dispatch(GetConvertPRListingSearch(_form_value))
    }

    let  _table_data_header = [
        {name : "PR Number", id:"PRM_PR_NO", width:'50px', key:true, type:"index"},
        {name : "Item Code", id:"PRD_VENDOR_ITEM_CODE", width:'100px'},
        {name : "Item Name", id:"PRD_PRODUCT_DESC", width:'100px'},
        {name : "Converted Date", id:"PRM_CREATED_DATE", width:'144px'},
        {name : "Converted Doc No", id:"PRD_CONVERT_TO_DOC", width:'144px'},
        {name : "Vendor", id:"PM_LAST_TXN_S_COY_NAME", width:'122px'},
       
        {name : "Quantity", id:"PRD_ORDERED_QTY", width:'100px'},
        {name : "Currency", id:"PRD_CURRENCY_CODE", width:'150px'},
        {name : "Last Txn. Price", id:"PM_LAST_TXN_TAX", width:'100px', dataFormat:"number"},
        {name : "Amount", id:"PRD_UNIT_COST", width:'100px'},
        {name : "SST Amount", id:"PRD_GST", width:'100px'},
        {name : "Budget Account", id:"Status_Desc", width:'100px', dataFormat:"number"},
    ];
   
    useEffect(() => {
       
    }, [table_datas]);

   
    return <Fragment> 
            {(loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(handlefromsubmit.bind(this))}>
            <div className="container-fluid mt-3">
                <PageHeading 
                    heading="" 
                    subheading="Fill in the search criteria and click Search button to list the relevant PR." 
                />
                <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
                <div className="d-flex bg-info text-white p-1 mt-2 mb-3"><strong>Approval Workflow</strong></div>
                    <div className="row mt-2">
                        <div className='col-12 col-md-12'>   
                            <Filters 
                                start_data = {start_data}
                                end_data = {end_data}
                                handleDate = {handleDate}
                                checked_details = {checked_details}
                                type="conver_pr_listing"
                            />
                        </div>  
                        <div className='col-12'>
                            <BootstrapCustomTable 
                                table_header={_table_data_header} 
                                table_body={table_datas} 
                                select={false} 
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>

}   

let ContactForm = reduxForm({
    form: 'contact'
})(ConverPRListing)
export default ContactForm

