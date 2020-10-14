import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import {FromInputs, FormDatePicker, FormRadioButton, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {FromateDate, FromateDate_YY_MM_DD, TodayDateSalash, CompareDate} from '../../../../Component/Dates'
import Alert from '../../../../Component/Modal/alert'
import {UserDetails} from '../../../../Common/LocalStorage'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'


class Request extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.getChecked = this.getChecked.bind(this)
        this.getTypeChecked = this.getTypeChecked.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            open:false,
            modal:false,
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:[],
            loading:false,
            checked_details:[1,2,4,5,9,6,8,7,99],
            check_value:false,
            strPRType : [],
            select_all : false
        }

        this.Checkall= this.Checkall.bind(this);
    }


    
    handlefromsubmit(values){
        let _form_value = Object.assign({},values);
        let  {PurchaseRequestListing, all_check_value} = _form_value;
        let _initial_obj = {
            strPRNo: "",
            strItemCode: "",
            strStatus: (PurchaseRequestListing && PurchaseRequestListing.status && PurchaseRequestListing.status.length) ? all_check_value : [],
            strStatus2: (PurchaseRequestListing &&  PurchaseRequestListing.status && PurchaseRequestListing.status.length) ? all_check_value :  [],
            strPRType: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data  : null ,
            UIEndDate: (this.state.end_data) ? this.state.end_data  : null ,
            dteDateFr: (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"",
            dteDateTo: (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"",
        }

        
    
        _form_value = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestListing) ? _form_value.PurchaseRequestListing : _form_value )
        _form_value = RemoveSpecialCharacter(_form_value)
        _form_value.strStatus = (this.state.all_check_value && this.state.all_check_value.length>0 && (!this.state.select_all)) ? this.state.all_check_value : [];
        _form_value.strStatus2 =  (this.state.all_check_value && this.state.all_check_value.length>0 && (!this.state.select_all)) ? this.state.all_check_value : [];
        _form_value.strPRType =  (this.state.strPRType && this.state.strPRType.length>0  && (!this.state.select_all)) ? this.state.strPRType.toString() : '' ;
        
        let _form_value_details = Object.assign({},_form_value)
        if(_form_value_details.strStatus && _form_value_details.strStatus.includes(99)){
            _form_value_details.strStatus = _form_value_details.strStatus.map((list_details, index)=>{
                  return  (list_details==99) ? 4 : list_details
            })
        }

        if(_form_value_details.hasOwnProperty('status')){
            delete _form_value_details.status
        }

       
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_prlist(_form_value_details)
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
            this.props.get_search_prlist(_form_value_details)
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
        all_check_value:checked_details,
        strPRType : ["'cc'","'bc'"],
        select_all : true,
      })
    }

    ClearAll = () =>{
        this.props.reset('PrListing')
        this.setState({
            all_check_value:[],
            strPRType :[],
            start_data:'',
            end_data:'',
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
        this.setState({all_check_value:all_check_value, select_all:false})
    }

    getTypeChecked(details){
        let strPRType = this.state.strPRType;
        let _checked =  (details.target.name).replace ( /[^\d.]/g, '' );
         
        _checked = _checked.replace(".", "");
        if(_checked==1){
            _checked ="'cc'"
        }
        else if (_checked == 2){
            _checked ="'bc'"
        }
        else{
            _checked =""
        }
        if(details.target.checked){
            strPRType.push(_checked)
        }
        else{
            strPRType= strPRType.filter((list)=>{return list != _checked})
          
        }
        this.setState({strPRType:strPRType})
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
      let {start_data, end_data} = this.state
     
       if(name=="start_date"){
            this.setState({start_data:date})
       }
       else if(name=="end_date"){
            this.setState({end_data:date})
       }

       if(end_data && start_data){
            
       }
    }

    getPage_details(details, cell, row){
       
        let _details =  {
            productList:'',
            viewState: 'mod',
            strType: (cell.PRM_PR_TYPE === 'CC' || cell.PRM_PR_TYPE=='cc') ? 'Contract' : 'Non-Contract',
            prid : cell.PRM_PR_No
        };
        localStorage.setItem('pr_details', JSON.stringify(_details))
        window.location.reload()
    }

    viewPageDetails(details, cell, row){

        this.props.history.push({
            pathname:"/view_pr_details",
            selected_items: '',
            datas: cell,
            redirect_to_tab : 'profile',
            redirect_to_page : 'purchaseRequest',
            type:'listing'
        })
    }
    

    async get_details(type,details){
        let _user_details = UserDetails();
        let _send_details = { "POM_PO_NO": details.PO_NO, "POM_B_COY_ID": _user_details.UM_COY_ID, "POM_S_COY_ID": details.POM_S_COY_ID , "PRM_PO_INDEX": details.PRM_PO_INDEX, STATUS: details.STATUS_DESC, PR_NO: details.PRM_PR_No}
        this.props.history.push({
            pathname : '/VendorPOListPop',
            datas : _send_details,
            redirect_to_tab : 'profile',
            redirect_to_page : 'purchaseRequest',
        })
    }

    async get_details_po(type,details, list){
        let _send_details = { "POM_PO_NO": list.strPOM_PO_No, "POM_B_COY_ID": list.PRM_COY_ID, "POM_S_COY_ID": list.PRD_S_COY_ID , "PRM_PO_INDEX": list.strPOM_PO_Index, STATUS: list.strPOM_PO_Status, PR_NO: details.PRM_PR_No}
        this.props.history.push({
            pathname : '/VendorPOListPop',
            datas : _send_details,
            redirect_to_tab : 'profile',
            redirect_to_page : 'purchaseRequest',
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
            {name : "PR No", id:"PRM_PR_No", width:'171px', key:true,formatter: (cellContent, row) => {
                return (
                    row.STATUS_DESC === 'Draft' ? 
                    <button type="button" className="btn btn-sm btn-outline-info" type="button"  onClick={() => this.getPage_details(cellContent, row)} >{row.PRM_PR_No} <span style={{ color: 'red' }}>{row.PRM_URGENT === "1" ? ' U' : ''}</span><span style={{ color: 'orange',fontWeight:900 }}>{row.HasAttachment===true?<i className="fa fa-paperclip" style={{ color: 'brown',fontWeight:900 }} aria-hidden="true"></i>:""}     {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button > : 
                    <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}</span><span style={{ color: 'orange',fontWeight:900 }}>{row.HasAttachment===true?<i className="fa fa-paperclip" style={{ color: 'brown',fontWeight:900 }} aria-hidden="true"></i>:""}     {row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'CC' || row.PRM_PR_TYPE === 'cc') ? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Creation Date", id:"PRM_CREATED_DATE", width:'130px', dataFormat:'sort_pr_created_date'},
            {name : "Submission Date", id:"PRM_SUBMIT_DATE", width:'148px', dataFormat:'sort_pr_submitted_date'},
            {name : "Approved Date", id:"PRM_SUBMIT_DATE", width:'130px',   formatter: (cellContent, row) => {
                return (
                    (row.PRM_SUBMIT_DATE !== null && row.STATUS_DESC!=="Submitted" && row.STATUS_DESC!="Cancelled By" && row.STATUS_DESC!="Rejected By")? TodayDateSalash(row.PRM_SUBMIT_DATE): ''
                )
            }},
            {name : "PR Status", id:"STATUS_DESC", width:'130px',formatter: (cellContent, row) => {
                if(row.STATUS_DESC=="Cancelled By"){
                    return 'Cancelled'
                }
                else if (row.STATUS_DESC=="Rejected By"){
                    return 'Rejected'
                }
                else if (row.STATUS_DESC=="Held By"){
                    return row.STATUS_DESC+' '+row.NAME
                }
                else if (row.PRM_PR_STATUS=="99"){
                    return 'Sourcing'
                }
                else{
                    return row.STATUS_DESC
                }
            }},
            {name : "PO Number", id:"PO_NO", width:'130px',formatter: (cellContent, row) => {
                let _po_details = row.po
                if(_po_details.length){
                    let _sub_details = _po_details.map((list_row)=>{
                            return <button type="button" className="btn btn-sm btn-outline-info mb-2" type="button"  onClick={() => this.get_details_po(cellContent, row, list_row)} >{list_row.strPOM_PO_No} </button >
                    })
                return <Fragment>{_sub_details}</Fragment>;
                }
                else{
                    return '';
                }
                // return (
                //     (row.PO_NO) ?  <button type="button" className="btn btn-sm btn-outline-info" type="button"  onClick={() => this.get_details(cellContent, row)} >{row.PO_NO} </button > : ''
                // )
            }},
        ]

       
        return <Fragment>
        
             {(this.state.loading) ? <Loader /> : '' }
              {(this.props.sp_loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <PageHeading 
                heading="" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR." 
            />
              <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
               
                <div className="row mt-2">    
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestListing.strPRNo" component={FromInputs} className="form-control" placeholder="PR No." label="PR No. : " />
                        </div> 
                        <div className="row mt-2">   
                            <Field type="text" name="PurchaseRequestListing.UIStartDate" selected={this.state.start_data} component={FormDatePicker} className="form-control" placeholder="Start Date " label="Start Date : "    onChange={this.handleDate.bind(this, 'start_date')} clear={true} />
                        </div>   
                    </div>  
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestListing.strItemCode" component={FromInputs} className="form-control" placeholder="Item Code " label="Item Code : " />       
                        </div> 
                        <div className="row mt-2">   
                            <Field type="text" name="PurchaseRequestListing.UIEndDate" selected={this.state.end_data} value={this.state.end_data} component={FormDatePicker} className="form-control" placeholder="End Date " label="End Date : "  onChange={this.handleDate.bind(this, 'end_date')} clear={true} /> 
                        </div>   
                    </div> 
                    <div className='col-12'>   
                            <div className="mt-2 row">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                    <label htmlFor="PRType">PR Type :</label>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-4">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType[1]"  component={FormRadioButtonSpan} onChange={this.getTypeChecked} checked={this.state.strPRType.includes("'cc'")} label="Contract PR" /> 
                                </div>
                                <div className="ml-4 col-lg-2 col-md-2 col-sm-4 col-4">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType[2]"  component={FormRadioButtonSpan} onChange={this.getTypeChecked} checked={this.state.strPRType.includes("'bc'")} label="Non-Contract PR"  /> 
                                </div>
                            </div>
                    </div>  
                    <div className='col-12'>   
                            <div className="mt-2 row ">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                    <label htmlFor="PRType">PR Status :</label>
                                </div>
                              
                                <div className="displayFlex col-lg-auto col-md-auto col-sm-auto col-auto">  
                                    <Field type="text" name="PurchaseRequestListing.status[1]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Draft" checked={this.state.all_check_value.includes(1)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[2]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Submitted" checked={this.state.all_check_value.includes(2)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[4]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Approved" checked={this.state.all_check_value.includes(4)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[5]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Converted To PO" checked={this.state.all_check_value.includes(5)} /> 
                                    <Field type="text" name="PurchaseRequestListing.status[9]" component={FormRadioButtonSpan}  onChange={this.getChecked} label="Void"  checked={this.state.all_check_value.includes(9)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[6]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Cancelled" checked={this.state.all_check_value.includes(6)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[8]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Rejected" checked={this.state.all_check_value.includes(8)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[7]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Held" checked={this.state.all_check_value.includes(7)}/> 
                                    <Field type="text" name="PurchaseRequestListing.status[99]"  component={FormRadioButtonSpan} onChange={this.getChecked} label="Sourcing" checked={this.state.all_check_value.includes(99)}/> 
                                </div>
                            </div>
                    </div>  
                       
                    <div className="col-12">
                        <div className="text-right mt-2 row">
                            <div className="col-12">
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                                <button type="button" className="ml-4  btn btn-outline-primary btn-sm" onClick={()=>{this.Checkall()}}>Select All</button>
                                <button type="reset" onClick={this.ClearAll} className="ml-4  btn btn-outline-danger btn-sm">Clear</button>
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
    form:'PrListing',
})(Request);

