import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import Alert from '../../../../Component/Modal/alert'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class Quotation extends Component {
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

            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            vendor_details : ''
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.GetQuoteListWithVendor){
            return {
                all_products: (props.search_result.GetQuoteListWithVendor && props.search_result.GetQuoteListWithVendor.GetQuoteListWithVendor) ? props.search_result.GetQuoteListWithVendor.GetQuoteListWithVendor : []
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false
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
        let _form_value = values;
        let _initial_obj = {
            Doc_num: "",
            VenName: (this.state.vendor_details) ? this.state.vendor_details.value : '',
            vendorName :  (this.state.vendor_details) ? this.state.vendor_details.label : '',
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _form_value.Doc_num = (_form_value.DocNum) ? _form_value.DocNum : '';
        _form_value =  RemoveSpecialCharacter(_form_value)
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
             let products = this.state.products.filter((fieldValue, index) =>fieldValue.RM_RFQ_ID !== values.RM_RFQ_ID);
             this.setState({
                products : products
            })
        }
    }

    download_pdf = (details) => {
      let _pdf_datas = { RFQId: details.RM_RFQ_ID, SCoyID: details.RVM_V_Company_ID, Quo_no: details.RRM_Actual_Quot_Num, Rfq_no: details.RM_RFQ_No };
      this.props.downlod_pdf(_pdf_datas)
    }

    HandleChange = (selectedOption) =>{
        this.setState({
            vendor_details : selectedOption
        })
    }
    
    raise_details(details){
        let _details = UserDetails();
        this.props.history.push({
            pathname : '/view_rfq',
            datas : {
                vcomid :  _details.UM_COY_ID,
                rfq_id :  details.RM_RFQ_ID,
                rfq_no :  details.RM_RFQ_No,
            },
            redirect_to_tab : 'Quotation',
            redirect_to_page : 'rfq',
        })
    }

   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "RFQ Number", id:"RM_RFQ_No", width:'160px', key:true, type:"index" , formatter: (cellContent, row) => {
                return (
                    <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.raise_details(row)}>{row.RM_RFQ_No} </button>
                )
              }},
            {name : "RFQ Description", id:"RM_RFQ_Name", width:'120px'},
            {name : "Quotation Number", id:"RRM_Actual_Quot_Num", width:'160px', formatter: (cellContent, row) => {
              return (row.RRM_Actual_Quot_Num) ? <button className="btn btn-sm btn-outline-primary" onClick={() => this.download_pdf(row)}>{row.RRM_Actual_Quot_Num} </button> : ''
            }},
            {name : "Expire Date", id:"RM_Expiry_Date", width:'144px', dataFormat:"date"},
            {name : "Quotation Validity", id:"RM_Reqd_Quote_Validity", width:'144px', dataFormat:"date"},
            {name : "Vendor(s)", id:"RVM_V_Company_ID", width:'89px'},
            {name : "Currency", id:"RRM_Currency_Code", width:'100px'},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="Quotation" 
                subheading="Fill in the search criteria and click Search button to list the relevant RFQ and quotation details." 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mt-2">    
                    <div className='col-12 col-md-12'>   
                    
                        <Filters 
                            start_data = {this.state.start_data}
                            end_data = {this.state.end_data}
                            handleDate = {this.handleDate}
                            checked_details = {this.state.checked_details}
                            vendor_name_list_service = {this.props.vendor_name_list_service}
                            handleChange={this.HandleChange} 
                            selectedOption={this.state.vendor_details}
                            type="quotation"
                        />
                    </div>  
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="button" className="ml-4 btn btn-sm btn-outline-primary" >Select All</button>
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={()=>this.props.reset_form()}>Clear</button>
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
                <Alert 
                         title="Validation" 
                         message="Select Atleast Once Purchase Request" 
                         status={this.state.status} 
                         show={this.state.model} 
                         confirm={this.closemodel}
                />
               
        </Fragment>
    }
}

export default reduxForm({
    form:'RejectList',
})(Quotation);
