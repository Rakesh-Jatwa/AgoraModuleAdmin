import React, {Component, Fragment} from 'react';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import Filters from '../Filters'
import {reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Loader from '../../../../Component/Loader'
import {FromateDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {ApiExtract} from '../../../../Common/GetDatas'
import {UserDetails} from '../../../../Common/LocalStorage'
import {OutStandingRFQDuplicate, OutStandingRFQDelete} from '../../../../Apis/Approver'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'

class OutstandingRFQ extends Component {
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

    componentDidMount(){
        this.props.reset('OutstandingRFQ')
    }
    static getDerivedStateFromProps(props, state){
        if(props.search_result && props.search_result.GetoutstaningRFQList){
            return {
                all_products: (props.search_result.GetoutstaningRFQList) ? props.search_result.GetoutstaningRFQList : []
            }
        }
        return null
    }

    closemodel = () => {
        this.setState({
            model : false
        })
        let _tem_details = {}
        if(this.state.status){
            let _initial_obj = {
                Doc_num: "",
                VenName: "",
            }
        
            _tem_details.OutstandingRFQ = _initial_obj
            this.props.get_search_list(_tem_details)
        }
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

    raise_details(details){
        if(details.UIStatus=="Draft" || details.UIStatus=="Draft\nExpired" ){
            let _details = {
                rfq_num :  details.RM_RFQ_No,
                rfq_id :  details.RM_RFQ_ID,
                rfq_name : details.RM_RFQ_Name,
                status : details.UIStatus
            }
            
            localStorage.setItem('rfq_from',JSON.stringify(_details))
            window.location.reload()
        }
        else{
            let _details = UserDetails();
            this.props.history.push({
                pathname : '/view_rfq',
                datas : {
                    vcomid :  _details.UM_COY_ID,
                    rfq_id :  details.RM_RFQ_ID,
                    rfq_no :  details.RM_RFQ_No,
                },
                redirect_to_tab : 'OutstandingRFQ',
                redirect_to_page : 'rfq',
            })
        }
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:(date) ? date : '',
                end_data:(date) ? date : '',
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:(date) ? date : '',
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
        }
        _form_value = Object.assign({}, _initial_obj,(_form_value.ConvertPrSearch) ? _form_value.ConvertPrSearch : {} )
        _tem_details.OutstandingRFQ = RemoveSpecialCharacter(_form_value)
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

   updateData() {
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

   get_vendor(details){
        var data = { "v_com_id": details.CM_COY_ID}
        this.props.history.push({
            pathname : '/vendorDetailsPage',
            datas : data,
        })
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

   closeModel (details){
        this.setState({
            modal_popup:true,
        })
        if(this.state.status){
            let _tem_details = {};
            let _initial_obj = {
                Doc_num: "",
                VenName: "",
            }
            this.props.get_search_list(_initial_obj)
        }
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

    ClearAll = () =>{
        this.props.reset();
        this.setState({
            vendor_details : '',
        })
    }
    
   

    render(){
        
        const { handleSubmit } = this.props
        let  _table_data_header = [
            {name : "RFQ Number", id:"RM_RFQ_No", width:'160px', key:true, type:"index" , key:true, formatter: (cellContent, row) => {
              return (
                  <button className="btn btn-sm btn-outline-primary" type="button" onClick={()=>this.raise_details(row)}>{row.RM_RFQ_No} </button>
              )
            }},
            {name : "RFQ Description", id:"RM_RFQ_Name", width:'120px'},
            {name : "Creation Date", id:"RM_CREATED_ON", width:'144px', dataFormat:"date"},
            {name : "Expire Date", id:"RM_EXPIRY_DATE", width:'144px', dataFormat:"date"},
            {name : "Vendor List(s)/Vendor(s)", id:"POM_PO_No", width:'144px', formatter: (cellContent, row) => {
                if (row.vendorName && row.vendorName.length>=1) {
                    let _details =  row.vendorName.map((lis_index)=>{
                        return <button className="btn btn-small btn-outline-info mr-2" variant="primary" onClick={() => this.get_vendor(lis_index)}>{lis_index.CM_COY_NAME}</button> 
                    })
                    return  <Fragment>{_details}</Fragment>;
                }
                else{
                    return  <Fragment>No vendors are found</Fragment>;
                }
               
            }},
           
            {name : "Status", id:"RM_Status", width:'111px', formatter: (cellContent, row) => {
                if (row.UIStatus === 'View Response') {
                    return (<button className="btn btn-sm btn-outline-primary" type="button"  onClick={() => this.ViewDetails(row)}>{row.UIStatus}</button>)
                }
                else {
                    return (<button className="btn btn-sm btn-outline-secondary" type="button" >{row.UIStatus}</button>)
                }
            }},
        ];
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.props.loading_pdf) ? <Loader /> : '' }
              
              {(this.state.loading) ? <Loader /> : '' }
              
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
             <PageHeading 
                heading="Outstanding RFQ" 
                subheading="Fill in the search criteria and click Search button to list the relevant RFQ. Select the RFQ and click the Duplicate button to duplicate the selected RFQ. Click the View Response link to view the quotation results summary page." 
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
                            products={this.getProducts} 
                            select={true} 
                            selectname={'itemcode'} 
                            responsive={true} 
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
                    title="Validation" 
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
                  
        </Fragment>
    }
}

export default reduxForm({
    form:'Quotation',
})(OutstandingRFQ);
