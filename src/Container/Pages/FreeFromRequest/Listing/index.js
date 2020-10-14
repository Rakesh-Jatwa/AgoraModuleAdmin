import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import {FromInputs, FormDatePicker, FormRadioButton, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {FromateDate, CompareDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
class Request extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.Checkall= this.Checkall.bind(this);
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            open:false,
            modal:false,
            check_value:false,
            all_check_value:[],
            loading:false,
            checked_details:[0,1,2,3,4,5,6,7],
            check_value:false,
     
            modal_title:'',
            modal_body:'',
            modal:false,
        }
    }


    closeModel = () => {
        this.setState({
            modal : false
        })
    }

    handlefromsubmit(values){
       let _check_key = '';
       let  {PurchaseRequestListing, all_check_value} = values;
       let _details = values.PurchaseRequestListing;
       let _checked_details = []
       
        let _form_value = values;
        let {checkbox} = this.state
        let _checkbox_details = [1, 2, 4, 5, 6, 7, 8, 9];
        let _initial_obj = {
            strPRNo: "",
            strItemCode: "",
            strStatus: (PurchaseRequestListing && PurchaseRequestListing.status && PurchaseRequestListing.status.length) ? all_check_value : _checkbox_details,
            strStatus2: (PurchaseRequestListing &&  PurchaseRequestListing.status && PurchaseRequestListing.status.length) ? all_check_value : _checkbox_details,
            strPRType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data  : null ,
            UIEndDate: (this.state.end_data) ? this.state.end_data  : null ,
            dteDateTo: (this.state.start_data) ? FromateDate(this.state.start_data)  :"",
            dteDateFr: (this.state.end_data) ? FromateDate(this.state.end_data)  :"",
        }
    
        _form_value = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestListing) ? _form_value.PurchaseRequestListing : _form_value )
        _form_value = RemoveSpecialCharacter(_form_value)
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_prlist(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    modal : true
                })

            }
        }
        else{
            this.props.get_search_prlist(_form_value)
        }
       

    }

    handleheaderlinks(values){
        let _target_name = values.target.getAttribute('data-field');
        if(_target_name){
            this.setState({
                model:true,
                modal_title:_target_name
            })
        }
    }

    Checkall = () =>{
      let   {checked_details} = this.state
      this.setState({
        all_check_value:checked_details
      })
    }

    getChecked(details){
        let all_check_value = this.state.all_check_value;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            _checked = parseInt(_checked)
            all_check_value.push(_checked)
        }
        else{
            all_check_value= all_check_value.filter((list)=>{return list != _checked})
          
        }
        this.setState({all_check_value:all_check_value})
    }

    updateData() {

    }

    getProducts (values){
        let _all_products = this.state.products;
        if(values.hasOwnProperty('itemcode')){
            _all_products.push(values.itemcode)
            this.setState({
                products : _all_products
            })
        }
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

    getPage_details(details, cell, row){
        this.props.history.push({
            pathname:"/purchaseRequestView",
            selected_items: '',
            datas: {
                productList:'',
                viewState: 'mod',
                strType: (cell.PRM_PR_TYPE === 'CC' || 'cc' ? 'Contract' : 'Non-Contract'),
                prid : cell.PRM_PR_No
            },
        })
    }

    viewPageDetails(details, cell, row){
        this.props.get_pr_details(cell)
        this.props.history.push({
            pathname:"/prViewPage",
            selected_items: '',
            datas: cell,
            type:'listing'
        })
    }

    

    closeModel (details){
        this.setState({
            modal : false,
        })
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR No.", id:"PRM_PR_No", width:'162px', key:true,formatter: (cellContent, row) => {
                return (
                    row.STATUS_DESC === 'Draft' ? <button type="button" className="btn btn-sm btn-outline-info" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.PRM_PR_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span></button > : <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span></button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
              
                return (
                    (row.PRM_PR_TYPE === 'CC' || row.PRM_PR_TYPE === 'cc') ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Creation Date", id:"PRM_CREATED_DATE", width:'130px', dataFormat:'date'},
            {name : "Submission Date", id:"PRM_SUBMIT_DATE", width:'148px', dataFormat:'date'},
            {name : "Approved Date", id:"PRM_SUBMIT_DATE", width:'130px', dataFormat:'date'},
            {name : "PR Status", id:"STATUS_DESC", width:'130px'},
            {name : "PO Number", id:"PO_NO", width:'130px'}
        ]

       
        return <Fragment>
        
             {(this.state.loading) ? <Loader /> : '' }
              {(this.props.sp_loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <PageHeading 
                heading="Purchase Request Listing" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR." 
            />
              <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
               
                <div className="row mt-2">    
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestListing.strPRNo" component={FromInputs} className="form-control" placeholder="PR No." label="PR No." />
                        </div> 
                        <div className="row mt-2">   
                        <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.start_data} component={FormDatePicker} className="form-control" placeholder="Start Date " label="Start Date"    onChange={this.handleDate.bind(this, 'start_date')} />
                        </div>   
                    </div>  
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestListing.strItemCode" component={FromInputs} className="form-control" placeholder="Item Code " label="Item Code" />       
                        </div> 
                        <div className="row mt-2">   
                            <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePicker} className="form-control" placeholder="End Date " label="End Date" minDate={this.state.start_data}  onChange={this.handleDate.bind(this, 'end_date')} /> 
                        </div>   
                    </div> 
                    <div className='col-12'>   
                            <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                    <label htmlFor="PRType">PR Type :</label>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-4">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType" selected={this.state.end_data} component={FormRadioButton} label="Contract PR" checkvalue="CC" selected={false}/> 
                                </div>
                                <div className="ml-4 col-lg-2 col-md-2 col-sm-4 col-4">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType" selected={this.state.end_data} component={FormRadioButton} label="Non-Contract PR"  checkvalue="NonCont"  selected={false}/> 
                                </div>
                            </div>
                    </div>  
                    <div className='col-12'>   
                            <div className="mt-2 row ">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                    <label htmlFor="PRType">PR Status :   {(this.state.checked_details.includes(0)) ? 1 : 2}</label>
                                </div>
                              
                                <div className="displayFlex col-lg-auto col-md-auto col-sm-auto col-auto">  
                                    <Field type="text" name="PurchaseRequestListing.status[0]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Draft" checked={this.state.all_check_value.includes(0)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[1]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Submitted" checked={this.state.all_check_value.includes(1)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[2]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Approved / Sourcing" checked={this.state.all_check_value.includes(2)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[3]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Converted To PO" checked={this.state.all_check_value.includes(3)} /> 
                                    <Field type="text" name="PurchaseRequestListing.status[4]" component={FormRadioButtonSpan}  onChange={this.getChecked} label="Void"  checked={this.state.all_check_value.includes(4)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[5]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Cancelled" checked={this.state.all_check_value.includes(5)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[6]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Rejected" checked={this.state.all_check_value.includes(6)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[7]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Held" checked={this.state.all_check_value.includes(7)}/> 
                                </div>
                            </div>
                    </div>  
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12">
                        
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                        
                                <button type="button" className="ml-4  btn btn-outline-primary btn-sm" onClick={()=>{this.Checkall()}}>Select All</button>
                        
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm">Clear</button>
                            
                            </div>
                        </div>
                    </div>
                    

                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                        <Alert 
                            message={this.state.modal_body}
                            status={this.state.status} 
                            show={this.state.modal} 
                            confirm={this.closeModel}
                        />
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_product_list && this.props.search_product_list.ds) ? this.props.search_product_list.ds: [] } 
                            products={this.getProducts} 
                            select={false} 
                            click={false}
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                        />

                    </div>
                </div>
              
            </form>

            
     </Fragment>
    }
}

export default reduxForm({
    form:'login',
})(Request);
