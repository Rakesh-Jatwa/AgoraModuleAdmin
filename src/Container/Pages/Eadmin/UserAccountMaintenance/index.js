import React, {Component, Fragment} from 'react';
import {Field, reduxForm, reset } from 'redux-form';
import PageHeading from '../../../../Component/Heading/PageHeading';
import TabHeading from '../../../../Component/Heading/TabHeading';
import {connect} from 'react-redux';
import BootstrapCustomTable from '../../../../Component/Table/BootstrapCustomTable'
import {GetUserAccountList, GetUserValidateAdminLimit} from '../../../../Actions/Eadmin'
import {TaxType} from '../../../../Actions/Common/Functions'
import Loader from '../../../../Component/Loader'
import {PolicyListSave, UserAccountDelete, UserAccountDetails, UserAccountAlter, UserAccountUnlock} from '../../../../Apis/Eadmin'
import {ApiExtract} from '../../../../Common/GetDatas'
import Alert from '../../../../Component/Modal/alert'
import {FromInputsParallelForAllCompany} from '../../../../Component/From/FromInputs'  
import TaxCodeAlter from './TaxCodeAlter'
import ConfirmationModel from '../../../../Component/Modal/ConfirmationModel'

class HolidayCalender extends Component {
    constructor(props){
        super(props);
        this.closemodel = this.closemodel.bind(this);
        this.hide_add = this.hide_add.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products:[],
            render:false,
            start_data:'',
            end_data:'',
            title:'',
            message:'',
            status:false,
            show:false,
            checked_initial : [0,1,2],
            checked_details:[],
            list: [],
            submit_type:'',
            show_details : '',
            country : [],
            show_table :false,
            edit_details : {},
            country_name : '',
            state_name : '',
            search_object : {
                hm_country: "",
                hm_state: "All",
                hm_year: ""
            },
            modify_details : {},
            confimation:false ,
            confimation_pop:false ,
            confimation_type : '',
          
        }
    }

    componentDidMount(){
        this.props.GetUserValidateAdminLimit()
        this.setState({
            country_name : 'Malaysia',
            state_name: 'All States'
        })
    }


    closemodel = () => {
        this.setState({
            show : false
        })
        if(this.state.status && this.state.submit_type=="delete"){
            this.handlefromsubmit()
        }

        if(this.state.status && (this.state.submit_type=="status_alter" || this.state.submit_type=="unlock")){
            this.handlefromsubmit()
        }
        
    }


   
    async  getProducts (values, details){        
      
        let _all_products = this.state.products
        if(details){
            _all_products.push(values)
            await this.setState({
                products : _all_products
            })
        }
        else{
            let _products = this.state.products.filter((fieldValue, index) => fieldValue.UM_USER_ID != values.UM_USER_ID);
             await this.setState({
                products : _products
            })
        }
    }
 
    Reset = () => {
        this.setState({
            list : (this.props.policy_list && this.props.policy_list.length) ? this.props.policy_list : [],
            render : false
        })
    }

    
    Save = async() => {
       let {list} = this.state
       if(list && list.length){
            this.setState({ loading:true})
            let _status = await ApiExtract(PolicyListSave, list);
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"save",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
       }
    }

    ClearAll = () =>{
        this.props.reset('TaxCode')
    }


    handlefromsubmit= async(values={}) =>{
        let _values  = Object.assign({}, values)
        this.props.GetUserAccountList(_values)
        this.setState({
            show_table : true,
            search_object : _values
        })
    }

    Add = async() =>{
        let {validate_admin_limit} = this.props       
        if( (!validate_admin_limit.IsExceedAdminLimit)){
            let _status = await ApiExtract(UserAccountDetails, {strMode:"add"});
            if(_status){
                this.setState({
                    loading:false,
                    show_details :"add",
                    show:false,
                    modify_details : _status.response
                })
            }
        }
    }

    Modify = async() =>{
        let {products, search_object} = this.state;
        if(products.length){
            if(products.length==1){
                let _temp_details = {
                    strMode : 'modify',
                    pUserId : products[0].UM_USER_ID,
                }
                this.setState({ loading:true})
                let _status = await ApiExtract(UserAccountDetails, _temp_details);
                if(_status){
                    this.setState({
                        loading:false,
                        show_details :"modify",
                        show:false,
                        modify_details : _status.response
                    })
                }
              
            }
            else{
                this.setState({
                    show:true,
                    status :false,
                    message : 'Please make only one selection',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }


    get_details = (row) =>{
        if(row){
            let _temp_details = {
                userGroupId:row.UGM_USRGRP_ID,
                appPackageId:row.UGM_APP_PKG
            }
            this.setState({
                edit_details : _temp_details,
                show_details : 'modify'
            })
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }

    Delete = async() =>{
        let {products} = this.state;
        if(products.length){
            let _delete_details = products.map((list_details)=>{
                return {pUserId : list_details.UM_USER_ID}
            })
            this.setState({loading:true})
            let _status = await ApiExtract(UserAccountDelete, {deleteData:_delete_details});
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"status_alter",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }

    
    Unlock = async() =>{
        let {products, search_object} = this.state;
        if(products.length){
            let _temp_details= products.map((list_details)=>{
                return {strUserid : list_details.UM_USER_ID}
            })
            this.setState({loading:true})
            let _status = await ApiExtract(UserAccountUnlock, {data: _temp_details});
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :"unlock",
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
           
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }


    StatusAlter = async(status) =>{
        let {products} = this.state;
        if(products.length){
            let _temp_details= products.map((list_details)=>{
                return {strUserid : list_details.UM_USER_ID}
            })
            this.setState({loading:true})
            let _status = await ApiExtract(UserAccountAlter, {strAction :status,  data:_temp_details});
            if(_status){
                this.setState({
                    status:_status.status,
                    loading:false,
                    submit_type :'status_alter',
                    show:true,
                    title : '',
                    status :_status.status,
                    message : (_status.message) ? _status.message :'Security policy saved',
                })
            }
        }
        else{
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            })
        }
    }


    

    hide_add = () =>{
        this.handlefromsubmit()
        this.setState({
            show_details : '',
        })
        this.props.reset('UG_details_maintenance')
    }

    ClearAll = () =>{
        this.props.reset('HolidayCalenderHolder')
    }

    handleChange = (e) =>{
        this.props.GetState({countryCode : e})
    }

    ClodeAdd = () =>{
        this.handlefromsubmit()
        this.setState({
            show_details: ''
        })
    }

    confirm_function = (e, type, text) => {
        e.preventDefault()
        if(this.state.products.length === 0) {
            this.setState({
                show:true,
                status :false,
                message : 'Please make atleast only one selection!',
            });
            return false;
        }
        
        this.setState({
            status: false,
            confimation:true,
            confimation_pop:true,
            confimation_type : type,
            status_text : text,
            loading:false,
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
            this.Delete()
        }
        else if(_confimation_type=="unlock"){
            this.Unlock()
        }
        else if(_confimation_type=="activate"){
            this.StatusAlter('active')
        }
        else if(_confimation_type=="deactivate"){
            this.StatusAlter('deactive')
        }

    }

    async  getProductsall (_products, details){
        let _all_products = this.state.products;
        if(_products.length){
            if(details){
                for(let i=0;i<_products.length;i++){
                    _all_products.push(_products[i])
                    if (i != _products.length) {
                        await this.setState({products : _all_products})
                    }
                }
            }
            else{
                let _temp_query = _all_products
                for(let i=0;i<_products.length;i++){
                        _temp_query = _temp_query.filter((fieldValue, index) => fieldValue.UM_USER_ID != _products[i].UM_USER_ID);
                        if (i != _products.length) {
                             this.setState({products : _temp_query})
                        }
                   
                }
                
            }
        }
        
    }



    render(){
        const { handleSubmit } = this.props
        const _table_header = [
            {name : "User ID", id:"UM_USER_ID", width:'50px', key:true, key:true},
            {name : "User Name", id:"UM_USER_NAME", width:'50px'},
            {name : "User Group", id:"UM_USER_NAME", width:'100px'},
            {name : "Dept Name", id:"CDM_DEPT_NAME", width:'100px'},
            {name : "Status", id:"UM_STATUS", width:'100px'},
            {name : "Account Locked", id:"UM_DELETED", width:'100px'},
            
        ];
        let {user_account_list} = this.props
        let {country_name, state_name, modify_details} = this.state
        return <Fragment>
              {(this.props.loading) ? <Loader /> : '' }
              {(this.state.loading) ? <Loader /> : '' }
              {(this.props.st_loading) ? <Loader /> : '' }
              
            
              {(this.state.show_details=="") ? 
              <Fragment>
                <PageHeading  heading="User Account Maintenance" subheading=""  />
                <TabHeading color={'bg-info text-white margin-bottom-none'}> Search Criteria</TabHeading> 
                <form onSubmit={handleSubmit(this.handlefromsubmit.bind(this))}>
                    <div className='row'> 
                        <div className="col-12 col-sm-12">
                            <div className="row mt-2">
                                <Field type="text" name="pUserID" component={FromInputsParallelForAllCompany} className="form-control" placeholder="User ID" label="User ID " />
                                <Field type="text" name="pUserName" component={FromInputsParallelForAllCompany} className="form-control" placeholder="User Name" label="User Name " />
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 col-md-12 mt-2 text-right">
                                    <button type="submit" className="btn btn-sm btn-outline-success" >Search</button>
                                    <button type="reset" className="btn btn-sm btn-outline-info ml-2" onClick={()=>this.ClearAll()}>Clear</button>
                                </div>
                            </div>
                        </div>
                      
                    </div>  
                </form>
                {(this.state.show_details=="add") ? 
                    <TaxCodeAlter
                        datas = {this.state.search_object}
                        close = {this.ClodeAdd}
                        country_name = {country_name}
                        state_name = {state_name}
                        type={this.state.show_details}
                        
                    /> 
                : ''}
                
               
                <div className="row mt-4">    
                {(this.state.show_table) ? <div>    <div className="col-12 col-sm-4 col-md-2">
                        User License : {user_account_list.userLicense}
                    </div>
                    <div className="col-12 col-sm-4 col-md-2">
                        Active User :  {user_account_list.activeUser} 
                    </div>
                    <div className='col-12'>   
                       
                        <BootstrapCustomTable 
                            table_header={_table_header} 
                            table_body={(user_account_list) ? user_account_list.data : []} 
                            products={this.getProducts}
                            select={true} 
                            selectname={'pr_no'} 
                            responsive={true} 
                            click={false}
                            table_name="issue_grn"
                            selectall={this.getProductsall} 
                        /> 
                    </div>   </div> : ''}
                    {/* {(this.state.show_details=="") ? */}
                    <div className="col-md-12 col-lg-12 text-left mt-2">
                        <button type="button"  className="btn btn-sm btn-outline-success" onClick={()=>this.Add()}>Add</button>                     
                        <button type="button" disabled={!this.state.show_table ? true : false} className={`btn btn-sm ${!this.state.show_table ? "custom-disabled-btn-outline-primary" : ""} btn-outline-primary ml-2`} onClick={()=>this.Modify()}>Modify</button>
                        <button type="button" disabled={!this.state.show_table ? true : false} className={`btn btn-sm ${!this.state.show_table ? "custom-disabled-btn-outline-danger": ""} btn-outline-danger ml-2`} onClick={(e)=>this.confirm_function(e, 'delete', 'permanently delete this item(s)')}>Delete</button>
                        <button type="button" disabled={!this.state.show_table ? true : false} className={`btn btn-sm ${!this.state.show_table ? "custom-disabled-btn-outline-info" : ""} btn-outline-info ml-2`} onClick={(e)=>this.confirm_function(e, 'unlock', 'unlock this item(s)')}>Unlock User Account</button>
                        <button type="button" disabled={!this.state.show_table ? true : false} className={`btn btn-sm ${!this.state.show_table ? "custom-disabled-btn-outline-secondary": ""} btn-outline-secondary ml-2`} onClick={(e)=>this.confirm_function(e, 'activate', 'activate this item(s)')}>Activate</button>
                        <button type="button" disabled={!this.state.show_table ? true : false} className={`btn btn-sm ${!this.state.show_table ? "custom-disabled-btn-outline-warning" : ""} btn-outline-warning ml-2`} onClick={(e)=>this.confirm_function(e, 'deactivate', 'deactivate this item(s)')}>Deactivate</button>
                    </div> 
                </div>
                </Fragment> : ''}
                {(this.state.show_details=="modify" || this.state.show_details=="add") ? 
                  <TaxCodeAlter
                      datas = {modify_details}
                      close = {this.ClodeAdd}
                      country_name = {country_name}
                      state_name = {state_name}
                      type={this.state.show_details}
                  /> 
              : ''}
            
                <Alert 
                    confirm={this.closemodel} 
                    title={this.state.title}
                    message={this.state.message}
                    status={this.state.status}
                    show={this.state.show}
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

const mapStateToProps = state => ({
    user_account_list : state.user_account_list.responseList,
    loading : state.user_account_list.loading,
    pro_state : state.ed_state.responseList,
    st_loading : state.ed_state.loading,
    holiday_list : state.holiday_list.responseList,
    validate_admin_limit : state.validate_admin_limit.responseList,
})

const mapDispatchToProps = dispatch => ({
    GetUserAccountList  : (values) => dispatch(GetUserAccountList(values)),
    GetUserValidateAdminLimit  : () => dispatch(GetUserValidateAdminLimit()),
    
})


const HolidayCalenderHolder = connect(mapStateToProps, mapDispatchToProps)(HolidayCalender);
export default reduxForm({
    form:'TaxCode',
})(HolidayCalenderHolder);