import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';

import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import RfqButton from '../../../../Component/Buttons/RfqButton'
import {FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class ApprovedList extends Component {
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
            checked_initial : [0,1,2],
            checked_details:[],
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result){
            return {
                all_products: (props.search_result) ? props.search_result : []
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false
        })
        
    }

    async get_details(details, type){
        if(type=="RfQ_vendor_details"){
            let _user_details = {};
            let _send_details = { "POM_PO_NO": details.PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.SNAMEID}

            this.props.history.push({
                pathname : '/VendorPOListPop',
                datas : _send_details,
            })
        }
        else{
            this.props.history.push({
                pathname : '/po_approval_detail',
                datas : {
                    PO_NO:details.POM_PO_No,
                    index:details.POM_PO_Index
                },
            })
        }
        
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

    componentDidMount () {
        let _initial_obj = {
            PO_NO: "",
            Vendor_Name: "",
            startUIDate: "",
            DateFrom: "",
            endUIDate: null,
            DateTo: "",
            ReliefOn: "",
        }
        this.props.get_search_list(_initial_obj)
    }

    handlefromsubmit(values){
        let _form_value = values;
        let _initial_obj = {
            PO_NO: "",
            Vendor_Name: "",
            startUIDate: "",
            DateFrom: "",
            endUIDate: null,
            DateTo: "",
            ReliefOn: "",
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _form_value.DateFrom = (this.state.start_data) ?  FromateDate_YY_MM_DD(this.state.start_data) : "";
        _form_value.DateTo =  (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.end_data) : "";
        _form_value = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list(_form_value)
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

    viewPageDetails(details, cell, row){
        this.props.history.push({
            pathname : '/ViewPRDetails',
            datas : {
                PRM_PR_Index :  details.PRM_PR_Index,
                PRM_PR_No :  details.PRM_PR_NO,
            },
        })
    }


    download_pdf = (details) => {
      let _pdf_datas = { RFQId: details.RM_RFQ_ID, SCoyID: details.RVM_V_Company_ID, Quo_no: details.RRM_Actual_Quot_Num, Rfq_no: details.RM_RFQ_No };
      this.props.downlod_pdf(_pdf_datas)
    }

    get_vendor(details){
        console.log('get_vendor', details)
        var data = { "v_com_id": details.POM_S_Coy_ID}
        this.props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
    }
   
    ClearAll = () =>{
        this.props.reset('ApprovedList')
        this.setState({
            start_data:'',
            end_data:'',
        })
    }
   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "PO Number", id:"POM_PO_No", width:'185px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
                console.log('Number', row.POM_S_COY_ID)
                return (
                 <Fragment>
                  <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.get_details(row, 'POM_PO_No')}>
                        {row.POM_PO_No} 
                        <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span>
                       
                        {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}
                  </button>
                  
                  <RfqButton {...this.props} {...row} datas={{ vcomid : row.POM_S_Coy_ID, rfq_id : row.POM_RFQ_INDEX,rfq_no : row.RM_RFQ_No}}  pathname= '  ' pathname='view_quotation' redirect_to_tab='ApprovalList' redirect_to_page='SearchPO_AO'/>
                </Fragment>
              )
            }},

            {name : "Submitted Date", id:"POM_SUBMIT_DATE", width:'130px', dataFormat:"date"},
            {name : "Buyer", id:"UM_USER_NAME", width:'140px'},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'210px',formatter: (cellContent, row) => {
                return (row.POM_S_COY_NAME) ? <button className="btn btn-small btn-outline-info" variant="primary" onClick={() => this.get_vendor(row)}>{row.POM_S_COY_NAME}</button> : ''
            }},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'98px'},
            {name : "Amount", id:"PO_AMT", width:'89px', dataFormat:"number"},
            {name : "Status", id:"STATUS_DESC", width:'100px', formatter: (cellContent, row) => {
                if(row.STATUS_DESC=="Held By"){
                    return `${row.STATUS_DESC} ${row.NAME}`
                }
                else{
                    return row.STATUS_DESC
                }
            }},
            {name : "PR No", id:"PRM_PR_NO", width:'171px', formatter: (cellContent, row) => {
                return (row.PRM_PR_NO) ? <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_NO}</span></button > : ''
            }},
           
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PO for approval. Click the PO Number to go to PO approval page." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                        <Filters 
                            start_data = {this.state.start_data}
                            end_data = {this.state.end_data}
                            handleDate = {this.handleDate}
                            checked_details = {this.state.checked_details}
                            type="approve_listing"
                        />
                    </div>  
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                {/* <button type="button" className="ml-4 btn btn-sm btn-outline-primary" >Select All</button> */}
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
               
                </form>
                
        </Fragment>
    }
}

export default reduxForm({
    form:'ApprovedList',
})(ApprovedList);
