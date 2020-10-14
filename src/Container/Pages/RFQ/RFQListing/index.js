import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {UserDetails} from '../../../../Common/LocalStorage'
import {ApiExtract} from '../../../../Common/GetDatas'
import {OutStandingRFQDuplicate, OutStandingRFQDelete, RfqPolist} from '../../../../Apis/Approver'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Modal from '../../../../Component/Modal'

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

            rfq_details:{},
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
            all_products_pop : [],
            modal_popup : false,

        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.GetRFQListAllWithVendor){
            return {
                all_products: (props.search_result.GetRFQListAllWithVendor) ? props.search_result.GetRFQListAllWithVendor : []
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false,
            modal_popup  : false,
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

    handlefromsubmit(values){
        let _tem_details = {};
        let _form_value = values;
        let _initial_obj = {
            Doc_num: "",
            VenName: (this.state.vendor_details) ? this.state.vendor_details.value : '',
            vendorName :  (this.state.vendor_details) ? this.state.vendor_details.label : '',
            Valid:'',
            startdate: FromateDate(new Date()),
            enddate: FromateDate(new Date())
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _tem_details.RFQListing = RemoveSpecialCharacter(_form_value)
        this.props.get_search_list(_tem_details)
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

    UpdateDuplicate = async () =>{
        let _list =  this.state.products;
        if(_list.length){
            this.setState({loading:true})
            let _status =  await ApiExtract(OutStandingRFQDuplicate, {RFQDulipcateItems:{RFQItems:_list}})
            if(_status.status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body:'Rfq Duplicated Successfully',
                    loading:false,
                    products : []
                })
            }
        }
        else{
            this.setState({
                modal_title: 'File Upload Validation',
                title : 'File Upload Validation',
                modal_body: 'Choose a Rfq To Duplicatōe ',
                status : false,
                model: true,
            })  
        }
   }

   UpdateDelete = async () =>{
        let _list =  this.state.products;
        if(_list.length){
            this.setState({loading:true})
            let _status =  await ApiExtract(OutStandingRFQDelete, {RFQDeleteItems:{RFQItems:_list}})
            if(_status.status){
                this.setState({
                    status: _status.status,
                    model:true,
                    modal_body:'Rfq Deleted Successfully',
                    loading:false,
                    products : []
                })
            }
        }
        else{
            this.setState({
                modal_title: 'File Upload Validation',
                title : 'File Upload Validation',
                modal_body: 'Choose a Rfq To Delete ',
                status : false,
                model: true,
            })  
        }
    }

    ViewDetails = (row) => {
       
        let _inputReq = { "RFQ_ID": row.RM_RFQ_ID, "RFQ_No": row.RM_RFQ_No };
        localStorage.setItem('rfq_details',JSON.stringify(_inputReq));
        this.props.history.push({
           pathname : 'RFQComSummary',
           redirect_to_tab : 'OutstandingRFQ',
           redirect_to_page : 'rfq',
           datas:row
        })
        window.location.reload();
    }

     view_po = async(row) => {
       let _rfq_details = { RFQ_No:row.RM_RFQ_No,RFQ_ID:row.RM_RFQ_ID}
       this.setState({ loading : true})
        let _status =  await ApiExtract(RfqPolist, _rfq_details)
        if(_status.status){
            this.setState({
                rfq_details : _rfq_details,
                modal_popup:true,
                loading:false,
                all_products_pop : _status.response
            })
        }
        
    }

      
    download_pdf = (details) => {
      let _user_details = UserDetails();
      let _pdf_datas = { "VendorRequired": "F", "prmVCoyID": _user_details.UM_COY_ID, "RFQ_No": details.RM_RFQ_No, "BCOY_ID": details.RM_Coy_ID };
      console.log('_pdf_datas', _pdf_datas)
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

    onConfirm = () => {
        let _confimation_type = this.state.confimation_type
        this.setState({ confimation_pop: false})
        if(_confimation_type=="delete"){
            this.UpdateDelete()
        }
        else if (_confimation_type=="duplicate"){
            this.UpdateDuplicate() 
        }
    }

    HandleChange = (selectedOption) =>{
        this.setState({
            vendor_details : selectedOption
        })
    }

    get_vendor(details){
        var data = { "v_com_id": details.CM_COY_ID}
        this.props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
    }

    ViewDetails = (row) => {
        this.props.history.push({
            pathname : 'RFQComSummary',
            redirect_to_tab : 'RFQListing',
            redirect_to_page : 'rfq',
            datas:row
        })
      }
   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "RFQ Number", id:"RM_RFQ_No", width:'160px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
              return (
                  <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.download_pdf(row)}>{row.RM_RFQ_No} </button>
              )
            }},
            {name : "RFQ Description", id:"RM_RFQ_Name", width:'120px'},
            {name : "Creation Date", id:"RM_CREATED_ON", width:'144px', dataFormat:"date"},
            {name : "Expire Date", id:"RM_EXPIRY_DATE", width:'144px', dataFormat:"date"},
            {name : "Vendor List(s)/Vendor(s)", id:"POM_PO_No", width:'144px', formatter: (cellContent, row) => {
                if (row.vendorName && row.vendorName.length>=1) {
                    let _details =  row.vendorName.map((lis_index)=>{
                        return <button className="btn btn-small btn-outline-info mb-2 mr-2" variant="primary" onClick={() => this.get_vendor(lis_index)}>{lis_index.CM_COY_NAME}</button> 
                    })
                    return  <Fragment>{_details}</Fragment>;
                }
                else{
                    return  <Fragment>No vendors are found</Fragment>;
                }
            }},
            {name : "Status", id:"UIStatus", width:'111px', formatter: (cellContent, row) => {
                let _sub_details = (row.UIStatus) ? row.UIStatus.split(",") : '';
                let _button = _sub_details.map((list, expired)=>{
                    let _button_name = (list) ? list.trim() : ''
                    if(_button_name=="View Response"){
                        return <button type="button" onClick={()=>this.ViewDetails(row)} className="btn btn-outline-primary btn-sm mb-2">{_button_name}</button>
                    }
                    else if(_button_name=="Partial PO"){
                        return <button type="button" onClick={()=>this.view_po(row)} className="btn btn-outline-info btn-sm mb-2">{_button_name}</button>
                    }
                    else if(_button_name=="Full PO"){
                        return <button type="button" onClick={()=>this.view_po(row)} className="btn btn-outline-success btn-sm mb-2">{_button_name}</button>
                    }
                    else if(_button_name=="Expired"){
                        return <button type="button" className="btn btn-outline-danger btn-sm  mb-2">{_button_name}</button>
                    }
                    else if(_button_name=="Sent"){
                        return <button type="button" className="btn btn-outline-secondary btn-sm  mb-2">{_button_name}</button>
                    }
                })

            return <Fragment>{_button}</Fragment>
               
            }},
        ];
        let _table_data_po = [
            {name : "PO No", id:"POM_PO_NO", width:'160px', key:true, type:"index" ,formatter: (cellContent, row) => { return row.POM_PO_NO }},
            {name : "Order Date", id:"POM_PO_DATE", width:'120px', dataFormat:"date"},
            {name : "Vendor Name", id:"POM_S_COY_NAME", width:'144px'},
            {name : "Currency", id:"POM_CURRENCY_CODE", width:'144px'},
            {name : "Status", id:"POM_PO_STATUS", width:'90px'},
            {name : "PR No", id:"PRD_PR_NO", width:'144px'},
        ]
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              
              {(this.state.loading) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="RFQ Listing" 
                subheading="Select/fill in the search criteria and click Search button to list the relevant Contract Catalogue. Click the Raise PR button to go to Raise PR page. Click the Raise PO button to go to Raise PO page" 
            />
            <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
            <div className="row mb-2">    
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
                            products={this.getProducts}
                            select={true} 
                            selectname={'itemcode'} 
                            responsive={true} 
                            vendor_name_list_service = {this.props.vendor_name_list_service}
                            handleChange={this.HandleChange} 
                            selectedOption={this.state.vendor_details}
                            table_name="issue_grn"
                        />

                    </div>
                    <div className="col-12">
                        <div className="text-left mt-2 row">
                            <div className="col-12 mt-2">
                                <button type="button" className=" btn btn-sm btn-outline-secondary" onClick={()=>this.confirm_function('duplicate', 'duplicate this RFQ')}>Duplicate</button>
                                <button type="reset" className="ml-4 btn btn-outline-danger btn-sm" onClick={()=>this.confirm_function('delete', 'delete this RFQ')}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
           
                </form>
                <Alert 
                    title={this.state.modal_title} 
                    message={this.state.modal_body} 
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />
                 <ConfirmationModel
                     title="" 
                     confimation = {true}
                     message={this.state.modal_body} 
                     status={this.state.status} 
                     show={this.state.confimation_pop} 
                     onConfirm={(e)=>this.onConfirm()}
                     onCancel = {this.onCancel}
                />

                <Modal size="lg" open={this.state.modal_popup} header ={true} title ={'Purchase Order List'} closemodel={this.closemodel} footer={true} footercontent={<Fragment>
                        <button type='button' className='btn btn-outline-danger btn-sm' onClick={ this.closemodel }>Close</button></Fragment>}>
                        <p className="mt-2">RFQ No : {(this.state.rfq_details) ? this.state.rfq_details.RFQ_No : ''}</p>
                        <BootstrapCustomTable 
                            table_header={_table_data_po} 
                            table_body={this.state.all_products_pop} 
                            select={false} 
                            selectname={'itemcode'} 
                            responsive={true} 
                            table_name="issue_grn"
                        />
                </Modal>


        </Fragment>
    }
}

export default reduxForm({
    form:'RFQListing',
})(Quotation);
