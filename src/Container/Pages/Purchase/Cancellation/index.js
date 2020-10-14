import React,{Component, Fragment} from 'react';
import Loader from '../../../../Component/Loader'
import {FromInputs, FormDatePicker, FormRadioButton, FormRadioButtonSpan} from '../../../../Component/From/FromInputs'
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {Field, reduxForm } from 'redux-form';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import Common from '../../../../Common'
import {CompareDate, FromateDate_YY_MM_DD} from '../../../../Component/Dates'
import Modal from '../../../../Component/Modal'
import {RemoveSpecialCharacter} from '../../../../Actions/Common/Functions'
import Alert from '../../../../Component/Modal/alert'
// const _table_body = Common.prs_Data();
class Cancellation extends Component{
    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.handleheaderlinks = this.handleheaderlinks.bind(this)
        this.updateData = this.updateData.bind(this)
        this.closemodel = this.closemodel.bind(this);
        this.getChecked = this.getChecked.bind(this)
        this.getTypeChecked = this.getTypeChecked.bind(this)
        this.state = {
            products:[],
            start_data:'',
            end_data:'',
            modal_title:'',
            modal_body:'',
            check_value:false,
            all_check_value:'',
            model:false,
            strPRType : [],
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


    

    handlefromsubmit(values){

        let _form_value = values;
        let _initial_obj = {
            PRNumber: "",
            UIStartDate: (this.state.start_data) ? this.state.start_data  : "" ,
            UIEndDate: (this.state.end_data) ? this.state.end_data  : "" ,
            startDateStr: (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"",
            endDateStr: (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"",
        }
        _form_value.PurchaseRequestCancellation = Object.assign({}, _initial_obj,(_form_value.PurchaseRequestCancellation) ? _form_value.PurchaseRequestCancellation : _form_value )
        _form_value.PurchaseRequestCancellation.prType = this.state.all_check_value
        _form_value.PurchaseRequestCancellation.strPRType =  (this.state.strPRType && this.state.strPRType.length>0) ? this.state.strPRType.toString() :  ["'cc'","'bc'"].toString();
        _form_value.PurchaseRequestCancellation.startDateStr = (this.state.start_data) ? FromateDate_YY_MM_DD(this.state.start_data)  :"";
        _form_value.PurchaseRequestCancellation.endDateStr = (this.state.end_data) ? FromateDate_YY_MM_DD(this.state.end_data)  :"";
        _form_value.PurchaseRequestCancellation = RemoveSpecialCharacter(_form_value.PurchaseRequestCancellation)
        _form_value.PurchaseRequestCancellation.strPRType =  (this.state.strPRType && this.state.strPRType.length>0) ? this.state.strPRType.toString() :  ["'cc'","'bc'"].toString();
        if(this.state.start_data && this.state.end_data){
            if(this.state.start_data && this.state.end_data && CompareDate(this.state.start_data, this.state.end_data)){
                this.props.get_search_prlist(_form_value)
            }
            else{
                this.setState({
                    modal_body : 'End date should be greater than or equal to Start date',
                    status :false,
                    model : true
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

    updateData(data, type) {
        if(type=="cancel"){
            let _details = {
                lblPRNo: data.PRM_PR_No,
                PRIndex: data.PRM_PR_Index,
                CurrentAppSeq: "",
                strRemark: "",
                caller: ""
            }
            this.props.get_cancel_pr(_details);
        }
        else if(type=="void"){
            this.props.get_void_pr(data);
        }
        else if(type=="view"){
            this.props.get_generate_prpdf(data);
        }
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

    closemodel = () => {
        this.setState({
            model : false
        })
    }

   

    handleDate = (name, date) =>{
       if(name=="start_date"){
            this.setState({
                start_data:date
            })
       }
       else if(name=="end_date"){
            this.setState({
                end_data:date
            })
       }
    }

    getChecked(details){
        console.log('details.target', details.target.value, details.target.checked)
        let all_check_value = this.state.all_check_value;
        let _checked =  details.target.value;
        _checked = _checked.replace(".", "");
        if(details.target.checked){
            all_check_value = _checked
        }
        console.log('getChecked', this.state.all_check_value)
        this.setState({all_check_value:all_check_value})
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.pr_status.strMsg!=prevProps.pr_status.strMsg){
            this.setState({
                model:true
            })
        }
      
    }
   

    viewPageDetails(details, cell, row){
        this.props.history.push({
            pathname:"/view_pr_details",
            selected_items: '',
            datas: cell,
            type:'cancel',
            redirect_to_tab : 'contact',
            redirect_to_page : 'purchaseRequest',
        })
    }
    

    ClearAll = () =>{
        this.props.reset('PurCancellation')
        this.setState({
            start_data:'',
            end_data:'',
            all_check_value : '',
        })
      
    }

    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "PR No.", id:"PRM_PR_No", width:'200px', key:true,  key:true,formatter: (cellContent, row) => {
                return (
                  <button className="btn btn-outline-primary btn-sm" size="sm" variant="primary"  onClick={() => this.viewPageDetails(cellContent, row)} ><span className="row_name">{row.PRM_PR_No}</span> <span className="row_symbol">{row.PRM_URGENT === "1" ? ' U' : ''}{row.HAS_ATTACHEMENT!=0 ? <i className="fa fa-paperclip" style={{ color: '#e65a5a',fontWeight:900, marginLeft:'5px' }} aria-hidden="true"></i> : ""}</span></button >
                )
            }},
            {name : "PR Type", id:"PRM_PR_TYPE", width:'100px', formatter: (cellContent, row) => {
                return (
                    (row.PRM_PR_TYPE === 'CC' || row.PRM_PR_TYPE === 'cc')? 'Contract' : 'Non-Contract'
                )
            }},
            {name : "Creation Date", id:"PRM_CREATED_DATE", width:'144px'},
            {name : "Submission Date", id:"PRM_SUBMIT_DATE", width:'144px'},
        ];

       
       
        return <Fragment>
             {(this.props.sp_loading) ? <Loader /> : '' }
            <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
            <PageHeading 
                heading="Purchase Request Cancellation" 
                subheading="Fill in the search criteria and click Search button to list the relevant PR." 
            />


           
              <TabHeading color={'bg-info text-white'}>Search Criteria</TabHeading> 
               
                <div className="row mt-2">    
                    <div className='col-12 col-md-6'>   
                        <div className="row">     
                            <Field type="text" name="PurchaseRequestCancellation.PRNumber" component={FromInputs} className="form-control" placeholder="PR No." label="PR No. :" />
                        </div> 
                       
                  
                        <div className="mt-3 row">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                                    <label htmlFor="PRType">PR Type :</label>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 col-12">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType[1]"  component={FormRadioButtonSpan} onChange={this.getTypeChecked} checked={this.state.strPRType.includes("'cc'")} label="Contract PR" /> 
                                </div>
                                <div className="ml-4 col-lg-4 col-md-4 col-sm-4 col-12">  
                                    <Field type="text" name="PurchaseRequestListing.strPRType[2]"  component={FormRadioButtonSpan} onChange={this.getTypeChecked} checked={this.state.strPRType.includes("'bc'")} label="Non-Contract PR"  /> 
                                </div>
                            </div>
                    </div>  
                    <div className='col-12 col-md-6'>   
                        <div className="row">   
                            <Field type="text" name="PurchaseRequestCancellation.UIStartDate" selected={this.state.start_data} component={FormDatePicker} className="form-control" placeholder="Start Date " label="Start Date :"    onChange={this.handleDate.bind(this, 'start_date')} clear={true}/>
                        </div> 
                        <div className="row mt-2">   
                            <Field type="text" name="PurchaseRequestCancellation.UIEndDate" selected={this.state.end_data} minDate={this.state.start_data} value={this.state.end_data} component={FormDatePicker} className="form-control" placeholder="End Date " label="End Date :"  onChange={this.handleDate.bind(this, 'end_date')} clear={true}/>
                        </div>   
                    </div> 
                       
                    <div className="col-12">
                        <div className="text-center mt-2 row">
                            <div className="col-12 mt-2">
                        
                                <button type="submit" className="ml-4 btn btn-sm btn-outline-success">Search</button>
                        
                                {/* <button type="button" className="ml-4  btn btn-outline-primary btn-sm">Select All</button> */}
                        
                                <button type="reset" className="ml-4  btn btn-outline-danger btn-sm" onClick={this.ClearAll}>Clear</button>
                            
                            </div>
                        </div>
                    </div>
                    

                </div> 
                <hr></hr>
                <div className="row mt-2">    
                    <div className='col-12'>   
                    
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(this.props.search_product_list && this.props.search_product_list) ? this.props.search_product_list: [] } 
                            products={this.getProducts} 
                            select={false} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            headerclick={this.handleheaderlinks}
                            getData = {this.updateData}
                        />

                <Alert 
                    message={this.state.modal_body}
                    status={this.state.status} 
                    show={this.state.model} 
                    confirm={this.closemodel}
                />

                    </div>
                </div>
              
            </form>
            
     </Fragment>
    }
}

export default reduxForm({
    form:'PurCancellation',
})(Cancellation);
